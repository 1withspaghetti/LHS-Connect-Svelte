<script lang="ts">
	import { shortLinkLoginValidator } from '$api/short_link/validator';
	import { page } from '$app/stores';
	import ValidatedInput from '$components/form/ValidatedInput.svelte';
	import ValidatedInputGroup from '$components/form/ValidatedInputGroup.svelte';
	import { PUBLIC_BASE_SHORT_URL } from '$env/static/public';
	import { Button, InputAddon } from 'flowbite-svelte';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';

	interface Props {
		suffix?: string;
		password?: string;
		onSubmit?: (linkLoginData: { suffix: string; password: string }) => void;
		onChange?: () => void;
	}

	let {
		suffix = $bindable($page.url.searchParams.get('suffix') || ''),
		password = $bindable(''),
		onSubmit: submit,
		onChange: oninput,
	}: Props = $props();

	$effect(() => {
		suffix = suffix.replace(PUBLIC_BASE_SHORT_URL + '/', '');
	});

	let suffixInput: ValidatedInput<'suffix'> | undefined = $state();
	let passwordInput: ValidatedInput<'password'> | undefined = $state();

	async function onsubmit(event: Event) {
		event.preventDefault();
		const linkLoginData = {
			suffix: await suffixInput!.validate(),
			password: await passwordInput!.validate(),
		};
		submit?.(linkLoginData);
	}

	let passwordVisible = $state(false);
</script>

<form class="flex w-full flex-col gap-8 md:flex-row" {onsubmit}>
	<div class="flex-1">
		<ValidatedInputGroup
			bind:this={suffixInput}
			id="suffix"
			label="Short Url (Only letters, numbers, and hyphens)"
			bind:value={suffix}
			visuallyRequired
			validatorObject={shortLinkLoginValidator}
			inputProps={{ type: 'text', oninput }}
		>
			{#snippet before()}
				<InputAddon><span class="text-nowrap">{PUBLIC_BASE_SHORT_URL}/</span></InputAddon>
			{/snippet}
		</ValidatedInputGroup>
	</div>
	<div class="flex flex-1 gap-8">
		<div class="w-full">
			<ValidatedInputGroup
				bind:this={passwordInput}
				id="password"
				label="Password"
				bind:value={password}
				validatorObject={shortLinkLoginValidator}
				inputProps={{ type: passwordVisible ? 'text' : 'password', oninput }}
			>
				{#snippet before()}
					<Button
						type="button"
						on:click={() => (passwordVisible = !passwordVisible)}
						class="pointer-events-auto"
					>
						{#if passwordVisible}
							<EyeOutline class="h-6 w-6" />
						{:else}
							<EyeSlashOutline class="h-6 w-6" />
						{/if}
					</Button>
				{/snippet}
			</ValidatedInputGroup>
		</div>
		<Button type="submit" class="mt-7 h-min">Verify</Button>
	</div>
</form>
