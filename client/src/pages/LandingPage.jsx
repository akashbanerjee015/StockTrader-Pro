import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function LandingPage() {
  return (
    <div className="stock-app">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-content">
          <h2>Trade Smarter, Not Harder</h2>
          <p>Real-time data, advanced analytics, and commission-free trading all in one platform.</p>
          <Link to="/register">
            <button className="btn btn-cta">Start Trading Now</button>
          </Link>
        </div>
        <div className="hero-image">
          <div className="chart-placeholder">
            <div className="chart-line"></div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>Powerful Trading Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Data</h3>
            <p>Get instant access to market data from global exchanges.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Trading</h3>
            <p>Trade from anywhere with our responsive platform.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Analytics</h3>
            <p>Make informed decisions with our analytical tools.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Platform</h3>
            <p>Your investments are protected with bank-level security.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <h2>Simple, Transparent Pricing</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Basic</h3>
            <div className="price">$0<span>/month</span></div>
            <ul>
              <li>Commission-free stock trading</li>
              <li>Basic market data</li>
              <li>Standard charts</li>
              <li>Mobile access</li>
            </ul>
            <Link to="/register">
              <button className="btn btn-outline">Get Started</button>
            </Link>
          </div>
          <div className="pricing-card highlighted">
            <div className="popular-tag">Most Popular</div>
            <h3>Pro</h3>
            <div className="price">$19<span>/month</span></div>
            <ul>
              <li>Everything in Basic</li>
              <li>Real-time advanced data</li>
              <li>Technical indicators</li>
              <li>Portfolio analysis</li>
              <li>Priority support</li>
            </ul>
            <Link to="/register">
              <button className="btn btn-primary">Get Started</button>
            </Link>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">$49<span>/month</span></div>
            <ul>
              <li>Everything in Pro</li>
              <li>API access</li>
              <li>Custom analytics</li>
              <li>Dedicated account manager</li>
              <li>White-glove support</li>
            </ul>
            <Link to="/register">
              <button className="btn btn-outline">Contact Sales</button>
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="testimonials-section">
        <h2>What Our Traders Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"StockTrader Pro has completely transformed my trading experience. The platform is intuitive and the data is reliable."</p>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <h4>John Doe</h4>
                <p>Day Trader, 2 years</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"I've tried many platforms, but the analytics tools here are unmatched. I can make decisions faster and with more confidence."</p>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div className="author-info">
                <h4>Jane Smith</h4>
                <p>Investor, 5 years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Trading?</h2>
          <p>Join thousands of traders who have already discovered the StockTrader Pro advantage.</p>
          <Link to="/register">
            <button className="btn btn-cta">Create Free Account</button>
          </Link>
        </div>
      </section>

      <footer className="app-footer">
        <div className="footer-grid">
          <div className="footer-column">
            <h3>StockTrader Pro</h3>
            <p>Making stock trading accessible, affordable, and intuitive for everyone.</p>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#community">Community</a></li>
              <li><a href="#webinars">Webinars</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 StockTrader Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage