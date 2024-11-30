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

<Card.Root data-testid="file-card">
	<Card.Header data-testid="file-card-header">
		<Card.Title>{cardTitle}</Card.Title>
		<Card.Description>{cardDescription}</Card.Description>
	</Card.Header>

	<Card.Content data-testid="file-card-content">
		<form>
			<div>
				<div>
					<Label for="name">{inputLabel}</Label>
					<Input
						id="name"
						bind:value={inputValue}
						placeholder={inputPlaceholder}
						data-testid="name-input"
					/>
				</div>
				<div>
					<Checkbox bind:checked id="framework" data-testid="framework-checkbox" />
					<Label for="framework">{checkboxLabel}</Label>
				</div>
			</div>
		</form>
	</Card.Content>

	<Card.Footer data-testid="file-card-footer">
		<Button variant="outline" onclick={handleCancel} data-testid="cancel-button">Cancel</Button>
		<Button onclick={handleDeploy} data-testid="deploy-button">Deploy</Button>
	</Card.Footer>
</Card.Root>
