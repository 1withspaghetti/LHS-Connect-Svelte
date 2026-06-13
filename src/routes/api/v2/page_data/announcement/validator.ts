import { object, type ObjectSchema, string } from 'yup';
import type { IAnnouncement } from './types';
import type { WithoutID } from '$lib/types/basicTypes';

export const announcementValidator: ObjectSchema<WithoutID<IAnnouncement>> = object({
	text: string().optional().max(512).label('Announcement Text'),
});
