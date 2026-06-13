import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { google } from '$lib/auth/oauth';
import { createSession, setSessionTokenCookie } from '$lib/auth/session';
import { Permission, Permissions } from '$lib/auth/permissions';
import { User } from '$api/users/model';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state') ?? null;
	const codeVerifier = cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return error(400, 'Missing code, state, or code verifier, please try again');
	}
	if (state !== storedState) {
		return error(400, 'Invalid state, please try again');
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		// Invalid code or client credentials
		return error(400, 'Invalid code or client credentials, please try again');
	}
	const claims = decodeIdToken(tokens.idToken()) as any;

	const googleId = claims.sub as string;
	const name = claims.name as string;
	const email = claims.email as string;
	const pfp = claims.picture as string | undefined;

	const existing = await User.findOne({ googleId });
	if (existing) {
		const { token, expires } = await createSession(existing.id);
		await existing.updateOne({ lastLogin: new Date(), name, email, pfp });
		setSessionTokenCookie(cookies, token, expires);
		return redirect(302, '/admin/panel');
	}

	const permissions = new Permissions();
	permissions.add(Permission.VIEW);

	const user = new User({
		googleId,
		name,
		email,
		pfp,
		permissions: permissions.get(),
		firstLogin: new Date(),
		lastLogin: new Date(),
	});

	await user.save();

	const { token, expires } = await createSession(user.id);
	setSessionTokenCookie(cookies, token, expires);
	return redirect(302, '/admin/panel');
};
