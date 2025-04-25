const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  photo: { type: String }, // Path to the uploaded image
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now },
});

// Indexes for search and sorting
blogSchema.index({ title: 1, author: 1, createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);