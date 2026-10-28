from PIL import Image, ImageDraw, ImageFont
import os

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

# Create a test image with dark background and white background to compare
w, h = 1200, 800
img = Image.new('RGBA', (w, h), (10, 16, 45, 255))
draw = ImageDraw.Draw(img)

# Left column: on dark card (#0d1b40 with border)
# Right column: on light card (#ffffff)
for idx, (name, path) in enumerate(logos.items()):
    logo = Image.open(path).convert('RGBA')
    # scale logo to max w=200, max h=60
    logo.thumbnail((200, 60), Image.Resampling.LANCZOS)
    
    y = 50 + idx * 90
    
    # Dark card
    x1, y1 = 50, y
    draw.rounded_rectangle([x1, y1, x1 + 260, y1 + 75], radius=12, fill=(15, 25, 70), outline=(50, 70, 150), width=2)
    # paste centered in card
    lx = x1 + (260 - logo.width) // 2
    ly = y1 + (75 - logo.height) // 2
    img.paste(logo, (lx, ly), logo)
    
    # Light card
    x2, y2 = 350, y
    draw.rounded_rectangle([x2, y2, x2 + 260, y2 + 75], radius=12, fill=(255, 255, 255), outline=(220, 220, 230), width=2)
    lx2 = x2 + (260 - logo.width) // 2
    ly2 = y2 + (75 - logo.height) // 2
    img.paste(logo, (lx2, ly2), logo)

img.save('downloaded_logos/test_cards.png')
print('test_cards.png saved!')
