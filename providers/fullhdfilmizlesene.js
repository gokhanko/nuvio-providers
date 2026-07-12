/**
 * fullhdfilmizlesene - Built from src/fullhdfilmizlesene/
 * Generated: 2026-07-12T07:31:08.829Z
 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/fullhdfilmizlesene/index.js
var fullhdfilmizlesene_exports = {};
__export(fullhdfilmizlesene_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(fullhdfilmizlesene_exports);
var TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
var BASE_URL = "https://www.fullhdfilmizlesene.life";
function rtt(str) {
  return (str + "").replace(/[a-z]/gi, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < "n" ? 13 : -13));
  });
}
function unpack(packedStr) {
  const pMatch = packedStr.match(/}\('([^']*)',.*?(\d+),.*?(\d+),.*?'([^']*)'\.split/);
  if (!pMatch)
    return packedStr;
  let p = pMatch[1];
  const a = parseInt(pMatch[2]);
  let c = parseInt(pMatch[3]);
  const k = pMatch[4].split("|");
  const e = function(c2) {
    return (c2 < a ? "" : e(parseInt(c2 / a))) + ((c2 = c2 % a) > 35 ? String.fromCharCode(c2 + 29) : c2.toString(36));
  };
  while (c--) {
    if (k[c]) {
      p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
    }
  }
  return p;
}
function decodeUrl(encodedStr) {
  if (!encodedStr)
    return null;
  if (encodedStr.startsWith("http"))
    return encodedStr;
  try {
    let dec = typeof atob === "function" ? atob(encodedStr) : Buffer.from(encodedStr, "base64").toString("utf-8");
    if (!/[^\x09\x0A\x0D\x20-\x7E]/.test(dec)) {
      return dec;
    }
  } catch (e) {
  }
  try {
    const rotated = rtt(encodedStr);
    let dec = typeof atob === "function" ? atob(rotated) : Buffer.from(rotated, "base64").toString("utf-8");
    if (!/[^\x09\x0A\x0D\x20-\x7E]/.test(dec)) {
      return dec;
    }
  } catch (e) {
  }
  return encodedStr;
}
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    if (mediaType !== "movie") {
      console.log("FullHDFilmIzlesene: Only movies are supported right now.");
      return [];
    }
    try {
      const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
      const tmdbRes = yield fetch(tmdbUrl);
      if (!tmdbRes.ok) {
        console.log("Failed to fetch from TMDB:", tmdbRes.status);
        return [];
      }
      const tmdbData = yield tmdbRes.json();
      const imdbId = tmdbData.imdb_id;
      if (!imdbId) {
        console.log("No IMDb ID found for this movie.");
        return [];
      }
      const searchUrl = `${BASE_URL}/arama/${imdbId}`;
      const searchRes = yield fetch(searchUrl, {
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
      const html = yield searchRes.text();
      const linkRegex = /<li class="film">[\s\S]*?<a class="tt" href="([^"]+)">/;
      const match = html.match(linkRegex);
      if (!match || !match[1]) {
        console.log("Movie not found on fullhdfilmizlesene.");
        return [];
      }
      const movieUrl = match[1];
      const movieRes = yield fetch(movieUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
          "Connection": "keep-alive"
        }
      });
      const movieHtml = yield movieRes.text();
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
      for (const sourceKey in scxData) {
        const sourceInfo = scxData[sourceKey];
        let sourceName = sourceKey.toUpperCase();
        if (sourceInfo.tt) {
          const decName = decodeUrl(sourceInfo.tt);
          if (decName)
            sourceName = decName;
        }
        if (sourceInfo && sourceInfo.sx && sourceInfo.sx.t) {
          const links = sourceInfo.sx.t;
          for (let i = 0; i < links.length; i++) {
            const encodedUrl = links[i];
            if (!encodedUrl)
              continue;
            const decoded = decodeUrl(encodedUrl);
            let finalUrl = decoded;
            if (decoded && !decoded.startsWith("http")) {
              const proxyUrl = watchUrl + decoded;
              try {
                const proxyRes = yield fetch(proxyUrl, {
                  headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": watchUrl
                  }
                });
                if (proxyRes.url && proxyRes.url !== proxyUrl && proxyRes.url.startsWith("http")) {
                  finalUrl = proxyRes.url;
                } else {
                  const proxyHtml = yield proxyRes.text();
                  const iframeMatch = proxyHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
                  if (iframeMatch && iframeMatch[1].startsWith("http")) {
                    finalUrl = iframeMatch[1];
                  }
                }
              } catch (e) {
                console.error("Proxy fetch error:", e);
              }
            }
            if (finalUrl && finalUrl.includes("rapidvid.net")) {
              try {
                const rapidRes = yield fetch(finalUrl, {
                  headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": "https://www.fullhdfilmizlesene.life/"
                  }
                });
                if (rapidRes.ok) {
                  const rapidHtml = yield rapidRes.text();
                  const avMatch = rapidHtml.match(/["']?file["']?\s*:\s*av\(['"]([^'"]+)['"]\)/);
                  if (avMatch) {
                    const encodedHls = avMatch[1];
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
                      url: hlsUrl.includes(".m3u8") ? hlsUrl : hlsUrl + "#.m3u8",
                      quality: "1080p",
                      format: "hls",
                      type: "hls",
                      headers: {
                        "Referer": "https://rapidvid.net/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                      }
                    });
                    continue;
                  }
                }
              } catch (e) {
                console.error("Rapidvid fetch error:", e);
              }
            }
            if (finalUrl && (finalUrl.includes("vidmoly.to") || finalUrl.includes("vidmoly.me"))) {
              try {
                const vidmolyRes = yield fetch(finalUrl, {
                  headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": "https://www.fullhdfilmizlesene.life/"
                  }
                });
                if (vidmolyRes.ok) {
                  let vidmolyHtml = yield vidmolyRes.text();
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
                    continue;
                  }
                }
              } catch (e) {
                console.error("Vidmoly fetch error:", e);
              }
            }
            if (finalUrl) {
              streams.push({
                name: `[DB] ${finalUrl.substring(0, 45)}`,
                title: `Stream ${i}`,
                url: finalUrl,
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
  });
}
