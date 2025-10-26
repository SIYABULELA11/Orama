const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Controller function to handle chat messages
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body; // message from frontend user

    // Create a model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Send message to Gemini
    const result = await model.generateContent(message);

    // Extract AI response
    const responseText = result.response.text();

    // Send it back to frontend
    res.json({ reply: responseText });
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
};

module.exports = { chatWithAI };
