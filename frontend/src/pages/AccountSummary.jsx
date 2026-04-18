import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/pages/AccountSummary.css';

const AccountSummary = () => {
    const location = useLocation();
    const user = location.state || {}; // Get user from state

    // Mock Data
    const accountDetails = {
        accountHolder: user.name || "Guest",
        accountNumber: user.id || "4598 2300 1122 8899",
        accountType: user.accountType || "Savings Premium",
        status: user.status || "Active",
        currency: "INR",
        openDate: user.openDate || "Aug 15, 2023"
    };

    const branchDetails = {
        bankName: "TrustBank Global",
        branchName: "Downtown Financial Center",
        ifsc: "TBG0004521",
        swift: "TBGUS33",
        branchCode: "004521",
        address: "125 Financial District, New York, NY 10005"
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Copied: ${text}`);
    };

    return (
        <div className="summary-container">
            <div className="summary-header">
                <h1>Account Summary</h1>
                <p className="summary-subtitle">Overview of your primary banking account details.</p>
            </div>

            <div className="summary-grid">
                {/* Account Details Card */}
                <div className="detail-card glass-panel">
                    <div className="card-header">
                        <div className="card-icon">💼</div>
                        <h3 className="card-title">Account Details</h3>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Account Holder</span>
                        <span className="detail-value">{accountDetails.accountHolder}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Account Type</span>
                        <span className="detail-value">{accountDetails.accountType}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Account Number</span>
                        <div className="detail-value">
                            <span className="account-number-display">{accountDetails.accountNumber}</span>
                            <button
                                className="copy-btn"
                                onClick={() => handleCopy(accountDetails.accountNumber)}
                                title="Copy Account Number"
                            >
                                📋
                            </button>
                        </div>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Status</span>
                        <span className="detail-value status-badge status-active">{accountDetails.status}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Opening Date</span>
                        <span className="detail-value">{accountDetails.openDate}</span>
                    </div>
                </div>

                {/* Branch & Bank Details Card */}
                <div className="detail-card glass-panel">
                    <div className="card-header">
                        <div className="card-icon">🏛️</div>
                        <h3 className="card-title">Branch & Bank Info</h3>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Bank Name</span>
                        <span className="detail-value">{branchDetails.bankName}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Branch Name</span>
                        <span className="detail-value">{branchDetails.branchName}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">IFSC Code</span>
                        <div className="detail-value">
                            <span style={{ fontFamily: 'monospace' }}>{branchDetails.ifsc}</span>
                            <button
                                className="copy-btn"
                                onClick={() => handleCopy(branchDetails.ifsc)}
                                title="Copy IFSC"
                            >
                                📋
                            </button>
                        </div>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">SWIFT Code</span>
                        <span className="detail-value" style={{ fontFamily: 'monospace' }}>{branchDetails.swift}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Branch Address</span>
                        <span className="detail-value" style={{ maxWidth: '60%', lineHeight: '1.4' }}>
                            {branchDetails.address}
                        </span>
                    </div>
                </div>

                {/* Additional Info / Contact */}
                <div className="detail-card glass-panel" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header">
                        <div className="card-icon">📞</div>
                        <h3 className="card-title">Dedicated Support</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <p className="detail-label">Your Relationship Manager</p>
                            <p className="detail-value" style={{ fontSize: '1.1rem', marginTop: '4px' }}>Sarah Jenkins</p>
                        </div>
                        <div>
                            <p className="detail-label">Direct Line</p>
                            <p className="detail-value" style={{ marginTop: '4px' }}>+1 (800) 555-0199</p>
                        </div>
                        <div>
                            <p className="detail-label">Email Support</p>
                            <p className="detail-value" style={{ marginTop: '4px' }}>premium.support@trustbank.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSummary;
