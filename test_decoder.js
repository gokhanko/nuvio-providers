function decodeRapidvid(e) {
    let t = Buffer.from(e.split("").reverse().join(""), 'base64').toString('binary');
    let o = "";
    for (let e = 0; e < t.length; e++) {
        let r = "K9L"[e % 3],
            n = t.charCodeAt(e) - (r.charCodeAt(0) % 5 + 1);
        o += String.fromCharCode(n)
    }
    return Buffer.from(o, 'base64').toString('utf8');
}

console.log(decodeRapidvid('/AkUPx3WaFletpkZ5B1bjpXZahmVEtkYyIHbkVTbtB1TYtlTNhDSnlzQG1lMP9mZ5l0ejlzUHRGUY9GWycTMURWavhFNul0T3MXSlpnTuZVS7Y0Y2xjel1WbJZmd2olYrl1MctmMZRmdX1mT8xjeOljTKZWMUtkY'));
