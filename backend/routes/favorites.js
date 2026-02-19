const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

// All favorites routes require authentication
router.use(protect);

router.get('/', getFavorites);
router.post('/:productId', addFavorite);
router.delete('/:productId', removeFavorite);
router.post('/:productId/toggle', toggleFavorite);

module.exports = router;