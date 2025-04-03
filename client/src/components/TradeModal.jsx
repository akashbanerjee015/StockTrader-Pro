import { useState, useEffect } from 'react';
import { buyStock, sellStock } from '../services/portfolioService';

function TradeModal({ isOpen, onClose, stock, action, holdings = [] }) {
  const [shares, setShares] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentHolding, setCurrentHolding] = useState(null);
  
  // Check if the user already has shares of this stock
  useEffect(() => {
    if (stock && holdings.length > 0) {
      const existing = holdings.find(h => h.symbol === stock.symbol);
      setCurrentHolding(existing || null);
    }
  }, [stock, holdings]);
  
  const resetForm = () => {
    setShares('');
    setOrderType('market');
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const validateForm = () => {
    setError(null);
    
    if (!shares || isNaN(shares) || parseInt(shares) <= 0) {
      setError('Please enter a valid number of shares');
      return false;
    }
    
    // For sell orders, make sure user has enough shares
    if (action === 'sell' && currentHolding) {
      if (parseInt(shares) > currentHolding.shares) {
        setError(`You only have ${currentHolding.shares} shares to sell`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleTrade = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const tradeData = {
        symbol: stock.symbol,
        name: stock.name,
        shares: parseInt(shares),
        price: stock.price
      };
      
      if (action === 'buy') {
        await buyStock(tradeData);
        setSuccess(`Successfully bought ${shares} shares of ${stock.symbol}`);
      } else {
        await sellStock(tradeData);
        setSuccess(`Successfully sold ${shares} shares of ${stock.symbol}`);
      }
      
      // Reset form after successful trade
      setShares('');
      
      // Give the user a moment to see the success message before closing
      setTimeout(() => {
        handleClose();
        window.location.reload(); // Refresh to show updated portfolio
      }, 2000);
      
    } catch (err) {
      setError(err.msg || `Failed to ${action} stock`);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{action === 'buy' ? 'Buy' : 'Sell'} {stock?.symbol}</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="modal-content">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="stock-info">
            <p className="stock-name">{stock?.name}</p>
            <p className="stock-price">Current Price: ${stock?.price.toFixed(2)}</p>
            {action === 'sell' && currentHolding && (
              <p className="holding-info">You currently own {currentHolding.shares} shares</p>
            )}
          </div>
          
          <div className="trade-form">
            <div className="form-group">
              <label htmlFor="shares">Number of Shares</label>
              <input 
                type="number" 
                id="shares" 
                value={shares} 
                onChange={(e) => setShares(e.target.value)}
                placeholder="Enter number of shares"
                min="1"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="orderType">Order Type</label>
              <select 
                id="orderType" 
                value={orderType} 
                onChange={(e) => setOrderType(e.target.value)}
                disabled={loading}
              >
                <option value="market">Market Order</option>
                <option value="limit" disabled>Limit Order</option>
                <option value="stop" disabled>Stop Order</option>
              </select>
              <p className="order-note">
                {orderType === 'market' ? 'Market orders execute immediately at the current price' : ''}
              </p>
            </div>
            
            {shares && stock && (
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Shares:</span>
                  <span>{shares}</span>
                </div>
                <div className="summary-row">
                  <span>Price per Share:</span>
                  <span>${stock.price.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Estimated Total:</span>
                  <span>${(parseInt(shares) * stock.price || 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className={`btn ${action === 'buy' ? 'btn-success' : 'btn-danger'}`} 
            onClick={handleTrade}
            disabled={loading}
          >
            {loading ? 'Processing...' : action === 'buy' ? 'Buy Shares' : 'Sell Shares'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TradeModal;