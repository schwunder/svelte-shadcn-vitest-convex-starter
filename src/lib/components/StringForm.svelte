<script lang="ts">
	import * as Form from '$ui/form';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import { stringInputSchema, type StringInputConfig } from '$lib/schemas';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	type Props = {
		form: SuperValidated<Infer<typeof stringInputSchema>>;
		config?: StringInputConfig;
	};

	export let form: Props['form'];
	export let config: StringInputConfig = {};

	const formInstance = superForm(form, {
		validators: zodClient(stringInputSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(config.successMessage ?? `String "${f.data.stringInput}" input successfully`);
			} else {
				toast.error(config.errorMessage ?? 'Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance, tainted, isTainted } = formInstance;
</script>

<form method="POST" use:enhance data-testid="string-input-form" aria-label="String Input Form">
	<Form.Field form={formInstance} name="stringInput" data-testid="string-input-field">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label data-testid="string-input-label" aria-label="String Input Label">
					{config.label ?? 'String Input'}
				</Form.Label>
				<Input
					{...props}
					bind:value={$formData.stringInput}
					placeholder={config.placeholder ?? 'Enter string input'}
					data-testid="string-input"
					aria-label="String Input"
				/>
				<Form.Description
					data-testid="string-input-description"
					aria-label="String Input Description"
				>
					Enter a string input between 2 and 50 characters.
				</Form.Description>
				<Form.FieldErrors data-testid="string-input-errors" />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Button
		type="submit"
		disabled={!isTainted($tainted)}
		data-testid="submit-button"
		aria-label="Submit Folder">Submit</Button
	>
</form>
