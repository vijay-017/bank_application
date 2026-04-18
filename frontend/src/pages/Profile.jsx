import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/pages/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state || {}; // Get user from state
    console.log(user);

    const [activeTab, setActiveTab] = useState(location.state?.openBankTab ? 'banks' : 'personal');

    const [personalInfo, setPersonalInfo] = useState({
        firstName: user.name?.split(' ')[0] || 'Guest',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || 'guest@example.com',
        phone: user.mobileNumber || '',
        address: user.address || 'Address not set'
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const devices = [
        { id: 1, name: 'MacBook Pro', type: 'laptop', location: 'New York, USA', lastActive: 'Currently Active', current: true },
        { id: 2, name: 'iPhone 14 Pro', type: 'mobile', location: 'New York, USA', lastActive: '2 hours ago', current: false },
        { id: 3, name: 'iPad Air', type: 'tablet', location: 'Boston, USA', lastActive: 'Feb 5, 2026', current: false },
    ];

    const notificationSettings = [
        { id: 'trans_email', label: 'Transaction Emails', desc: 'Receive emails for every transaction.', checked: true },
        { id: 'trans_push', label: 'Transaction Push', desc: 'Receive push notifications for transactions.', checked: true },
        { id: 'sec_alert', label: 'Security Alerts', desc: 'Get notified about new logins and security changes.', checked: true },
        { id: 'offers', label: 'Marketing Offers', desc: 'Receive updates about new features and promos.', checked: false },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    // --- Bank Accounts Logic ---

    const [linkedAccounts, setLinkedAccounts] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [accountsError, setAccountsError] = useState(null);

    // State for Link New Bank Account section
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
    const [availableError, setAvailableError] = useState(null);
    const [selectedAccountsToLink, setSelectedAccountsToLink] = useState([]);
    const [isLinking, setIsLinking] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.mobileNumber) return;

            // Fetch Linked Accounts
            setIsLoadingAccounts(true);
            setAccountsError(null);
            try {
                const response = await api.get(`/linked-accounts/${user.mobileNumber}`);
                setLinkedAccounts(response.data || []);
            } catch (err) {
                console.error("Failed to fetch linked bank accounts:", err);
                setAccountsError("Failed to load linked bank accounts.");
            } finally {
                setIsLoadingAccounts(false);
            }

            // Fetch Available external accounts for linking
            setIsLoadingAvailable(true);
            setAvailableError(null);
            try {
                const response = await api.get(`/bank/${user.mobileNumber}`);
                setAvailableAccounts(response.data || []);
            } catch (err) {
                console.error("Failed to fetch available accounts:", err);
                setAvailableError("Failed to load available bank accounts.");
            } finally {
                setIsLoadingAvailable(false);
            }
        };

        if (activeTab === 'banks') {
            fetchData();
        }
    }, [activeTab, user?.mobileNumber]);

    const toggleAccountSelection = (accountNumber) => {
        setSelectedAccountsToLink(prev =>
            prev.includes(accountNumber)
                ? prev.filter(acc => acc !== accountNumber)
                : [...prev, accountNumber]
        );
    };

    const handleLinkAccounts = async () => {
        if (selectedAccountsToLink.length === 0) return;
        setIsLinking(true);

        const accountsToPayload = availableAccounts.filter(acc =>
            selectedAccountsToLink.includes(acc.accountNumber)
        );

        try {
            await api.post("/link-account", accountsToPayload);

            const response = await api.get(`/linked-accounts/${user.mobileNumber}`);
            setLinkedAccounts(response.data || []);

            setSelectedAccountsToLink([]);
            alert("Accounts successfully linked!");
        } catch (err) {
            console.error("Failed to link bank accounts:", err);
            alert("Failed to link bank accounts. Please try again.");
        } finally {
            setIsLinking(false);
        }
    };

    const handleRemoveBankAccount = async (accountId) => {
        if (window.confirm("Are you sure you want to unlink this bank account?")) {
            try {
                await api.post(`/unlink-account`, { accountId });
                // If it was primary, the backend will auto-assign a new one. Let's just refetch to be safe, or just filter.
                // It's safer to refetch to get the updated primary if one was deleted
                const response = await api.get(`/linked-accounts/${user.mobileNumber}`);
                setLinkedAccounts(response.data || []);
            } catch (err) {
                console.error("Failed to unlink bank account:", err);
                alert("Failed to unlink bank account. Please try again.");
            }
        }
    };

    const handleSetPrimary = async (accountId) => {
        try {
            await api.post("/set-primary-account", {
                mobileNumber: user.mobileNumber,
                accountId: accountId
            });
            setLinkedAccounts(linkedAccounts.map(acc => ({
                ...acc,
                isPrimary: acc.id === accountId
            })));
        } catch (err) {
            console.error("Failed to set primary account:", err);
            alert("Failed to set primary account. Please try again.");
        }
    };

    const renderBankAccounts = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Linked Accounts List */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
                <div className="section-header">
                    <h2>Linked Bank Accounts</h2>
                </div>
                {isLoadingAccounts ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Loading bank accounts...
                    </div>
                ) : accountsError ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        {accountsError}
                    </div>
                ) : linkedAccounts.length > 0 ? (
                    <div className="accounts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        {linkedAccounts.map(acc => (
                            <div key={acc.id} className="account-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: acc.isPrimary ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem' }}>🏦</div>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{acc.bankName}</h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>A/c: •••• {acc.accountNumber.slice(-4)}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>₹{acc.balance.toLocaleString()}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available Balance</span>
                                    
                                    {acc.isPrimary || linkedAccounts.length === 1 ? (
                                        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold' }}>
                                            Primary
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleSetPrimary(acc.id)}
                                            style={{ background: 'transparent', border: '1px solid var(--primary)', borderRadius: '4px', color: 'var(--primary)', fontSize: '0.7rem', cursor: 'pointer', padding: '2px 8px', marginTop: '5px' }}
                                        >
                                            Set as Primary
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleRemoveBankAccount(acc.id)}
                                        style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', padding: 0, marginTop: '8px' }}
                                    >
                                        Unlink
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No bank accounts linked to this mobile number.
                    </div>
                )}
            </div>

            {/* Available Bank Accounts for Linking */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
                <div className="section-header">
                    <h2>Link Bank Account</h2>
                </div>
                {isLoadingAvailable ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Fetching your accounts...
                    </div>
                ) : availableError ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                        {availableError}
                    </div>
                ) : availableAccounts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            We found the following accounts associated with your mobile number (+91 {user?.mobileNumber}).
                        </p>
                        <div className="available-accounts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {availableAccounts.map(acc => {
                                const isAlreadyLinked = linkedAccounts.some(linked => linked.accountNumber === acc.accountNumber);
                                const isSelected = selectedAccountsToLink.includes(acc.accountNumber);

                                return (
                                    <div
                                        key={acc.accountNumber}
                                        onClick={() => !isAlreadyLinked && toggleAccountSelection(acc.accountNumber)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '12px',
                                            border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            cursor: isAlreadyLinked ? 'not-allowed' : 'pointer',
                                            opacity: isAlreadyLinked ? 0.5 : 1,
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-secondary)'}`,
                                                background: isSelected ? 'var(--primary)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '0.5rem'
                                            }}>
                                                {isSelected && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{acc.bankName}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>A/c: •••• {acc.accountNumber.slice(-4)}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            {isAlreadyLinked ? (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>Already Linked</span>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select to Link</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className="btn-save"
                            onClick={handleLinkAccounts}
                            disabled={isLinking || selectedAccountsToLink.length === 0}
                            style={{
                                marginTop: '1rem',
                                opacity: (isLinking || selectedAccountsToLink.length === 0) ? 0.5 : 1,
                                cursor: (isLinking || selectedAccountsToLink.length === 0) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLinking ? 'Linking Accounts...' : `Link Selected Account${selectedAccountsToLink.length > 1 ? 's' : ''}`}
                        </button>
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No external bank accounts found for this mobile number.
                    </div>
                )}
            </div>
        </div>
    );

    const renderPersonal = () => (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div className="section-header">
                <h2>Personal Information</h2>
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" className="form-input" value={personalInfo.firstName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" className="form-input" value={personalInfo.lastName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" className="form-input" value={personalInfo.email} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" name="phone" className="form-input" value={personalInfo.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Address</label>
                    <input type="text" name="address" className="form-input" value={personalInfo.address} onChange={handleInputChange} />
                </div>
            </div>
            <button className="btn-save">Save Changes</button>
        </div>
    );

    const renderSecurity = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Password Change */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
                <div className="section-header">
                    <h2>Change Password</h2>
                </div>
                <div className="form-grid" style={{ maxWidth: '600px' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Current Password</label>
                        <input type="password" className="form-input" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" className="form-input" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-input" placeholder="••••••••" />
                    </div>
                </div>
                <button className="btn-save">Update Password</button>
            </div>

            {/* Manage Devices */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
                <div className="section-header">
                    <h2>Manage Devices</h2>
                </div>
                <div className="devices-list">
                    {devices.map(device => (
                        <div key={device.id} className="device-item">
                            <div className="device-info">
                                <div className="device-icon">
                                    {device.type === 'mobile' ? '📱' : device.type === 'laptop' ? '💻' : '📟'}
                                </div>
                                <div className="device-details">
                                    <h4>{device.name} {device.current && <span className="device-status">(This Device)</span>}</h4>
                                    <div className="device-meta">
                                        <span>{device.location}</span> • <span>{device.lastActive}</span>
                                    </div>
                                </div>
                            </div>
                            {!device.current && (
                                <button className="btn-logout" onClick={() => alert(`Logged out ${device.name}`)}>Logout</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div className="section-header">
                <h2>Notification Settings</h2>
            </div>
            <div className="settings-list">
                {notificationSettings.map(setting => (
                    <div key={setting.id} className="toggle-row">
                        <div className="toggle-label">
                            <h4>{setting.label}</h4>
                            <p>{setting.desc}</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" defaultChecked={setting.checked} />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="profile-container">
            {/* Sidebar */}
            <aside className="profile-sidebar">
                <div className="profile-card glass-panel">
                    <div className="profile-avatar">{personalInfo.firstName.charAt(0).toUpperCase()}</div>
                    <h3 className="profile-name">{personalInfo.firstName} {personalInfo.lastName}</h3>
                    <span className="profile-role">Premium User</span>
                </div>

                <div className="profile-nav glass-panel">
                    <div
                        className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        👤 Personal Details
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        🛡️ Security & Devices
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙️ Preferences
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'banks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('banks')}
                    >
                        🏦 Link Accounts
                    </div>
                </div>

                <div className="glass-panel" style={{ marginTop: '1rem', padding: '1rem' }}>
                    <button
                        className="btn-logout"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                        onClick={() => {
                            // Clear session/local storage here
                            localStorage.removeItem('userToken'); // Example
                            navigate('/login');
                        }}
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="profile-content">
                {activeTab === 'personal' && renderPersonal()}
                {activeTab === 'security' && renderSecurity()}
                {activeTab === 'settings' && renderSettings()}
                {activeTab === 'banks' && renderBankAccounts()}
            </main>
        </div>
    );
};

export default Profile;
