import { GELBOORU_API_KEY, GELBOORU_USER_ID } from '$env/static/private';
import {
	e621Headers,
	fetchBooru,
	fetchJson,
	fetchPost,
	fetchWithUserAgent
} from '$lib/server/functions.js';

export const actions = {
	search: async ({ request }) => {
		const data = await request.formData();
		const url = data.get('q')?.toString();

		if (!url) return { error: 'Invalid URL' };

		let fixedUrl: string | URL = url;
		let reqUrl;

		if (url?.includes('q=')) {
			fixedUrl = new URL(url);
			fixedUrl.searchParams.delete('q');
		}

		if (url?.includes('rule34.xxx')) {
			reqUrl = await fetchPost(
				'https://api.rule34.xxx/index.php',
				`${new URL(url).searchParams.get('id')}`
			);
		}

		if (url?.includes('tbib.org')) {
			reqUrl = await fetchPost(
				'https://tbib.org/index.php',
				`${new URL(url).searchParams.get('id')}`
			);
		}

		if (url?.includes('e621.net')) {
			reqUrl = await fetchJson(fixedUrl + '.json', { 'User-Agent': 'e621-clone' });
		}

		if (url?.includes('gelbooru.com')) {
			const id = new URL(url).searchParams.get('id');
			if (!id) return { error: 'Invalid URL' };
			reqUrl = await fetchWithUserAgent(
				`https://gelbooru.com/index.php?page=dapi&s=post&id=${id}&json=1&q=index&api_key=${GELBOORU_API_KEY}&user_id=${GELBOORU_USER_ID}`
			);
		}

		if (!reqUrl) return { error: 'Invalid URL' };

		let parentMD5;
		let imageUrl;
		let videoUrl;

		const json = await reqUrl;

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
			if (imageUrl && !imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
				videoUrl = `https://tbib.org/images/${await json[0].directory}/${await json[0].image}?${await json[0].id}`;
			}
		}

		if (url?.includes('gelbooru.com')) {
			parentMD5 = await json.post[0].md5;
			imageUrl = await json.post[0].file_url;
			if (imageUrl && !imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
				videoUrl = await json.post[0].file_url;
			}
		}

		const booruUrls = [
			'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1',
			'https://tbib.org/index.php?page=dapi&s=post&q=index&json=1',
			'https://e621.net/posts.json',
			`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&api_key=${GELBOORU_API_KEY}&user_id=${GELBOORU_USER_ID}`
		];

		const booruNames = ['rule34.xxx', 'tbib.org', 'e621.net', 'gelbooru.com'];

		const boorus = booruUrls.map((booruUrl, index) =>
			url.includes(booruNames[index])
				? null
				: booruNames[index] === 'e621.net'
					? fetchJson(`https://e621.net/posts.json?tags=md5:${parentMD5!}`, e621Headers)
					: fetchBooru(booruUrl, parentMD5!)
		);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const results: any = await Promise.allSettled(boorus);

		if (!results) return { error: 'No results found' };

		for (let i = 0; i < results.length; i++) {
			if (results[i].status === 'fulfilled' && results[i]) {
				const data = results[i].status === 'fulfilled' ? results[i].value : null;
				if (!imageUrl) {
					for (const post of data) {
						if (post.sample_url || post.file_url) {
							imageUrl = post.sample_url || post.file_url;
							break;
						}
					}
				}
				if (!videoUrl) {
					for (const post of data) {
						if (post.file_url) {
							videoUrl = post.file_url;
							break;
						}
					}
				}
			}
		}

		return {
			r34: results[0].status === 'fulfilled' ? results[0].value : null,
			tbib: results[1].status === 'fulfilled' ? results[1].value : null,
			e621: results[2].status === 'fulfilled' ? results[2].value : null,
			gelbooru: results[3].status === 'fulfilled' ? results[3].value : null,
			imageUrl,
			parentMD5,
			videoUrl,
			fixedUrl: fixedUrl?.toString()
		};
	}
};
