from PIL import Image

img = Image.open('frame.png').convert('RGB')
r, g, b = img.getpixel((0, 0))
hex_color = "#{:02x}{:02x}{:02x}".format(r, g, b)
print(hex_color)
