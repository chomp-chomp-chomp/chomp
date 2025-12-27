# Chomp Chomp Chat Widget Setup Guide

This guide will help you set up the floating chat widget with Google Gemini AI integration.

## Overview

The chat widget is a floating button that appears in the bottom-right corner of your website. When clicked, it opens a chat interface where users can ask questions about baking, ingredients, techniques, and more. The AI is powered by Google Gemini and configured to respond as "Chomp Chomp," a collective baking entity.

## Features

- ✅ Floating button with your cookie logo
- ✅ Expandable chat interface
- ✅ Google Gemini AI integration
- ✅ Custom system instructions (Zizekian, Marxist, Lacanian, Gramscian theory)
- ✅ Responsive design (desktop and mobile)
- ✅ Dark mode support
- ✅ Conversation history
- ✅ Typing indicator
- ✅ Auto-resizing input field

## Prerequisites

1. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Firebase Project** (already set up)
   - Your project: `chomp-chomp-recipes`

3. **Firebase CLI** (for deploying cloud functions)
   ```bash
   npm install -g firebase-tools
   ```

## Setup Options

You have two options for deploying the chat widget:

### Option 1: Firebase Cloud Functions (Recommended - Secure)

This option keeps your API key secure on the server side.

#### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### Step 2: Initialize Firebase Functions (if not already done)
```bash
cd /home/user/chomp
firebase init functions
```
Select:
- Use existing project: `chomp-chomp-recipes`
- Language: JavaScript
- ESLint: No (or Yes, your choice)
- Install dependencies: Yes

#### Step 3: Install Dependencies
```bash
cd functions
npm install
```

#### Step 4: Set Gemini API Key as Environment Variable
```bash
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY_HERE"
```

Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key.

#### Step 5: Deploy Cloud Function
```bash
firebase deploy --only functions
```

This will deploy the `chat` function. Note the URL provided (e.g., `https://us-central1-chomp-chomp-recipes.cloudfunctions.net/chat`)

#### Step 6: Update index.html
In `index.html`, find the JavaScript section (around line 724) and update the API configuration:

```javascript
// Change this line:
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// To this:
const CLOUD_FUNCTION_URL = 'https://us-central1-chomp-chomp-recipes.cloudfunctions.net/chat';
```

And update the `callGeminiAPI` function to:

```javascript
async function callGeminiAPI(userMessage) {
  const requestBody = {
    message: userMessage,
    conversationHistory: conversationHistory
  };

  const response = await fetch(CLOUD_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}
```

### Option 2: Direct API Call (Quick but Less Secure)

This option calls the Gemini API directly from the browser. **Warning:** Your API key will be visible in the page source.

#### Step 1: Add API Key
In `index.html`, find line 726 and replace `YOUR_GEMINI_API_KEY` with your actual Gemini API key:

```javascript
const GEMINI_API_KEY = 'AIza...'; // Your actual API key
```

#### Step 2: Deploy
Just push your changes and the widget will work immediately.

**Security Note:** Anyone can view your API key in the browser's developer tools. It's recommended to:
- Set up API key restrictions in Google Cloud Console
- Limit the key to only the Gemini API
- Set up usage quotas to prevent abuse

## Testing

1. Open `index.html` in your browser (or visit your live site)
2. Look for the floating cookie logo in the bottom-right corner
3. Click the logo to open the chat interface
4. Type a question like "How do I substitute butter in a recipe?"
5. The AI should respond as "Chomp Chomp" with theoretical baking advice

## Customization

### Change Logo
To use a different logo, update the image URLs in `index.html`:
- Line 350: Chat toggle button logo
- Line 357: Chat header logo

### Adjust Colors
The widget uses your site's color scheme:
- Primary: `#e73b42` (red)
- Dark mode: `#ff6b7a` (lighter red)

To change colors, edit the CSS in the `<style>` section (lines 389-721).

### Modify AI Behavior
To change how the AI responds, edit the `SYSTEM_INSTRUCTION` constant (line 741 in index.html or line 36 in functions/index.js).

### Change AI Model
To use a different Gemini model, update the model name:
- Current: `gemini-2.0-flash-exp` (experimental, fast)
- Alternatives:
  - `gemini-2.0-flash`: Stable version
  - `gemini-1.5-pro`: More capable but slower
  - `gemini-1.5-flash`: Balance of speed and capability

## Troubleshooting

### Chat Widget Not Appearing
- Check browser console for errors
- Verify JavaScript is loading correctly
- Check CSS is not being overridden

### API Errors
- Verify API key is correct
- Check API key has Gemini API enabled
- Review Firebase Cloud Function logs: `firebase functions:log`

### CORS Errors
- If using cloud functions, ensure CORS is enabled (already configured)
- Check Firebase hosting configuration

### Rate Limiting
- Gemini API has rate limits
- Consider implementing rate limiting on your end
- Add usage quotas in Google Cloud Console

## Mobile Optimization

The chat widget is fully responsive:
- **Desktop**: 380px wide, 550px tall
- **Mobile**: Full width (minus 20px margins), full height (minus 100px)

Test on different devices to ensure proper display.

## Dark Mode

The widget automatically adapts to the user's system color scheme preference:
- Light mode: White background, red accents
- Dark mode: Dark espresso theme with lighter red accents

## Performance

The chat widget is lightweight:
- No external dependencies (except Gemini API)
- Minimal CSS and JavaScript
- Loads asynchronously
- Does not impact page load time

## Security Best Practices

1. **Use Firebase Cloud Functions** (Option 1) to keep API key secure
2. **Set API Key Restrictions** in Google Cloud Console:
   - Application restrictions: HTTP referrers (websites)
   - Add your domain: `https://chompchomp.cc/*`
   - API restrictions: Only allow "Generative Language API"
3. **Set Usage Quotas** to prevent abuse
4. **Monitor Usage** regularly in Google Cloud Console
5. **Rotate API Keys** periodically

## Cost Considerations

Gemini API pricing (as of 2024):
- Free tier: 60 requests per minute
- Paid tier: $0.00025 per 1,000 characters (input)
- Paid tier: $0.00050 per 1,000 characters (output)

Monitor usage at [Google Cloud Console](https://console.cloud.google.com).

## Next Steps

After setup, consider:
1. Adding analytics to track chat usage
2. Implementing user feedback mechanism
3. Creating a knowledge base of common questions
4. Adding recipe suggestions based on chat context
5. Integrating with your recipe database for personalized recommendations

## Support

For issues or questions:
- Email: hey@chompchomp.cc
- Check Firebase logs: `firebase functions:log`
- Review browser console for client-side errors

## Files Created

- `index.html` - Updated with chat widget
- `functions/index.js` - Cloud function for API proxy
- `functions/package.json` - Dependencies
- `functions/.gitignore` - Ignore node_modules
- `.env.example` - Environment variable template
- `CHAT-WIDGET-SETUP.md` - This file

## Version

- Chat Widget Version: 1.0
- Last Updated: 2025-12-12
- Gemini API Version: v1beta
- Model: gemini-2.0-flash-exp

---

**Happy Baking! 🍪**

*Chomp Chomp*
