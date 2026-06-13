import type { WithoutID } from '$lib/types/basicTypes';
import { object, type ObjectSchema, string } from 'yup';
import type { IClub } from './types';

export const INSTAGRAM_REGEX = /^[a-zA-Z0-9._]*$/;

export const clubValidator: ObjectSchema<WithoutID<IClub>> = object({
	name: string().required().max(250),
	day: string().required().max(250),
	time: string().required().max(250),
	location: string().required().max(250),
	advisor: string().required().max(250),
	instagram: string()
		.optional()
		.trim()
		.matches(INSTAGRAM_REGEX, 'Must be a valid instagram username (without the @)')
		.max(250),
	desc: string().optional().max(1000),
});
