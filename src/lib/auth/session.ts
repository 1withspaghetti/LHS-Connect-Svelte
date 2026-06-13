import type { ISessionUser } from '$api/users/types';
import { Session } from '$lib/models/sessionModel';
import type { ISession } from '$lib/types/session';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { Cookies } from '@sveltejs/kit';
import type { Types } from 'mongoose';

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 1 week

/**
 * Generates a new session token for a user and saves it to the database
 *
 * @param user - The user id of the user to create a session for
 * @returns A new session token
 */
export async function createSession(
	user: Types.ObjectId
): Promise<{ token: string; expires: Date }> {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);

	const tokenHash = Buffer.from(sha256(new TextEncoder().encode(token)));
	const expires = new Date(Date.now() + SESSION_DURATION);

	await new Session({
		id: tokenHash,
		user,
		expires,
	}).save();

	return { token, expires };
}

/**
 * Finds a session in the database and returns it if it is valid
 * Also renews the session if it is valid
 *
 * @param token The session token to look for
 * @returns ISession if the session is valid, null otherwise
 */
export async function validateAndRenewSession(token: string | undefined): Promise<ISession | null> {
	if (!token || typeof token !== 'string' || token.length !== 32) {
		return null;
	}

	const newExpires = new Date(Date.now() + SESSION_DURATION);

	const tokenHash = Buffer.from(sha256(new TextEncoder().encode(token)));
	const session = await Session.findOneAndUpdate(
		{ _id: tokenHash },
		{ $set: { expires: newExpires } }
	)
		.populate<{ user: ISessionUser }>('user', '_id name email pfp permissions')
		.exec();

	if (!session) {
		return null;
	}

	// Because of the way MongoDB handles TTL indexes, we still need to check if the session has expired
	// And the findOneAndUpdate call above returned the doc before it was updated
	if (session.expires < new Date()) {
		await Session.deleteOne({ _id: tokenHash });
		return null;
	}
	session.expires = newExpires; // Update the expires field to the new expiry date

	return session.toObject();
}

/**
 * Deletes a session from the database, invalidating it
 * @param token The session token to delete
 * @returns true if the session was deleted, false otherwise (e.g. if the token is invalid)
 */
export async function deleteSession(token: string | undefined): Promise<boolean> {
	if (typeof token !== 'string' || token.length !== 32) {
		return false;
	}

	return await deleteSessionById(Buffer.from(sha256(new TextEncoder().encode(token))));
}

/**
 * Deletes a session from the database by its id (the hashed token)
 * @param id The session id to delete
 * @returns true if the session was deleted, false otherwise
 */
export async function deleteSessionById(id: Buffer): Promise<boolean> {
	const res = await Session.deleteOne({ _id: id });
	return res.deletedCount === 1;
}

/**
 * Adds a session token to the response as a cookie
 *
 * @param event The request event from an endpoint
 * @param token The session token to set in the cookie
 * @param expiresAt When the session expires, used to set the cookie expiry
 */
export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/',
	});
}

/**
 * Removes the session token cookie from the response
 *
 * @param event The request event from an endpoint
 */
export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/',
	});
}
