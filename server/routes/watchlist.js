import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import Watchlist from '../models/Watchlist.js';

// @route   GET api/watchlist
// @desc    Get all user watchlists
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const watchlists = await Watchlist.find({ user: req.user.id });
    res.json(watchlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/watchlist
// @desc    Create a new watchlist
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ msg: 'Watchlist name is required' });
    }
    
    const newWatchlist = new Watchlist({
      user: req.user.id,
      name,
      stocks: []
    });
    
    const watchlist = await newWatchlist.save();
    res.json(watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/watchlist/:id/add
// @desc    Add stock to watchlist
// @access  Private
router.post('/:id/add', auth, async (req, res) => {
  try {
    const { symbol, name } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ msg: 'Stock symbol is required' });
    }
    
    const watchlist = await Watchlist.findOne({ 
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!watchlist) {
      return res.status(404).json({ msg: 'Watchlist not found' });
    }
    
    // Check if stock already in watchlist
    if (watchlist.stocks.some(stock => stock.symbol === symbol)) {
      return res.status(400).json({ msg: 'Stock already in watchlist' });
    }
    
    watchlist.stocks.push({
      symbol,
      name: name || symbol,
      addedOn: Date.now()
    });
    
    await watchlist.save();
    res.json(watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/watchlist/:id/remove/:symbol
// @desc    Remove stock from watchlist
// @access  Private
router.delete('/:id/remove/:symbol', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ 
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!watchlist) {
      return res.status(404).json({ msg: 'Watchlist not found' });
    }
    
    // Remove stock from watchlist
    const stockIndex = watchlist.stocks.findIndex(
      stock => stock.symbol === req.params.symbol
    );
    
    if (stockIndex === -1) {
      return res.status(404).json({ msg: 'Stock not found in watchlist' });
    }
    
    watchlist.stocks.splice(stockIndex, 1);
    await watchlist.save();
    
    res.json(watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/watchlist/:id
// @desc    Delete watchlist
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if default watchlist (don't allow deletion)
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!watchlist) {
      return res.status(404).json({ msg: 'Watchlist not found' });
    }
    
    if (watchlist.name === 'Default') {
      return res.status(400).json({ msg: 'Cannot delete default watchlist' });
    }
    
    await Watchlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    res.json({ msg: 'Watchlist removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;