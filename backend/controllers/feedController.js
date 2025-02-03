
import Post from '../models/Post.js';
import User from '../models/User.js';

export const getUserFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('subscriptions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ community: { $in: user.subscriptions } })
      .populate('author', 'username')
      .populate('community', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error server', error });
  }
};
