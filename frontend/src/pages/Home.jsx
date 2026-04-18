import '../styles/pages/Home.css';
import { Link } from 'react-router-dom';

function Home() {


    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar glass-panel">
                <div className="logo">
                    <div className="logo-icon-small">SDB</div>
                    <span>Smart Digital Bank</span>
                </div>
                <ul className="nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
                <div className="auth-buttons">
                    <Link to="/login" className="btn-text">Login</Link>
                    <Link to="/signup" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <div className="badge">Next Gen Banking</div>
                    <h1>
                        Banking Made <span className="gradient-text">Simple</span> & <span className="gradient-text">Secure</span>
                    </h1>
                    <p className="subtitle">
                        Standard experience with modern technology.
                        Manage your finances with confidence using our intuitive and secure platform.
                    </p>
                    <div className="cta-group">
                        <Link to="/signup" className="btn-primary btn-large">Open Free Account</Link>
                        <button className="btn-secondary btn-large">Learn More</button>
                    </div>

                    <div className="stats-row">
                        <div className="stat">
                            <span className="stat-number">2M+</span>
                            <span className="stat-label">Active Users</span>
                        </div>
                        <div className="divider"></div>
                        <div className="stat">
                            <span className="stat-number">$10B+</span>
                            <span className="stat-label">Transactions</span>
                        </div>
                        <div className="divider"></div>
                        <div className="stat">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>Everything you need</h2>
                    <p>Powerful features to help you grow your wealth.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="icon-box blue">
                            <div className="icon-shape"></div>
                        </div>
                        <h3>Instant Transfers</h3>
                        <p>Send money to anyone, anywhere in the world instantly with zero fees.</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="icon-box purple">
                            <div className="icon-shape"></div>
                        </div>
                        <h3>Smart Savings</h3>
                        <p>Earn up to 5% APY with our automated savings pots and goal tracking.</p>
                    </div>

                    <div className="feature-card glass-panel">
                        <div className="icon-box pink">
                            <div className="icon-shape"></div>
                        </div>
                        <h3>Bank-Grade Security</h3>
                        <p>Your data is protected with 256-bit encryption and biometric authentication.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="cta-box glass-panel">
                    <h2>Ready to start your journey?</h2>
                    <p>Join millions of users who trust GMR Bank for their financial needs.</p>
                    <Link to="/signup" className="btn-primary btn-large">Create Account Now</Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>GMR Bank</h3>
                        <p>© 2026 GMR Bank. All rights reserved.</p>
                    </div>
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;