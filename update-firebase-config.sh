#!/bin/bash

# Script to update Firebase config across all files
# Usage:
#   1. Edit this file and paste your actual config values below
#   2. Run: bash update-firebase-config.sh

echo "🔥 Firebase Config Updater"
echo "=========================="
echo ""

# PASTE YOUR ACTUAL VALUES HERE (from Firebase Console)
NEW_API_KEY="YOUR-ACTUAL-API-KEY-HERE"
NEW_AUTH_DOMAIN="chomp-chomp-recipes.firebaseapp.com"
NEW_PROJECT_ID="chomp-chomp-recipes"
NEW_STORAGE_BUCKET="chomp-chomp-recipes.firebasestorage.app"
NEW_MESSAGING_SENDER_ID="YOUR-ACTUAL-MESSAGING-SENDER-ID"
NEW_APP_ID="YOUR-ACTUAL-APP-ID"

# Check if values are still placeholders
if [[ "$NEW_API_KEY" == "YOUR-ACTUAL-API-KEY-HERE" ]]; then
    echo "❌ ERROR: You need to edit this script first!"
    echo ""
    echo "Instructions:"
    echo "1. Get your Firebase config from Firebase Console"
    echo "2. Edit this file (update-firebase-config.sh)"
    echo "3. Replace the placeholder values above with your actual values"
    echo "4. Run this script again"
    echo ""
    exit 1
fi

echo "📝 New Configuration:"
echo "  API Key: ${NEW_API_KEY:0:20}..."
echo "  Project: $NEW_PROJECT_ID"
echo ""

# Files to update
FILES=(
    "temp/post-editor.html"
    "temp/index.html"
    "temp/recipes.html"
    "temp/about.html"
)

# Backup first
echo "💾 Creating backups..."
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "${file}.backup"
        echo "  ✓ Backed up $file"
    fi
done

echo ""
echo "🔄 Updating files..."

# Update each file
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        # Use sed to replace the config values
        # Note: This is a simple version. For complex replacements, use a proper script

        sed -i "s|apiKey: \".*\"|apiKey: \"$NEW_API_KEY\"|g" "$file"
        sed -i "s|authDomain: \".*\"|authDomain: \"$NEW_AUTH_DOMAIN\"|g" "$file"
        sed -i "s|projectId: \".*\"|projectId: \"$NEW_PROJECT_ID\"|g" "$file"
        sed -i "s|storageBucket: \".*\"|storageBucket: \"$NEW_STORAGE_BUCKET\"|g" "$file"
        sed -i "s|messagingSenderId: \".*\"|messagingSenderId: \"$NEW_MESSAGING_SENDER_ID\"|g" "$file"
        sed -i "s|appId: \".*\"|appId: \"$NEW_APP_ID\"|g" "$file"

        echo "  ✓ Updated $file"
    else
        echo "  ⚠ File not found: $file"
    fi
done

echo ""
echo "✅ Done!"
echo ""
echo "Next steps:"
echo "1. Test login in post-editor.html"
echo "2. If it works, commit the changes"
echo "3. If it doesn't work, restore from .backup files"
echo ""
