<script lang="ts">
	import SectionHeader from '$components/SectionHeader.svelte';
	import { Button, Table, TableHead, TableHeadCell, TableBody, Label } from 'flowbite-svelte';
	import DefaultSchedules from './DefaultSchedules.svelte';
	import SpecialScheduleRow from './SpecialScheduleRow.svelte';
	import BellScheduleTabs from '$components/info/BellScheduleTabs.svelte';
	import type { PageData } from './$types';
	import dayjs, { TZ } from '$lib/util/dayjs';
	import EditableItemList from '$components/admin/EditableItemList.svelte';
	import ExternalLink from '$components/ExternalLink.svelte';
	import type { BellScheduleData } from '$api/page_data/bellSchedule/types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Select options for the schedule overrides
	let scheduleOptions = $derived(
		data.bellSchedules.map((item) => ({ value: item.id, name: item?.name || 'Unknown' }))
	);

	let defaults = $state(data.bellScheduleDefaults?.bellScheduleIDs || []);
	let overrides = $state(data.bellScheduleOverrides);

	let previewTime = $state(dayjs().format(`YYYY-MM-DD[T]HH:mm`));

	let bellScheduleData: BellScheduleData = $derived({
		defaults: defaults.map((id) => data.bellSchedules.find((schedule) => schedule.id === id)!), // Populate the defaults
		overrides: overrides.map((item) => ({
			...item,
			schedule: data.bellSchedules.find((schedule) => schedule.id === item.scheduleId)!,
		})), // Populate the overrides
	});
</script>

<div class="flex flex-col items-center p-4">
	<div class="w-full max-w-4xl">
		<SectionHeader title="Days of the Week" updatedAt={[data.bellScheduleDefaults]} />
		<p class="mb-8">The default bell schedules that always show up, one of each day of the week.</p>
		<DefaultSchedules bind:defaults {scheduleOptions} />

		<div class="h-24"></div>

		<SectionHeader title="Schedule Overrides" updatedAt={overrides} />
		<p class="mb-8">
			Special schedules that override the default schedules on specific dates. To add a new
			schedule, go to the <ExternalLink
				href="/admin/panel/home/saved-schedules"
				text="Saved Schedules Page"
			/>.
		</p>
		<EditableItemList
			serviceId="page_data/bellSchedule/bellScheduleOverrides"
			bind:items={overrides}
			generateNewItem={() => ({
				date: dayjs().tz(TZ).startOf('day').valueOf(),
				scheduleId: data.bellSchedules[0]?.id,
			})}
			order={{
				canReorder: false,
				sortFn: (a, b) => a.date - b.date,
			}}
		>
			{#snippet renderItems({ items, create })}
				<div class="mb-8 flex justify-center gap-8">
					<Button color="alternative" on:click={create}>Add Schedule Override</Button>
				</div>
				<Table>
					<TableHead>
						<TableHeadCell>Date</TableHeadCell>
						<TableHeadCell>Schedule</TableHeadCell>
						<TableHeadCell class="text-right">Actions</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each items as item (item.id)}
							<SpecialScheduleRow
								special={item.item}
								{scheduleOptions}
								onUpdate={item.update}
								onDuplicate={item.duplicate}
								onRemove={item.remove}
							/>
						{/each}
					</TableBody>
				</Table>
			{/snippet}
		</EditableItemList>

		<div class="h-24"></div>

		<SectionHeader title="Schedule Preview" />
		<div class="mb-8 flex items-center">
			<Label for="preview-time" class="mr-4 text-xl">At Time:</Label>
			<input
				id="preview-time"
				name="preview-time"
				type="datetime-local"
				step="60"
				bind:value={previewTime}
				class="border-0 bg-white ring-primary-500 group-odd:bg-white group-even:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 group-odd:dark:bg-gray-800 group-even:dark:bg-gray-700"
			/>
		</div>
		<div class="mx-auto max-w-2xl">
			<BellScheduleTabs data={bellScheduleData} customTime={dayjs(previewTime).tz(TZ)} />
		</div>
	</div>
</div>
