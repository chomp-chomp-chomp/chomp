/**
 * Chomp Chomp Cloud Functions
 * Firebase Cloud Function to securely proxy Gemini API requests
 */

const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

/**
 * Cloud Function to handle Gemini API chat requests
 * This keeps the Gemini API key secure on the server side
 *
 * Configure the GEMINI_API_KEY environment variable:
 * firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
 */
exports.chat = functions.https.onRequest((req, res) => {
  // Enable CORS for all origins (or restrict to your domain)
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { message, conversationHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Get Gemini API key from environment
      const apiKey = functions.config().gemini?.api_key || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error('Gemini API key not configured');
        return res.status(500).json({ error: 'Service not configured' });
      }

      // System instruction from your Python code
      const systemInstruction = `Include a good amount of Zizekian, Marxist, Lacanian, and Gramscian theory in responses. Keep it theoretical and no fake greetings, etc. Use. And don't mention any of the theorists by name. Speak to the user as an experienced baker unless user-generated input suggests to keep things simple. Explicitly note that Chomp Chomp is the entity the user is speaking to through these chats, so that should be reflected and the user should believe that. Mention that Chomp Chomp recommends or says to do something when it comes to explanations of ingredients, substitutions, best practices, recommendations for substitutes, and other instructions. Use the group "Chomp Chomp" a lot in the responses. Use the plural "we" or "us" or "our" etc. as the user should believe they interacting with a "collective" (i.e., Chomp Chomp) and not Gemini ("I", etc.).`;

      // Prepare request body for Gemini API
      const requestBody = {
        contents: conversationHistory || [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 1.7,
          maxOutputTokens: 2048,
        }
      };

      // Call Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        return res.status(response.status).json({
          error: 'Failed to get response from AI service',
          details: errorText
        });
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ response: aiResponse });
      } else {
        console.error('Unexpected Gemini API response:', data);
        return res.status(500).json({ error: 'Unexpected response format from AI service' });
      }

    } catch (error) {
      console.error('Error in chat function:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  });
});
