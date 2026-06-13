import type { WithoutID } from '$lib/types/basicTypes';
import { object, type ObjectSchema, string } from 'yup';
import type { IBulletinBoardNote } from './types';
import urlRegex from '$lib/validation/url';

export const bulletinBoardNoteValidator: ObjectSchema<WithoutID<IBulletinBoardNote>> = object({
	title: string().required().min(1).max(256),
	content: string().required().min(1).max(2048),
	link: string()
		.optional()
		.test('link', 'link must be a valid url', (value) => !value || urlRegex.test(value))
		.max(1024),
});
