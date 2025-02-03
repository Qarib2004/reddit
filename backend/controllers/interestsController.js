
import User from '../models/User.js';
import Community from '../models/Community.js';

export const setUserInterests = async (req, res) => {
  const { interests } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.interests = interests;
    await user.save();

    res.json({ message: 'Interests uppdated', interests: user.interests });
  } catch (error) {
    res.status(500).json({ message: 'Error server', error });
  }
};

export const getRecommendedCommunities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recommendedCommunities = await Community.find({
      name: { $in: user.interests }
    });

    res.json(recommendedCommunities);
  } catch (error) {
    res.status(500).json({ message: 'Error server', error });
  }
};
