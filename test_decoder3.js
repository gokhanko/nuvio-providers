function decodeRapidvid(encodedHls) {
    const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function atobPoly(rotated) {
        let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, enc = "";
        do {
            h1 = b64.indexOf(rotated.charAt(i++));
            h2 = b64.indexOf(rotated.charAt(i++));
            h3 = b64.indexOf(rotated.charAt(i++));
            h4 = b64.indexOf(rotated.charAt(i++));
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;
            if (h3 == 64) enc += String.fromCharCode(o1);
            else if (h4 == 64) enc += String.fromCharCode(o1, o2);
            else enc += String.fromCharCode(o1, o2, o3);
        } while (i < rotated.length);
        return enc;
    }

    let t = atobPoly(encodedHls.split("").reverse().join(""));
    let o = "";
    for (let j = 0; j < t.length; j++) {
        let r = "K9L"[j % 3];
        let n = t.charCodeAt(j) - (r.charCodeAt(0) % 5 + 1);
        o += String.fromCharCode(n);
    }
    return atobPoly(o);
}

console.log(decodeRapidvid('/AkUPx3WaFletpkZ5B1bjpXZahmVEtkYyIHbkVTbtB1TYtlTNhDSnlzQG1lMP9mZ5l0ejlzUHRGUY9GWycTMURWavhFNul0T3MXSlpnTuZVS7Y0Y2xjel1WbJZmd2olYrl1MctmMZRmdX1mT8xjeOljTKZWMUtkY'));
