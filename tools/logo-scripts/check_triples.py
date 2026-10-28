from PIL import Image

im = Image.open('downloaded_logos/triples.png').convert('RGBA')
print('Triples size:', im.size)
# inspect bounding box of non-zero alpha
bbox = im.getbbox()
print('Bounding box:', bbox)

# check some pixel colors
pixels = list(im.getdata())
colors = {}
for p in pixels:
    if p[3] > 100:
        c = (p[0]//20*20, p[1]//20*20, p[2]//20*20)
        colors[c] = colors.get(c, 0) + 1
print('Top colors in triples:', sorted(colors.items(), key=lambda x: x[1], reverse=True)[:5])
