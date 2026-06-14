import { object, type ObjectSchema, string } from 'yup';
import type {
	IShortLinkAdminUpdate,
	IShortLinkCreate,
	IShortLinkLogin,
	IShortLinkUrlUpdate,
} from './types';

export const shortLinkUrlValidator = string().trim().required().url().max(2048).label('URL');
export const shortLinkSuffixValidator = string()
	.trim()
	.required()
	.matches(/^[a-zA-Z0-9-]{1,32}$/, 'Suffix must only contain letters, numbers, and dashes')
	.label('Suffix');
export const shortLinkPasswordValidator = string().optional().label('Password');

export const shortLinkCreateValidator: ObjectSchema<IShortLinkCreate> = object({
	url: shortLinkUrlValidator,
	suffix: shortLinkSuffixValidator,
	password: shortLinkPasswordValidator,
});

export const shortLinkLoginValidator: ObjectSchema<IShortLinkLogin> = object({
	suffix: shortLinkSuffixValidator,
	password: shortLinkPasswordValidator.required(),
});

export const shortLinkUrlUpdateValidator: ObjectSchema<IShortLinkUrlUpdate> = object({
	url: shortLinkUrlValidator,
});

export const shortLinkAdminUpdateValidator: ObjectSchema<IShortLinkAdminUpdate> = object({
	url: shortLinkUrlValidator,
	suffix: shortLinkSuffixValidator,
});
