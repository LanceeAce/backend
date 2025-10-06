const mongoose = require("mongoose");

const PendingPetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true }, // pwede URL or base64
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PendingPet", PendingPetSchema);
