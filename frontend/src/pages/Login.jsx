import '../styles/pages/Login.css';
import { Link, useNavigate } from "react-router-dom";
import api from '../services/api';
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Shield, Smartphone, Lock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

function Login() {
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState(""); // "" | "success" | "error" | "warning"
    const [msgIcon, setMsgIcon] = useState("");

    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [userData, setuserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimer, setLockTimer] = useState(0);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    // Field-level validation states
    const [mobileValid, setMobileValid] = useState(null); // null | true | false
    const [mobileTouched, setMobileTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const navigate = useNavigate();
    const passwordRef = useRef(null);
    const mobileRef = useRef(null);

    // ── Load remembered mobile number ──
    useEffect(() => {
        const saved = localStorage.getItem('smart_bank_remembered_mobile');
        if (saved) {
            setMobileNumber(saved);
            setRememberMe(true);
            setMobileValid(saved.length === 10);
            setMobileTouched(true);
        }
    }, []);

    // ── Lock timer countdown ──
    useEffect(() => {
        if (!isLocked) return;
        if (lockTimer <= 0) {
            setIsLocked(false);
            setFailedAttempts(0);
            return;
        }
        const timer = setInterval(() => {
            setLockTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [isLocked, lockTimer]);

    // ── Mobile number validation ──
    const handleMobileChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setMobileNumber(val);
        setMobileTouched(true);
        setMobileValid(val.length === 10);
        if (msg) { setMsg(""); setMsgType(""); }
    };

    // ── Password change ──
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordTouched(true);
        if (msg) { setMsg(""); setMsgType(""); }
    };

    // ── Show error with smart messages ──
    const showError = (message, icon = "❌", type = "error") => {
        setMsg(message);
        setMsgType(type);
        setMsgIcon(icon);
    };

    // ── Handle Login ──
    const handleLoginClick = async (e) => {
        e.preventDefault();

        if (isLocked) {
            showError(`⏳ Account temporarily locked. Try again in ${lockTimer}s.`, "🔒", "warning");
            return;
        }

        // ── Validate mobile number ──
        if (!mobileNumber || mobileNumber.length !== 10) {
            showError("⚠️ Invalid Mobile Number\nPlease enter a valid 10-digit number 📱", "⚠️", "error");
            mobileRef.current?.focus();
            return;
        }

        // ── Validate password ──
        if (!password) {
            showError("🔒 Password Required\nPlease enter your password to continue.", "🔒", "error");
            passwordRef.current?.focus();
            return;
        }

        setIsLoading(true);
        setMsg("");

        try {
            const response = await api.get(`/user/${mobileNumber}`);
            const user = response.data;

            // Password verification — compare with server data
            if (user.password && password !== user.password) {
                const newAttempts = failedAttempts + 1;
                setFailedAttempts(newAttempts);
                setIsLoading(false);

                if (newAttempts >= 5) {
                    setIsLocked(true);
                    setLockTimer(30);
                    showError("🚫 Account Locked\nToo many failed attempts. Please wait 30 seconds.", "🚫", "error");
                } else if (newAttempts >= 3) {
                    showError(`❌ Incorrect Password (${newAttempts}/5 attempts)\nHaving trouble? Reset your password or contact support.`, "❌", "warning");
                } else {
                    showError("❌ Incorrect Password\nThat doesn't match our records 🔒", "❌", "error");
                }
                return;
            }

            // ── SUCCESS ──
            setuserData(user);
            setFailedAttempts(0);

            // Save remember me
            if (rememberMe) {
                localStorage.setItem('smart_bank_remembered_mobile', mobileNumber);
            } else {
                localStorage.removeItem('smart_bank_remembered_mobile');
            }

            // Show success overlay
            setShowSuccessOverlay(true);
            setMsg("✅ Login Successful!\nWelcome back 👋");
            setMsgType("success");
            setMsgIcon("✅");
            setIsLoading(false);

        } catch (error) {
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            setIsLoading(false);

            if (error.response && error.response.status === 404) {
                showError("🚫 Account Not Found\nNo account linked to this number. Try a different number or create a new account.", "🚫", "error");
            } else if (newAttempts >= 3) {
                showError(`🚫 Login Failed (${newAttempts}/5 attempts)\nHaving trouble logging in?\n👉 Reset your password or contact support.`, "🚫", "warning");
            } else {
                showError("🚫 Login Failed\nMobile number or password is incorrect.", "🚫", "error");
            }
        }
    };

    // ── Time-based greeting ──
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
        if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
        return { text: 'Good Evening', emoji: '🌙' };
    };

    const greeting = getGreeting();

    return (
        <div className="fullscreen-wrapper">
            {/* ── Animated Background Orbs ── */}
            <div className="login-bg-orbs">
                <div className="login-orb orb-1" />
                <div className="login-orb orb-2" />
                <div className="login-orb orb-3" />
            </div>

            <div className="login-container">
                {/* ── Logo & Greeting ── */}
                <div className="logo-area">
                    <div className="login-logo-icon">
                        <Shield size={28} strokeWidth={2.5} />
                    </div>
                    <h2>{greeting.emoji} {greeting.text}</h2>
                    <p className="login-subtitle">Sign in to your Smart Digital Bank</p>
                </div>

                {/* ── Security Indicator ── */}
                <div className="security-badge">
                    <Lock size={13} />
                    <span>256-bit Encrypted Connection</span>
                </div>

                <form onSubmit={handleLoginClick} autoComplete="off">
                    {/* ── Mobile Number Input ── */}
                    <div className={`form-group ${mobileTouched ? (mobileValid ? 'valid' : 'invalid') : ''}`}>
                        <label htmlFor="login-mobile">
                            <Smartphone size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                            Mobile Number
                        </label>
                        <div className="input-wrapper">
                            <span className="input-prefix">+91</span>
                            <input
                                ref={mobileRef}
                                type="text"
                                inputMode="numeric"
                                id="login-mobile"
                                placeholder="9876543210"
                                maxLength="10"
                                value={mobileNumber}
                                onChange={handleMobileChange}
                                onBlur={() => setMobileTouched(true)}
                                disabled={isLocked || showSuccessOverlay}
                                className="prefixed-input"
                                required
                            />
                            {mobileTouched && (
                                <span className={`input-status-icon ${mobileValid ? 'valid' : 'invalid'}`}>
                                    {mobileValid ? <CheckCircle size={18} /> : mobileNumber.length > 0 ? <XCircle size={18} /> : null}
                                </span>
                            )}
                        </div>
                        {mobileTouched && !mobileValid && mobileNumber.length > 0 && (
                            <span className="field-hint error">Enter a valid 10-digit mobile number</span>
                        )}
                        {mobileTouched && mobileValid && (
                            <span className="field-hint success">✓ Valid number</span>
                        )}
                    </div>

                    {/* ── Password Input ── */}
                    <div className={`form-group ${passwordTouched && !password ? 'invalid' : ''}`}>
                        <label htmlFor="login-password">
                            <Lock size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                            Password / PIN
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                id="login-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => setPasswordTouched(true)}
                                disabled={isLocked || showSuccessOverlay}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* ── Remember Me & Forgot Password ── */}
                    <div className="login-options-row">
                        <label className="remember-me-label" htmlFor="remember-me">
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="remember-checkbox"
                            />
                            <span className="custom-checkbox">
                                {rememberMe && <CheckCircle size={14} />}
                            </span>
                            Remember Me
                        </label>
                        <button type="button" className="forgot-password-btn" onClick={() => {
                            showError("📧 Password reset link will be sent to your registered email.", "📧", "info");
                        }}>
                            Forgot Password?
                        </button>
                    </div>

                    {/* ── Message Display ── */}
                    {msg && (
                        <div className={`login-message ${msgType}`}>
                            <div className="login-message-content">
                                {msg.split('\n').map((line, i) => (
                                    <div key={i} className={i === 0 ? 'msg-title' : 'msg-subtitle'}>{line}</div>
                                ))}
                            </div>
                            {/* Retry guidance for failed attempts */}
                            {failedAttempts >= 2 && msgType !== 'success' && (
                                <div className="msg-actions">
                                    <button type="button" className="msg-action-btn" onClick={() => {
                                        setPassword('');
                                        passwordRef.current?.focus();
                                        setMsg('');
                                    }}>🔄 Retry</button>
                                    <button type="button" className="msg-action-btn outline" onClick={() => {
                                        showError("📧 Password reset link will be sent to your registered email.", "📧", "info");
                                    }}>🔑 Reset Password</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Lock Timer Display ── */}
                    {isLocked && (
                        <div className="lock-timer-display">
                            <div className="lock-timer-icon">🔒</div>
                            <div className="lock-timer-text">
                                <span>Account temporarily locked</span>
                                <span className="lock-countdown">{lockTimer}s remaining</span>
                            </div>
                            <div className="lock-timer-bar">
                                <div className="lock-timer-fill" style={{ width: `${(lockTimer / 30) * 100}%` }} />
                            </div>
                        </div>
                    )}

                    {/* ── Failed Attempts Indicator ── */}
                    {failedAttempts > 0 && failedAttempts < 5 && !isLocked && msgType !== 'success' && (
                        <div className="attempts-indicator">
                            <AlertTriangle size={14} />
                            <span>{failedAttempts}/5 attempts used</span>
                            <div className="attempts-dots">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`attempt-dot ${i < failedAttempts ? 'used' : ''}`} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Action Buttons ── */}
                    {showSuccessOverlay ? (
                        <div className="login-success-section">
                            <div className="success-checkmark">
                                <CheckCircle size={48} strokeWidth={2} />
                            </div>
                            <div className="success-welcome">
                                Welcome back, <strong>{userData?.name || 'User'}</strong>! 🎉
                            </div>
                            {userData && (
                                <div className="success-snapshot">
                                    <div className="snapshot-title">💰 Quick Snapshot</div>
                                    <div className="snapshot-item">
                                        <span>Name</span>
                                        <span>{userData.name}</span>
                                    </div>
                                    <div className="snapshot-item">
                                        <span>Mobile</span>
                                        <span>+91 {mobileNumber}</span>
                                    </div>
                                    <div className="snapshot-item">
                                        <span>Last Login</span>
                                        <span>Just now ✅</span>
                                    </div>
                                </div>
                            )}
                            <button
                                type="button"
                                className="login-continue-btn"
                                onClick={() => navigate("/dashboard", { state: userData })}
                            >
                                Continue to Dashboard →
                            </button>
                            <div className="success-quick-actions">
                                <button type="button" className="quick-nav-btn" onClick={() => navigate("/transactions", { state: userData })}>
                                    📜 Transactions
                                </button>
                                <button type="button" className="quick-nav-btn" onClick={() => navigate("/fund-transfer", { state: userData })}>
                                    💸 Transfer
                                </button>
                                <button type="button" className="quick-nav-btn" onClick={() => navigate("/smart-insights", { state: userData })}>
                                    🤖 Insights
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={isLoading || isLocked}
                        >
                            {isLoading ? (
                                <span className="login-loading">
                                    <span className="login-spinner" />
                                    Authenticating...
                                </span>
                            ) : (
                                <>
                                    <Shield size={18} />
                                    Secure Sign In
                                </>
                            )}
                        </button>
                    )}
                </form>

                {!showSuccessOverlay && (
                    <div className="footer">
                        <p>Don't have an account? <Link to="/signup">Create One</Link></p>
                        <p className="footer-security">
                            <Shield size={12} /> Protected by Smart Digital Bank Security
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login;