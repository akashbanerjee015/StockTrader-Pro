import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import TradeModal from '../components/TradeModal';
import { getStockDetails, getStockNews, getStockChart } from '../services/stockService';
import { addStockToWatchlist, getWatchlists } from '../services/watchlistService';
import { getPortfolio } from '../services/portfolioService';
import { AuthContext } from '../context/AuthContext';

function StockDetails() {
  const { symbol } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [stockData, setStockData] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tradeAction, setTradeAction] = useState(null); // 'buy' or 'sell'
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    loadStockData();
    loadPortfolio();
  }, [symbol]);
  
  const loadStockData = async () => {
    try {
      setLoading(true);
      // Fetch stock details
      const data = await getStockDetails(symbol);
      setStockData(data);
      
      // Fetch stock news
      const news = await getStockNews(symbol);
      setNewsItems(news);
      
      // Fetch chart data (default to 1 month)
      const chart = await getStockChart(symbol, '1m');
      setChartData(chart);
      
      setError(null);
    } catch (err) {
      setError(err.msg || 'Error loading stock data');
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
  
  const handleAddToWatchlist = async () => {
    try {
      const watchlists = await getWatchlists();
      const defaultWatchlist = watchlists.find(w => w.name === 'Default') || watchlists[0];
      const watchlistId = defaultWatchlist._id;

      await addStockToWatchlist(
        watchlistId,
        symbol,
        stockData.name
      );
      alert('Stock added to watchlist');
    } catch (err) {
      setError(err.msg || 'Failed to add stock to watchlist');
      console.error(err);
    }
  };
  
  const openTradeModal = (action) => {
    setTradeAction(action);
    setShowTradeModal(true);
  };
  
  const closeTradeModal = () => {
    setShowTradeModal(false);
    setTradeAction(null);
  };
  
  // Mock data for demonstration - we'll keep this for fallback
  const mockStockData = {
    symbol: symbol,
    name: symbol === 'AAPL' ? 'Apple Inc.' : symbol === 'MSFT' ? 'Microsoft Corp.' : `${symbol} Corp.`,
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

  // Use actual data if available, otherwise fallback to mock data
  const displayData = stockData || mockStockData;

  return (
    <div className="stock-details-container">
      <Navbar />
      
      <div className="stock-details-content">
        {loading ? (
          <div className="loading">Loading stock data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="stock-header">
              <div className="stock-title">
                <h1>{displayData.symbol}</h1>
                <h2>{displayData.name}</h2>
              </div>
              <div className="stock-price">
                <h2>${displayData.price.toFixed(2)}</h2>
                <p className={parseFloat(displayData.change) > 0 ? 'up' : 'down'}>
                  {displayData.change} ({displayData.changePercent})
                </p>
              </div>
              <div className="stock-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => openTradeModal('buy')}
                >
                  Buy
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => openTradeModal('sell')}
                >
                  Sell
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={handleAddToWatchlist}
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
            
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-periods">
                  <button className="period-btn active">1D</button>
                  <button className="period-btn">1W</button>
                  <button className="period-btn">1M</button>
                  <button className="period-btn">3M</button>
                  <button className="period-btn">1Y</button>
                  <button className="period-btn">5Y</button>
                  <button className="period-btn">All</button>
                </div>
              </div>
              <div className="stock-chart">
                {/* In a real app, you would integrate a charting library here */}
                <div className="chart-placeholder">
                  <div className="chart-line"></div>
                  <p className="chart-note">Stock price chart for {displayData.symbol}</p>
                </div>
              </div>
            </div>
            
            <div className="stock-tabs">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
                  onClick={() => setActiveTab('news')}
                >
                  News
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'financials' ? 'active' : ''}`}
                  onClick={() => setActiveTab('financials')}
                >
                  Financials
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analysis')}
                >
                  Analysis
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="stock-stats">
                      <div className="stat-row">
                        <div className="stat-item">
                          <h4>Open</h4>
                          <p>${displayData.open.toFixed(2)}</p>
                        </div>
                        <div className="stat-item">
                          <h4>Previous Close</h4>
                          <p>${(displayData.price - parseFloat(displayData.change)).toFixed(2)}</p>
                        </div>
                        <div className="stat-item">
                          <h4>Volume</h4>
                          <p>{displayData.volume}</p>
                        </div>
                      </div>
                      <div className="stat-row">
                        <div className="stat-item">
                          <h4>Day's Range</h4>
                          <p>${displayData.low.toFixed(2)} - ${displayData.high.toFixed(2)}</p>
                        </div>
                        <div className="stat-item">
                          <h4>52 Week Range</h4>
                          <p>${displayData.fiftyTwoWeekLow.toFixed(2)} - ${displayData.fiftyTwoWeekHigh.toFixed(2)}</p>
                        </div>
                        <div className="stat-item">
                          <h4>Market Cap</h4>
                          <p>{displayData.marketCap}</p>
                        </div>
                      </div>
                      <div className="stat-row">
                        <div className="stat-item">
                          <h4>P/E Ratio</h4>
                          <p>{displayData.peRatio}</p>
                        </div>
                        <div className="stat-item">
                          <h4>Dividend Yield</h4>
                          <p>{displayData.dividendYield}</p>
                        </div>
                        <div className="stat-item">
                          <h4>EPS (TTM)</h4>
                          <p>${(displayData.price / displayData.peRatio).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="company-info">
                      <h3>About {displayData.name}</h3>
                      <p>
                        {displayData.name} is a leading technology company that designs, manufactures, and markets consumer electronics, 
                        software, and online services. The company was founded in the late 20th century and has grown to become 
                        one of the world's most valuable companies by market capitalization.
                      </p>
                      <p>
                        The company's main product lines include smartphones, personal computers, tablets, wearables, and accessories, 
                        along with a variety of services such as digital content stores, streaming services, and payment solutions.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'news' && (
                  <div className="news-tab">
                    <h3>Latest News</h3>
                    <div className="news-list">
                      {newsItems.length === 0 ? (
                        <p>No news available for this stock.</p>
                      ) : (
                        newsItems.map(item => (
                          <div key={item.id} className="news-item">
                            <h4>{item.title}</h4>
                            <div className="news-meta">
                              <span>{item.source}</span>
                              <span>•</span>
                              <span>{item.time}</span>
                            </div>
                            <p>{item.summary}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'financials' && (
                  <div className="financials-tab">
                    <h3>Financial Information</h3>
                    <p>Quarterly financial statements and annual reports would be displayed here.</p>
                  </div>
                )}
                
                {activeTab === 'analysis' && (
                  <div className="analysis-tab">
                    <h3>Analyst Recommendations</h3>
                    <p>Stock analysis, price targets, and recommendations would be displayed here.</p>
                  </div>
                )}
              </div>
            </div>
            
            {showTradeModal && (
              <TradeModal 
                isOpen={showTradeModal}
                onClose={closeTradeModal}
                stock={displayData}
                action={tradeAction}
                holdings={portfolio?.holdings || []}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StockDetails;