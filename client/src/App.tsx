import { Switch, Route, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import SmartGuidance from '@/components/SmartGuidance';
import IABoard from '@/pages/CurisoOriginal';
import ProgressDemo from '@/pages/ProgressDemo';
import Downloads from '@/pages/Downloads';
import HighPerformanceAI from '@/pages/HighPerformanceAI';
import { IABoardProductionDashboard } from '@/components/IABoardProductionDashboard';
import { FixedSystemTester } from '@/components/FixedSystemTester';
import { YouTubeAnalyzer } from '@/components/YouTubeAnalyzer';
import RealAIModuleInterface from '@/components/RealAIModuleInterface';
import { LandingSimple as Landing } from '@/pages/LandingSimple';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Checkout } from '@/pages/Checkout';
import { Success } from '@/pages/Success';
import { NotFound } from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      },
    },
  },
});

export default function App() {
  const [location] = useLocation();
  
  const getCurrentContext = () => {
    if (location === '/board') return 'board';
    if (location === '/dashboard') return 'dashboard';
    if (location === '/progress') return 'progress';
    return 'landing';
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <Switch>
            {/* Landing and Auth Routes */}
            <Route path="/landing" component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/success" component={Success} />
            
            {/* Main Application Routes */}
            <Route path="/board" component={IABoard} />
            <Route path="/downloads" component={Downloads} />
            <Route path="/high-performance" component={HighPerformanceAI} />
            <Route path="/progress" component={ProgressDemo} />
            <Route path="/production" component={IABoardProductionDashboard} />
            <Route path="/tests" component={FixedSystemTester} />
            <Route path="/youtube" component={YouTubeAnalyzer} />
            <Route path="/ai-modules" component={RealAIModuleInterface} />
            
            {/* Default route - redirect to landing */}
            <Route path="/" component={Landing} />
            
            {/* 404 Handler */}
            <Route component={NotFound} />
          </Switch>
          <SmartGuidance 
            currentContext={getCurrentContext()}
            userLevel="beginner"
          />
          <Toaster />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}