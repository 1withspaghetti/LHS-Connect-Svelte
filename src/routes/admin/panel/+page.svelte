<script lang="ts">
	import SectionHeader from '$components/SectionHeader.svelte';
	import { Alert, Button, Card, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import pages from './pages';
	import { Permissions } from '$lib/auth/permissions';
	import type { PageData } from './$types';
	import ValidatedInput from '$components/form/ValidatedInput.svelte';
	import adminApiClient from '$lib/util/adminApiClient';
	import { goto, invalidate } from '$app/navigation';
	import { getNotificationContext } from '$components/NotificationProvider.svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';
	import { announcementValidator } from '$api/page_data/announcement/validator';

	let { data }: { data: PageData } = $props();

	const notificationContext = getNotificationContext();

	let announcementInput: ValidatedInput<'text'> | undefined = undefined;

	let announcement = $state(data.announcement?.text || '');
	$effect(() => {
		announcement = data.announcement?.text || '';
	});
	let announcementSaved = $derived(announcement === (data.announcement?.text || ''));

	async function saveAnnouncement(e: Event) {
		e.preventDefault();
		const data = {
			text: await announcementInput?.validate(),
		};

		await adminApiClient.create('page_data/announcement', data).catch((e) => {
			notificationContext.show(e.message, 'error');
		});
		invalidate('/api/v2/page_data/announcement/edit');
		notificationContext.show('Announcement saved', 'success');
	}
</script>

<div class="flex flex-col items-center p-4 pb-12">
	<div class="w-full max-w-4xl">
		<SectionHeader title="Dashboard" />

		<div class="mb-12 flex w-full flex-wrap items-start justify-center gap-6 md:justify-start">
			{#each pages as page (page.label)}
				{@const IconComponent = page.icon}
				{#if !page.hidden && (!page.permission || Permissions.has(data.session, page.permission)) && !(page.href == '/admin/panel')}
					<Card size="sm">
						<IconComponent class="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400" />
						<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
							{page.label}
						</h5>
						{#if page.children}
							<Listgroup active class="border-0 dark:!bg-transparent">
								{#each page.children as item (item.label)}
									<ListgroupItem active href={page.href} on:click={() => goto(item.href)}>
										{item.label}
									</ListgroupItem>
								{/each}
							</Listgroup>
						{/if}
						<div class="mt-4 flex gap-4">
							{#if page.href}
								<Button href={page.href} class="w-fit">Edit</Button>
							{/if}
							{#if page.publicHref}
								<Button href={page.publicHref} target="_blank" color="alternative" class="w-fit"
									>View Public Page</Button
								>
							{/if}
						</div>
					</Card>
				{/if}
			{/each}
		</div>

		<SectionHeader title="Announcement" />
		<p class="mb-4">
			This displays at the top of every public page, and can be dismissed. (Supports inline
			markdown)
		</p>
		<form onsubmit={saveAnnouncement} class="mb-4 flex w-full items-end gap-4">
			<div class="w-full">
				<ValidatedInput
					bind:this={announcementInput}
					id="text"
					label="Announcement Text"
					bind:value={announcement}
					validatorObject={announcementValidator}
					inputProps={{ placeholder: 'Leave blank for none' }}
				/>
			</div>
			<Button type="submit">Save</Button>
		</form>
		{#if !announcementSaved}
			<div transition:slide>
				<Alert color="yellow">
					<InfoCircleSolid slot="icon" class="h-5 w-5" />
					<span class="font-medium">Warning!</span>
					You have unsaved changes
				</Alert>
			</div>
		{/if}
	</div>
</div>
