const mongoose = require("mongoose");

const AdoptedHistorySchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    petName: { type: String, required: true },
    petImage: { type: String, required: true },
    adopterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adopterName: { type: String, required: true },
    adopterEmail: { type: String, required: true },
    contactNumber: { type: String, required: true }, 
    gender: { type: String, enum: ["Male", "Female"], required: true }, 
    typeOfResidence: { type: String, required: true },
    reason: { type: String, required: true },
    adoptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdoptedHistory", AdoptedHistorySchema);
