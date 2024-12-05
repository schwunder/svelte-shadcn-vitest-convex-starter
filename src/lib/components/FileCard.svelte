<script lang="ts">
	import * as Card from '$ui/card';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';
	import { Checkbox } from '$ui/checkbox';

	let {
		cardTitle = 'Card Title',
		cardDescription = 'Card Description',
		inputLabel = 'Input Label',
		inputPlaceholder = 'Type something...',
		checkboxLabel = 'Enable Framework Selection',
		checked = false,
		onCancel = () => {},
		onDeploy = () => {}
	} = $props<{
		cardTitle?: string;
		cardDescription?: string;
		inputLabel?: string;
		inputPlaceholder?: string;
		checkboxLabel?: string;
		checked?: boolean;
		onCancel?: () => void;
		onDeploy?: () => void;
	}>();

	let inputValue = $state('');

	function handleCancel() {
		onCancel();
	}

	function handleDeploy() {
		onDeploy();
	}
</script>

<Card.Root data-testid="file-card" aria-label="File Card">
	<Card.Header data-testid="file-card-header" aria-label="Card Header">
		<Card.Title data-testid="card-title" aria-label="Card Title">{cardTitle}</Card.Title>
		<Card.Description data-testid="card-description" aria-label="Card Description"
			>{cardDescription}</Card.Description
		>
	</Card.Header>

	<Card.Content data-testid="file-card-content" aria-label="Card Content">
		<Label for="name" data-testid="name-label" aria-label="Name Label">{inputLabel}</Label>
		<Input
			id="name"
			bind:value={inputValue}
			placeholder={inputPlaceholder}
			data-testid="name-input"
			aria-label="Name Input"
		/>
		<Checkbox
			bind:checked
			id="framework"
			data-testid="framework-checkbox"
			aria-label="Framework Selection"
		/>
		<Label for="framework" data-testid="framework-label" aria-label="Framework Label"
			>{checkboxLabel}</Label
		>
	</Card.Content>

	<Card.Footer data-testid="file-card-footer" aria-label="Card Footer">
		<Button variant="outline" onclick={handleCancel} data-testid="cancel-button" aria-label="Cancel"
			>Cancel</Button
		>
		<Button onclick={handleDeploy} data-testid="deploy-button" aria-label="Deploy">Deploy</Button>
	</Card.Footer>
</Card.Root>
