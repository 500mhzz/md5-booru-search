
async function e621MD5Post(username: string, api_key: string, md5: string) {
    const url = `https://e621.net/posts.json?tags=md5:${md5}`;
    const headers = {
        'User-Agent': 'YourAppName/1.0 (by YourUsername on e621)',
        'Authorization': 'Basic ' + btoa(`${username}:${api_key}`)
    };

    const response = await fetch(url, { headers })
    const json = await response.json();

    return json;
}

export {
    e621MD5Post
};