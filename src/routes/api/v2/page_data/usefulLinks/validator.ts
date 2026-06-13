import type { WithoutID } from '$lib/types/basicTypes';
import { string, object, array, type ObjectSchema } from 'yup';
import type { ILinkCard } from './types';

export const linkCardLinkNameValidator = string().required().max(64).label('Name');
export const linkCardLinkUrlValidator = string().required().max(512).label('URL');

export const linkCardLinkValidator = object({
	title: linkCardLinkNameValidator,
	url: linkCardLinkUrlValidator,
});

export const linkCardValidator: ObjectSchema<WithoutID<ILinkCard>> = object({
	title: string().required().max(64),
	subtitle: string().optional().max(256),
	links: array().of(linkCardLinkValidator).required().min(1).max(16),
});
