import type { WithoutID } from '$lib/types/basicTypes';
import { object, ObjectSchema, string } from 'yup';
import type { IClub } from './types';

export const INSTAGRAM_REGEX = /^(?:[a-zA-Z0-9._]+|N\/A)$/;

export const clubValidator: ObjectSchema<WithoutID<IClub>> = object({
	name: string().required().max(250),
	dayAndTime: string().required().max(250),
	location: string().required().max(250),
	advisor: string().required().max(250),
	instagram: string()
		.optional()
		.trim()
		.matches(INSTAGRAM_REGEX, {
			message: 'Must be a valid instagram username (without the @)',
			excludeEmptyString: true,
		})
		.max(250),
	desc: string().optional().max(1000),
});
