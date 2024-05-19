<script>
	import '../app.css';
</script>


<div>
	<nav class="w-full bg-blue-700 p-4 top-0 flex justify-between items-center">
		<a href="/"><h1 class="text-2xl text-center text-white">MD5 Booru Search</h1></a>
		<div class="text-sm">
			<a href="https://github.com/500mhzz/md5-booru-search" class="text-white hover:underline mr-4"
				>GitHub</a
			>
		</div>
	</nav>

    <div class="bg-blue-800 p-2 text-center mt-2 mx-2 rounded-lg">
        If you have any suggestions or issues, please open a ticket in our <a href="https://discord.gg/hn2Hdd4cb8" class="text-sky-300 hover:underline">Discord</a>.
    </div>

	<main 
        class="flex flex-col items-center justify-center px-4"
        style="min-height: calc(100vh - 17vh);"
    >
		<slot />
	</main>
</div>

<footer class="bg-blue-700 p-4 text-center text-white">
        <p>MD5 Search created with 💖 by <a href="https://500mhz.xyz" class="text-sky-300 hover:underline">500mhz</a></p>
</footer>