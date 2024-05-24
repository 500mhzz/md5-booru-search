<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: any;

	function isImageUrl(url: string) {
		const imageFileExtensions = ['jpeg', 'jpg', 'gif', 'png', 'svg', 'webp'];

		// Remove query parameters
		try {
			url = url.split('?')[0];
		} catch (e) {
			if (!form?.imageUrl) return false;
			return true;
		}

		const urlExtension = url?.split('.')?.pop()?.toLowerCase();
		return imageFileExtensions.includes(urlExtension!);
	}

</script>

<svelte:head>
	<title>MD5 Booru Search</title>

	<meta property="og:title" content="MD5 Booru Search | 500Mhz.xyz" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://booru.500mhz.xyz" />
	<meta property="og:image" content="https://booru.500mhz.xyz/favicon.png" />
	<meta
		property="og:description"
		content="A simple website that helps you find posts across boorus, even if the original post is deleted."
	/>
	<meta name="theme-color" content="#7D9DD3" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="mt-16 w-full px-4 md:px-0 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
	{#if form?.fixedUrl}
		<a
			href={form?.fixedUrl}
			class="text-black/90 py-2 mb-2 bg-white/90 border rounded-lg hover:bg-white/100 text-center block"
			>Source Post</a
		>
	{/if}
	{#if isImageUrl(form?.imageUrl) && isImageUrl(form?.videoUrl)}
		<img
			src={form?.imageUrl}
			alt="Preview"
			class="w-full h-auto object-cover rounded-lg border border-white/10 shadow-lg mb-3"
		/>
		<p
			class="bg-neutral-900/35 p-2 text-sm sm:text-md border border-white/10 w-full rounded-lg text-center"
		>
			<span class="text-white/80">MD5:</span>
			{form?.parentMD5}
		</p>
	{:else if form?.videoUrl}
		<video controls class="w-full rounded-lg border border-white/10 shadow-lg mb-3">
			<track kind="captions" />
			<source src={form?.videoUrl} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
		<p
			class="bg-neutral-900/35 p-2 text-sm sm:text-md border border-white/10 w-full rounded-lg text-center"
		>
			<span class="text-white/80">MD5:</span>
			{form?.parentMD5}
		</p>
	{:else if form?.parentMD5 && !form?.imageUrl}
		<img
			src="https://placehold.co/500x500?text=Image Not Found"
			alt="Preview"
			class="w-full h-auto object-cover rounded-lg border border-white/10 shadow-lg mb-3"
		/>
		<p
			class="bg-neutral-900/35 p-2 text-sm sm:text-md border border-white/10 w-full rounded-lg text-center"
		>
			<span class="text-white/80">MD5:</span>
			{form?.parentMD5}
		</p>
	{/if}
</div>

{#if !form}
	<button
		class="flex flex-row items-center justify-center bg-neutral-900/35 border border-white/10 rounded-lg rounded-b-none p-2 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4 hover:bg-neutral-900/70"
		on:click={() =>
			(window.location.href =
				'https://github.com/500mhzz/md5-booru-search/commit/0daa40b623c134c7d8cb7a34db29a54a2eeb2d33')}
		role="link"
	>
		<div class="flex flex-row w-full">
			<p
				class="flex items-center justify-center bg-sky-300 text-black px-3 py-1 rounded-lg rounded-r-none border border-white/10 border-r-0 md:text-base text-sm text-center"
			>
				NEW
			</p>
			<p
				class="text-sky-300 uppercase bg-neutral-900/80 px-3 py-1 rounded-lg rounded-l-none border border-white/10 border-l-0 w-full md:text-base text-sm"
			>
				Added GelBooru support!
			</p>
		</div>
	</button>

	<div
		class="flex flex-col items-center justify-center w-full bg-neutral-900/35 border border-white/10 border-t-0 rounded-lg rounded-t-none md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4 p-5"
	>
		<h1 class="flex flex-row items-center gap-4 text-3xl text-white text-center">
			MD5 Booru Search
		</h1>
		<p class="text-white/60 text-center mt-3">
			Search for images on Rule34, TBIB, and E621 using the MD5 hash of the image.
		</p>
	</div>
{/if}

<div class="flex flex-col w-full px-4 md:px-0 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4 gap-3">
	{#if form?.error}
		<div class="bg-red-500 text-white text-center p-3 rounded-lg w-full">
			{form.error}
		</div>
	{/if}
	<form
		action="?/search"
		method="POST"
		class="flex items-center justify-center mt-5 sm:text-md text-sm"
	>
		<input
			type="text"
			name="q"
			placeholder="Post URL Here"
			class="flex-grow mr-2 w-full py-2 px-4 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/35 bg-neutral-900/35 text-white"
		/>
		<button type="submit" class="py-2 px-4 bg-white/90 text-black rounded-lg hover:bg-white/100"
			>Search</button
		>
	</form>

	<div class="flex flex-col items-center max-w-full gap-5">
		{#if form?.r34}
			<div
				class="flex flex-row bg-neutral-900/35 border border-white/10 p-4 rounded-lg shadow-lg w-full"
			>
				<img src="rule34-logo.png" alt="Rule34 Logo" class="w-20 mr-0" />

				<div class="ml-5 w-full">
					<h2 class="text-xl">Rule34</h2>
					{#each form.r34 || [] as post}
						<a
							href={`https://rule34.xxx/index.php?page=post&s=view&id=` + post.id}
							class="text-black bg-white/90 rounded-lg p-2 mt-2 hover:bg-white/100 block ml-0 text-center w-full"
							>Go to Rule34</a
						>
					{/each}
				</div>
			</div>
		{/if}

		{#if form?.tbib}
			<div
				class="flex flex-row bg-neutral-900/35 border border-white/10 p-4 rounded-lg shadow-lg w-full"
			>
				<img src="tbib-logo.png" alt="TBIB Logo" class="w-20 mr-0" />

				<div class="ml-5 w-full">
					<h2 class="text-xl">TBIB (The Big ImageBoard)</h2>
					{#each form?.tbib || [] as post}
						<a
							href={`https://tbib.org/index.php?page=post&s=view&id=` + post.id}
							class="text-black bg-white/90 rounded-lg p-2 mt-2 hover:bg-white/100 block ml-0 text-center w-full"
							>Go to TBIB</a
						>
					{/each}
				</div>
			</div>
		{/if}

		{#if form?.e621 && form.e621.posts.length > 0}
			<div
				class="flex flex-row bg-neutral-900/35 border border-white/10 p-4 rounded-lg shadow-lg w-full"
			>
				<img src="e621-logo.png" alt="Rule34 Logo" class="w-20 mr-0" />

				<div class="ml-5 w-full">
					<h2 class="text-xl">E621</h2>
					{#each form?.e621?.posts || [] as post}
						<a
							href={`https://e621.net/posts/` + post.id}
							class="text-black bg-white/90 rounded-lg p-2 mt-2 hover:bg-white/100 block ml-0 text-center w-full"
							>Go to E621</a
						>
						{#if !post.id}
							<p class="text-white/60 text-center mt-2">Couldn't fetch post id.</p>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		{#if form?.gelbooru && form?.gelbooru?.post}
			<div
				class="flex flex-row bg-neutral-900/35 border border-white/10 p-4 rounded-lg shadow-lg w-full"
			>
				<img src="gelbooru-logo.png" alt="Gelbooru Logo" class="w-20 mr-0" />

				<div class="ml-5 w-full">
					<h2 class="text-xl">Gelbooru</h2>
					{#each form?.gelbooru?.post || [] as post}
						<a
							href={`https://gelbooru.com/index.php?page=post&s=view&id=` + post.id}
							class="text-black bg-white/90 rounded-lg p-2 mt-2 hover:bg-white/100 block ml-0 text-center w-full"
							>Go to Gelbooru</a
						>
					{/each}
				</div>
			</div>
		{/if}

		{#if form?.fixedUrl && !form?.r34 && !form?.tbib && !form?.e621 && !form?.e621?.posts && !form?.gelbooru && !form?.gelbooru?.post}
			<div class="bg-white/10 text-white/85 text-center backdrop-blur-lg p-3 rounded-lg w-full">
				No results found.
			</div>
		{/if}
	</div>

	<div class="bg-white/10 text-white/85 text-center backdrop-blur-lg mb-10 p-3 rounded-lg w-fit">
		For suggestions or bug reports please join our <a
			href="https://discord.gg/hn2Hdd4cb8"
			class="text-sky-300 hover:underline">Discord</a
		>
		and open a ticket.
	</div>
</div>
