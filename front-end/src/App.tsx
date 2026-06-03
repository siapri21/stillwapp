import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { MainLayout } from './layouts/MainLayout.tsx'
import { Auth } from './pages/Auth.tsx'
import { Dashboard } from './pages/Dashboard.tsx'
import { Explore } from './pages/Explore.tsx'
import { Feed } from './pages/Feed.tsx'
import { Home } from './pages/Home.tsx'
import { Matching } from './pages/Matching.tsx'
import { Messages } from './pages/Messages.tsx'
import { Notifications } from './pages/Notifications.tsx'
import { Profile } from './pages/Profile.tsx'
import { Reviews } from './pages/Reviews.tsx'
import { Search } from './pages/Search.tsx'
import { SkillDetail } from './pages/SkillDetail.tsx'
import { Swap } from './pages/Swap.tsx'
import { UserProfile } from './pages/UserProfile.tsx'
import { ProtectedRoute } from './routes/ProtectedRoute.tsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/user/:userId" element={<UserProfile />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/matching" element={<Matching />} />
              <Route path="/planning" element={<Swap />} />
              <Route path="/swap" element={<Navigate to="/planning" replace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:conversationId" element={<Messages />} />
              <Route path="/reviews" element={<Reviews />} />
            </Route>
          </Route>

          <Route path="/explore/:id" element={<SkillDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
