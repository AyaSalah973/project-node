const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/follow', authMiddleware, userController.followUser);
router.post('/unfollow', authMiddleware, userController.unfollowUser);
router.get('/profile/:id', authMiddleware, userController.getUserProfile);
router.get('/followed-blogs', authMiddleware, userController.getFollowedBlogs);

module.exports = router;