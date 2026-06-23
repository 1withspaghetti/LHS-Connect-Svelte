import type { WithoutID } from '$lib/types/basicTypes';
import { string, object, boolean, array, number, type ObjectSchema } from 'yup';
import type { IBellSchedule, IBellScheduleDefaults, IBellScheduleOverride } from './types';
import { idArrayValidator, idValidator } from '$lib/validation/objectId';

export const TIME_STRING_REGEX = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const bellSchedulePeriodNameValidator = string().required().max(64).label('Name');
export const bellSchedulePeriodTimeValidator = string()
	.required()
	.matches(TIME_STRING_REGEX, 'Time must be in HH:MM format')
	.label('Time');

export const bellSchedulePeriodValidator = object({
	name: bellSchedulePeriodNameValidator,
	start: bellSchedulePeriodTimeValidator,
	end: bellSchedulePeriodTimeValidator,
	emphasis: boolean().optional(),
});

export const bellScheduleValidator: ObjectSchema<WithoutID<IBellSchedule>> = object({
	name: string().required().max(64),
	desc: string().optional().max(512),
	periods: array().of(bellSchedulePeriodValidator).required().min(1).max(16),
});

export const bellScheduleDefaultsValidator: ObjectSchema<WithoutID<IBellScheduleDefaults>> = object(
	{
		bellScheduleIDs: idArrayValidator.label('Bell Schedule IDs'),
	}
);

export const bellScheduleOverrideValidator: ObjectSchema<WithoutID<IBellScheduleOverride>> = object(
	{
		date: number().required().label('Date'),
		scheduleId: idValidator.label('Schedule ID'),
	}
);
