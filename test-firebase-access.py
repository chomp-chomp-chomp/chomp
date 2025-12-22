#!/usr/bin/env python3
import urllib.request
import sys

# Test downloading one image
test_url = "https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipes%2Fapple-rose-pie-1763568986654.jpg?alt=media&token=d3862772-c523-4d00-af22-6c0e27ee0bd2"

print("Testing Firebase Storage access...")
print(f"URL: {test_url[:80]}...\n")

try:
    response = urllib.request.urlopen(test_url)
    data = response.read()
    print(f"✅ SUCCESS! Downloaded {len(data)} bytes")
    print("\nFirebase Storage is now accessible!")
    print("You can now run: python3 download-firebase-images.py")
except urllib.error.HTTPError as e:
    print(f"❌ ERROR: {e.code} - {e.reason}")
    if e.code == 412:
        print("\nThis is a Storage Rules issue.")
        print("Follow the instructions to update your Firebase Storage Rules.")
    elif e.code == 403:
        print("\nThis is a permissions issue.")
        print("Check your IAM permissions in Firebase Console.")
    else:
        print(f"\nUnexpected error. Check Firebase Console.")
except Exception as e:
    print(f"❌ ERROR: {e}")
    print("\nCheck your internet connection or Firebase project status.")

sys.exit(0)
