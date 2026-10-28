from PIL import Image

# Ensure meridianobet is converted to RGBA
im = Image.open('downloaded_logos/meridianobet.png').convert('RGBA')
im.save('downloaded_logos/meridianobet_rgba.png')

# Let's inspect each image
logos = [
    'sellatuparley_direct.png',
    'juegaenlinea.png',
    'meridianobet_rgba.png',
    'cordialito.png',
    'micasino.png',
    'triples.png',
    'camanbet.png',
    'redhairbet.png'
]

for l in logos:
    img = Image.open(f'downloaded_logos/{l}')
    # check if has transparent pixels
    has_alpha = False
    if 'A' in img.getbands():
        alpha = img.split()[-1]
        min_a, max_a = alpha.getextrema()
        has_alpha = min_a < 255
    print(f'{l}: size={img.size}, has_alpha={has_alpha}')
