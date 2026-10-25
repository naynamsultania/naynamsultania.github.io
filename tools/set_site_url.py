"""Run from an extracted GitHub Pages package to fill in its actual public URL."""
from pathlib import Path
from html import escape
from urllib.parse import urlparse
import json, re, sys

if len(sys.argv) != 2:
    raise SystemExit('Usage: python3 tools/set_site_url.py https://your-real-host/optional-repo')
origin=sys.argv[1].rstrip('/')
url=urlparse(origin)
if url.scheme!='https' or not url.netloc or url.username or url.password or url.query or url.fragment:
    raise SystemExit('Provide an https URL without credentials, query parameters, or a fragment.')
root=Path(__file__).resolve().parents[1]
if not (root/'index.html').exists():
    raise SystemExit('Run this helper inside the extracted site package, where index.html is next to the tools folder.')
pages=[]
for path in sorted(root.glob('*.html')):
    canonical=origin+('/' if path.name=='index.html' else '/'+path.name)
    html=path.read_text()
    html=re.sub(r'<link rel="canonical"[^>]*>','',html)
    html=re.sub(r'<meta property="og:url"[^>]*>','',html)
    html=html.replace('</head>',f'<link rel="canonical" href="{escape(canonical,quote=True)}"><meta property="og:url" content="{escape(canonical,quote=True)}"></head>')
    def schema(match):
        data=json.loads(match.group(1)); data['url']=origin+'/'
        return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False).replace('<','\\u003c')+'</script>'
    html=re.sub(r'<script type="application/ld\+json">(.*?)</script>',schema,html,flags=re.S)
    path.write_text(html)
    if path.name not in ('404.html','privacy.html'): pages.append(canonical)
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+escape(page)+'</loc></url>' for page in pages)+'</urlset>')
(root/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n')
print('Updated site metadata and sitemap for '+origin)
