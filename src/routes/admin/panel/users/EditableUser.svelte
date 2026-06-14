<script lang="ts">
	import { Permission, Permissions } from '$lib/auth/permissions';
	import { Avatar, Badge, Modal, TableBodyCell, TableBodyRow, Tooltip } from 'flowbite-svelte';
	import { EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import EditableUserForm from './EditableUserForm.svelte';
	import dayjs from '$lib/util/dayjs';
	import type { ISerializedUser, IAdminUserUpdate } from '$api/users/types';

	interface Props {
		user: ISerializedUser;
		onUpdate: (e: IAdminUserUpdate) => void;
		onRemove: () => void;
	}

	let { user, onUpdate, onRemove }: Props = $props();

	let editModalOpen = $state(false);

	let selectedPermissions = $derived(new Permissions(user.permissions).toArray());

	function handleEditModalSubmit(user: IAdminUserUpdate) {
		editModalOpen = false;
		onUpdate(user);
	}
</script>

<TableBodyRow>
	<TableBodyCell tdClass="p-4 font-medium max-w-sm min-w-16"
		><Avatar size="sm" src={user.pfp} /></TableBodyCell
	>
	<TableBodyCell tdClass="p-4 font-medium max-w-sm">{user.name}</TableBodyCell>
	<TableBodyCell tdClass="p-4 font-medium max-w-sm">{user.email}</TableBodyCell>
	<TableBodyCell tdClass="p-4 font-medium max-w-sm">
		<div class="flex flex-wrap gap-2">
			{#each selectedPermissions as p (p)}
				<Badge large color="dark">{Permission[p]}</Badge>
			{/each}
		</div>
	</TableBodyCell>
	<TableBodyCell tdClass="p-4 font-medium max-w-sm"
		>{dayjs(user.firstLogin).format('L LT')}</TableBodyCell
	>
	<TableBodyCell tdClass="p-4 font-medium max-w-sm"
		>{dayjs(user.lastLogin).format('L LT')}</TableBodyCell
	>
	<TableBodyCell tdClass="p-2 py-4 font-medium max-w-sm align-top">
		<div class="flex justify-center">
			<button title="Edit" onclick={() => (editModalOpen = true)} class="!p-2"
				><EditOutline class="h-6 w-6" /></button
			>
			<Tooltip>Edit</Tooltip>

			<button title="Delete" onclick={onRemove} class="!p-2"
				><TrashBinOutline class="h-6 w-6 text-red-500 dark:text-red-400" /></button
			>
			<Tooltip>Delete</Tooltip>
		</div>
	</TableBodyCell>
</TableBodyRow>

<Modal bind:open={editModalOpen} size="sm" autoclose={false}>
	<EditableUserForm
		{user}
		onSubmit={handleEditModalSubmit}
		onCancel={() => (editModalOpen = false)}
	/>
</Modal>
