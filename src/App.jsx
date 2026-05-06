import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Auth from './pages/Auth'
import DashboardLayout from './pages/Dashboard/DashboardLayout'
import Overview from './pages/Dashboard/Overview'
import Posts from './pages/Dashboard/Posts'
import SentimentAnalytics from './pages/Dashboard/SentimentAnalytics'
import ConnectedAccounts from './pages/Dashboard/ConnectedAccounts'
import Reports from './pages/Dashboard/Reports'
import OAuthCallback from './pages/Dashboard/OAuthCallback'
import Plans from './pages/Dashboard/Plans'
import Profile from './pages/Dashboard/Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="posts" element={<Posts />} />
          <Route path="sentiment" element={<SentimentAnalytics />} />
          <Route path="accounts" element={<ConnectedAccounts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="plans" element={<Plans />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/oauth/:platform/callback" element={<OAuthCallback />} />
      </Routes>
    </Router>
  )
}

export default App
