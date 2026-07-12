// Nuvio Provider for FullHD Film Izlesene
const TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const BASE_URL = "https://www.fullhdfilmizlesene.life";

// ROT13 implementation matching the site's logic
function rtt(str) {
    return (str + '').replace(/[a-z]/gi, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
    });
}

// Decode the video URL from scx data
function decodeUrl(encodedStr) {
    try {
        const rotated = rtt(encodedStr);
        // Hermes engine might not have atob available natively in all configurations, 
        // but typically atob is supported in RN/Nuvio environments.
        // If not, we can implement base64 decode, but let's assume it works or we use a polyfill if needed.
        // Actually, Nuvio provides atob globally.
        let decoded = "";
        if (typeof atob === 'function') {
            decoded = atob(rotated);
        } else if (typeof Buffer !== 'undefined') {
            decoded = Buffer.from(rotated, 'base64').toString('utf-8');
        } else {
            // Very simple base64 decoder fallback just in case
            const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
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
            decoded = enc;
        }
        return decoded;
    } catch (e) {
        console.log("Error decoding URL:", e);
        return null;
    }
}

async function getStreams(tmdbId, mediaType, season, episode) {
    // This site is mostly for movies. 
    if (mediaType !== 'movie') {
        console.log("FullHDFilmIzlesene: Only movies are supported right now.");
        return [];
    }

    try {
        // 1. Get IMDb ID from TMDB
        const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
        const tmdbRes = await fetch(tmdbUrl);
        if (!tmdbRes.ok) {
            console.log("Failed to fetch from TMDB:", tmdbRes.status);
            return [];
        }
        const tmdbData = await tmdbRes.json();
        const imdbId = tmdbData.imdb_id;

        if (!imdbId) {
            console.log("No IMDb ID found for this movie.");
            return [];
        }

        // 2. Search fullhdfilmizlesene by IMDb ID
        const searchUrl = `${BASE_URL}/arama/${imdbId}`;
        const searchRes = await fetch(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "Connection": "keep-alive"
            }
        });
        
        if (!searchRes.ok) {
            console.log("Failed to search site:", searchRes.status);
            return [];
        }
        
        const html = await searchRes.text();
        
        // Find the movie link in search results
        // Example: <a class="tt" href="https://www.fullhdfilmizlesene.life/film/mumya-1/">Mumya 1 - The Mummy 1 izle</a>
        const linkRegex = /<li class="film">[\s\S]*?<a class="tt" href="([^"]+)">/;
        const match = html.match(linkRegex);
        
        if (!match || !match[1]) {
            console.log("Movie not found on fullhdfilmizlesene.");
            return [];
        }
        
        const movieUrl = match[1];
        
        // 3. Fetch movie page
        const movieRes = await fetch(movieUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "Connection": "keep-alive"
            }
        });
        const movieHtml = await movieRes.text();
        
        // 4. Extract scx variable
        // Example: var scx = {"atom":{"tt":"QXRvbQ==","sx":{"p":[],"t":["nUE0pUZ..."]},"order":1}};
        const scxRegex = /var scx = (.*?);/;
        const scxMatch = movieHtml.match(scxRegex);
        
        if (!scxMatch || !scxMatch[1]) {
            console.log("Could not find scx data on movie page.");
            return [];
        }
        
        let scxData;
        try {
            scxData = JSON.parse(scxMatch[1]);
        } catch (e) {
            console.log("Failed to parse scx JSON.");
            return [];
        }
        
        const streams = [];
        
        // Parse streams from scxData
        for (const sourceKey in scxData) {
            // sourceKey is something like 'atom', 'vidmoly', etc.
            const sourceInfo = scxData[sourceKey];
            let sourceName = sourceKey.toUpperCase();
            
            // Sometimes the title is provided in tt field:
            if (sourceInfo.tt) {
                const decName = decodeUrl(sourceInfo.tt);
                if (decName) sourceName = decName;
            }
            
            if (sourceInfo && sourceInfo.sx && sourceInfo.sx.t) {
                const links = sourceInfo.sx.t;
                for (let i = 0; i < links.length; i++) {
                    const encodedUrl = links[i];
                    if (!encodedUrl) continue;
                    
                    const decoded = decodeUrl(encodedUrl);
                    if (decoded && decoded.includes("rapidvid.net")) {
                        try {
                            const rapidRes = await fetch(decoded, {
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                                    "Referer": "https://www.fullhdfilmizlesene.life/"
                                }
                            });
                            
                            if (rapidRes.ok) {
                                const rapidHtml = await rapidRes.text();
                                const avMatch = rapidHtml.match(/av\(['"]([^'"]+)['"]\)/);
                                if (avMatch) {
                                    const encodedHls = avMatch[1];
                                    
                                    // Rapidvid decoder
                                    let t = atob(encodedHls.split("").reverse().join(""));
                                    let o = "";
                                    for (let j = 0; j < t.length; j++) {
                                        let r = "K9L"[j % 3];
                                        let n = t.charCodeAt(j) - (r.charCodeAt(0) % 5 + 1);
                                        o += String.fromCharCode(n);
                                    }
                                    const hlsUrl = atob(o);
                                    
                                    streams.push({
                                        name: `FHD [${sourceName}]`,
                                        title: `Rapidvid HLS (TR/EN)`,
                                        url: hlsUrl.includes('.m3u8') ? hlsUrl : hlsUrl + '#.m3u8',
                                        quality: "1080p",
                                        format: "hls",
                                        type: "hls",
                                        headers: {
                                            "Referer": "https://rapidvid.net/"
                                        }
                                    });
                                    continue; // Successfully extracted
                                }
                            }
                        } catch (e) {
                            console.error("Rapidvid fetch error:", e);
                        }
                    }
                    
                    if (decoded) {
                        streams.push({
                            name: `FHD [${sourceName}]`,
                            title: `Stream ${i}`,
                            url: decoded,
                            quality: "1080p",
                            headers: {
                                "Referer": BASE_URL + "/"
                            }
                        });
                    }
                }
            }
        }
        
        return streams;

    } catch (error) {
        console.error("Provider Error:", error);
        return [];
    }
}

export { getStreams };
