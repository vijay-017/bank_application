import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/pages/FundTransfer.css';

const FundTransfer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state; 

    const [transferType, setTransferType] = useState('MOBILE'); // MOBILE, ACCOUNT, SELF
    const [linkedAccounts, setLinkedAccounts] = useState([]);
    const [fromAccountId, setFromAccountId] = useState('');
    
    // Dynamic fields
    const [toMobileNumber, setToMobileNumber] = useState('');
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    
    const [status, setStatus] = useState(null); // 'processing', 'success', null
    const [error, setError] = useState('');
    const [transactionDetails, setTransactionDetails] = useState(null);

    useEffect(() => {
        if (!user || !user.mobileNumber) {
            navigate('/');
            return;
        }
        
        // Fetch linked accounts
        api.get(`/linked-accounts/${user.mobileNumber}`)
            .then(res => {
                const accounts = res.data || [];
                setLinkedAccounts(accounts);
                
                const primary = accounts.find(acc => acc.isPrimary || acc.primaryAccount);
                if (primary) {
                    setFromAccountId(primary.id);
                } else if (accounts.length > 0) {
                    setFromAccountId(accounts[0].id);
                }
            })
            .catch(err => {
                console.error("Failed to load accounts", err);
                setError("Could not load your bank accounts.");
            });
    }, [user, navigate]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!fromAccountId) {
            setError('Please select an account to transfer from.');
            return;
        }
        if (amount <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }

        if (transferType === 'SELF' && fromAccountId.toString() === toAccountId.toString()) {
            setError('Cannot transfer to the same account.');
            return;
        }

        setStatus('confirm');
    };

    const confirmTransfer = async () => {
        setStatus('processing');

        const payload = {
            type: transferType,
            fromAccountId: parseInt(fromAccountId),
            toMobileNumber: transferType === 'MOBILE' ? toMobileNumber : null,
            toAccountNumber: transferType === 'ACCOUNT' ? toAccountNumber : null,
            toAccountId: transferType === 'SELF' ? parseInt(toAccountId) : null,
            amount: parseFloat(amount),
            category: remarks || 'Transfer'
        };

        try {
            const response = await api.post('/transactions/transfer', payload);
            setTransactionDetails({
                ...response.data,
                amount: payload.amount
            });
            setTimeout(() => setStatus('success'), 600); // Small delay for smooth transition
        } catch (err) {
            console.error("Transfer failed", err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Transfer failed. Check your balance or recipient details.');
            setStatus(null);
        }
    };

    const renderFormFields = () => {
        switch (transferType) {
            case 'MOBILE':
                return (
                    <div className="form-section">
                        <div className="form-group">
                            <label className="label">Recipient Mobile Number</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="Enter 10-digit mobile number" 
                                value={toMobileNumber}
                                onChange={e => setToMobileNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                );
            case 'ACCOUNT':
                return (
                    <div className="form-section">
                        <div className="form-group">
                            <label className="label">Beneficiary Account Number</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="Enter account number" 
                                value={toAccountNumber}
                                onChange={e => setToAccountNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                );
            case 'SELF':
                return (
                    <div className="form-section">
                        <div className="form-group">
                            <label className="label">To Account (My Accounts)</label>
                            <select 
                                className="select-field"
                                value={toAccountId}
                                onChange={e => setToAccountId(e.target.value)}
                                required
                            >
                                <option value="">Select Destination Account</option>
                                {linkedAccounts.filter(acc => acc.id.toString() !== fromAccountId.toString()).map(acc => (
                                    <option key={`to-${acc.id}`} value={acc.id}>
                                        {acc.bankName} - **** {acc.accountNumber?.slice(-4)}
                                    </option>
                                ))}
                            </select>
                            {linkedAccounts.length < 2 && (
                                <p style={{color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem'}}>
                                    You need at least 2 linked accounts for self transfer.
                                </p>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (status === 'confirm' || status === 'processing') {
        const fromAcc = linkedAccounts.find(a => a.id.toString() === fromAccountId.toString());
        const toDisplay = transferType === 'MOBILE' ? `Mobile: ${toMobileNumber}` : 
                          transferType === 'ACCOUNT' ? `A/c: ****${toAccountNumber.slice(-4)}` : 
                          `Self A/c: ****${linkedAccounts.find(a => a.id.toString() === toAccountId.toString())?.accountNumber?.slice(-4) || ''}`;

        return (
            <div className="transfer-container" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', animation: 'fadeIn 0.3s ease' }}>
                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', maxWidth: '450px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Confirm Transfer</h2>
                    
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Transfer Amount</span>
                            <strong style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>₹{parseFloat(amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '15px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>From Account</span>
                            <span style={{ fontWeight: '500' }}>**** {fromAcc?.accountNumber?.slice(-4)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>To Beneficiary</span>
                            <span style={{ fontWeight: '500' }}>{toDisplay}</span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-transfer" style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }} onClick={() => setStatus(null)} disabled={status === 'processing'}>
                            Cancel
                        </button>
                        <button className="btn-transfer" onClick={confirmTransfer} disabled={status === 'processing'}>
                            {status === 'processing' ? 'Processing...' : 'Confirm & Pay'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="transfer-container" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: '24px', maxWidth: '500px', animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem', color: '#10b981', animation: 'tada 1s ease-in-out' }}>✓</div>
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>Transfer Successful!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Your transaction of <strong style={{color: 'var(--text-primary)'}}>₹{parseFloat(transactionDetails?.amount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong> has been processed.
                    </p>
                    {transactionDetails?.updatedBalance !== undefined && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'inline-block' }}>
                            <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Updated Balance: </span>
                            <strong style={{ color: '#10b981', fontSize: '1.2rem' }}>₹{transactionDetails.updatedBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            className="btn-transfer"
                            style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                            onClick={() => navigate('/dashboard', { state: user })}
                        >
                            Back to Home
                        </button>
                        <button
                            className="btn-transfer"
                            onClick={() => { 
                                setStatus(null); 
                                setAmount(''); 
                                setToMobileNumber(''); 
                                setToAccountNumber('');
                                setToAccountId('');
                                setRemarks('');
                                setTransactionDetails(null);
                            }}
                        >
                            New Transfer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="transfer-container">
            <div className="transfer-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                    <button className="back-btn" onClick={() => navigate(-1)} style={{background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer'}}>
                        ←
                    </button>
                    <h1 style={{margin: 0}}>Pay & Transfer</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Send money securely.</p>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    {error}
                </div>
            )}

            {/* Transfer Type Tabs */}
            <div className="transfer-tabs">
                <div
                    className={`tab-item ${transferType === 'MOBILE' ? 'active' : ''}`}
                    onClick={() => { setTransferType('MOBILE'); setError(''); }}
                >
                    Mobile Number
                </div>
                <div
                    className={`tab-item ${transferType === 'ACCOUNT' ? 'active' : ''}`}
                    onClick={() => { setTransferType('ACCOUNT'); setError(''); }}
                >
                    Account No
                </div>
                <div
                    className={`tab-item ${transferType === 'SELF' ? 'active' : ''}`}
                    onClick={() => { setTransferType('SELF'); setError(''); }}
                >
                    Self Transfer
                </div>
            </div>

            <div className="transfer-form-card glass-panel">
                <form onSubmit={handleTransfer}>
                    {/* From Account - Always present */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label">From Account</label>
                        <select 
                            className="select-field"
                            value={fromAccountId}
                            onChange={e => setFromAccountId(e.target.value)}
                            required
                        >
                            {linkedAccounts.length === 0 && <option value="">No linked accounts</option>}
                            {linkedAccounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.bankName} - **** {acc.accountNumber?.slice(-4)} (Avl: ₹{acc.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2})})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Fields based on Type */}
                    {renderFormFields()}

                    {/* Amount & Remarks */}
                    <div className="form-section" style={{ marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label className="label">Amount</label>
                            <div className="amount-input-group">
                                <span className="currency-symbol">₹</span>
                                <input
                                    type="number"
                                    className="input-amount"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">Remarks / Note (Optional)</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="What is this for?" 
                                value={remarks}
                                onChange={e => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-transfer" disabled={status === 'processing' || linkedAccounts.length === 0}>
                        {status === 'processing' ? 'Processing...' : 'Proceed to Pay'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FundTransfer;
