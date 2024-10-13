const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RSASchema = new Schema({
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const RSA = mongoose.model("RSA", RSASchema);

module.exports = RSA;
