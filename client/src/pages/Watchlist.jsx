import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TradeModal from '../components/TradeModal';
import { getWatchlists, addStockToWatchlist, removeStockFromWatchlist } from '../services/watchlistService';
import { getStockDetails } from '../services/stockService';
import { getPortfolio } from '../services/portfolioService';

function Watchlist() {
  const [watchlists, setWatchlists] = useState([]);
  const [activeWatchlist, setActiveWatchlist] = useState(null);
  const [showAddStock, setShowAddStock] = useState(false);
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAction, setTradeAction] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  
  useEffect(() => {
    loadWatchlists();
    loadPortfolio();
  }, []);
  
  const loadWatchlists = async () => {
    try {
      setLoading(true);
      const data = await getWatchlists();
      setWatchlists(data);
      if (data.length > 0) {
        setActiveWatchlist(data[0]._id);
      }
      setError(null);
    } catch (err) {
      setError(err.msg || 'Error loading watchlists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadPortfolio = async () => {
    try {
      const portfolioData = await getPortfolio();
      setPortfolio(portfolioData);
    } catch (err) {
      console.error('Error loading portfolio:', err);
    }
  };
  
  const handleAddStock = async (e) => {
    e.preventDefault();
    if (newStockSymbol.trim() === '') return;
    
    try {
      await addStockToWatchlist(
        activeWatchlist, 
        newStockSymbol.toUpperCase(),
        `${newStockSymbol.toUpperCase()} Corp.`
      );
      loadWatchlists(); // Reload watchlists to get updated data
      setNewStockSymbol('');
      setShowAddStock(false);
    } catch (err) {
      setError(err.msg || 'Failed to add stock');
      console.error(err);
    }
  };
  
  const handleRemoveStock = async (symbol) => {
    try {
      await removeStockFromWatchlist(activeWatchlist, symbol);
      loadWatchlists(); // Reload watchlists to get updated data
    } catch (err) {
      setError(err.msg || 'Failed to remove stock');
      console.error(err);
    }
  };
  
  const initiateTradeAction = async (symbol, action) => {
    try {
      const stockDetails = await getStockDetails(symbol);
      setSelectedStock(stockDetails);
      setTradeAction(action);
      setShowTradeModal(true);
    } catch (err) {
      setError(`Failed to get stock details for ${symbol}`);
    }
  };
  
  const closeTradeModal = () => {
    setShowTradeModal(false);
    setSelectedStock(null);
    loadPortfolio();
  };

  // Find the current active watchlist object
  const currentWatchlist = watchlists.find(w => w._id === activeWatchlist);

  return (
    <div className="watchlist-container">
      <Navbar />
      
      <div className="watchlist-content">
        <div className="watchlist-header">
          <h1>Watchlists</h1>
          <div className="watchlist-actions">
            <button className="btn btn-outline">Create New Watchlist</button>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading watchlists...</div>
        ) : (
          <>
            <div className="watchlist-tabs">
              {watchlists.map(watchlist => (
                <button 
                  key={watchlist._id}
                  className={`tab-btn ${activeWatchlist === watchlist._id ? 'active' : ''}`}
                  onClick={() => setActiveWatchlist(watchlist._id)}
                >
                  {watchlist.name}
                </button>
              ))}
            </div>
            
            {currentWatchlist && (
              <div className="watchlist-table-container">
                <div className="watchlist-table-header">
                  <h2>{currentWatchlist.name} Watchlist</h2>
                  <div className="watchlist-table-actions">
                    {showAddStock ? (
                      <form onSubmit={handleAddStock} className="add-stock-form">
                        <input 
                          type="text" 
                          placeholder="Enter stock symbol" 
                          value={newStockSymbol}
                          onChange={(e) => setNewStockSymbol(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Add</button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => setShowAddStock(false)}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowAddStock(true)}
                      >
                        Add Stock
                      </button>
                    )}
                  </div>
                </div>
                
                <table className="watchlist-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Name</th>
                      <th>Last Price</th>
                      <th>Change</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWatchlist.stocks.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No stocks in this watchlist. Add some stocks to get started.
                        </td>
                      </tr>
                    ) : (
                      currentWatchlist.stocks.map((stock) => (
                        <tr key={stock.symbol}>
                          <td>
                            <Link to={`/stocks/${stock.symbol}`} className="stock-symbol">{stock.symbol}</Link>
                          </td>
                          <td>{stock.name || stock.symbol}</td>
                          <td>$---.--</td>
                          <td>---%</td>
                          <td>
                            <div className="stock-actions">
                              <Link to={`/stocks/${stock.symbol}`}>
                                <button className="btn btn-sm btn-outline">View</button>
                              </Link>
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => initiateTradeAction(stock.symbol, 'buy')}
                              >
                                Buy
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveStock(stock.symbol)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      
      {showTradeModal && selectedStock && (
        <TradeModal 
          isOpen={showTradeModal}
          onClose={closeTradeModal}
          stock={selectedStock}
          action={tradeAction}
          holdings={portfolio?.holdings || []}
        />
      )}
    </div>
  );
}

export default Watchlist;