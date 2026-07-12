async function get() {
    const res = await fetch("https://www.fullhdfilmizlesene.life/dune-col-gezegeni-bolum-2-8-izle/", {
        headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await res.text();
    const scxMatch = html.match(/var scx = (.*?);/);
    if (scxMatch) {
        console.log(scxMatch[1]);
    } else {
        console.log("no scx");
    }
}
get();
