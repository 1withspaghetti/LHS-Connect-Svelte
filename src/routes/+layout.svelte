<script lang="ts">
	import NotificationProvider from '$components/NotificationProvider.svelte';
	import type { ThemeContext } from '$components/ThemeSwitch.svelte';
	import '$lib/styles/tailwind.css';
	import { setContext, type Snippet } from 'svelte';
	import { writable } from 'svelte/store';
	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let theme = setContext<ThemeContext>('theme', writable(undefined));

	$effect(() => {
		if ($theme !== undefined) {
			localStorage.setItem('theme', $theme);
			if ($theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
</script>

<NotificationProvider>
	{@render children?.()}
</NotificationProvider>
