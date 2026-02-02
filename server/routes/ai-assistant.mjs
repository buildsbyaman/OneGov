import express from "express";
import OpenAI from "openai";
import { getDatabase } from "../db.mjs";

const router = express.Router();

const getOpenAI = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.API_URL || "http://localhost:3001",
      "X-Title": "OneGov",
    },
  });
};

router.post("/", async (req, res) => {
  try {
    const { message, userId, profile } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const db = getDatabase();

    const schemes = await db.collection("schemes").find({}).toArray();

    const systemPrompt = `You are a helpful and friendly AI assistant for the OneGov platform - a government schemes portal in India.

PRIMARY FOCUS: You specialize in helping users with Indian government schemes, benefits, eligibility, and applications.

User Profile:
${
  profile
    ? `
- Name: ${profile.full_name || "Not provided"}
- Age: ${profile.age || "Not provided"}
- State: ${profile.state || "Not provided"}
- Occupation: ${profile.occupation || "Not provided"}
- Annual Income: ₹${profile.annual_income || "Not provided"}
- Category: ${profile.category || "Not provided"}
- Gender: ${profile.gender || "Not provided"}
`
    : "Profile not available"
}

Available Government Schemes Database:
${schemes
  .slice(0, 10)
  .map(
    (s) => `
- ${s.name} (${s.category})
  Description: ${s.description}
  Benefits: ${s.benefits}
  Eligibility: ${JSON.stringify(s.eligibility_criteria)}
`,
  )
  .join("\n")}

... and ${schemes.length - 10} more schemes in the database.

GUIDELINES:
- Prioritize answering questions about government schemes, eligibility, benefits, and applications
- When users ask about schemes, provide detailed, helpful information based on the database
- For general questions, you can provide brief, helpful answers
- Always try to be helpful and guide users back to discovering relevant schemes
- Maintain a friendly, professional tone
- If asked about topics outside your knowledge, politely acknowledge limitations

You can answer general questions, but always look for opportunities to help users discover government schemes they might benefit from.`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    res.json({
      response: aiResponse,
      model: "arcee-ai/trinity-large-preview:free",
      usage: completion.usage,
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.status,
    });
    res.status(500).json({
      error: "Failed to get AI response",
      details: error.message,
      apiError: error.response?.data || error.message,
    });
  }
});

export default router;
