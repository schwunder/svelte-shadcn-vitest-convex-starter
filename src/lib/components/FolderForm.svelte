<script lang="ts">
	import * as Form from '$ui/form';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import { folderSchema } from '$lib/schemas/folder';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';

	type Props = {
		form: SuperValidated<Infer<typeof folderSchema>>;
	};

	export let form: Props['form'];

	const formInstance = superForm(form, {
		validators: zodClient(folderSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Folder "${f.data.folderPath}" added successfully`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance, errors, tainted, isTainted } = formInstance;
</script>

<form method="POST" use:enhance data-testid="folder-form" aria-label="Folder Form">
	<Form.Field form={formInstance} name="folderPath" data-testid="folder-path-field">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label data-testid="folder-path-label" aria-label="Folder Path Label"
					>Folder Path</Form.Label
				>
				<Input
					{...props}
					bind:value={$formData.folderPath}
					placeholder="Enter folder path"
					data-testid="folder-path-input"
					aria-label="Folder Path Input"
				/>
				<Form.Description
					data-testid="folder-path-description"
					aria-label="Folder Path Description"
				>
					Enter a folder path between 2 and 50 characters.
				</Form.Description>
				<Form.FieldErrors data-testid="folder-path-errors" />
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
