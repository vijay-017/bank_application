import '../styles/pages/Signup.css';
import { Link, useNavigate } from "react-router-dom";
import api from '../services/api';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
function Signup() {

    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState(""); // "" | "success" | "error"
    const [userData, setUserData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const phoneNo = e.target.phone.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirm.value;

        // Validation logic
        if (phoneNo.length !== 10) {
            setMsg("Mobile number must be exactly 10 digits.");
            setMsgType("error");
            return;
        }

        if (password.length < 8) {
            setMsg("Password must be at least 8 characters long.");
            setMsgType("error");
            return;
        }

        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
            setMsg("Password must contain at least one special character.");
            setMsgType("error");
            return;
        }

        if (password !== confirmPassword) {
            setMsg("Passwords do not match.");
            setMsgType("error");
            return;
        }

        api.post("/user", {
            name,
            email,
            mobileNumber: phoneNo,
            password
        }).then(response => {
            setMsgType("success");
            setMsg(response.data.message || "Signup successful! Welcome.");

            // Construct a robust user object for the dashboard
            const createdUser = response.data.user || response.data;
            if (typeof createdUser === 'object' && createdUser !== null) {
                setUserData({
                    name: name,
                    email: email,
                    phoneNo: phoneNo,
                    ...createdUser
                });
            } else {
                setUserData({ name, email, phoneNo });
            }
        }).catch(error => {
            console.log(error);
            setMsg("Signup failed. Please try again.");
            setMsgType("error");
        })
    }
    return (
        <div className="fullscreen-wrapper">
            <div className="signup-container">
                <div className="logo-area">
                    <h2>Create Account</h2>
                </div>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" placeholder="John Doe" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" placeholder="name@example.com  (Optional)" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Mobile Number</label>
                        <input type="text" inputMode="numeric" id="phone" name="phone" placeholder="9876543210 (Mandatory)" 
                            maxLength="10"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Create a password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm"
                                placeholder="Confirm password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {msg && (
                        <div className={`signup-message ${msgType}`}>
                            {msg}
                        </div>
                    )}

                    {msgType === "success" ? (
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard", { state: userData })}
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                        >
                            Continue to Dashboard
                        </button>
                    ) : (
                        <button type="submit">Sign Up</button>
                    )}


                </form>

                <div className="footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup;