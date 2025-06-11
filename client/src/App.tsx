import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import HomeEnhanced from '@/pages/HomeEnhanced';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AIPlatformFixed from '@/pages/AIPlatformFixed';
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
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Switch>
          <Route path="/" component={HomeEnhanced} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={PostLoginDashboard} />
          <Route path="/platform" component={AIPlatformFixed} />
          <Route path="/supreme" component={SupremeDashboard} />
          <Route path="/checkout" component={Checkout} />
          <Route>
            <HomeEnhanced />
          </Route>
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}