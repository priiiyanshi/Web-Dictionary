console.log("📘 DICTIONARY BACKEND RUNNING");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/explain", async (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.json({
      explanation: "No word provided."
    });
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.json({
        explanation: `No definition found for "${word}".`
      });
    }

    const meaning = data[0]?.meanings?.[0];
    const definition = meaning?.definitions?.[0]?.definition;
    const partOfSpeech = meaning?.partOfSpeech;

    if (!definition) {
      return res.json({
        explanation: `No clear definition found for "${word}".`
      });
    }

    res.json({
      explanation: `${word} (${partOfSpeech}): ${definition}`
    });

  } catch (error) {
    console.error("Dictionary API error:", error);
    res.json({
      explanation: "Failed to fetch definition."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Dictionary server running on http://localhost:${PORT}`);
});
