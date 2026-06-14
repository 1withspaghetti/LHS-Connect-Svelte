import type { ISessionUser } from '$api/users/types';
import type { ISession } from '$lib/types/session';

export enum Permission {
	/**
	 * The owner of the website, has all permissions and can give anybody all permissions
	 */
	OWNER = 1 << 30, // Overrides all permissions
	/**
	 * Can manage other users, and their permissions (except OWNER)
	 */
	MANAGE_USERS = 1 << 29,
	/**
	 * Can edit and delete short links
	 */
	MANAGE_SHORT_LINKS = 1 << 20,
	/**
	 * Can make edits to the website data via the admin panel
	 */
	EDIT = 1 << 1,
	/**
	 * Can view the admin panel
	 */
	VIEW = 1 << 0,
}

export const PermissionKeys = Object.keys(Permission).filter((k) => isNaN(Number(k)));
export const PermissionValues = Object.values(Permission).filter((v) => typeof v === 'number');

export class Permissions {
	public static readonly OWNER = 1 << 30;

	private permissions: number;

	constructor(obj?: ISession | ISessionUser | number | Permission[]) {
		if (obj === undefined) {
			this.permissions = 0;
		} else if (typeof obj === 'number') {
			this.permissions = obj;
		} else if ('permissions' in obj) {
			this.permissions = obj.permissions;
		} else if ('user' in obj) {
			this.permissions = obj.user.permissions;
		} else if (Array.isArray(obj)) {
			this.permissions = obj.reduce((acc, val) => acc | val, 0);
		} else {
			this.permissions = 0;
		}
	}

	/**
	 * @param permission The permission to check
	 * @param explicit If the permission is explicitly set, otherwise it will return true if the permission is set or the owner permission is set
	 * @returns If the permission is set
	 */
	public has(permission: Permission, explicit = false): boolean {
		return (
			(this.permissions & permission) === permission ||
			(!explicit && (this.permissions & Permission.OWNER) === Permission.OWNER)
		);
	}

	/**
	 * Sets the permission to true
	 * @param permission The permission to add
	 * @returns this, for chaining
	 */
	public add(permission: Permission): Permissions {
		this.permissions |= permission;
		return this;
	}

	/**
	 * Sets the permission to false
	 * @param permission The permission to remove
	 * @returns this, for chaining
	 */
	public remove(permission: Permission): Permissions {
		this.permissions &= ~permission;
		return this;
	}

	/**
	 * Updates the permission to the value
	 * @param permission The permission to set
	 * @param value The value to set the permission to
	 * @returns this, for chaining
	 */
	public set(permission: Permission, value: boolean): Permissions {
		if (value) {
			this.add(permission);
		} else {
			this.remove(permission);
		}
		return this;
	}

	/**
	 * Removes all permissions that are not in the Permission enum.
	 * This is useful for sanitizing permissions that may have been set to an invalid value.
	 *
	 * @returns this, for chaining
	 */
	public strip(): Permissions {
		const original = this.permissions;
		this.permissions = 0;
		for (let i = 0; i < PermissionValues.length; i++) {
			if ((original & PermissionValues[i]) === PermissionValues[i]) {
				this.permissions |= PermissionValues[i];
			}
		}
		return this;
	}

	/**
	 * @returns The permissions as a number
	 */
	public get(): number {
		return this.permissions;
	}

	/**
	 * @param permissions The permissions as a number to set, effectively overwriting the current instance
	 */
	public setPermissions(permissions: number): void {
		this.permissions = permissions;
	}

	/**
	 * @returns The permissions as a string list, separated by commas
	 */
	public toString(): string {
		return PermissionValues.filter((p) => this.has(p, true)) // Filter out the permissions that are not set
			.map((k) => Permission[k]) // Convert the permissions to their string values
			.join(', ');
	}

	/**
	 * @returns The permissions as an array of Permission enum values
	 */
	public toArray(): Permission[] {
		return PermissionValues.filter((p) => this.has(p, true));
	}

	/**
	 * Creates a new Permissions instance from a number, equivalent to `new Permissions(permissions)`
	 * @param permissions The permissions as a number to convert to a Permissions instance
	 * @returns The Permissions instance
	 */
	public static from(permissions: number): Permissions {
		return new Permissions(permissions);
	}

	/**
	 * Checks the permissions of an object
	 * @param obj Value to check permissions on, can be a session, user, or permissions number
	 * @param permission The permission to check
	 * @returns true if the permission is set, false otherwise
	 */
	public static has(obj: ISession | ISessionUser | number, permission: Permission): boolean {
		if (typeof obj === 'number') {
			return (obj & permission) === permission || (obj & Permission.OWNER) === Permission.OWNER;
		} else if ('permissions' in obj) {
			return this.has(obj.permissions, permission);
		} else if ('user' in obj) {
			return this.has(obj.user.permissions, permission);
		} else {
			return false;
		}
	}
}
