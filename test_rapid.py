import urllib.request
import gzip

url = "https://rapidvid.net/vod/v1xec243c91"
req = urllib.request.Request(
    url, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.fullhdfilmizlesene.life/',
        'Accept-Encoding': 'gzip'
    }
)

try:
    with urllib.request.urlopen(req) as response:
        content = response.read()
        if response.info().get('Content-Encoding') == 'gzip':
            content = gzip.decompress(content)
        text = content.decode('utf-8', errors='ignore')
        
        print("Status:", response.status)
        print("Length:", len(text))
        print(text[:1000])
        
        # Search for interesting things like .m3u8 or .mp4
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if '.m3u8' in line or '.mp4' in line or 'sources' in line or 'file:' in line or 'eval(' in line:
                print(f"L{i}:", line.strip()[:200])

except Exception as e:
    print("Error:", e)
