<script lang="ts">
	import type {
		BellScheduleData,
		IBellSchedule,
		IPopulatedBellScheduleOverride,
	} from '$api/page_data/bellSchedule/types';
	import BellScheduleTable from '$components/info/BellScheduleTable.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';
	import dayjs, { TZ } from '$lib/util/dayjs';
	import { type Dayjs } from 'dayjs';
	import { Accordion, AccordionItem, TabItem, Tabs } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	// Import the data from the parent component
	interface Props {
		data: BellScheduleData;
		customTime?: Dayjs;
	}

	let { data, customTime }: Props = $props();

	// Precalculate the shown tabs and the selected tab

	let tabs: IBellSchedule[] = $state([]);
	let selectedTab = $state(0);

	let now = $state(customTime || dayjs());
	$effect(() => {
		if (customTime)
			now = customTime; // Update the time if it's custom
		else now = dayjs();
	});
	let dayOfWeek = $derived(now.tz(TZ).day());
	let dateEpoch = $derived(dayjs(now.valueOf()).tz(TZ).startOf('day').valueOf());

	$effect.pre(() => {
		// Default day schedules
		let newTabs: IBellSchedule[] = [];
		let newTabIds: IBellSchedule['id'][] = [];
		for (let i = 0; i < data.defaults.length; i++) {
			const schedule = data.defaults[i];
			if (!schedule) continue; // Skip if no schedule is found
			if (!newTabIds.includes(schedule.id)) {
				newTabs.push(schedule);
				newTabIds.push(schedule.id);
			}
			if (dayOfWeek === i) selectedTab = newTabIds.indexOf(schedule.id);
		}

		// Get the special schedule for today
		const overrides = data.overrides.filter((item) => item.date === dateEpoch);
		for (let i = 0; i < overrides.length; i++) {
			const schedule = overrides[i].schedule;
			if (schedule == null) {
				console.warn('Override schedule is null. Skipping it.');
				continue;
			}
			if (newTabIds.includes(schedule.id)) {
				selectedTab = newTabIds.indexOf(schedule.id);
				continue;
			}
			newTabs.unshift(schedule);
			newTabIds.unshift(schedule.id);
			selectedTab = 0;
		}

		tabs = newTabs;
	});

	// Add any future special schedules
	let upcomingOverrides: (IPopulatedBellScheduleOverride & { dateStr: string })[] = $derived(
		data.overrides
			.filter((item) => item.date > dateEpoch)
			.map((item) => ({
				...item,
				dateStr: dayjs(item.date).format('M/D/YY'),
			}))
			.sort((a, b) => a.date - b.date)
	);

	// setInterval to update reactive data
	onMount(() => {
		if (customTime) return;
		// Update the current time every 10 seconds
		let clear = setInterval(() => {
			now = dayjs();
		}, 10000);
		return () => clearInterval(clear);
	});
</script>

<SectionHeader
	title="Bell Schedule"
	updatedAt={[...data.defaults, ...data.overrides, ...data.overrides.map((i) => i.schedule)]}
/>
<Tabs
	tabStyle="none"
	contentClass="pt-4 bg-white dark:bg-gray-900"
	defaultClass="flex flex-wrap ltr:mr-2 rtl:ml-2"
>
	{#each tabs as schedule, i (schedule.name)}
		<TabItem open={i === selectedTab} title={schedule?.name || 'Unknown'}>
			<BellScheduleTable {schedule} reactive={i === selectedTab} customTime={now} />
		</TabItem>
	{/each}

	{#if upcomingOverrides.length > 0}
		<TabItem title="Upcoming...">
			<Accordion multiple>
				{#each upcomingOverrides as special (special.date)}
					<AccordionItem>
						<span slot="header">{special.schedule?.name || 'Unknown'} - {special.dateStr}</span>
						<BellScheduleTable schedule={special.schedule} />
					</AccordionItem>
				{/each}
			</Accordion>
		</TabItem>
	{/if}
</Tabs>
