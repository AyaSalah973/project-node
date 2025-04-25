const Blog = require('../models/Blog');
const Tag = require('../models/Tag');

// Get latest blogs (Server-Side Pagination)
exports.getLatestBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Blog.countDocuments();

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a blog (Authenticated users only)
exports.createBlog = async (req, res) => {
  const { title, body, tags } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = JSON.parse(tags);
    }

    
    const tagIds = await Promise.all(
      parsedTags.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = new Tag({ name: tagName });
          await tag.save();
        }
        return tag._id;
      })
    );

    const blog = new Blog({
      title,
      body,
      photo,
      author: req.user.id,
      tags: tagIds,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error in createBlog:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit a blog (Author only)
exports.editBlog = async (req, res) => {
  const { title, body, tags } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = JSON.parse(tags);
    }

    const tagIds = await Promise.all(
      parsedTags.map(async (tagName) => {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = new Tag({ name: tagName });
          await tag.save();
        }
        return tag._id;
      })
    );

    blog.title = title || blog.title;
    blog.body = body || blog.body;
    blog.tags = tagIds.length ? tagIds : blog.tags;
    if (photo) blog.photo = photo;

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Error in editBlog:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a blog (Author only)
exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
  
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      if (blog.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      await blog.deleteOne(); 
      res.json({ message: 'Blog deleted' });
    } catch (err) {
      console.error('Error in deleteBlog:', err.stack); 
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  exports.searchBlogs = async (req, res) => {
    const { query } = req.query; // Query parameter for search
    try {
      const blogs = await Blog.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive title search
          { body: { $regex: query, $options: 'i' } }, // Optional: search in body
          { 'author.username': { $regex: query, $options: 'i' } }, // Search by author username
          { 'tags.name': { $regex: query, $options: 'i' } }, // Search by tag name
        ],
      })
        .populate('author', 'username')
        .populate('tags', 'name')
        .limit(10); // Limit results
      res.json(blogs);
    } catch (err) {
      console.error('Error in searchBlogs:', err.stack);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };