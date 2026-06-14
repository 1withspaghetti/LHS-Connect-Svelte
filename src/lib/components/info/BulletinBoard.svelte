<script lang="ts">
	import type { BulletinBoardData } from '$api/page_data/bulletinBoard/types';
	import BoardNoteContent from '$components/info/BoardNoteContent.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';

	interface Props {
		data: BulletinBoardData;
	}

	let { data }: Props = $props();
</script>

<SectionHeader title="Bulletin Board" updatedAt={data.notes} />
<div class="my-4 flex flex-col gap-4">
	{#each data.notes as note (note.id)}
		<BoardNoteContent {note} />
	{/each}
</div>
