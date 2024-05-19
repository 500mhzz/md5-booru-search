export const actions = {
	search: async ({ fetch, request }) => {
		const data = await request.formData();
		const url = data.get('q')?.toString();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let fixedUrl: any = url;

		if (url?.includes('q=')) {
			fixedUrl = new URL(`${url}`);
			fixedUrl.searchParams.delete('q');
		}

		const reqUrl = await fetch(fixedUrl + '.json', {
			headers: {
				'User-Agent': 'e621-clone'
			}
		});

		const json = await reqUrl.json();
		const parentMD5 = await json.post.file.md5;
        const imageUrl = await json.post.file.url;

		const boorus = [
			`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`,
			`https://tbib.org/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`
		];

		const r34 = await (await fetch(boorus[0])).json().catch(() => null);
		const tbib = await (await fetch(boorus[1])).json().catch(() => null);

		return {
			r34,
			tbib,
            imageUrl
		};
	}
};
