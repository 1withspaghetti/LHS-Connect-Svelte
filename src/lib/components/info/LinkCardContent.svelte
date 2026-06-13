<script lang="ts">
	import type { ILinkCard } from '$api/page_data/usefulLinks/types';
	import ExternalLink from '../ExternalLink.svelte';

	interface Props {
		card: ILinkCard;
	}

	let { card }: Props = $props();
</script>

<div
	class="flex w-96 flex-col overflow-hidden rounded-xl border bg-gray-50 p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
>
	<h3 class="text-lg font-semibold">{card.title}</h3>
	{#if card.subtitle}
		<p class="leading-tight text-gray-700 dark:text-gray-400">{card.subtitle}</p>
	{/if}
	<ul class="mt-2 flex flex-col divide-y">
		{#each card.links as link (link.title)}
			<li class="p-2 text-center dark:border-gray-700">
				<ExternalLink href={link.url} text={link.title} />
			</li>
		{/each}
	</ul>
</div>
