<script lang="ts">
	import type { ActionData } from './$types';

	export let form: any;
</script>

<svelte:head>
	<title>MD5 Booru Search</title>
</svelte:head>

<div class="mt-16 w-full px-4 md:px-0 md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
	{#if form?.imageUrl}
		<img
			src={form.imageUrl}
			alt="Preview"
			class="w-full h-auto object-cover rounded-lg border border-white/10 shadow-lg mb-3"
		/>
		<p
			class="text-center text-sm bg-neutral-900/35 rounded-lg px-5 py-3 border border-white/10 sm:text-md"
		>
			<span class="text-white/60">MD5:</span>
			{form.parentMD5}
		</p>
	{/if}
</div>

{#if !form}
	<div class="flex flex-col items-center justify-center mt-10">
		<h1 class="flex flex-row items-center gap-4 text-3xl text-white text-center">
			MD5 Booru Search
		</h1>
		<p class="text-white/60 text-center mt-3 text-center">
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
		class="flex items-center justify-center mt-10 sm:text-md text-sm"
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
					{#each form.r34 as post}
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
					{#each form.tbib as post}
						<a
							href={`https://tbib.org/index.php?page=post&s=view&id=` + post.id}
							class="text-black bg-white/90 rounded-lg p-2 mt-2 hover:bg-white/100 block ml-0 text-center w-full"
							>Go to TBIB</a
						>
					{/each}
				</div>
			</div>
		{/if}

		{#if form?.e621}
			<div
				class="flex flex-row bg-neutral-900/35 border border-white/10 p-4 rounded-lg shadow-lg w-full"
			>
				<img src="e621-logo.png" alt="Rule34 Logo" class="w-20 mr-0" />

				<div class="ml-5 w-full">
					<h2 class="text-xl">E621</h2>
					{#each form.e621.posts as post}
						<a
							href={`https://e621.net/posts/` + post.id}
							class="text-black bg-white/90 rounded-lg p-2 mt-2 hover:bg-white/100 block ml-0 text-center w-full"
							>Go to E621</a
						>
					{/each}
				</div>
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
