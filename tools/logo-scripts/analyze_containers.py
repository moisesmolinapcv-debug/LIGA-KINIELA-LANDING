from PIL import Image

# Let's inspect test_cards.png by checking pixel values in both columns
# Or let's see which logos have low contrast on dark vs light cards:
# Dark card color was (15, 25, 70)
# Light card color was (255, 255, 255)
# JuegaEnLinea has white text -> on dark card it is PERFECT! On white card it is INVISIBLE!
# Triples has blue text (0, 100, 200) -> on dark card (15, 25, 70) it might have low contrast if background is dark blue!
# But what if each card has a custom background OR what if cards have a stylish dark slate / navy pill with an inner glow or border?
# Or what if Triples has a subtle white badge or outline, or what if the card has a balanced gradient (e.g. from #ffffff to #f0f4f8 for brands that need light, or dark pill for brands that need dark)?
print('Analyzing best container style for each logo...')
