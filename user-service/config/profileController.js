const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'profile_picture','phone','bio','role','address','city','state','postal_code','website','created_at'] // Select only needed fields
    });
//id, name, email, profile_picture,phone,bio,role,city,state,postal_code,website,created_at,profile_picture
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Profile fetch error:', err);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

module.exports = { getProfile };
