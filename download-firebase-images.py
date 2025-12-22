#!/usr/bin/env python3
import urllib.request
import urllib.parse
import os
import time
import re

# Read URLs
with open('/home/user/chomp/firebase-image-urls.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip()]

output_dir = '/home/user/chomp/images/firebase-downloads'
os.makedirs(output_dir, exist_ok=True)

print(f"Downloading {len(urls)} images from Firebase Storage...")
print(f"Saving to: {output_dir}\n")

successful = 0
failed = 0

for i, url in enumerate(urls, 1):
    try:
        # Extract filename from URL
        # URL format: .../o/recipes%2Ffilename.jpg?alt=media&token=...
        match = re.search(r'/o/([^?]+)', url)
        if match:
            encoded_path = match.group(1)
            decoded_path = urllib.parse.unquote(encoded_path)
            # Get just the filename, handle paths like "recipes/image.jpg"
            filename = os.path.basename(decoded_path)
        else:
            filename = f"image_{i}.jpg"

        filepath = os.path.join(output_dir, filename)

        # Download
        print(f"[{i}/{len(urls)}] Downloading: {filename}...", end=" ")
        urllib.request.urlretrieve(url, filepath)

        # Get file size
        size = os.path.getsize(filepath)
        size_kb = size / 1024
        print(f"✓ ({size_kb:.1f} KB)")

        successful += 1
        time.sleep(0.1)  # Be nice to the server

    except Exception as e:
        print(f"✗ Error: {e}")
        failed += 1

print("\n" + "=" * 60)
print(f"Download complete!")
print(f"  ✓ Successful: {successful}")
print(f"  ✗ Failed: {failed}")
print(f"  📁 Location: {output_dir}")
print("=" * 60)
