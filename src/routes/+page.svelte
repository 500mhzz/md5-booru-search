<script lang="ts">
	import type { ActionData } from './$types';

	export let form: any;

    console.log(form)
</script>

<div class="mt-16 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
	{#if form?.imageUrl}
		<img
			src={form.imageUrl}
			alt="Preview"
			class="w-full h-auto object-cover rounded-md shadow-lg mb-10"
		/>
		<p class="text-center">MD5: {form.parentMD5}</p>
	{/if}
</div>

<div class="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
	<form action="?/search" method="POST" class="flex items-center justify-center mt-10">
		<input
			type="text"
			name="q"
			placeholder="Search"
			class="flex-grow mr-4 py-2 px-4 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
		/>
		<button type="submit" class="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700"
			>Search</button
		>
	</form>

	<div class="mt-10 bg-gray-800 p-4 rounded-md shadow-lg flex flex-col items-center max-w-full">
		{#if form?.r34}
			<h2 class="text-2xl text-center">Rule34</h2>
			<div class="mt-5 space-y-2">
				{#each form.r34 as post}
					<a
						href={`https://rule34.xxx/index.php?page=post&s=view&id=` + post.id}
						class="text-blue-500 hover:underline block">Link</a
					>
				{/each}
			</div>
		{/if}

		{#if form?.tbib}
			<h2 class="text-2xl text-center mt-10">TBIB (The Big ImageBoard)</h2>
			<div class="mt-5 space-y-2">
				{#each form.tbib as post}
					<a
						href={`https://tbib.org/index.php?page=post&s=view&id=` + post.id}
						class="text-blue-500 hover:underline block">Link</a
					>
				{/each}
			</div>
		{/if}

        {#if form?.e621}
			<h2 class="text-2xl text-center mt-10">E621</h2>
			<div class="mt-5 space-y-2">
				{#each form.e621.posts as post}
					<a
						href={`https://e621.net/posts/` + post.id}
						class="text-blue-500 hover:underline block">Link</a
					>
				{/each}
			</div>
		{/if}
	</div>
</div>
