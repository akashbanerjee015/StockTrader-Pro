import express from 'express';
import auth from '../middleware/auth.js';
import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/portfolio/buy
// @desc    Buy stock
// @access  Private
router.post('/buy', auth, async (req, res) => {
  try {
    const { symbol, name, shares, price } = req.body;
    
    if (!symbol || !shares || !price) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Convert to numbers to ensure calculations work correctly
    const sharesNum = Number(shares);
    const priceNum = Number(price);
    
    if (isNaN(sharesNum) || isNaN(priceNum) || sharesNum <= 0 || priceNum <= 0) {
      return res.status(400).json({ msg: 'Shares and price must be positive numbers' });
    }
    
    // Get user for cash balance check
    const user = await User.findById(req.user.id);
    const totalCost = sharesNum * priceNum;
    
    if (user.cashBalance < totalCost) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }
    
    // Update user cash balance
    user.cashBalance -= totalCost;
    await user.save();
    
    // Update portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    // Check if stock already exists in portfolio
    const stockIndex = portfolio.holdings.findIndex(holding => holding.symbol === symbol);
    
    if (stockIndex > -1) {
      // Update existing holding
      const currentHolding = portfolio.holdings[stockIndex];
      const totalShares = currentHolding.shares + sharesNum;
      const totalCostBasis = (currentHolding.shares * currentHolding.averagePrice) + totalCost;
      const newAveragePrice = totalCostBasis / totalShares;
      
      portfolio.holdings[stockIndex].shares = totalShares;
      portfolio.holdings[stockIndex].averagePrice = newAveragePrice;
    } else {
      // Add new holding
      portfolio.holdings.push({
        symbol,
        name: name || symbol,
        shares: sharesNum,
        averagePrice: priceNum
      });
    }
    
    portfolio.totalInvested += totalCost;
    portfolio.lastUpdated = Date.now();
    
    await portfolio.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      type: 'Buy',
      symbol,
      shares: sharesNum,
      price: priceNum,
      amount: totalCost
    });
    
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/portfolio/sell
// @desc    Sell stock
// @access  Private
router.post('/sell', auth, async (req, res) => {
  try {
    const { symbol, shares, price } = req.body;
    
    if (!symbol || !shares || !price) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    // Convert to numbers to ensure calculations work correctly
    const sharesNum = Number(shares);
    const priceNum = Number(price);
    
    if (isNaN(sharesNum) || isNaN(priceNum) || sharesNum <= 0 || priceNum <= 0) {
      return res.status(400).json({ msg: 'Shares and price must be positive numbers' });
    }
    
    // Get portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    // Check if user owns the stock
    const stockIndex = portfolio.holdings.findIndex(holding => holding.symbol === symbol);
    
    if (stockIndex === -1) {
      return res.status(400).json({ msg: 'Stock not found in portfolio' });
    }
    
    const holding = portfolio.holdings[stockIndex];
    
    // Check if user has enough shares
    if (holding.shares < sharesNum) {
      return res.status(400).json({ msg: 'Not enough shares to sell' });
    }
    
    const saleAmount = sharesNum * priceNum;
    
    // Update user cash balance
    const user = await User.findById(req.user.id);
    user.cashBalance += saleAmount;
    await user.save();
    
    // Update portfolio
    if (holding.shares === sharesNum) {
      // Remove the holding completely
      portfolio.holdings.splice(stockIndex, 1);
    } else {
      // Update shares count
      portfolio.holdings[stockIndex].shares -= sharesNum;
    }
    
    portfolio.lastUpdated = Date.now();
    await portfolio.save();
    
    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      type: 'Sell',
      symbol,
      shares: sharesNum,
      price: priceNum,
      amount: saleAmount
    });
    
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/portfolio/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;