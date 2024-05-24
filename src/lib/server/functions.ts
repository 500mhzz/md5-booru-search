import { E621_API_KEY } from '$env/static/private';

const USER_AGENT =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';

const e621Headers = {
	'User-Agent': 'YourAppName/1.0 (by YourUsername on e621)',
	Authorization: 'Basic ' + btoa(`500mhz:${E621_API_KEY}`)
};

const fetchJson = async (url: URL | string, headers = {}) => {
	const response = await fetch(url, { headers });
	return response.json();
};

const fetchWithUserAgent = (url: URL | string) => fetchJson(url, { 'User-Agent': USER_AGENT });

const fetchPost = async (url: URL | string, id: string) => {
	if (!id) return { error: 'Invalid URL' };
	return fetchWithUserAgent(`${url}?page=dapi&s=post&id=${id}&json=1&q=index`);
};

const fetchBooru = async (url: URL | string, md5: string) => {
	return fetchWithUserAgent(`${url}?page=dapi&s=post&q=index&json=1&tags=md5%3a${md5}`);
};

export { fetchJson, fetchWithUserAgent, fetchPost, fetchBooru, e621Headers };
