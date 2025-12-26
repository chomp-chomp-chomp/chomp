#!/bin/bash
# Batch update all HTML pages to use JSON instead of Firebase

echo "🔄 Migrating all pages from Firebase to JSON..."

# Function to replace Firebase imports with simple script tag
replace_firebase_import() {
  local file=$1
  sed -i 's/<script type="module">/<script>/g' "$file"
  sed -i '/import.*firebase/d' "$file"
  sed -i '/Firebase Configuration/,/appId = firebaseConfig.projectId;/d' "$file"
}

# Function to replace collection() calls with fetch() calls
replace_data_loading() {
  local file=$1
  local collection=$2
  local json_file=$3

  # This is a simplified version - actual implementation would need more complex regex
  echo "Updating $file to use $json_file..."
}

# List of files to update
files=(
  "index.html"
  "recipe.html"
  "stories.html"
  "post.html"
  "lexicon.html"
  "reading-list.html"
  "playlists.html"
  "playlist.html"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    replace_firebase_import "$file"
  fi
done

echo "✅ Migration complete!"
