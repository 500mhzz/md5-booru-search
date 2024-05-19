export const actions = {
    search: async ({ fetch, request}) => {
        const data = await request.formData();
        const url = data.get('q')?.toString();

        const fixedUrl = new URL(`${url}`)
        fixedUrl.searchParams.delete('q')

        const reqUrl = await fetch(fixedUrl + '.json', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        })

        const json = await reqUrl.json()
        const parentMD5 = await json.post.file.md5;

        const boorus = [
            `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`,
            `https://tbib.org/index.php?page=dapi&s=post&q=index&json=1&tags=md5%3a${parentMD5}`
        ]

        const r34 = await (await fetch(boorus[0])).json()
        const tbib = await (await fetch(boorus[1])).json()

        return {
                r34,
                tbib
        }
    }
}