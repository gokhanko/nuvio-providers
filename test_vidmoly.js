const html = `var scx = {"vidmoly":{"tt":"VmlkbW9seQ==","sx":{"p":[],"t":["nUE0pUZ6YltmX1xjQERzQENnV19gQ2Z+b116YEZzZUZ9TGVp"]},"order":2}};`;
const scxData = JSON.parse(html.match(/var scx = (.*?);/)[1]);
const links = scxData.vidmoly.sx.t;
const encoded = links[0];

// Decoder
let e = encoded;
let t = Buffer.from(e.split("").reverse().join(""), 'base64').toString('binary');
let o = "";
for (let e = 0; e < t.length; e++) {
    let r = "K9L"[e % 3],
        n = t.charCodeAt(e) - (r.charCodeAt(0) % 5 + 1);
    o += String.fromCharCode(n);
}
const decoded = Buffer.from(o, 'binary').toString('utf8');
console.log("Decoded:", decoded);
