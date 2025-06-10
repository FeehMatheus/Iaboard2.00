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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showFurion, setShowFurion] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showFurionCanvas, setShowFurionCanvas] = useState(false);

  const handleOpenFurion = () => {
    setShowFurion(true);
  };

  const handleCloseFurion = () => {
    setShowFurion(false);
  };

  const handleOpenLogin = () => {
    setShowLogin(true);
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setShowLogin(false);
    setCurrentPage('dashboard');
  };

  const handleBackToHome = () => {
    setShowLogin(false);
    setCurrentPage('home');
  };

  const handleAccessPlatform = () => {
    setCurrentPage('dashboard');
  };

  const handleOpenFurionCanvas = () => {
    setShowFurionCanvas(true);
  };

  const handleCloseFurionCanvas = () => {
    setShowFurionCanvas(false);
  };

  // Se está na tela de login
  if (showLogin) {
    return (
      <div>
        <LoginPage onLogin={handleLogin} onBack={handleBackToHome} />
        <Toaster />
      </div>
    );
  }

  // Se está no canvas do Furion
  if (showFurionCanvas) {
    return (
      <div>
        <FurionCanvas onBack={handleCloseFurionCanvas} />
        <Toaster />
      </div>
    );
  }

  // Se está no dashboard
  if (currentPage === 'dashboard') {
    return (
      <div>
        <Dashboard user={currentUser} onOpenFurionCanvas={handleOpenFurionCanvas} />
        <Toaster />
      </div>
    );
  }

  // Página inicial
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