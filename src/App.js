import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';

// Import ALL our screens
import { Dashboard, AddRecipe } from './MainScreens';
import { SplashScreen, Login, Signup, EmailVerification, ForgotPassword, ResetPassword, RoleVerification } from './AuthScreens';
import { RecordVoice, UploadAudio, UploadPDF, AiProcessing, CulturalQuestions } from './UploadScreens';
import { RecipePreview, SubmissionSuccess } from './RecipeScreens';
import { RecipesList, CookingPrep, RecipeDetail } from './BrowseAndCookScreens';
import { CookingMode, CookingCompleted } from './CookingModeScreens';
import { Profile } from './ProfileScreen';
import { Settings } from './SettingsScreen'; 
import { AdminDashboard, RecipeModeration } from './AdminScreens';

const { Content, Footer } = Layout;

// --- Helper: Scroll to top on every route change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Custom Bottom Nav SVGs ---
const NavHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const NavBook = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const NavAdd = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const NavUser = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const NavShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hidden paths where the bottom nav should completely disappear
  const hiddenNavRoutes = [
    '/', '/login', '/signup', '/email-verification', '/forgot-password', 
    '/reset-password', '/role-verification', 
    '/ai-processing', '/cooking-mode', '/cooking-completed'
  ];
  
  if (hiddenNavRoutes.includes(location.pathname)) return null;

  // --- Dynamic Role Check ---
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = !!user.isAdmin;

  // Standard User Items (4 Tabs)
  const userItems = [
    { key: '/dashboard', icon: <NavHome />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Home</span> },
    { key: '/recipes', icon: <NavBook />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Recipes</span> },
    { key: '/add-recipe', icon: <NavAdd />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Add</span> },
    { key: '/profile', icon: <NavUser />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Profile</span> },
  ];

  // Admin Items (5 Tabs)
  const adminItems = [
    { key: '/dashboard', icon: <NavHome />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Home</span> },
    { key: '/recipes', icon: <NavBook />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Recipes</span> },
    { key: '/add-recipe', icon: <NavAdd />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Add</span> },
    { key: '/admin-dashboard', icon: <NavShield />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Admin</span> },
    { key: '/profile', icon: <NavUser />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Profile</span> },
  ];

  // Map sub-routes to parent tabs so the correct tab stays highlighted
  let selectedKey = location.pathname;
  if (selectedKey === '/recipe-moderation') selectedKey = '/admin-dashboard';

  return (
    <Footer style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '430px', padding: 0, zIndex: 1000, borderTop: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
      <style>
        {`
          .custom-bottom-nav .ant-menu-item-selected { color: #FF5238 !important; }
          .custom-bottom-nav .ant-menu-item-selected::after { border-bottom-color: transparent !important; }
          .custom-bottom-nav .ant-menu-item::after { border-bottom: none !important; }
          .custom-bottom-nav .ant-menu-item { flex: 1; color: #888; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; margin: 0 !important; }
          .custom-bottom-nav .ant-menu-title-content { margin-left: 0 !important; line-height: 1; }
        `}
      </style>
      <Menu 
        className="custom-bottom-nav"
        mode="horizontal" 
        style={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'none', height: '65px', alignItems: 'center' }}
        selectedKeys={[selectedKey]}
        onClick={({ key }) => navigate(key)}
        items={isAdmin ? adminItems : userItems} 
      />
    </Footer>
  );
};

// --- GLOBAL APP BOOT MANAGER (The "Theater Curtain") ---
const BootSplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start smoothly fading out the curtain at 2.2 seconds
    const fadeTimer = setTimeout(() => setOpacity(0), 2200);
    // Completely remove the curtain from the screen at 2.5 seconds
    const removeTimer = setTimeout(() => setVisible(false), 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', 
      top: 0, 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: '100%', 
      maxWidth: '430px', 
      height: '100vh',
      zIndex: 9999, 
      opacity: opacity,
      transition: 'opacity 0.3s ease-out',
      backgroundColor: '#FCF4F1'
    }}>
      <SplashScreen />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop /> 
      {/* The Global Overlay that runs on every refresh */}
      <BootSplashScreen /> 
      
      <Layout style={{ minHeight: '100vh', maxWidth: '430px', margin: '0 auto', border: '1px solid #f0f0f0', position: 'relative', overflowX: 'hidden' }}>
        <Content style={{ paddingBottom: '70px', background: '#FCF4F1' }}>
          <Routes>
            {/* --- Auth Flow --- */}
            <Route path="/" element={<Navigate to="/login" replace />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/role-verification" element={<RoleVerification />} />
            
            {/* --- User Hub --- */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipes" element={<RecipesList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} /> 
            
            {/* --- Documentation Flow --- */}
            <Route path="/voice-recording" element={<RecordVoice />} />
            <Route path="/upload-audio" element={<UploadAudio />} />
            <Route path="/upload-pdf" element={<UploadPDF />} />
            <Route path="/ai-processing" element={<AiProcessing />} />
            <Route path="/cultural-questions" element={<CulturalQuestions />} />
            <Route path="/recipe-preview" element={<RecipePreview />} />
            <Route path="/submission-success" element={<SubmissionSuccess />} />
            
            {/* --- Cooking Flow --- */}
            <Route path="/recipe-detail" element={<RecipeDetail />} /> 
            <Route path="/cooking-prep" element={<CookingPrep />} />
            <Route path="/cooking-mode" element={<CookingMode />} />
            <Route path="/cooking-completed" element={<CookingCompleted />} />

            {/* --- Admin Flow --- */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/recipe-moderation" element={<RecipeModeration />} />

            {/* --- 404 Catch-all --- */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Content>
        <BottomNav />
      </Layout>
    </Router>
  );
}