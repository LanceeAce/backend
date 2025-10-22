const mongoose = require("mongoose");

const AdoptionRequestSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    petName: { type: String, required: true },
    petImage: { type: String, required: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    gender: { type: String, enum: ["Male", "Female"], required: true }, 
    typeOfResidence: { type: String, enum: ["Apartment", "House"], required: true }, 

    email: { type: String, required: true },

    contactNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{11}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid contact number!`,
      },
    },

    ownPets: { type: String, enum: ["Yes", "No"], required: true },
    reason: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdoptionRequest", AdoptionRequestSchema);
