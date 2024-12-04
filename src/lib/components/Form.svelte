<script>
	let email = '';
</script>

<form data-testid="form" aria-label="Form">
	<div>
		<label for="email" data-testid="email-label" aria-label="Email Label">Email</label>
		<input type="email" id="email" data-testid="email-input" aria-label="Email Input" required />
	</div>
	<button type="submit" data-testid="submit-button" aria-label="Submit Form"> Submit </button>
</form>
