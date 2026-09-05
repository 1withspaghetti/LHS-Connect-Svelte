<script lang="ts" module>
	export const feedbackTypes: SelectOptionType<string>[] = [
		{ value: 'suggestion', name: 'Suggestion' },
		{ value: 'report', name: 'Incorrect Information Report' },
		{ value: 'bug', name: 'Bug Report' },
		{ value: 'other', name: 'Other' },
	];
</script>

<script lang="ts">
	import { contactUsValidator } from '$api/contact/validator';
	import { page } from '$app/state';
	import ValidatedInput from '$components/form/ValidatedInput.svelte';
	import ValidatedSelect from '$components/form/ValidatedSelect.svelte';
	import ValidatedTextarea from '$components/form/ValidatedTextarea.svelte';
	import { getNotificationContext } from '$components/NotificationProvider.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';
	import apiRequest from '$lib/util/apiClient';
	import { Button, Spinner, type SelectOptionType } from 'flowbite-svelte';
	import { PaperPlaneOutline } from 'flowbite-svelte-icons';

	const notificationContext = getNotificationContext();

	let emailInput: ValidatedInput<'email'> | undefined = $state();
	let typeInput: ValidatedSelect<'type'> | undefined = $state();
	let nameInput: ValidatedInput<'name'> | undefined = $state();
	let messageInput: ValidatedTextarea<'message'> | undefined = $state();

	let loading = $state(false);

	let name = $state('');
	let type = $state(page.url.searchParams.get('type') || '');
	let email = $state('');
	let message = $state('');

	async function onsubmit(e: Event) {
		e.preventDefault();

		loading = true;

		try {
			const data = {
				name: await nameInput!.validate(),
				type: await typeInput!.validate(),
				email: await emailInput!.validate(),
				message: await messageInput!.validate(),
			};

			await apiRequest('POST', '/contact', data);
			notificationContext.show('Message sent, thank you!');

			name = '';
			type = '';
			email = '';
			message = '';
		} catch (error) {
			if (error instanceof Error) notificationContext.show(error.message, 'error');
		}

		loading = false;
	}
</script>

<SectionHeader title="Contact Us" />
<form {onsubmit}>
	<div class="grid gap-6 md:grid-cols-2">
		<div class="mb-6">
			<ValidatedInput
				bind:this={nameInput}
				id="name"
				label="Name"
				bind:value={name}
				validatorObject={contactUsValidator}
				inputProps={{ type: 'text', placeholder: 'John Doe', autocomplete: 'name' }}
			/>
		</div>
		<div class="mb-6">
			<ValidatedSelect
				bind:this={typeInput}
				id="type"
				label="Category"
				bind:value={type}
				visuallyRequired
				validatorObject={contactUsValidator}
				selectProps={{ items: feedbackTypes, placeholder: 'Select a category...' }}
			/>
		</div>
	</div>
	<div class="mb-6">
		<ValidatedInput
			bind:this={emailInput}
			id="email"
			label="Email"
			bind:value={email}
			validatorObject={contactUsValidator}
			inputProps={{ type: 'email', placeholder: 'name@email.com' }}
		/>
	</div>
	<div class="mb-6">
		<ValidatedTextarea
			bind:this={messageInput}
			id="message"
			label="Message"
			bind:value={message}
			visuallyRequired
			validatorObject={contactUsValidator}
			textareaProps={{ placeholder: 'Your message', rows: 4 }}
		/>
		<p class="text-center text-sm italic text-gray-400">
			Please do not abuse this form. LHS Connect is built and maintained by students.
		</p>
	</div>
	<div class="flex justify-center">
		<Button type="submit">
			{#if !loading}
				Send <PaperPlaneOutline class="ms-2 h-5 w-5 rotate-45" />
			{:else}
				<Spinner class="me-3" size="4" color="white" />Loading ...
			{/if}
		</Button>
	</div>
</form>
