const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 3000;
const mongo = require("./config/index");
app.use(express.json());
app.use(cors());

const RSA = require("./models/rsa.model");

mongo.connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/rsa/all", async (req, res) => {
  const rsa = await RSA.find({});
  res.status(200).json(rsa);
});

app.post("/rsa/create", async (req, res) => {
  const { publicKey, privateKey } = req.body;
  if(!publicKey || !privateKey) {
    return res.status(404).send("Please enter public key and private key !");
  }
  const newKey = new RSA({
    publicKey: publicKey,
    privateKey: privateKey,
  });
  await newKey.save();
  res.status(200).json({ message: "Success" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
