

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/usersDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
  
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

   
    res.json({
      msg: 'Login successful',
      email: user.email
    });
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
