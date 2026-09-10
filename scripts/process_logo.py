from PIL import Image
import sys

input_path = sys.argv[1]

img = Image.open(input_path).convert("RGBA")
datas = img.getdata()
newData = []
traceData = []

for item in datas:
    brightness = sum(item[:3]) / 3
    if brightness < 120:
        # Transparent for final image
        newData.append((255, 255, 255, 0))
        # White background for potrace
        traceData.append((255, 255, 255, 255))
    else:
        # White for final image
        newData.append((255, 255, 255, 255))
        # Black graphic for potrace
        traceData.append((0, 0, 0, 255))

img.putdata(newData)
img.save("public/logo_transparent.png", "PNG")

img.putdata(traceData)
img.save("public/logo_for_potrace.png", "PNG")

width, height = img.size
size = int(width * 0.65)
left = (width - size) / 2
top = height * 0.05
right = (width + size) / 2
bottom = top + size

favicon = img.crop((left, top, right, bottom))
favicon.thumbnail((64, 64))
favicon.save("public/favicon.png", "PNG")
