<script lang="ts">
	import LinkCardContent from '$components/info/LinkCardContent.svelte';
	import { Modal } from 'flowbite-svelte';
	import { EditOutline, FileCopyOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { dragHandle } from 'svelte-dnd-action';
	import EditableLinkCardForm from './EditableLinkCardForm.svelte';
	import type { WithoutID } from '$lib/types/crud/globalCrud';
	import type { ILinkCard } from '$lib/types/crud/linkCard';

	interface Props {
		card: ILinkCard;
		onUpdate: (e: WithoutID<ILinkCard>) => void;
		onDuplicate: () => void;
		onRemove: () => void;
	}

	let { card, onUpdate, onDuplicate, onRemove }: Props = $props();

	let editModalOpen = $state(false);

	function handleEditModalSubmit(e: WithoutID<ILinkCard>) {
		onUpdate(e);
		editModalOpen = false;
	}
</script>

<div class="flex items-start gap-2">
	<div use:dragHandle>
		<LinkCardContent {card} />
	</div>
	<div class="flex flex-col">
		<button title="Edit" onclick={() => (editModalOpen = true)} class="!p-2"
			><EditOutline class="h-6 w-6" /></button
		>
		<button title="Duplicate" onclick={onDuplicate} class="!p-2"
			><FileCopyOutline class="h-6 w-6" /></button
		>
		<button title="Delete" onclick={onRemove} class="!p-2"
			><TrashBinOutline class="h-6 w-6 text-red-500 dark:text-red-400" /></button
		>
	</div>
</div>

<Modal bind:open={editModalOpen} size="md" autoclose={false}>
	<EditableLinkCardForm
		{card}
		onSubmit={handleEditModalSubmit}
		onCancel={() => (editModalOpen = false)}
	/>
</Modal>
