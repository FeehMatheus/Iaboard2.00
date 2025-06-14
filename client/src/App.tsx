import { Switch, Route, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import SmartGuidance from '@/components/SmartGuidance';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Board from '@/pages/Board';
import AdvancedBoard from '@/pages/AdvancedBoard';
import CurisoDashboard from '@/pages/CurisoDashboard';

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
    return 'landing';
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900">
          <Switch>
            <Route path="/" component={CurisoDashboard} />
            <Route path="/landing" component={Landing} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/board" component={Board} />
            <Route path="/advanced-board" component={AdvancedBoard} />
            <Route path="/curiso" component={CurisoDashboard} />
            <Route>
              <CurisoDashboard />
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