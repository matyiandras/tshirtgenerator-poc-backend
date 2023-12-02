/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");

require('dotenv').config()

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});
const cors = require('cors');

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

app.post('/generate-tshirt-designs', async (req, res) => {
  try {
    const response = await openai.images.generate({
      prompt: req.body.prompt,
      size: "512x512",
      n: 4,
      response_format: "b64_json",
    });

    console.log(req.body.prompt);

    design_urls = response.data.map((design) => design.b64_json);

    res.send({ urls: design_urls});
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Error generating image');
  }
});

exports.app = onRequest({region: "europe-west1"}, app);

