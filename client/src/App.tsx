import { Switch, Route, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import SmartGuidance from '@/components/SmartGuidance';
import IABoard from '@/pages/CurisoOriginal';
import ProgressDemo from '@/pages/ProgressDemo';
import { IABoardProductionDashboard } from '@/components/IABoardProductionDashboard';
import { FixedSystemTester } from '@/components/FixedSystemTester';
import { YouTubeAnalyzer } from '@/components/YouTubeAnalyzer';

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
            <Route path="/" component={IABoard} />
            <Route path="/progress" component={ProgressDemo} />
            <Route path="/production" component={IABoardProductionDashboard} />
            <Route path="/tests" component={FixedSystemTester} />
            <Route path="/youtube" component={YouTubeAnalyzer} />
            <Route>
              <IABoard />
            </Route>
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