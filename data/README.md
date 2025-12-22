# Data Folder

This folder contains static JSON files exported from Firestore.

## Files:

- `recipes.json` - All recipe data
- `posts.json` - All blog posts/stories
- `lexicon.json` - All lexicon entries
- `books.json` - All reading list items

## Structure:

Each JSON file is an array of objects with the original Firestore document data.

### Example (recipes.json):
```json
[
  {
    "id": "chocolate-chip-cookies",
    "title": "Chocolate Chip Cookies",
    "slug": "chocolate-chip-cookies",
    "description": "Classic chewy cookies...",
    "image": "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/cookies.jpg",
    "ingredients": ["2 cups flour", "1 cup butter", ...],
    "instructions": ["Preheat oven...", ...],
    ...
  }
]
```

## Updating Data:

After making changes to these files, commit and push to deploy updates to the site.

The admin interfaces will need to be updated to edit these JSON files instead of Firestore.
