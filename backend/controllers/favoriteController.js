const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user favorites
// @route   GET /favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      match: { isActive: true },
      select: 'title price description image category rating numReviews stock createdAt'
    });

    res.json({
      success: true,
      data: {
        favorites: user.favorites,
        count: user.favorites.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch favorites', error: error.message });
  }
};

// @desc    Add product to favorites
// @route   POST /favorites/:productId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);

    if (user.favorites.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites'
      });
    }

    user.favorites.push(productId);
    await user.save();

    res.json({
      success: true,
      message: 'Added to favorites!',
      data: { favoriteId: productId, favoritesCount: user.favorites.length }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: 'Failed to add favorite', error: error.message });
  }
};

// @desc    Remove product from favorites
// @route   DELETE /favorites/:productId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in favorites'
      });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    res.json({
      success: true,
      message: 'Removed from favorites!',
      data: { favoriteId: productId, favoritesCount: user.favorites.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove favorite', error: error.message });
  }
};

// @desc    Toggle favorite (add/remove)
// @route   POST /favorites/:productId/toggle
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const isFavorited = user.favorites.some(id => id.toString() === productId);

    if (isFavorited) {
      user.favorites = user.favorites.filter(id => id.toString() !== productId);
    } else {
      user.favorites.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      message: isFavorited ? 'Removed from favorites!' : 'Added to favorites!',
      data: {
        isFavorited: !isFavorited,
        favoritesCount: user.favorites.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle favorite', error: error.message });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, toggleFavorite };