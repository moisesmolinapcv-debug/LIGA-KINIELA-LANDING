from PIL import Image
import numpy as np

logos = {
    'Sella Tu Parley': 'downloaded_logos/sellatuparley_direct.png',
    'Juega En Línea': 'downloaded_logos/juegaenlinea.png',
    'Meridiano Bet': 'downloaded_logos/meridianobet_rgba.png',
    'Cordialito': 'downloaded_logos/cordialito.png',
    'Mi Casino': 'downloaded_logos/micasino.png',
    'Triples': 'downloaded_logos/triples.png',
    'Camanbet': 'downloaded_logos/camanbet.png',
    'Redhairbet': 'downloaded_logos/redhairbet.png'
}

for name, path in logos.items():
    im = Image.open(path).convert('RGBA')
    arr = list(im.getdata())
    opaque = [p[:3] for p in arr if p[3] > 50]
    if opaque:
        avg_r = sum(p[0] for p in opaque) / len(opaque)
        avg_g = sum(p[1] for p in opaque) / len(opaque)
        avg_b = sum(p[2] for p in opaque) / len(opaque)
        lum = 0.299 * avg_r + 0.587 * avg_g + 0.114 * avg_b
        print(f'{name:16}: avg_rgb=({avg_r:.0f}, {avg_g:.0f}, {avg_b:.0f}) -> lum={lum:.1f}')
