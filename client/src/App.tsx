import { useState } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import MaquinaMilionaria from '@/pages/MaquinaMilionaria';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import FurionAI from '@/components/FurionAI';
import FurionCanvas from '@/pages/FurionCanvas';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [showFurion, setShowFurion] = useState(false);
  const [showFurionCanvas, setShowFurionCanvas] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'dashboard'>('home');
  const [user, setUser] = useState<any>(null);

  const handleOpenFurion = () => {
    setShowFurion(true);
  };

  const handleCloseFurion = () => {
    setShowFurion(false);
  };

  const handleOpenLogin = () => {
    setCurrentPage('login');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleAccessPlatform = () => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
  };

  const handleOpenFurionCanvas = () => {
    setShowFurionCanvas(true);
  };

  const handleCloseFurionCanvas = () => {
    setShowFurionCanvas(false);
  };

  if (currentPage === 'login') {
    return (
      <div>
        <LoginPage 
          onLogin={handleLogin}
          onBack={handleBackToHome}
        />
        <Toaster />
      </div>
    );
  }

  if (showFurionCanvas) {
    return (
      <div>
        <FurionCanvas onBack={handleCloseFurionCanvas} />
        <Toaster />
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <div>
        <Dashboard onOpenFurionCanvas={handleOpenFurionCanvas} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MaquinaMilionaria 
        onOpenFurion={handleOpenFurion}
        onAccessPlatform={handleAccessPlatform}
        onOpenLogin={handleOpenLogin}
      />

      {/* Furion AI Modal */}
      {showFurion && (
        <FurionAI onClose={handleCloseFurion} />
      )}

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}