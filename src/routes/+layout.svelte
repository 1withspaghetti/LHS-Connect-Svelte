<script lang="ts">
	import { dev } from '$app/environment';
	import NotificationProvider from '$components/NotificationProvider.svelte';
	import type { ThemeContext } from '$components/ThemeSwitch.svelte';
	import '$lib/styles/tailwind.css';
	import { onMount, setContext, type Snippet } from 'svelte';
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
		} else {
			if (localStorage.getItem('theme') === null) {
				if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
					$theme = 'light';
				} else {
					$theme = 'dark';
				}
			} else {
				if (localStorage.getItem('theme') === 'light') {
					$theme = 'light';
				} else {
					$theme = 'dark';
				}
			}
		}
	});
</script>

<NotificationProvider>
	{@render children?.()}
</NotificationProvider>
