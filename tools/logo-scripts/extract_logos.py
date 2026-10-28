import base64
import re
from PIL import Image

with open('downloaded_logos/meridianobet.svg', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'data:image/png;base64,([^\"]+)', content)
if m:
    b64_data = m.group(1).strip()
    # Add padding if needed
    missing_padding = len(b64_data) % 4
    if missing_padding:
        b64_data += '=' * (4 - missing_padding)
    with open('downloaded_logos/meridianobet.png', 'wb') as out:
        out.write(base64.b64decode(b64_data))
    print('Extracted meridianobet.png successfully!')

# Check all 8 logos
logos = {
    'sellatuparley': 'downloaded_logos/sellatuparley_direct.png',
    'juegaenlinea': 'downloaded_logos/juegaenlinea.png',
    'meridianobet': 'downloaded_logos/meridianobet.png',
    'cordialito': 'downloaded_logos/cordialito.png',
    'micasino': 'downloaded_logos/micasino.png',
    'triples': 'downloaded_logos/triples.png',
    'camanbet': 'downloaded_logos/camanbet.png',
    'redhairbet': 'downloaded_logos/redhairbet.png',
    'kini': 'downloaded_logos/kini_original.png',
}

for name, path in logos.items():
    try:
        im = Image.open(path)
        print(f'{name}: size={im.size}, mode={im.mode}')
    except Exception as e:
        print(f'{name}: ERROR -> {e}')
