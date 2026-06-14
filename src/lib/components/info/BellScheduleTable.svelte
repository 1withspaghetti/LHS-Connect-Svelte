<script lang="ts">
	import type { IBellSchedule } from '$api/page_data/bellSchedule/types';
	import dayjs, { TZ } from '$lib/util/dayjs';
	import type { Dayjs } from 'dayjs';
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	interface Props {
		schedule?: IBellSchedule;
		reactive?: boolean;
		customTime?: Dayjs;
	}

	let { schedule, reactive = false, customTime }: Props = $props();

	function formatTime(time: string): string {
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours);
		const minute = parseInt(minutes);
		const formattedHour = hour % 12 === 0 ? '12' : (hour % 12).toString();
		const formattedMinute = minute.toString().padStart(2, '0');
		return `${formattedHour}:${formattedMinute}`;
	}

	function getRowClass(
		periodIndex: number,
		reactive: boolean,
		customTime: Dayjs | undefined
	): string {
		let c = 'text-base';
		if (!schedule) return c;

		const period = schedule.periods[periodIndex];
		if (period.emphasis) {
			c += ' !bg-gray-100 dark:!bg-gray-600';
		}
		if (reactive && currentlyWithinTime(period.start, period.end, customTime)) {
			c += ' !border-2 !border-primary-500';
		} else {
			c += ' border-b last:border-b-0 dark:border-gray-700';
			// Check for passing period
			if (
				reactive &&
				schedule.periods[periodIndex - 1] &&
				currentlyWithinTime(schedule.periods[periodIndex - 1].end, period.start, customTime)
			) {
				c += ' !border-t-2 !border-t-primary-500';
			}
		}
		return c;
	}

	function currentlyWithinTime(
		startStr: string,
		endStr: string,
		customTime: Dayjs | undefined
	): boolean {
		const millis = (customTime || dayjs()).tz(TZ).valueOf();
		const start = dayjs(startStr, 'HH:mm').tz(TZ).valueOf();
		const end = dayjs(endStr, 'HH:mm').tz(TZ).valueOf();
		return millis >= start && millis <= end;
	}
</script>

<Table class="table-fixed" divClass="relative mx-auto border dark:border-gray-700" striped>
	<TableBody tableBodyClass="divide-y text-center">
		{#each schedule?.periods || [] as period, i (period.name)}
			<TableBodyRow class={getRowClass(i, reactive, customTime)}>
				<TableBodyCell>
					{period.name}
				</TableBodyCell>
				<TableBodyCell>
					{formatTime(period.start)} - {formatTime(period.end)}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
{#if schedule?.desc}
	<p class="mt-4 text-center text-sm opacity-75">{schedule.desc}</p>
{/if}
