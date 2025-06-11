import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { EnhancedThemeProvider } from '@/components/ui/enhanced-theme-provider';
import HomeSupreme from '@/pages/HomeSupreme';
import LoginSupremo from '@/pages/LoginSupremo';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AIPlatformFixed from '@/pages/AIPlatformFixed';
import CanvasInfinito from '@/pages/CanvasInfinito';
import Checkout from '@/pages/Checkout';
import PostLoginDashboard from '@/pages/PostLoginDashboard';
import { SupremeDashboard } from '@/components/ui/supreme-dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <EnhancedThemeProvider defaultTheme="supreme">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <Switch>
            <Route path="/" component={HomeSupreme} />
            <Route path="/login" component={LoginSupremo} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={PostLoginDashboard} />
            <Route path="/platform" component={AIPlatformFixed} />
            <Route path="/canvas" component={CanvasInfinito} />
            <Route path="/supreme" component={SupremeDashboard} />
            <Route path="/checkout" component={Checkout} />
            <Route>
              <HomeSupreme />
            </Route>
          </Switch>
          <Toaster />
        </div>
      </QueryClientProvider>
    </EnhancedThemeProvider>
  );
}