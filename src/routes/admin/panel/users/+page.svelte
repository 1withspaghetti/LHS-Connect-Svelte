<script lang="ts">
	import { getNotificationContext } from '$components/NotificationProvider.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';
	import adminApiClient from '$lib/util/adminApiClient';
	import {
		Input,
		Label,
		Pagination,
		Select,
		Table,
		TableBody,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import EditableUser from './EditableUser.svelte';
	import { Permission } from '$lib/auth/permissions';
	import type { IAdminUserUpdate, ISerializedUser } from '$api/users/types';

	const notificationContext = getNotificationContext();

	let page = $state(1);
	let itemsPerPage = $state(10);
	let total = $state(0);

	let list = $state<ISerializedUser[]>([]);

	let search = $state('');
	let orderBy = $state('permissions');
	let order = $state<'desc' | 'asc'>('desc');

	$effect(refresh);

	function refresh() {
		adminApiClient
			.baseApiRequest(
				'GET',
				`/users/edit?page=${page}&pageSize=${itemsPerPage}&search=${search}&orderBy=${orderBy}&order=${order}`
			)
			.then((res) => {
				list = res.results;
				total = res.total;
				if (page > 1 && list.length === 0) {
					page--;
					refresh();
				}
			})
			.catch((e) => notificationContext.show(e.message, 'error'));
	}

	function next() {
		if (page * itemsPerPage < total) {
			page++;
		}
	}

	function prev() {
		if (page > 1) {
			page--;
		}
	}

	function update(id: ISerializedUser['id'], user: IAdminUserUpdate) {
		adminApiClient
			.baseApiRequest('PATCH', `/users/edit/${id}`, user)
			.then((res) => {
				const index = list.findIndex((item) => item.id === id);
				list[index] = res.result;
			})
			.catch((e) => {
				notificationContext.show(e.message, 'error');
				refresh();
			});
	}

	function remove(id: ISerializedUser['id']) {
		list = list.filter((item) => item.id !== id);
		adminApiClient
			.baseApiRequest('DELETE', `/users/edit/${id}`)
			.catch((e) => notificationContext.show(e.message, 'error'))
			.finally(refresh);
	}

	const pageSizes = [
		{ value: 10, name: '10' },
		{ value: 25, name: '25' },
		{ value: 50, name: '50' },
		{ value: 100, name: '100' },
	];

	const sortByOptions = [
		{ value: 'name', name: 'Name' },
		{ value: 'email', name: 'Email' },
		{ value: 'permissions', name: 'Permissions' },
		{ value: 'firstLogin', name: 'First Login' },
		{ value: 'lastLogin', name: 'Last Login' },
	];

	const sortOptions = [
		{ value: 'asc', name: 'Ascending' },
		{ value: 'desc', name: 'Descending' },
	];
</script>

<div class="flex flex-col items-center p-4">
	<div class="w-full max-w-4xl">
		<SectionHeader title="User Accounts" />
		<p class="mb-6">
			All accounts that have logged in at least once are listed here. You can edit their
			permissions. The OWNER permission gives full access to the admin panel and the ability to
			manage other users. It cannot be given or taken away from this panel. Instead, it must be done
			manually in the database by setting the permission field to <code>{Permission.OWNER}</code>.
			Other than owner, permissions do not cascade. E.g. If a user only has the MANAGE_USERS
			permission, they can only manage other users and nothing else. Not even edit. Be careful when
			passing out permissions.
		</p>

		<div class="mb-6 flex w-full items-center justify-center gap-6">
			<div>
				<Label for="search" class="mb-2">Search</Label>
				<Input
					bind:value={search}
					on:change={() => (page = 1)}
					type="text"
					id="search"
					placeholder="Name or Email"
				/>
			</div>
			<div>
				<Label for="search" class="mb-2">Order By</Label>
				<Select
					bind:value={orderBy}
					on:change={() => (page = 1)}
					id="orderby"
					size="sm"
					items={sortByOptions}
				/>
			</div>
			<div>
				<Label for="desc" class="mb-2">Order</Label>
				<Select
					bind:value={order}
					on:change={() => (page = 1)}
					id="order"
					size="sm"
					items={sortOptions}
				/>
			</div>
		</div>

		<Table shadow>
			<TableHead>
				<TableHeadCell padding="p-2">Pfp</TableHeadCell>
				<TableHeadCell padding="p-2">Name</TableHeadCell>
				<TableHeadCell padding="p-2">Email</TableHeadCell>
				<TableHeadCell padding="p-2">Permissions</TableHeadCell>
				<TableHeadCell padding="p-2">First Login</TableHeadCell>
				<TableHeadCell padding="p-2">Last Login</TableHeadCell>
				<TableHeadCell padding="p-2">Actions</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each list as item (item.id)}
					<EditableUser
						user={item}
						onUpdate={(i) => update(item.id, i)}
						onRemove={() => remove(item.id)}
					/>
				{/each}
			</TableBody>
		</Table>
		<div class="mt-4 flex flex-col items-center justify-center gap-2">
			<div class="text-sm text-gray-700 dark:text-gray-400">
				Showing
				<span class="font-semibold text-gray-900 dark:text-white"
					>{Math.min((page - 1) * itemsPerPage + 1, total)}</span
				>
				to
				<span class="font-semibold text-gray-900 dark:text-white"
					>{Math.min((page - 1) * itemsPerPage + list.length, total)}</span
				>
				of
				<span class="font-semibold text-gray-900 dark:text-white">{total}</span>
				Entries
			</div>

			<Pagination table pages={[]} large on:next={next} on:previous={prev}>
				<span slot="next">Next</span>
				<span slot="prev">Prev</span>
			</Pagination>
			<div class="flex items-center gap-2 whitespace-nowrap">
				<Label for="pageSize">Per page:</Label>
				<Select
					bind:value={itemsPerPage}
					on:change={() => (page = 1)}
					id="pageSize"
					size="sm"
					underline
					items={pageSizes}
					class="bg-white dark:bg-gray-900"
				/>
			</div>
		</div>
	</div>
</div>
