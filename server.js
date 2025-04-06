const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<h1>Hello from Backend<h1/>`)
});

app.post("/summarize", async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mixtral-8x7b-instruct", // free & powerful
                messages: [{ role: "user", content: `Summarize this:\n\n${text}` }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.status(200).json({ summary: response.data.choices[0].message.content });
    } catch (error) {
        console.error("OpenRouter error:", error.response?.data || error.message);
        res.status(500).json({ error: "OpenRouter API failed" });
    }
});

// app.listen(5000, () => console.log("✅ Free LLM server on port 5000"));

module.exports = app;