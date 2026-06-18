require("dotenv").config();
const axios = require("axios");

async function testModel(modelName) {
  const api_key = process.env.CLAUDE_API_KEY;
  const headers = {
    "content-type": "application/json",
    "x-api-key": api_key,
    "anthropic-version": "2023-06-01",
  };

  const requestBody = {
    model: modelName,
    max_tokens: 10,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Hi",
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post("https://api.anthropic.com/v1/messages", requestBody, { headers });
    console.log(`Model ${modelName}: Success!`);
    return true;
  } catch (error) {
    if (error.response) {
      console.log(`Model ${modelName}: Error ${error.response.status} - ${error.response.data?.error?.message}`);
    } else {
      console.log(`Model ${modelName}: Error - ${error.message}`);
    }
    return false;
  }
}

async function run() {
  const models = [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620",
    "claude-3-5-sonnet-latest",
    "claude-3-haiku-20240307",
    "claude-3-opus-20240229",
    "claude-3-7-sonnet-20250219",
    "claude-3-7-sonnet-latest"
  ];
  for (const m of models) {
    await testModel(m);
  }
}

run();
