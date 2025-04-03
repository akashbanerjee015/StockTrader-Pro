import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TradeModal from '../components/TradeModal';
import { getPortfolio, getTransactions } from '../services/portfolioService';
import { getStockDetails } from '../services/stockService';
import { AuthContext } from '../context/AuthContext';

function Portfolio() {
  const [portfolioView, setPortfolioView] = useState('holdings');
  const [portfolioData, setPortfolioData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAction, setTradeAction] = useState(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    loadPortfolioData();
  }, []);
  
  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const portfolio = await getPortfolio();
      
      // Process portfolio data to ensure consistent property names and defaults
      if (portfolio && portfolio.holdings) {
        // Map through holdings to normalize property names and add any missing properties
        portfolio.holdings = portfolio.holdings.map(holding => {
          // Calculate any missing values
          const shares = holding.shares || 0;
          const avgPrice = holding.averagePrice || holding.avgPrice || 0;
          const currentPrice = holding.currentPrice || avgPrice;
          const marketValue = shares * currentPrice;
          const unrealizedPL = holding.unrealizedPL !== undefined ? 
            holding.unrealizedPL : (marketValue - (shares * avgPrice));
          const plPercent = holding.plPercent !== undefined ? 
            holding.plPercent : (avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice * 100) : 0);
          
          return {
            ...holding,
            shares,
            avgPrice,
            averagePrice: avgPrice,
            currentPrice,
            marketValue,
            unrealizedPL,
            plPercent
          };
        });
      }
      
      setPortfolioData(portfolio);
      
      // Also fetch transactions
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
      
      setError(null);
    } catch (err) {
      setError(err.msg || 'Error loading portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const initiateTradeAction = async (symbol, action) => {
    try {
      // Get the latest stock data
      const stockData = await getStockDetails(symbol);
      setSelectedStock(stockData);
      setTradeAction(action);
      setShowTradeModal(true);
    } catch (err) {
      setError(err.msg || `Failed to get stock data for ${symbol}`);
    }
  };
  
  const closeTradeModal = () => {
    setShowTradeModal(false);
    setSelectedStock(null);
    setTradeAction(null);
    // Reload data after trade
    loadPortfolioData();
  };
  
  // Mock data for demonstration - we'll keep this for now until we integrate real data
  const portfolioSummary = {
    totalValue: 25632.48,
    cashBalance: 3850.75,
    totalReturn: 3245.87,
    totalReturnPercent: 14.5,
    dayChange: 235.78,
    dayChangePercent: 0.93
  };
  
  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgPrice: 155.30, currentPrice: 189.50, marketValue: 2842.50, unrealizedPL: 512.70, plPercent: 21.98, allocation: 13.03 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 10, avgPrice: 320.15, currentPrice: 385.20, marketValue: 3852.00, unrealizedPL: 650.50, plPercent: 20.31, allocation: 17.67 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, avgPrice: 125.45, currentPrice: 142.30, marketValue: 1138.40, unrealizedPL: 134.80, plPercent: 13.43, allocation: 5.22 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 12, avgPrice: 140.25, currentPrice: 157.80, marketValue: 1893.60, unrealizedPL: 210.60, plPercent: 12.51, allocation: 8.69 },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 20, avgPrice: 190.75, currentPrice: 224.60, marketValue: 4492.00, unrealizedPL: 677.00, plPercent: 17.74, allocation: 20.61 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', shares: 25, avgPrice: 160.30, currentPrice: 157.50, marketValue: 3937.50, unrealizedPL: -70.00, plPercent: -1.75, allocation: 18.06 },
    { symbol: 'PG', name: 'Procter & Gamble', shares: 18, avgPrice: 145.70, currentPrice: 152.90, marketValue: 2752.20, unrealizedPL: 129.60, plPercent: 4.94, allocation: 12.62 },
    { symbol: 'V', name: 'Visa Inc.', shares: 7, avgPrice: 220.50, currentPrice: 260.30, marketValue: 1822.10, unrealizedPL: 278.60, plPercent: 18.03, allocation: 8.36 }
  ];
  
  // Better fallback handling for displayHoldings

  // Use real data or mock data
  const displayHoldings = (portfolioData && portfolioData.holdings && portfolioData.holdings.length > 0) 
    ? portfolioData.holdings 
    : holdings;

  return (
    <div className="portfolio-container">
      <Navbar />
      
      <div className="portfolio-content">
        <div className="portfolio-header">
          <h1>Portfolio</h1>
          <div className="portfolio-overview">
            <div className="overview-item total-value">
              <h3>Total Value</h3>
              <p className="value">${portfolioSummary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="sub-value">
                <span className={portfolioSummary.dayChange >= 0 ? 'up' : 'down'}>
                  {portfolioSummary.dayChange >= 0 ? '+' : ''}${portfolioSummary.dayChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({portfolioSummary.dayChangePercent}%) Today
                </span>
              </p>
            </div>
            <div className="overview-item">
              <h3>Cash Balance</h3>
              <p className="value">${(user?.cashBalance || portfolioSummary.cashBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="overview-item">
              <h3>Total Return</h3>
              <p className={`value ${portfolioSummary.totalReturn >= 0 ? 'up' : 'down'}`}>
                {portfolioSummary.totalReturn >= 0 ? '+' : '-'}${Math.abs(portfolioSummary.totalReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="sub-value">
                <span className={portfolioSummary.totalReturnPercent >= 0 ? 'up' : 'down'}>
                  {portfolioSummary.totalReturnPercent >= 0 ? '+' : '-'}{Math.abs(portfolioSummary.totalReturnPercent)}%
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading portfolio data...</div>
        ) : (
          <>
            <div className="portfolio-tabs">
              <button 
                className={`tab-btn ${portfolioView === 'holdings' ? 'active' : ''}`}
                onClick={() => setPortfolioView('holdings')}
              >
                Holdings
              </button>
              <button 
                className={`tab-btn ${portfolioView === 'transactions' ? 'active' : ''}`}
                onClick={() => setPortfolioView('transactions')}
              >
                Transactions
              </button>
            </div>
            
            <div className="portfolio-tab-content">
              {portfolioView === 'holdings' && (
                <div className="holdings-view">
                  <table className="holdings-table">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Name</th>
                        <th>Shares</th>
                        <th>Avg Price</th>
                        <th>Current Price</th>
                        <th>Market Value</th>
                        <th>Unrealized P/L</th>
                        <th>% P/L</th>
                        <th>Allocation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayHoldings.map((holding) => (
                        <tr key={holding.symbol}>
                          <td>
                            <Link to={`/stocks/${holding.symbol}`} className="stock-symbol">{holding.symbol}</Link>
                          </td>
                          <td>{holding.name || 'Unknown'}</td>
                          <td>{holding.shares || 0}</td>
                          <td>${(holding.averagePrice || holding.avgPrice || 0).toFixed(2)}</td>
                          <td>${(holding.currentPrice || holding.avgPrice || 0).toFixed(2)}</td>
                          <td>${((holding.shares || 0) * (holding.currentPrice || holding.avgPrice || 0)).toFixed(2)}</td>
                          <td className={((holding.unrealizedPL || 0) >= 0) ? 'up' : 'down'}>
                            {(holding.unrealizedPL !== undefined && holding.unrealizedPL !== null) ? 
                              `${(holding.unrealizedPL >= 0) ? '+' : '-'}$${Math.abs(holding.unrealizedPL).toFixed(2)}` : 
                              'N/A'}
                          </td>
                          <td className={((holding.plPercent || 0) >= 0) ? 'up' : 'down'}>
                            {(holding.plPercent !== undefined && holding.plPercent !== null) ? 
                              `${(holding.plPercent >= 0) ? '+' : '-'}${Math.abs(holding.plPercent).toFixed(2)}%` : 
                              'N/A'}
                          </td>
                          <td>{(holding.allocation !== undefined && holding.allocation !== null) ? 
                            holding.allocation.toFixed(2) : 'N/A'}%</td>
                          <td>
                            <div className="holding-actions">
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => initiateTradeAction(holding.symbol, 'buy')}
                              >
                                Buy
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => initiateTradeAction(holding.symbol, 'sell')}
                              >
                                Sell
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {portfolioView === 'transactions' && (
                <div className="transactions-view">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Symbol</th>
                        <th>Shares</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">No transactions found.</td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => (
                          <tr key={transaction._id || transaction.id || Math.random()}>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td className={transaction.type === 'Buy' ? 'buy' : 'sell'}>{transaction.type}</td>
                            <td>
                              <Link to={`/stocks/${transaction.symbol}`} className="stock-symbol">{transaction.symbol}</Link>
                            </td>
                            <td>{transaction.shares}</td>
                            <td>${(transaction.price || 0).toFixed(2)}</td>
                            <td>${(transaction.amount || 0).toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {showTradeModal && selectedStock && (
        <TradeModal 
          isOpen={showTradeModal}
          onClose={closeTradeModal}
          stock={selectedStock}
          action={tradeAction}
          holdings={displayHoldings}
        />
      )}
    </div>
  );
}

export default Portfolio;