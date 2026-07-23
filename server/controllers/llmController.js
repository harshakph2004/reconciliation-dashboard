import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const explainDiscrepancy = async (req, res) => {
  try {
    const { discrepancy } = req.body;

    if (!discrepancy) {
      return res.status(400).json({
        message: "Discrepancy data is required",
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

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0].message.content;

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
    console.error(err);

    res.status(500).json({
      message: "AI explanation failed",
    });
  }
};