<script module lang="ts">
	export type ThemeContext = Writable<'light' | 'dark' | undefined>;
</script>

<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { MoonOutline, SunOutline } from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let theme = getContext<ThemeContext>('theme');

	function handleClick() {
		if ($theme === undefined) {
			let browserDefault: 'light' | 'dark' =
				window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
					? 'light'
					: 'dark';
			theme.update((value) => browserDefault);
		}
		theme.update((value) => (value === 'dark' ? 'light' : 'dark'));
	}
</script>

<Button size="sm" on:click={handleClick} color="none">
	{#if $theme === 'dark'}
		<SunOutline></SunOutline>
	{:else}
		<MoonOutline></MoonOutline>
	{/if}
</Button>
