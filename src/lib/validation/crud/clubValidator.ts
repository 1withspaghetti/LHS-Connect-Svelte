import { object, ObjectSchema, string } from 'yup';
import type { IClub } from '$lib/types/crud/club';
import type { WithoutID } from '$lib/types/crud/globalCrud';

export const INSTAGRAM_REGEX = /^[a-zA-Z0-9._]*$/;

export default object({
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
	desc: string().optional().max(1000)
}) as ObjectSchema<WithoutID<IClub>>;
