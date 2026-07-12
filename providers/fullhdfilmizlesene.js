/**
 * fullhdfilmizlesene - Built from src/fullhdfilmizlesene/
 * Generated: 2026-07-12T05:34:29.992Z
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
function decodeUrl(encodedStr) {
  try {
    const rotated = rtt(encodedStr);
    let decoded = "";
    if (typeof atob === "function") {
      decoded = atob(rotated);
    } else if (typeof Buffer !== "undefined") {
      decoded = Buffer.from(rotated, "base64").toString("utf-8");
    } else {
      const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, enc = "";
      do {
        h1 = b64.indexOf(rotated.charAt(i++));
        h2 = b64.indexOf(rotated.charAt(i++));
        h3 = b64.indexOf(rotated.charAt(i++));
        h4 = b64.indexOf(rotated.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 255;
        o2 = bits >> 8 & 255;
        o3 = bits & 255;
        if (h3 == 64)
          enc += String.fromCharCode(o1);
        else if (h4 == 64)
          enc += String.fromCharCode(o1, o2);
        else
          enc += String.fromCharCode(o1, o2, o3);
      } while (i < rotated.length);
      decoded = enc;
    }
    return decoded;
  } catch (e) {
    console.log("Error decoding URL:", e);
    return null;
  }
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
            const decodedUrl = decodeUrl(encodedUrl);
            if (decodedUrl) {
              streams.push({
                name: `FHD [${sourceName}]`,
                title: `Stream ${i}`,
                url: decodedUrl,
                quality: "1080p",
                // Often 1080p for this site
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
