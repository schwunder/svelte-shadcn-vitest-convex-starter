<script>
	let email = '';
</script>

<form>
	<input
		type="email"
		bind:value={email}
		class="form-input"
		placeholder="Email"
		aria-label="Form Submit Input"
	/>
	<button type="submit" class="form-button" aria-label="Form Submit Button">Submit</button>
</form>
