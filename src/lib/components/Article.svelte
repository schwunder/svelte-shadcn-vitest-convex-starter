<script lang="ts">
	export let title: string;
	export let text: string;
</script>

<article class="prose" aria-label="Article" data-testid="article">
	<h1 aria-label="Title">{title}</h1>
	<p aria-label="Text">{text}</p>
</article>
