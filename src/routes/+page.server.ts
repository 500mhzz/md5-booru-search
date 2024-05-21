import { e621MD5Post } from '$lib/server/e621.js';
import { E621_API_KEY, GELBOORU_API_KEY, GELBOORU_USER_ID } from '$env/static/private';

export const actions = {
	search: async ({ fetch, request }) => {
		const data = await request.formData();
		const url = data.get('q')?.toString();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let fixedUrl: any = url;
		let rule34Url;
		let tbibUrl;
		let gelbooruUrl;
		let reqUrl;

		if (url?.includes('q=')) {
			fixedUrl = new URL(`${url}`);
			fixedUrl.searchParams.delete('q');
		}

		if (url?.includes('rule34.xxx')) {
			rule34Url = new URL(`${url}`);
			const id = rule34Url.searchParams.get('id');

			if (!id) return { error: 'Invalid URL' };

			reqUrl = await fetch(
				`https://api.rule34.xxx/index.php?page=dapi&s=post&id=${id}&json=1&q=index`,
				{
					headers: {
						'User-Agent':
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
					}
				}
			);
		}

		if (url?.includes('tbib.org')) {
			tbibUrl = new URL(`${url}`);
			const id = tbibUrl.searchParams.get('id');

			if (!id) return { error: 'Invalid URL' };

			reqUrl = await fetch(`https://tbib.org/index.php?page=dapi&s=post&id=${id}&json=1&q=index`, {
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
				}
			});
		}

		if (url?.includes('e621.net')) {
			reqUrl = await fetch(fixedUrl + '.json', {
				headers: {
					'User-Agent': 'e621-clone'
				}
			});
		}

		if(url?.includes('gelbooru.com')) {
			gelbooruUrl = new URL(`${url}`);
			const id = gelbooruUrl.searchParams.get('id');
			if(!id) return { error: 'Invalid URL' };

			reqUrl = await fetch(`https://gelbooru.com/index.php?page=dapi&s=post&id=${id}&json=1&q=index&api_key=${GELBOORU_API_KEY}&user_id=${GELBOORU_USER_ID}`, {
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
				}
			});
		}

		if (!reqUrl) return { error: 'Invalid URL' };

		let parentMD5;
		let imageUrl;

		let videoUrl;

		const json = await reqUrl.json();

		if (url?.includes('rule34.xxx')) {
			parentMD5 = await json[0].hash;
			imageUrl = await json[0].sample_url;
			if (imageUrl && !imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
				videoUrl = await json[0].file_url;
			}
		}

		if (url?.includes('e621.net')) {
			parentMD5 = await json.post.file.md5;
			imageUrl = (await json.post.file.url) || null;
			if (imageUrl && !imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
				videoUrl = await json.post.file.url;
			}
		}

		if (url?.includes('tbib.org')) {
			parentMD5 = await json[0].hash;
			imageUrl = `https://tbib.org/images/${await json[0].directory}/${await json[0].image}?${await json[0].id}`;
		}

		if(url?.includes('gelbooru.com')) {
			parentMD5 = await json.post[0].md5;
			imageUrl = await json.post[0].file_url;
			if (imageUrl && !imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
				videoUrl = await json.post[0].file_url;
			}
		}

		const boorus = [
			`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`,
			`https://tbib.org/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`,
			`https://e621.net/posts.json?tmd5:${parentMD5}`,
			`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}&api_key=${GELBOORU_API_KEY}&user_id=${GELBOORU_USER_ID}`
		];

		let r34 = null;
		let tbib = null;
		let e621 = null;
		let gelbooru = null

		if (!url?.includes('rule34.xxx')) {
			r34 = await (await fetch(boorus[0])).json().catch(() => null);
			if (r34) {
				if (!imageUrl) imageUrl = await r34[0]?.sample_url;
				if (!videoUrl) videoUrl = await r34[0]?.file_url;
			}
		}

		if (!url?.includes('tbib.org')) {
			tbib = await (await fetch(boorus[1])).json().catch(() => null);
			if (tbib) {
				if (!imageUrl)
					imageUrl = `https://tbib.org/images/${await tbib[0]?.directory}/${await tbib[0]?.image}?${await tbib[0]?.id}`;
				if (!videoUrl)
					videoUrl = `https://tbib.org/images/${await tbib[0]?.directory}/${await tbib[0]?.image}?${await tbib[0]?.id}`;
			}
		}

		if (!url?.includes('e621.net')) {
			e621 = await e621MD5Post(`500mhz`, E621_API_KEY, parentMD5).catch(() => null)

			try {
				if (e621) {
					if (!imageUrl) imageUrl = await e621.post.file.url;
					if (!videoUrl) videoUrl = await e621.post.file.url;
				}
			} catch(e) {
				null
			}
		}

		if (!url?.includes('gelbooru.com')) {
			gelbooru = await (await fetch(boorus[3])).json().catch(() => null);
			if (gelbooru) {
				if (!imageUrl) imageUrl = await gelbooru.post[0]?.file_url;
				if (!videoUrl) videoUrl = await gelbooru.post[0]?.file_url;
			}
		}

		return {
			r34,
			tbib,
			e621,
			gelbooru,
			imageUrl,
			parentMD5,
			videoUrl,
			fixedUrl: fixedUrl.toString()
		};
	}
};
