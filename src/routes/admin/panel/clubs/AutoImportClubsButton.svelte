<script lang="ts">
	import ValidatedInput from '$components/form/ValidatedInput.svelte';
	import ValidatedTextarea from '$components/form/ValidatedTextarea.svelte';
	import { GradientButton, Helper, Modal, Tooltip } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';
	import { string } from 'yup';
	import Papa from 'papaparse';
	import { getNotificationContext } from '$components/NotificationProvider.svelte';
	import type { IClub } from '$api/page_data/clubs/types';
	import type { WithoutID } from '$lib/types/basicTypes';
/* SAMPLE DATA:
https://lhs.cx/current-clubs
https://lhs.cx/old-clubs
*/
	interface Props {
		onSubmit: (clubs: WithoutID<IClub>[]) => void;
	}

	let { onSubmit: submit }: Props = $props();

	const notificationContext = getNotificationContext();

	let modalOpen = $state(false);

	let startInput: ValidatedInput | undefined = $state();
	let endInput: ValidatedInput | undefined = $state();
	let csvInput: ValidatedTextarea | undefined = $state();

	async function onsubmit(event: Event) {
		event.preventDefault();
		let strData = await csvInput!.validate();
		let start = await startInput!.validate();
		let end = await endInput!.validate();

		try {
			const records: WithoutID<IClub>[] = [];

			let line = 0;
			Papa.parse(strData, {
				step(results) {
					line++;
					if (start !== undefined && line < parseInt(start)) return;
					if (end !== undefined && line > parseInt(end)) return;

					if (results.errors.length > 0) {
						console.error(results.errors);
						return;
					}

					const row = results.data as any[];
					const firstHeaderCell: string = 'Which student group are you submitting information for?';
					if (/*row[0] == firstHeaderCell && */line == 1) return; // Skip header. Commented out because header text was still getting through, idfk but if they change their data stucture we have bigger problems anyway.
					if (row.map((v: string) => v.trim()).filter((v) => !!v).length < 4) return; // Skip rows with less than 4 filled values

					// Search for instagram username
//					console.log('raw row[8]:' + row[8]);
					var instaSearch = /@?([a-zA-Z\d._]+)( ?- ?insta(gram)?)?/gim.exec(row[8]);
					var instaUrlSearch = /instagram\.com\/([a-zA-Z\d._]+)/gim.exec(row[8]);
					const noInstagramPattern: RegExp = /^(n\/a)?\s*$/i;
					var insta = '';
					if (instaSearch != null) insta = instaSearch[1];
					if (instaUrlSearch != null) insta = instaUrlSearch[1];
					if (noInstagramPattern.test(row[8])) insta = "N/A";
//					console.log("name: " +  row[0].replace('\n', ' ').trim() + ", dayTime: " + row[4].replace('\n', ' ').trim() + ", location: " + row[3].replace('\n', ' ').trim() + ", advisor: " + row[7].replace('\n', ' ').trim() + ", insta: " + insta.replace('@', '') + ", desc: " + row[6].replace('\n', ' ').trim());
					records.push({
						name: row[0].replace('\n', ' ').trim() || 'Unknown',
						dayTime: row[4].replace('\n', ' ').trim() || 'Unknown',
						location: row[3].replace('\n', ' ').trim() || 'Unknown',
						advisor: row[7].replace('\n', ' ').trim() || 'Unknown',
						instagram: insta.replace('@', '') || undefined,
						desc: row[6].replace('\n', ' ').trim() || undefined,
					});
				},
				complete() {
					notificationContext.show('Imported ' + records.length + ' clubs', 'success');
					submit(records);
					modalOpen = false;
				},
			});
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="flex items-center gap-2">
	<GradientButton outline color="purpleToPink" on:click={() => (modalOpen = true)}>Auto Import <InfoCircleOutline class="h-6 w-6 ml-4 text-gray-700 dark:text-gray-400" />
	<Tooltip
		>Import clubs from a CSV file, clicking this button will open a menu with instructions</Tooltip
	></GradientButton
	>
	
</div>

<Modal bind:open={modalOpen} size="lg" autoclose={false} title="Auto Import From CSV">
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Instructions: Visit the ASB club excel sheet, click on file, export as CSV (without formatting,
		utf8 format), then open the CSV in a program such as notepad and copy+paste the content here.
		Usually you don't need to input the start and end row, but if you are having issues, you can
		specify the start and end row of the data you want to import.
	</p>
	<form {onsubmit} class="flex flex-col items-center gap-4">
		<div class="flex flex-col gap-4 sm:flex-row">
			<div>
				<ValidatedInput
					bind:this={startInput}
					id="start"
					label="Start Row"
					validator={string()
						.optional()
						.matches(/^\d*$/, 'Must be a number')
						.max(4 /* Characters */)
						.label('Start Row')}
					inputProps={{ type: 'number' }}
				/>
			</div>
			<div>
				<ValidatedInput
					bind:this={endInput}
					id="end"
					label="End Row"
					validator={string()
						.optional()
						.matches(/^\d*$/, 'Must be a number')
						.max(4 /* Characters */)
						.label('End Row')}
					inputProps={{ type: 'number' }}
				/>
			</div>
		</div>
		<div class="w-full">
			<ValidatedTextarea
				bind:this={csvInput}
				id="clubs"
				label="Data"
				validator={string().required().max(100000).label('CSV')}
				visuallyRequired
				textareaProps={{
					rows: 10,
					placeholder: 'Paste the CSV content here',
					autocomplete: 'off',
					spellcheck: false,
					autocapitalize: 'off',
					autocorrect: 'off',
				}}
			/>
		</div>
		<Helper>Note: This will overwrite everything already in the table.</Helper>
		<GradientButton type="submit" color="purpleToPink">Import</GradientButton>
	</form>
</Modal>
