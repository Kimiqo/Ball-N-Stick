import cv2
import sys

video_path = sys.argv[1]
cap = cv2.VideoCapture(video_path)
ret, frame = cap.read()
if ret:
    # Get top-left pixel (BGR format in OpenCV)
    b, g, r = frame[0, 0]
    # Convert to hex
    hex_color = "#{:02x}{:02x}{:02x}".format(r, g, b)
    print(hex_color)
cap.release()
