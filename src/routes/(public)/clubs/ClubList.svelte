<script lang="ts">
	import type { ClubListData } from '$api/page_data/clubs/types';
	import ExternalLink from '$components/ExternalLink.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';
	import {
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Popover,
	} from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';
	import Fuse from 'fuse.js';

	interface Props {
		data: ClubListData;
	}

	let { data }: Props = $props();

	let search = $state('');

	let fuse = $derived(
		new Fuse(data.clubs, {
			keys: [
				{ name: 'name', weight: 5 },
				{ name: 'desc', weight: 4 },
				{ name: 'day', weight: 1 },
				{ name: 'time', weight: 1 },
				{ name: 'location', weight: 1 },
				{ name: 'advisor', weight: 1 },
			],
		})
	);

	let searchedClubs = $derived(
		search.trim().length === 0 ? data.clubs : fuse.search(search).map((result) => result.item)
	);
</script>

<div class="px-4">
	<SectionHeader title="List of Lincoln Clubs" updatedAt={data.clubs} />
</div>
<div class="mb-4 mt-8 flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<Search size="md" placeholder="Search" bind:value={search} />
	</div>
</div>
<Table striped shadow class="table-fixed">
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>Day</TableHeadCell>
		<TableHeadCell>Time</TableHeadCell>
		<TableHeadCell>Location</TableHeadCell>
		<TableHeadCell>Advisor</TableHeadCell>
		<TableHeadCell>Instagram</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each searchedClubs as club (club.id)}
			<TableBodyRow>
				<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">
					{club.name}
					{#if club.desc}
						<InfoCircleOutline class="inline h-4 w-4 text-gray-500 dark:text-gray-400" />
						<Popover title={club.name} placement="top-start" class="max-w-lg">
							{club.desc}
						</Popover>
					{/if}
				</TableBodyCell>
				<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">{club.day}</TableBodyCell>
				<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">{club.time}</TableBodyCell>
				<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">{club.location}</TableBodyCell>
				<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">{club.advisor}</TableBodyCell>
				<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">
					{#if club.instagram}
						<ExternalLink href="https://instagram.com/{club.instagram}" text="@{club.instagram}" />
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
