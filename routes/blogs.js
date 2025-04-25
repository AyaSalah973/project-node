const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');


router.get('/', blogController.getLatestBlogs);
router.post('/', authMiddleware, upload.single('photo'), blogController.createBlog);
router.put('/:id', authMiddleware, upload.single('photo'), blogController.editBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);
router.get('/search', authMiddleware, blogController.searchBlogs);

module.exports = router;