import cv2
import pytesseract
import os

# Read the image
image_path = '../../Downloads/question6.jpeg'
image = cv2.imread(image_path)

# Convert the image to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply thresholding to create a binary image
_, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

# Perform morphological operations to enhance horizontal lines
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 1))
horizontal_lines = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

# Find contours of the horizontal lines
contours, _ = cv2.findContours(horizontal_lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Create a directory to save the cropped sections
output_dir = 'new'
os.makedirs(output_dir, exist_ok=True)

# Crop the sections for each line and remove them from the original image
for i, contour in enumerate(contours):
    x, y, w, h = cv2.boundingRect(contour)
    aspect_ratio = w / h
    line_length = w  # Assume horizontal lines are wider than taller

    # Minimum length requirement of 3cm (adjust as needed)
    if aspect_ratio > 10 and line_length >= 10 * image.shape[1] / 300:
        section = image[y + h:, :]
        section_path = os.path.join(output_dir, f"Section_{i+1}.jpeg")
        cv2.imwrite(section_path, section)
        image = image[:y+h, :]  # Remove the section from the original image

# Display the result
cv2.imshow('Horizontal Margins', image)
cv2.waitKey(0)
cv2.destroyAllWindows()

