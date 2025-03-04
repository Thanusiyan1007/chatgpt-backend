require("dotenv").config();
const axios = require("axios");

module.exports = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { prompt } = req.body;
            if (!prompt) return res.status(400).json({ error: "Prompt is required" });

            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 200,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return res.status(200).json({ response: response.data.choices[0].message.content });

        } catch (error) {
            console.error("Error calling OpenAI API:", error.response?.data || error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
};
