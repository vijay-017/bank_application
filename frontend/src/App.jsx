import Login from './pages/Login.jsx'
import SmartInsights from './pages/SmartInsights.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AccountSummary from './pages/AccountSummary.jsx'
import TransactionHistory from './pages/TransactionHistory.jsx'
import Profile from './pages/Profile.jsx'
import FundTransfer from './pages/FundTransfer.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import PayBill from './pages/PayBill.jsx'
import Recharge from './pages/Recharge.jsx'
import Invest from './pages/Invest.jsx'
import BillPaymentForm from './pages/BillPaymentForm.jsx'
import EMIPlanner from './pages/EMIPlanner.jsx'
import BankingCompanion from './components/BankingCompanion.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import api from './services/api'
import { analyzeSpending } from './utils/spendingAnalyzer'


function App() {
  const location = useLocation();
  const user = location.state || null;

  // ── State for companion context ──
  const [primaryAccount, setPrimaryAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Fetch primary account & transactions for the companion
  useEffect(() => {
    if (!user?.mobileNumber) return;

    api.get(`/primary-account/${user.mobileNumber}`)
      .then(res => {
        if (res.status !== 204 && res.data) setPrimaryAccount(res.data);
      })
      .catch(() => { });

    api.get(`/transactions/${user.mobileNumber}`)
      .then(res => setTransactions(res.data || []))
      .catch(() => { });
  }, [user?.mobileNumber]);

  const spendingAnalysis = useMemo(() => {
    return analyzeSpending(transactions, user?.mobileNumber);
  }, [transactions, user?.mobileNumber]);

  // Only show companion on authenticated pages (not login/signup/home)
  const noCompanionPaths = ['/', '/login', '/signup'];
  const showCompanion = user && !noCompanionPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account-summary" element={<AccountSummary />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/fund-transfer" element={<FundTransfer />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/pay-bill" element={<PayBill />} />
        <Route path="/recharge" element={<Recharge />} />
        <Route path="/bill-payment" element={<BillPaymentForm />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/smart-insights" element={<SmartInsights />} />
        <Route path="/emi-planner" element={<EMIPlanner />} />
      </Routes>

      {/* 🤖 Smart Banking Companion — floats on authenticated pages */}
      {showCompanion && (
        <BankingCompanion
          user={user}
          primaryAccount={primaryAccount}
          spendingAnalysis={spendingAnalysis}
        />
      )}
    </>
  )
}

export default App;