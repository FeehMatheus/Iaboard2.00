import { useState } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import MaquinaMilionaria from '@/pages/MaquinaMilionaria';
import Dashboard from '@/pages/Dashboard';
import FurionAI from '@/components/FurionAI';
import { useAuth } from '@/hooks/useAuth';

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

  const handleOpenFurion = () => {
    setShowFurion(true);
  };

  const handleCloseFurion = () => {
    setShowFurion(false);
  };

  const handleAccessPlatform = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Switch>
        <Route path="/">
          <MaquinaMilionaria 
            onOpenFurion={handleOpenFurion}
            onAccessPlatform={handleAccessPlatform}
          />
        </Route>
        
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                404 - Página não encontrada
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                A página que você está procurando não existe.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </Route>
      </Switch>

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