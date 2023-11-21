const OpenAI = require('openai');
const openai = new OpenAI();
const cors = require('cors');

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/generate-image', async (req, res) => {
  try {
    const response = await openai.images.generate({
      prompt: req.body.prompt,
      size: "512x512",
      n: 1,
      response_format: "b64_json",
    });

    console.log(req.body.prompt);

    image_url = response.data[0].b64_json;

    res.send({ url: image_url});
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Error generating image');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
