<script lang="ts" generics="ID extends string = string">
	import { ButtonGroup, Input } from 'flowbite-svelte';
	import type { InputProps } from 'flowbite-svelte/Input.svelte';
	import type { LabelProps } from 'flowbite-svelte/Label.svelte';
	import ValidatedLabel from './util/ValidatedLabel.svelte';
	import ValidatedHelper from './util/ValidatedHelper.svelte';
	import type { ButtonGroupProps } from 'flowbite-svelte/ButtonGroup.svelte';
	import { type ObjectSchema, type StringSchema, ValidationError } from 'yup';

	interface Props {
		/**
		 * The id of the input element
		 */
		id: ID;
		/**
		 * The label of the input element, shown above the input. Also used for error messages if `contentName` is not provided
		 */
		label?: string | undefined;
		/**
		 * The value of the input element, used for two-way binding
		 */
		value?: string;
		/**
		 * The validator for the input element
		 */
		validator?: StringSchema<string | undefined, any, any, any> | undefined;
		/**
		 * The validator for the input element, but uses the `validateAt` method of an object schema with the provided id as the argument
		 */
		validatorObject?: ObjectSchema<{ [k in ID]: any }> | undefined;
		/**
		 * VISUAL ONLY, whether the input is required or not, and should have a red asterisk
		 */
		visuallyRequired?: boolean | undefined;
		/**
		 * Props to pass to the {@link Input} component
		 */
		inputProps?: InputProps & { [key: string]: any };
		/**
		 * Props to pass to the {@link Label} component
		 */
		labelProps?: LabelProps & { [key: string]: any };
		/**
		 * Props to pass to the {@link ButtonGroup} component
		 */
		buttonGroupProps?: ButtonGroupProps;
		before?: import('svelte').Snippet;
		after?: import('svelte').Snippet;
	}

	let {
		id,
		label = undefined,
		value = $bindable(),
		validator = undefined,
		validatorObject = undefined,
		visuallyRequired = false,
		inputProps = {},
		labelProps = {},
		buttonGroupProps = {},
		before,
		after,
	}: Props = $props();

	let checkValidation = $state(false);

	let errorMessage = $state('');

	/**
	 * Check if the input is valid, and set the error message if it is not.
	 * Calling this function will also enable the input to always be visually validated.
	 * @param cast - Whether to cast the value during validation as defined by the validator. For example, trimming the string or converting it to a number
	 * @throws ValidationError - If the input is not valid
	 * @returns The value of the input element
	 */
	export async function validate(cast: boolean = true): Promise<string> {
		checkValidation = true;
		try {
			if (validatorObject) {
				let casted = await validatorObject.validateAt(id, { [id]: value });
				if (cast) value = casted;
			} else if (validator) {
				let casted = await validator.validate(value);
				if (cast) value = casted;
			}
			errorMessage = '';
			return value || '';
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				errorMessage = error.message;
			} else {
				errorMessage = 'An unknown error occurred';
			}
			throw error;
		}
	}

	let isValid = $derived(errorMessage === '');
</script>

<ValidatedLabel {id} {label} {isValid} required={visuallyRequired} {labelProps} />
<ButtonGroup class="w-full" {...buttonGroupProps}>
	{@render before?.()}
	<Input
		{id}
		name={id}
		bind:value
		color={isValid ? 'base' : 'red'}
		formnovalidate
		on:blur={() => validate(false)}
		on:input={() => checkValidation && validate(false)}
		{...inputProps}
	></Input>
	{@render after?.()}
</ButtonGroup>
<ValidatedHelper {isValid} {errorMessage} />
