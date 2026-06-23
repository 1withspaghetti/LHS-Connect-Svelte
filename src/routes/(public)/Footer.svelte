<script lang="ts">
	import type { LinkCardListData } from '$api/page_data/usefulLinks/types';
	import dayjs from '$lib/util/dayjs';
	import {
		CogOutline,
		DiscordSolid,
		ExclamationCircleOutline,
		MailBoxOutline,
		StarOutline,
	} from 'flowbite-svelte-icons';

	interface Props {
		usefulLinks: LinkCardListData;
	}

	let { usefulLinks }: Props = $props();

	let updatedAtString = $derived(
		usefulLinks.cards
			?.filter((x) => x.updatedAt)
			.map((x) => dayjs(x.updatedAt))
			.sort((a, b) => b.valueOf() - a.valueOf())[0]
			?.fromNow()
	);
</script>

<footer class="mt-16 w-full bg-gray-100 p-8 text-gray-500 dark:bg-gray-800 dark:text-gray-500">
	<div class="flex flex-wrap justify-center gap-8 lg:gap-16">
		{#each usefulLinks.cards as card}
			<div>
				<h3 class="mb-2 text-lg font-bold">{card.title}</h3>
				{#if card.subtitle}
					<p class="text-xs">{card.subtitle}</p>
				{/if}
				<ul class="list-none">
					{#each card.links as link}
						<li class="mb-1">
							<a href={link.url} target="_blank" rel="noopener" class="underline">{link.title}</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
	{#if updatedAtString}
		<div class="mt-2 text-center text-sm italic">
			Links last updated {updatedAtString}
		</div>
	{/if}
	<div class="my-8 h-[1px] bg-current lg:mx-16"></div>
	<div class="mb-4 text-center">
		<MailBoxOutline class="inline-block" />
		<a href="/about#contact" class="underline">Contact</a>
		<span class="mx-2">•</span>
		<ExclamationCircleOutline class="inline-block" />
		<a href="/about?type=report#contact" class="underline">Report Incorrect Information</a>
		<span class="mx-2">•</span>
		<DiscordSolid class="inline-block h-6 w-6" />
		<a href="/discord" target="_blank" class="underline">Discord</a>
		<span class="mx-2">•</span>
		<CogOutline class="inline-block" />
		<a href="/admin/panel" class="underline">Admin Panel</a>
		<span class="mx-2">•</span>
		<StarOutline class="inline-block" />
		<a href="/extra" class="underline">Extras</a>
	</div>
	<p class="text-center text-xs">
		This website is not affiliated with Lincoln High School or Seattle Public Schools.
	</p>
</footer>
