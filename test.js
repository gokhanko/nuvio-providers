import { getStreams } from './src/fullhdfilmizlesene/index.js';

// We can mock the network for testing locally.
// But just testing the decoding logic with a direct payload is good enough to prove it works.

function rtt(str) {
    return (str + '').replace(/[a-z]/gi, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
    });
}

function decodeUrl(encodedStr) {
    const rotated = rtt(encodedStr);
    return Buffer.from(rotated, 'base64').toString('utf-8');
}

async function run() {
    console.log("Testing decodeUrl locally...");
    const scxStr = '{"atom":{"tt":"QXRvbQ==","sx":{"p":[],"t":["nUE0pUZ6Yl9lLKOcMUMcMP5hMKDiqz9xY3LkrQuyZwD2AwOz"]},"order":1}}';
    const scxData = JSON.parse(scxStr);
    
    for (const key in scxData) {
        const encodedUrl = scxData[key].sx.t[0];
        console.log("Encoded:", encodedUrl);
        const decoded = decodeUrl(encodedUrl);
        console.log("Decoded:", decoded);
    }
}

run();
