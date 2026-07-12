async function run() {
    const res = await fetch("https://vidmoly.to/embed-186k58x0f34v.html", {
        headers: { "Referer": "https://www.fullhdfilmizlesene.life/" }
    });
    const html = await res.text();
    const m3u8Match = html.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
    console.log(m3u8Match ? m3u8Match[1] : "not found");
}
run();
