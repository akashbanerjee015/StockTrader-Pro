import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import axios from 'axios';

// @route   GET api/stocks/search/:query
// @desc    Search for stocks
// @access  Private
router.get('/search/:query', auth, async (req, res) => {
  try {
    // In a real app, you would use a financial API like Alpha Vantage or Yahoo Finance
    // Since this is an example, we'll return mock data
    
    const query = req.params.query.toUpperCase();
    const mockResults = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'NFLX', name: 'Netflix Inc.' },
      { symbol: 'DIS', name: 'The Walt Disney Company' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.' }
    ];
    
    // Filter results based on query
    const results = mockResults.filter(stock => 
      stock.symbol.includes(query) || 
      stock.name.toUpperCase().includes(query)
    );
    
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/stocks/:symbol
// @desc    Get stock details
// @access  Private
router.get('/:symbol', auth, async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    // Mock data for demo purposes
    // In a real app, fetch from financial API
    const stockData = {
      symbol: symbol,
      name: symbol === 'AAPL' ? 'Apple Inc.' : 
            symbol === 'MSFT' ? 'Microsoft Corp.' : 
            `${symbol} Corp.`,
      price: 189.50,
      change: '+3.20',
      changePercent: '+1.72%',
      open: 187.30,
      high: 190.25,
      low: 186.95,
      volume: '45.3M',
      marketCap: '2.98T',
      peRatio: 32.8,
      dividendYield: '0.48%',
      fiftyTwoWeekHigh: 198.23,
      fiftyTwoWeekLow: 124.17,
    };
    
    res.json(stockData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/stocks/:symbol/chart/:period
// @desc    Get stock chart data
// @access  Private
router.get('/:symbol/chart/:period', auth, async (req, res) => {
  try {
    const { symbol, period } = req.params;
    
    // Mock chart data
    // In a real app, fetch from financial API
    let chartData = [];
    const periods = {
      '1d': 24,
      '1w': 7,
      '1m': 30,
      '3m': 90,
      '1y': 250,
      '5y': 250 // Just for demo, would be more in real app
    };
    
    const dataPoints = periods[period] || 30;
    const now = new Date();
    const startDate = new Date();
    
    switch(period) {
      case '1d':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '1w':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }
    
    // Generate random chart data
    let basePrice = 180; // Starting price
    
    for (let i = 0; i < dataPoints; i++) {
      const change = (Math.random() - 0.5) * 5; // Random price change
      basePrice += change;
      
      // Ensure price doesn't go negative
      if (basePrice < 10) basePrice = 10;
      
      const date = new Date(startDate);
      
      if (period === '1d') {
        date.setHours(date.getHours() + i);
      } else {
        date.setDate(date.getDate() + i);
      }
      
      chartData.push({
        date: date.toISOString(),
        price: basePrice.toFixed(2)
      });
    }
    
    res.json(chartData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/stocks/:symbol/news
// @desc    Get stock news
// @access  Private
router.get('/:symbol/news', auth, async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const companyName = symbol === 'AAPL' ? 'Apple Inc.' : 
                       symbol === 'MSFT' ? 'Microsoft Corp.' : 
                       `${symbol} Corp.`;
    
    // Mock news data
    const newsItems = [
      { 
        id: 1, 
        title: `${companyName} Announces New Product Line`, 
        source: 'Financial Times', 
        time: '2 hours ago',
        url: 'https://example.com/news/1',
        summary: 'The company unveiled its latest innovations at their annual conference...'
      },
      { 
        id: 2, 
        title: `${companyName} Beats Quarterly Earnings Expectations`, 
        source: 'Bloomberg', 
        time: '5 hours ago',
        url: 'https://example.com/news/2',
        summary: 'The tech giant reported earnings of $1.35 per share, exceeding analyst predictions...'
      },
      { 
        id: 3, 
        title: `What's Next for ${companyName}?`, 
        source: 'Wall Street Journal', 
        time: '1 day ago',
        url: 'https://example.com/news/3',
        summary: 'Analysts weigh in on the future prospects after recent market developments...'
      },
    ];
    
    res.json(newsItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;