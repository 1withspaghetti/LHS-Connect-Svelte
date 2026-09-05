import { ValidationError } from 'yup';
import { feedbackTypes } from '../../../../lib/components/ContactForm.svelte';
import type { RequestHandler } from './$types';
import { contactUsValidator } from './validator';
import { ContactUsMessage } from './model';
import { DISCORD_WEBHOOK_URL } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const req = await request.json();
		const validatedReq = await contactUsValidator.validate(req, { stripUnknown: true });

		const typeName = feedbackTypes.find((type) => type.value === validatedReq.type)?.name;
		if (!typeName) throw new ValidationError(`Invalid type: ${validatedReq.type}`);

		const message = new ContactUsMessage({
			name: validatedReq.name,
			email: validatedReq.email,
			type: validatedReq.type,
			message: validatedReq.message,
		});

		await message.save();

		if (DISCORD_WEBHOOK_URL) {
			const webhook_body = {
				content: null,
				embeds: [
					{
						title: typeName,
						description: validatedReq.message,
						color: 16734296,
						author: {
							name: validatedReq.name || 'No name provided',
						},
						footer: {
							text: validatedReq.email || 'No email provided',
						},
						timestamp: new Date().toISOString(),
					},
				],
				username: 'LHS Connect Feedback',
				attachments: [],
				allowed_mentions: {
					parse: [],
				},
			};

			const res = await fetch(DISCORD_WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(webhook_body),
			});

			if (!res.ok) {
				console.error('Failed to send message to Discord', await res.json());
			}
		}

		return json({});
	} catch (e) {
		if (e instanceof ValidationError) return error(400, { message: e.message });
		else throw e;
	}
};
