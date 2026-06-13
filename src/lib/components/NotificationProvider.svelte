<script lang="ts" module>
	export interface NotificationContext {
		/**
		 * Show a notification
		 * @param message - The message to show, should be short and sweet
		 * @param type - The type of notification, either 'success' or 'error', defaulting to 'success'
		 */
		show: (message: string, type?: 'success' | 'error') => void;
		/**
		 * Hide the notification
		 * @param message - The message to hide
		 */
		hide: (message: string) => void;
		/**
		 * Hide all notifications
		 */
		hideAll: () => void;
	}

	export interface Notification {
		message: string;
		type: 'success' | 'error';
	}

	export const getNotificationContext = () => getContext<NotificationContext>('notify');
</script>

<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';

	import { getContext, setContext, type Snippet } from 'svelte';

	const TIMEOUT = 5000;

	let { children }: { children: Snippet } = $props();

	let notifications = $state<Notification[]>([]);

	function show(message: string, type: 'success' | 'error' = 'success') {
		if (notifications.find((n) => n.message === message)) return; // Don't show duplicates
		if (notifications.length >= 3) notifications.pop();
		const newNotification = {
			message: message ?? (type === 'success' ? 'Success' : 'Error'),
			type,
		};
		notifications = [newNotification, ...notifications];
		setTimeout(() => hide(message), TIMEOUT);
	}

	function hide(message: string) {
		notifications = notifications.filter((n) => n.message !== message);
	}

	function hideAll() {
		notifications = [];
	}

	setContext<NotificationContext>('notify', {
		show,
		hide,
		hideAll,
	});
</script>

{@render children?.()}
<div class="fixed bottom-0 right-0 space-y-4 p-4">
	{#each notifications as { message, type } (message)}
		<Toast color={type === 'success' ? 'green' : 'red'} onclose={() => hide(message)}>
			<svelte:fragment slot="icon">
				{#if type === 'success'}
					<CheckCircleSolid class="h-5 w-5" />
					<span class="sr-only">Check icon</span>
				{:else}
					<CloseCircleSolid class="h-5 w-5" />
					<span class="sr-only">Error icon</span>
				{/if}
			</svelte:fragment>

			{message}
		</Toast>
	{/each}
</div>
