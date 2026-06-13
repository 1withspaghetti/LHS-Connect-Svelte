<script lang="ts">
	import type { LinkCardListData } from '$api/page_data/usefulLinks/types';
	import LinkCardContent from '$components/info/LinkCardContent.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';

	interface Props {
		title: string;
		data: LinkCardListData;
	}

	let { title, data }: Props = $props();
</script>

<SectionHeader {title} updatedAt={data.cards} />
<div class="flex flex-wrap items-start justify-center gap-4">
	{#each data.cards as card (card.id)}
		<LinkCardContent {card} />
	{/each}
</div>
