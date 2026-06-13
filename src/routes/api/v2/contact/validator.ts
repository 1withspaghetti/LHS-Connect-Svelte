import { object, type ObjectSchema, string } from 'yup';
import type { IContactUsMessage } from './types';

export const contactUsValidator: ObjectSchema<IContactUsMessage> = object({
	name: string().trim().max(256).label('Name'),
	type: string().trim().required().max(256).label('Type'),
	email: string().trim().email().max(256).label('Email'),
	message: string().trim().required().max(1024).label('Message'),
});
