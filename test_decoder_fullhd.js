const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function atobPoly(str) {
    let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, enc = "";
    do {
        h1 = b64.indexOf(str.charAt(i++));
        h2 = b64.indexOf(str.charAt(i++));
        h3 = b64.indexOf(str.charAt(i++));
        h4 = b64.indexOf(str.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        if (h3 == 64) enc += String.fromCharCode(o1);
        else if (h4 == 64) enc += String.fromCharCode(o1, o2);
        else enc += String.fromCharCode(o1, o2, o3);
    } while (i < str.length);
    return enc;
}

let e = "nUE0pUZ6YltmX1xjQERzQENnV19gQ2Z+b116YEZzZUZ9TGVp";
let t = atobPoly(e.split("").reverse().join(""));
let o = "";
for (let e = 0; e < t.length; e++) {
    let r = "K9L"[e % 3];
    let n = t.charCodeAt(e) - (r.charCodeAt(0) % 5 + 1);
    o += String.fromCharCode(n);
}
const decoded = atobPoly(o);
console.log("Decoded:", decoded);
