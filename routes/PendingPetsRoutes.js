const express = require("express");
const multer = require("multer");
const PendingPet = require("../models/PendingPet");
const { getPendingPets, acceptPet, rejectPet } = require("../controllers/PendingPetsController");

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, type } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    if (!name || !type || !image) return res.status(400).json({ msg: "All fields are required" });

    const newPendingPet = new PendingPet({ name, type, image });
    await newPendingPet.save();
    res.status(201).json({ msg: "Pet submitted successfully", pet: newPendingPet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/", getPendingPets);


router.post("/accept/:id", acceptPet);


router.delete("/reject/:id", rejectPet);

module.exports = router;
