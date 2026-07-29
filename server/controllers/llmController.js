import Groq from "groq-sdk";

const createGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

export const explainDiscrepancy = async (req, res) => {
  try {
    const { discrepancy } = req.body;

    if (!discrepancy) {
      return res.status(400).json({
        message: "Discrepancy data is required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        message: "AI is not configured. Add GROQ_API_KEY to the server environment and redeploy.",
      });
    }

    const prompt = `
You are a financial reconciliation assistant.

Explain this discrepancy in simple business language.

Return ONLY valid JSON in this format:

{
  "summary": "",
  "possibleCause": "",
  "recommendedAction": "",
  "confidence": ""
}

Discrepancy:

${JSON.stringify(discrepancy, null, 2)}
`;

    const completion = await createGroqClient().chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Groq returned an empty response");
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: text,
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Groq explanation error:", err);

    const status = err.status || err.statusCode;
    const message =
      status === 401
        ? "Groq rejected the API key. Check GROQ_API_KEY in your server environment."
        : status === 429
          ? "The AI service is busy. Please try again in a moment."
          : "AI explanation failed. Please try again later.";

    res.status(status && status >= 400 && status < 600 ? status : 500).json({
      message,
    });
  }
};
