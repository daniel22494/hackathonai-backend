require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

// Create an instance of the OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Function to post to GPT-3 API using the new API call
async function chatGPT(prompt) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Use the desired model (e.g., gpt-3.5-turbo)
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }, // Use the prompt as user input
      ],
    });

    return completion.data.choices[0].message;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

app.post("/api/gpt3", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt required" });
  }
  try {
    const response = await chatGPT(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// Use the function
// chatGPT("what favourite colour ")
//   .then((response) => console.log(response))
//   .catch((err) => console.error(err));

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
