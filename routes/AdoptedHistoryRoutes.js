const express = require("express");
const router = express.Router();
const AdoptedHistory = require("../models/AdoptedHistory");


router.get("/", async (req, res) => {
  try {
    const history = await AdoptedHistory.find().sort({ adoptedAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
