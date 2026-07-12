// Nuvio Provider for FullHD Film Izlesene
const TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const BASE_URL = "https://www.fullhdfilmizlesene.life";

// ROT13 implementation matching the site's logic
function rtt(str) {
    return (str + '').replace(/[a-z]/gi, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
    });
}

function unpack(packedStr) {
    const pMatch = packedStr.match(/}\('([^']*)',.*?(\d+),.*?(\d+),.*?'([^']*)'\.split/);
    if (!pMatch) return packedStr;
    let p = pMatch[1];
    const a = parseInt(pMatch[2]);
    let c = parseInt(pMatch[3]);
    const k = pMatch[4].split('|');

    const e = function(c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
    };

    while (c--) {
        if (k[c]) {
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
        }
    }
    return p;
}

function decodeUrl(encodedStr) {
    if (!encodedStr) return null;
    if (encodedStr.startsWith("http")) return encodedStr;
    
    // Try plain base64 first
    try {
        let dec = typeof atob === 'function' ? atob(encodedStr) : Buffer.from(encodedStr, 'base64').toString('utf-8');
        // If it looks like a valid string (no weird control characters except maybe some)
        if (!/[^\x09\x0A\x0D\x20-\x7E]/.test(dec)) {
            return dec;
        }
    } catch (e) {}

    // Try rtt + base64
    try {
        const rotated = rtt(encodedStr);
        let dec = typeof atob === 'function' ? atob(rotated) : Buffer.from(rotated, 'base64').toString('utf-8');
        if (!/[^\x09\x0A\x0D\x20-\x7E]/.test(dec)) {
            return dec;
        }
    } catch (e) {}

    // If all else fails, just return the original string
    return encodedStr;
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
                                const avMatch = rapidHtml.match(/["']?file["']?\s*:\s*av\(['"]([^'"]+)['"]\)/);
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
                                            "Referer": "https://rapidvid.net/",
                                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                                        }
                                    });
                                    continue; // Successfully extracted
                                }
                            }
                        } catch (e) {
                            console.error("Rapidvid fetch error:", e);
                        }
                    }
                    
                    if (decoded && (decoded.includes("vidmoly.to") || decoded.includes("vidmoly.me"))) {
                        try {
                            const vidmolyRes = await fetch(decoded, {
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                                    "Referer": "https://www.fullhdfilmizlesene.life/"
                                }
                            });
                            
                            if (vidmolyRes.ok) {
                                let vidmolyHtml = await vidmolyRes.text();
                                vidmolyHtml = unpack(vidmolyHtml);
                                const m3u8Match = vidmolyHtml.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
                                if (m3u8Match) {
                                    const m3u8Url = m3u8Match[1];
                                    streams.push({
                                        name: `FHD [${sourceName}]`,
                                        title: `Vidmoly HLS (TR/EN)`,
                                        url: m3u8Url,
                                        quality: "1080p",
                                        format: "hls",
                                        type: "hls",
                                        headers: {
                                            "Referer": "https://vidmoly.to/",
                                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                                        }
                                    });
                                    continue; // Successfully extracted
                                }
                            }
                        } catch (e) {
                            console.error("Vidmoly fetch error:", e);
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
