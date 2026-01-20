const router = require('express').Router();
const User = require('../models/User');

// GET User by Address
router.get('/:address', async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.address.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE or UPDATE User
router.post('/', async (req, res) => {
  const { address, name, email, role } = req.body;

  if (!address) return res.status(400).json({ message: 'Wallet address is required' });

  try {
    let user = await User.findOne({ address: address.toLowerCase() });

    if (user) {
      // Update existing
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      await user.save();
      return res.json(user);
    } else {
      // Create new
      user = new User({
        address: address.toLowerCase(),
        name,
        email,
        role
      });
      await user.save();
      return res.status(201).json(user);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
