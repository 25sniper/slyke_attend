

import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import Layout from './components/Layout';
import Home from './pages/Home';

// Lazy load other pages
const AddSubject = lazy(() => import('./pages/AddSubject'));
const SubjectDetail = lazy(() => import('./pages/SubjectDetail'));
const EditSubject = lazy(() => import('./pages/EditSubject'));
const MarkHours = lazy(() => import('./pages/MarkHours'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const startTime = window.performance.now();
    console.log('App Mounted at:', startTime);

    // Hide splash screen when app is mounted
    const hideSplash = async () => {
      await SplashScreen.hide();
      console.log('Splash hidden at:', window.performance.now());
    };
    hideSplash();

    CapacitorApp.addListener('backButton', () => {
      if (location.pathname === '/') {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [navigate]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="add" element={<AddSubject />} />
          <Route path="subject/:id" element={<SubjectDetail />} />
          <Route path="subject/:id/edit" element={<EditSubject />} />
          <Route path="subject/:id/mark" element={<MarkHours />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
