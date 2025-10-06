const PendingPet = require("../models/PendingPet");
const Pet = require("../models/Pets");


const getPendingPets = async (req, res) => {
  try {
    const pets = await PendingPet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const acceptPet = async (req, res) => {
  try {
    const pet = await PendingPet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    const approvedPet = new Pet({
      name: pet.name,
      type: pet.type,
      image: pet.image,
    });

    await approvedPet.save();


    await PendingPet.findByIdAndDelete(req.params.id);

    res.json({ message: "Pet accepted and moved to Adopt" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const rejectPet = async (req, res) => {
  try {
    const pet = await PendingPet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    res.json({ message: "Pet rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPendingPets,
  acceptPet,
  rejectPet,
};
