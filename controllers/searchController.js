const Blog = require('../models/Blog');
const Tag = require('../models/Tag');

exports.searchBlogs = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    // Search by title, author username, or tag name
    const tags = await Tag.find({ name: { $regex: query, $options: 'i' } });
    const tagIds = tags.map((tag) => tag._id);

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { 'author.username': { $regex: query, $options: 'i' } },
        { tags: { $in: tagIds } },
      ],
    })
      .populate('author', 'username')
      .populate('tags', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { 'author.username': { $regex: query, $options: 'i' } },
        { tags: { $in: tagIds } },
      ],
    });

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};