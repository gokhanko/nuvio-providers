import fetch from 'node-fetch';

async function testRapidvid() {
    const url = "https://rapidvid.net/vod/v1xec243c91";
    console.log("Fetching", url);
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://www.fullhdfilmizlesene.life/"
        }
    });
    const html = await res.text();
    console.log("Status:", res.status);
    console.log(html.substring(0, 1500));
}

testRapidvid();
