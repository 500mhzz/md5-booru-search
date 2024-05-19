import { e621MD5Post } from '$lib/server/e621.js';
import { E621_API_KEY } from "$env/static/private"

export const actions = {
	search: async ({ fetch, request }) => {
		const data = await request.formData();
		const url = data.get('q')?.toString();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let fixedUrl: any = url;
        let rule34Url;
        let tbibUrl;
        let reqUrl;


		if (url?.includes('q=')) {
			fixedUrl = new URL(`${url}`);
			fixedUrl.searchParams.delete('q');
		}

        if(url?.includes("rule34.xxx")) {
            rule34Url = new URL(`${url}`);
            const id = rule34Url.searchParams.get('id')

            if(!id) return { error: 'Invalid URL' }

            reqUrl = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&id=${id}&json=1&q=index`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
                }
            });
        }

        if(url?.includes("tbib.org")) {
            tbibUrl = new URL(`${url}`);
            const id = tbibUrl.searchParams.get('id')

            if(!id) return { error: 'Invalid URL' }

            reqUrl = await fetch(`https://tbib.org/index.php?page=dapi&s=post&id=${id}&json=1&q=index`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
                }
            });
        }
        
        if(url?.includes("e621.net")) {
            reqUrl = await fetch(fixedUrl + '.json', {
                headers: {
                    'User-Agent': 'e621-clone'
                }
            });
        }

        if(!reqUrl) return { error: 'Invalid URL' }

        let parentMD5;
        let imageUrl;

		const json = await reqUrl.json();

		if(url?.includes("rule34.xxx")) {
            parentMD5 = await json[0].hash;
            imageUrl = await json[0].sample_url;
        }

        if(url?.includes("e621.net")) {
            parentMD5 = await json.post.file.md5;
            imageUrl = await json.post.file.url;
        }

        if(url?.includes("tbib.org")) {
            parentMD5 = await json[0].hash;
            imageUrl = `https://tbib.org/images/${await json[0].directory}/${await json[0].image}?${await json[0].id}`;
        }

		const boorus = [
			`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`,
			`https://tbib.org/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`,
            `https://e621.net/posts.json?tmd5:${parentMD5}`
		];

        let r34;
        let tbib;
        let e621;

		if(!url?.includes("rule34.xxx")) {
            r34 = await (await fetch(boorus[0])).json().catch(() => null);
        }
		
        if(!url?.includes("tbib.org")) {
            tbib = await (await fetch(boorus[1])).json().catch(() => null);
        }

        if(!url?.includes("e621.net")) {
            e621 = await e621MD5Post(`500mhz`, E621_API_KEY, parentMD5).catch(() => null);
        }

		return {
			r34,
			tbib,
            e621,
            imageUrl,
            parentMD5
		};
	}
};
