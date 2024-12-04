<script lang="ts">
	export let title: string;
	export let text: string;
</script>

<article class="prose" aria-label="Article" data-testid="article">
	<h1 aria-label="Title" data-testid="article-title">{title}</h1>
	<p aria-label="Text" data-testid="article-text">{text}</p>
</article>
