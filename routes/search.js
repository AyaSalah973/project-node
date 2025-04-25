const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, searchController.searchBlogs);

module.exports = router;