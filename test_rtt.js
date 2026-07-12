function rtt(e) {
    let t = "";
    for (let r = 0; r < e.length; r++) {
        let n = "K9L"[r % 3];
        t += String.fromCharCode(e.charCodeAt(r) - (n.charCodeAt(0) % 5 + 1));
    }
    return t;
}

let e = "nUE0pUZ6YltmX1xjQERzQENnV19gQ2Z+b116YEZzZUZ9TGVp";
console.log(rtt(e));
