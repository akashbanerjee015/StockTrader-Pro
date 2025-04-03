import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TradeModal from '../components/TradeModal';
import { searchStocks } from '../services/stockService';
import { getPortfolio } from '../services/portfolioService';
import { getWatchlists } from '../services/watchlistService';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const [marketSummary, setMarketSummary] = useState([
    { index: 'S&P 500', value: '4,782.96', change: '+0.22%', trend: 'up' },
    { index: 'NASDAQ', value: '15,107.65', change: '+0.31%', trend: 'up' },
    { index: 'DOW', value: '37,215.73', change: '-0.18%', trend: 'down' },
  ]);

  const [popularStocks, setPopularStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 189.50, change: '+1.2%', trend: 'up' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 385.20, change: '+0.7%', trend: 'up' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.30, change: '+0.9%', trend: 'up' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 157.80, change: '-0.3%', trend: 'down' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 224.60, change: '-1.5%', trend: 'down' },
  ]);

  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: '$25,632.48',
    dayChange: '+$235.78 (0.93%)',
    trend: 'up'
  });
  
  const [tradeSymbol, setTradeSymbol] = useState('');
  const [quickTradeStock, setQuickTradeStock] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAction, setTradeAction] = useState('buy');
  const [portfolio, setPortfolio] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    loadPortfolio();
  }, []);
  
  const loadPortfolio = async () => {
    try {
      const portfolioData = await getPortfolio();
      setPortfolio(portfolioData);
    } catch (err) {
      console.error('Error loading portfolio:', err);
    }
  };
  
  const handleSymbolChange = async (e) => {
    const value = e.target.value;
    setTradeSymbol(value);
    
    if (value.length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchStocks(value);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching stocks:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };
  
  const selectStock = (stock) => {
    setTradeSymbol(stock.symbol);
    setQuickTradeStock(stock);
    setSearchResults([]);
  };
  
  const initiateQuickTrade = (action) => {
    // First, make sure we have the stock information
    if (!quickTradeStock && tradeSymbol) {
      // Find the stock from popular stocks list or search results
      const stock = popularStocks.find(s => s.symbol === tradeSymbol.toUpperCase());
      if (stock) {
        setQuickTradeStock(stock);
      } else {
        // For simplicity, create a basic stock object with the symbol
        setQuickTradeStock({
          symbol: tradeSymbol.toUpperCase(),
          name: `${tradeSymbol.toUpperCase()} Stock`,
          price: 100.00 // Default price
        });
      }
    }
    
    setTradeAction(action);
    setShowTradeModal(true);
  };
  
  const closeTradeModal = () => {
    setShowTradeModal(false);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="date-display">
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card market-summary">
            <h2>Market Summary</h2>
            <div className="market-indices">
              {marketSummary.map((item) => (
                <div key={item.index} className="market-index-item">
                  <h3>{item.index}</h3>
                  <p className="index-value">{item.value}</p>
                  <p className={`index-change ${item.trend}`}>{item.change}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card portfolio-overview">
            <h2>Portfolio Overview</h2>
            <div className="portfolio-value">
              <h3>Total Value</h3>
              <p className="value">{portfolioSummary.totalValue}</p>
              <p className={`day-change ${portfolioSummary.trend}`}>{portfolioSummary.dayChange}</p>
            </div>
            <div className="portfolio-actions">
              <Link to="/portfolio">
                <button className="btn btn-primary">View Portfolio</button>
              </Link>
            </div>
          </div>

          <div className="card watchlist-summary">
            <div className="watchlist-header">
              <h2>Popular Stocks</h2>
              <Link to="/watchlist" className="view-all">View All</Link>
            </div>
            <table className="stocks-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {popularStocks.map((stock) => (
                  <tr key={stock.symbol}>
                    <td>
                      <Link to={`/stocks/${stock.symbol}`} className="stock-symbol">{stock.symbol}</Link>
                    </td>
                    <td>{stock.name}</td>
                    <td>${stock.price.toFixed(2)}</td>
                    <td className={stock.trend}>{stock.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card quick-trade">
            <h2>Quick Trade</h2>
            <div className="trade-form">
              <div className="form-group symbol-search">
                <label htmlFor="symbol">Symbol</label>
                <div className="search-container">
                  <input 
                    type="text" 
                    id="symbol" 
                    placeholder="e.g., AAPL" 
                    value={tradeSymbol}
                    onChange={handleSymbolChange}
                  />
                  {isSearching && <div className="searching-indicator">Searching...</div>}
                  {searchResults.length > 0 && (
                    <ul className="search-results">
                      {searchResults.map(stock => (
                        <li key={stock.symbol} onClick={() => selectStock(stock)}>
                          <span className="stock-symbol">{stock.symbol}</span>
                          <span className="stock-name">{stock.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => initiateQuickTrade('buy')}
                  disabled={!tradeSymbol.trim()}
                >
                  Buy
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => initiateQuickTrade('sell')}
                  disabled={!tradeSymbol.trim()}
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showTradeModal && quickTradeStock && (
        <TradeModal 
          isOpen={showTradeModal}
          onClose={closeTradeModal}
          stock={quickTradeStock}
          action={tradeAction}
          holdings={portfolio?.holdings || []}
        />
      )}
    </div>
  );
}

export default Dashboard;