import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import SmartGuidanceProvider from '@/components/SmartGuidanceProvider';
import TooltipGuidanceSystem from '@/components/TooltipGuidanceSystem';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Board from '@/pages/Board';

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
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <SmartGuidanceProvider>
          <div className="min-h-screen bg-gray-900">
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/board" component={Board} />
              <Route>
                <Landing />
              </Route>
            </Switch>
            <TooltipGuidanceSystem 
              context="global" 
              userLevel="beginner" 
            />
            <Toaster />
          </div>
        </SmartGuidanceProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}