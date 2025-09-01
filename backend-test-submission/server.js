const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const Url = require("./models/Url");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/urlshortener");

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  const shortCode = shortid.generate();

  const newUrl = new Url({ originalUrl: url, shortCode });
  await newUrl.save();

  res.json({ shortUrl: `http://localhost:5000/${shortCode}` });
});

app.get("/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });
  if (!url) return res.status(404).send("Not found");

  url.clicks++;
  await url.save();

  res.redirect(url.originalUrl);
});

app.listen(5000, () => console.log("URL Shortener running 🚀"));
