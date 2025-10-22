const mongoose = require("mongoose");

const PendingPetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    age: { type: Number, required: true }, 
    gender: { type: String, enum: ["Male", "Female"], required: true }, 
    image: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingPet", PendingPetSchema);
