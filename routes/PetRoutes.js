const express = require("express");
const router = express.Router();
const multer = require("multer");
const Pet = require("../models/Pets");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, type, gender, age } = req.body; 
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !type || !gender || !age || !image) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newPet = new Pet({ name, type, gender, age, image }); 
    await newPet.save();

    res.status(201).json({ msg: "Pet added successfully", pet: newPet });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
