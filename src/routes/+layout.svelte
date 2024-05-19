<script>
	import '../app.css';
</script>


<div>
	<nav class="w-full bg-neutral-900/10 backdrop-blur-lg fixed p-4 top-0 flex justify-between items-center border-b border-white/10">
		<a href="/">
            <!-- <h1 class="text-2xl text-center text-white">MD5 Booru Search</h1> -->
            <img src="favicon.png" alt="icon" class="w-[3.3rem] border border-white/10 rounded-full">
        </a>
        <div>
            <a href="https://github.com/500mhzz/md5-booru-search" class="text-white/90 hover:underline mr-4 text-xl"
				>GitHub</a
			>
			<a href="https://discord.gg/hn2Hdd4cb8" class="text-white/90 hover:underline mr-4 text-xl"
				>Discord</a
			>
		</div>
	</nav>

	<main 
        class="flex flex-col items-center justify-center px-4 mt-10"
        style="min-height: calc(100vh - 9.7vh);"
    >
		<slot />
	</main>
</div>

<footer class="bg-neutral-900/10 p-4 text-center text-white border-t border-white/10">
        <p>MD5 Search created with 💖 by <a href="https://500mhz.xyz" class="text-sky-300 hover:underline">500mhz</a></p>
</footer> 