const express = require("express");
const router = express.Router();
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pets");
const AdoptedHistory = require("../models/AdoptedHistory");
const User = require("../models/User");

// ✅ POST new adoption request
router.post("/", async (req, res) => {
  try {
    const {
      petId,
      petName,
      petImage,
      firstName,
      lastName,
      email,
      contactNumber,
      gender,
      typeOfResidence,
      ownPets,
      reason,
    } = req.body;

    // ✅ Validation check
    if (
      !petId ||
      !petName ||
      !petImage ||
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber ||
      !gender ||
      !typeOfResidence ||
      !ownPets ||
      !reason
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ Create new adoption request
    const newRequest = new AdoptionRequest({
      petId,
      petName,
      petImage,
      firstName,
      lastName,
      email,
      contactNumber,
      gender,
      typeOfResidence,
      ownPets,
      reason,
    });

    await newRequest.save();
    res.status(201).json({ msg: "Adoption request submitted", request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const requests = await AdoptionRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ PATCH (update request status)
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    request.status = status;
    await request.save({ validateBeforeSave: false });

    // ✅ If approved, move record to AdoptedHistory
    if (status === "Approved") {
      const user = await User.findOne({ email: request.email });
      if (!user) return res.status(404).json({ msg: "User not found for adoption request" });

      await AdoptedHistory.create({
        petId: request.petId,
        petName: request.petName,
        petImage: request.petImage,
        adopterId: user._id,
        adopterName: `${request.firstName} ${request.lastName}`,
        adopterEmail: request.email,
        contactNumber: request.contactNumber,     // ✅ updated
        gender: request.gender,                   // ✅ updated
        typeOfResidence: request.typeOfResidence, // ✅ updated
        reason: request.reason,
        adoptedAt: new Date(),
      });

      // ✅ Remove adopted pet from pets collection
      await Pet.findByIdAndDelete(request.petId);

      // ✅ Reject all pending requests for same pet
      await AdoptionRequest.updateMany(
        { petId: request.petId, _id: { $ne: request._id }, status: "Pending" },
        { status: "Rejected" }
      );
    }

    res.json({ msg: "Status updated", request });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
