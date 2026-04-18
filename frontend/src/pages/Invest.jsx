import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/pages/Invest.css';

const Invest = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state || null;

    const investmentOptions = [
        {
            title: "Fixed Deposits (FD)",
            icon: "vault",
            description: "Invest a lump sum for a fixed period and earn guaranteed higher interest rates.",
            details: {
                "Min Amount": "₹10,000",
                "Lock-in": "7 Days - 10 Years",
                "Returns": "Up to 7.5% p.a."
            },
            example: "Invest ₹50,000 for 1 year and get ₹53,750 on maturity."
        },
        {
            title: "Recurring Deposits (RD)",
            icon: "calendar",
            description: "Save a fixed amount every month and build your savings steadily with high interest.",
            details: {
                "Monthly Min": "₹500",
                "Duration": "6 Months - 10 Years",
                "Returns": "Up to 7.2% p.a."
            },
            example: "Pay ₹2,000 every month for 2 years."
        },
        {
            title: "Mutual Funds",
            icon: "trending_up",
            description: "Expertly managed funds to grow your wealth through SIP or one-time investments.",
            details: {
                "SIP Min": "₹500",
                "Type": "Equity, Debt, Hybrid",
                "Avg Returns": "12-15% p.a.*"
            },
            example: "Start a ₹5,000 SIP every month for long-term growth."
        },
        {
            title: "Pension Plans",
            icon: "elderly",
            description: "Secure your future with long-term retirement savings and regular monthly income.",
            details: {
                "Min Contrib": "₹1,000/month",
                "Tax Benefit": "Under Sec 80C",
                "Maturity": "At 60 Years"
            },
            example: "Contribute monthly to ensure a stress-free retirement."
        },
        {
            title: "ULIP Insurance",
            icon: "security",
            description: "A dual benefit plan that provides insurance coverage along with investment returns.",
            details: {
                "Premium": "Monthly/Yearly",
                "Cover": "Life Insurance",
                "Lock-in": "5 Years"
            },
            example: "Invest ₹5,000 monthly for life cover + market returns."
        }
    ];

    const icons = {
        vault: "🏦",
        calendar: "🔁",
        trending_up: "📈",
        elderly: "🧓",
        security: "🛡️"
    };

    return (
        <div className="invest-container">
            <header className="invest-header glass-panel">
                <button className="back-btn" onClick={() => navigate('/dashboard', { state: user })}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span className="back-text">Back to Dashboard</span>
                </button>
                <div className="header-center">
                    <h1>Wealth Builder</h1>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Secure your future with smart investments</span>
                </div>
                <div className="header-right"></div>
            </header>

            <div className="invest-hero">
                <div className="calculator-card">
                    <h3 className="card-title">🧮 Investment Calculator</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Curious about your future returns? Estimate your wealth growth based on current interest rates.
                    </p>
                    <button className="invest-btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Calculate Now
                    </button>
                </div>
                <div className="expert-picks-card">
                    <h3 className="card-title">⭐ Expert Picks</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Top-rated mutual funds and high-interest FD schemes handpicked for you.
                    </p>
                    <button className="invest-btn">View Top Schemes</button>
                </div>
            </div>

            <div className="invest-grid">
                {investmentOptions.map((option, idx) => (
                    <div key={idx} className="invest-card">
                        <div className="invest-icon">{icons[option.icon]}</div>
                        <div className="invest-info">
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                        </div>
                        <div className="invest-details">
                            {Object.entries(option.details).map(([label, value], dIdx) => (
                                <div key={dIdx} className="detail-item">
                                    <span className="detail-label">{label}</span>
                                    <span className="detail-value">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="invest-example" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--primary)', borderLeft: '2px solid var(--primary)', paddingLeft: '0.8rem' }}>
                            {option.example}
                        </div>
                        <button className="invest-btn">Invest Now</button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.6, fontSize: '0.8rem' }}>
                *Investment returns are subject to market risks. Please read all scheme related documents carefully before investing.
            </div>
        </div>
    );
};

export default Invest;
