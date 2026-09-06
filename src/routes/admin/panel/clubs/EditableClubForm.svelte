<script lang="ts">
	import type { IClub } from '$api/page_data/clubs/types';
	import { clubValidator } from '$api/page_data/clubs/validator';
	import ValidatedInput from '$components/form/ValidatedInput.svelte';
	import ValidatedTextarea from '$components/form/ValidatedTextarea.svelte';
	import type { WithoutID } from '$lib/types/basicTypes';
	import { Button } from 'flowbite-svelte';

	interface Props {
		club: WithoutID<IClub>;
		onSubmit: (club: WithoutID<IClub>) => void;
		onCancel: () => void;
	}

	let { club, onSubmit: submit, onCancel: cancel }: Props = $props();

	let name = $state(club.name);
	let dayTime = $state(club.dayTime);
	let location = $state(club.location);
	let advisor = $state(club.advisor);
	let instagram = $state(club.instagram);
	let desc = $state(club.desc);

	let nameInput: ValidatedInput<'name'> | undefined = $state();
	let dayTimeInput: ValidatedInput<'dayTime'> | undefined = $state();
	let locationInput: ValidatedInput<'location'> | undefined = $state();
	let advisorInput: ValidatedInput<'advisor'> | undefined = $state();
	let instagramInput: ValidatedInput<'instagram'> | undefined = $state();
	let descInput: ValidatedTextarea<'desc'> | undefined = $state();

	async function onsubmit(e: Event) {
		e.preventDefault();
		const club = {
			name: await nameInput!.validate(),
			dayTime: await dayTimeInput!.validate(),
			location: await locationInput!.validate(),
			advisor: await advisorInput!.validate(),
			instagram: await instagramInput!.validate(),
			desc: await descInput!.validate(),
		};
		submit(club);
	}
</script>

<form class="flex flex-col space-y-6" {onsubmit}>
	<div>
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Edit Club</h3>
	</div>
	<div>
		<ValidatedInput
			bind:this={nameInput}
			id="name"
			label="Name"
			bind:value={name}
			validatorObject={clubValidator}
			visuallyRequired
		/>
	</div>
	<div>
		<ValidatedInput
			bind:this={dayTimeInput}
			id="dayTime"
			label="Day and Time"
			bind:value={dayTime}
			validatorObject={clubValidator}
			visuallyRequired
		/>
	</div>
	<div>
		<ValidatedInput
			bind:this={locationInput}
			id="location"
			label="Location"
			bind:value={location}
			validatorObject={clubValidator}
			visuallyRequired
		/>
	</div>
	<div>
		<ValidatedInput
			bind:this={advisorInput}
			id="advisor"
			label="Advisor"
			bind:value={advisor}
			validatorObject={clubValidator}
			visuallyRequired
		/>
	</div>
	<div>
		<ValidatedInput
			bind:this={instagramInput}
			id="instagram"
			label="Instagram"
			bind:value={instagram}
			validatorObject={clubValidator}
		/>
	</div>
	<div>
		<ValidatedTextarea
			bind:this={descInput}
			id="desc"
			label="Description"
			bind:value={desc}
			validatorObject={clubValidator}
		/>
	</div>

	<div class="mb-4 mt-6 flex justify-center gap-4">
		<Button type="button" color="alternative" on:click={cancel}>Cancel</Button>
		<Button type="submit">Save</Button>
	</div>
</form>
