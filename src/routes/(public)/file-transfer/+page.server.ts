import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fileTransferCodeValidator } from '$api/file_transfer/validator';

export const load = (async ({ url, cookies }) => {
	const existingCode = url.searchParams.get('code');

	if (existingCode && (await fileTransferCodeValidator.isValid(existingCode))) {
		cookies.set('fileTransferCode', existingCode, { path: '/', maxAge: 1800 }); // 30min
		return;
	}

	const cookieCode = cookies.get('fileTransferCode');
	if (cookieCode && (await fileTransferCodeValidator.isValid(cookieCode))) {
		cookies.set('fileTransferCode', cookieCode, { path: '/', maxAge: 1800 }); // 30min
		return redirect(301, '?code=' + cookieCode);
	}

	const code =
		Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0') +
		'-' +
		Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0');
	cookies.set('fileTransferCode', code, { path: '/', maxAge: 1800 }); // 30min

	return redirect(301, '?code=' + code);
}) satisfies PageServerLoad;
