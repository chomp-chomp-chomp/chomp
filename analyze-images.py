#!/usr/bin/env python3
import json
import os
from collections import defaultdict

# Read all JSON files
data_dir = '/home/user/chomp/data'

image_urls = defaultdict(list)

# Check recipes
with open(f'{data_dir}/recipes.json', 'r') as f:
    recipes = json.load(f)
    for recipe in recipes:
        if 'image' in recipe and recipe['image']:
            image_urls['recipes'].append({
                'title': recipe.get('title', 'Unknown'),
                'url': recipe['image']
            })

# Check posts
with open(f'{data_dir}/posts.json', 'r') as f:
    posts = json.load(f)
    for post in posts:
        if 'featured_image' in post and post['featured_image']:
            image_urls['posts'].append({
                'title': post.get('title', 'Unknown'),
                'url': post['featured_image']
            })

# Print summary
print("=" * 80)
print("IMAGE URL ANALYSIS")
print("=" * 80)

total = 0
firebase_count = 0
local_count = 0
other_count = 0

for collection, images in image_urls.items():
    print(f"\n{collection.upper()}: {len(images)} images")
    for img in images[:5]:  # Show first 5
        url = img['url']
        total += 1
        if 'firebasestorage' in url:
            firebase_count += 1
            print(f"  🔥 FIREBASE: {img['title']}")
            print(f"     {url[:80]}...")
        elif url.startswith('/images/') or url.startswith('images/'):
            local_count += 1
            print(f"  📁 LOCAL: {img['title']}")
            print(f"     {url}")
        else:
            other_count += 1
            print(f"  🌐 OTHER: {img['title']}")
            print(f"     {url}")

    if len(images) > 5:
        print(f"  ... and {len(images) - 5} more")

print("\n" + "=" * 80)
print("SUMMARY:")
print(f"  Total images: {total}")
print(f"  Firebase Storage: {firebase_count}")
print(f"  Local files: {local_count}")
print(f"  Other URLs: {other_count}")
print("=" * 80)

# Extract unique Firebase Storage URLs
firebase_urls = set()
for collection, images in image_urls.items():
    for img in images:
        if 'firebasestorage' in img['url']:
            firebase_urls.add(img['url'])

# Save to file for downloading
if firebase_urls:
    print(f"\n📥 Saving {len(firebase_urls)} unique Firebase URLs to download list...")
    with open('/home/user/chomp/firebase-image-urls.txt', 'w') as f:
        for url in sorted(firebase_urls):
            f.write(url + '\n')
    print("   Saved to: /home/user/chomp/firebase-image-urls.txt")
