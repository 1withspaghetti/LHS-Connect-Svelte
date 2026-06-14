<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import type { LabelProps } from 'flowbite-svelte/Label.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * The id of the input element
		 */
		id?: string;
		/**
		 * The text on the label, will not render a label if not provided
		 */
		label?: string;
		/**
		 * Props to pass to the {@link Label} component
		 */
		labelProps?: LabelProps;
		/**
		 * Whether the input is valid or not, rendered with red text if false
		 * @default true
		 */
		isValid?: boolean;
		/**
		 * Whether the input is required or not, will render a red asterisk if true
		 */
		required?: boolean;
		children?: Snippet;
	}

	let { id, label, labelProps = {}, isValid = true, required = false, children }: Props = $props();
</script>

{#if label}
	<Label for={id} color={isValid ? undefined : 'red'} class="mb-2" {...labelProps}>
		{label}
		{@render children?.()}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</Label>
{/if}
