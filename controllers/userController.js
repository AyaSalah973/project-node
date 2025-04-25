const User = require('../models/User');
const Follow = require('../models/Follow');
const Blog = require('../models/Blog');

// Follow a user
exports.followUser = async (req, res) => {
  const { followingId } = req.body;

  try {
    if (followingId === req.user.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const follow = new Follow({
      follower: req.user.id,
      following: followingId,
    });

    await follow.save();
    res.status(201).json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  const { followingId } = req.body;

  try {
    await Follow.deleteOne({ follower: req.user.id, following: followingId });
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('username createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const blogs = await Blog.find({ author: id })
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    res.json({ user, blogs });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get followed authors' blogs
exports.getFollowedBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const follows = await Follow.find({ follower: req.user.id });
    const followingIds = follows.map((follow) => follow.following);

    const blogs = await Blog.find({ author: { $in: followingIds } })
      .populate('author', 'username')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ author: { $in: followingIds } });

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};