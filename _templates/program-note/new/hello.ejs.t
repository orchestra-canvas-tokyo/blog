---
to: src/lib/posts/regular-<%= number %>/<%= slug %>/post.svelte
---

<script lang="ts" context="module">
	import type { Metadata } from '../../index.ts';
	import Author from '$lib/component/post/Author.svelte';
	import Reference from '$lib/component/post/Reference.svelte';

	export const metadata: Metadata = {
		published: true,
		publicatedAt: '●-●-●T20:00:0●+0900',
		title: '●',
		composerSlug: '●',
		concertSlug: 'regular-<%= number %>',
		youTubeVideoId: '●',
		tags: ['曲目解説', '第<%= number %>回定期', '●']
	};
</script>

<h3>●</h3>

<p>
	●
</p>

<Author>●</Author>

<Reference>
</Reference>

