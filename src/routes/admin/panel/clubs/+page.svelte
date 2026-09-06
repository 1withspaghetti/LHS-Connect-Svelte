<script lang="ts">
	import SectionHeader from '$components/SectionHeader.svelte';
	import {
		Button,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Popover,
		Modal,
		P,
	} from 'flowbite-svelte';
	import AutoImportClubsButton from './AutoImportClubsButton.svelte';
	import type { PageData } from './$types';
	import EditableItemList from '$components/admin/EditableItemList.svelte';
	import {
		EditOutline,
		FileCopyOutline,
		InfoCircleOutline,
		TrashBinOutline,
	} from 'flowbite-svelte-icons';
	import ExternalLink from '$components/ExternalLink.svelte';
	import EditableClubForm from './EditableClubForm.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="flex flex-col items-center p-4">
	<div class="w-full max-w-7xl">
		<SectionHeader title="Club List" />
		<p class="mb-8">Alphabetical list of clubs</p>
		<EditableItemList
			serviceId="page_data/clubs"
			items={data.results}
			generateNewItem={() => ({
				name: 'New Club',
				dayTime: 'unknown',
				location: 'unknown',
				advisor: 'unknown',
			})}
			order={{
				canReorder: false,
				sortFn: (a, b) => a.name.localeCompare(b.name),
			}}
		>
			{#snippet renderItems({ items, openCreateForm, updateAll })}
				<div class="mb-8 flex justify-center gap-8">
					<Button color="alternative" on:click={openCreateForm}>Add Club</Button>
					<AutoImportClubsButton onSubmit={updateAll} />
				</div>

				<Table striped shadow class="min-w-[1024px] table-fixed">
					<TableHead>
						<TableHeadCell>Name</TableHeadCell>
						<TableHeadCell>Day and Time</TableHeadCell>
						<TableHeadCell>Location</TableHeadCell>
						<TableHeadCell>Advisor</TableHeadCell>
						<TableHeadCell>Instagram</TableHeadCell>
						<TableHeadCell>Actions</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each items as { item, openEditFrom, duplicate, remove } (item.id)}
							<TableBodyRow>
								<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">
									{item.name}
									{#if item.desc}
										<InfoCircleOutline class="inline h-4 w-4 text-gray-500 dark:text-gray-400" />
										<Popover title={item.name} placement="top-start" class="max-w-lg">
											{item.desc}
										</Popover>
									{/if}
								</TableBodyCell>
								<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm"
									>{item.dayTime}</TableBodyCell
								>
								<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm"
									>{item.location}</TableBodyCell
								>
								<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm"
									>{item.advisor}</TableBodyCell
								>
								<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm">
									{#if item.instagram && item.instagram !== 'N/A'}
										<ExternalLink
											href="https://instagram.com/{item.instagram}"
											text="@{item.instagram}"
										/>
									{:else}
										<p class="font-bold text-gray-400 dark:text-gray-300">N/A</p>
									{/if}
								</TableBodyCell>
								<TableBodyCell tdClass="px-6 py-4 font-medium max-w-sm align-top">
									<div class="flex">
										<button title="Edit" onclick={openEditFrom} class="!p-2">
											<EditOutline class="h-6 w-6" />
										</button>
										<button title="Duplicate" onclick={duplicate} class="!p-2">
											<FileCopyOutline class="h-6 w-6" />
										</button>
										<button title="Delete" onclick={remove} class="!p-2">
											<TrashBinOutline class="h-6 w-6 text-red-500 dark:text-red-400" />
										</button>
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			{/snippet}

			{#snippet editForm({ item, onSubmit, onCancel })}
				<Modal open size="sm" on:close={onCancel}>
					<EditableClubForm club={item} {onSubmit} {onCancel} />
				</Modal>
			{/snippet}
		</EditableItemList>
	</div>
</div>
