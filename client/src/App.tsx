import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AIPlatformNew from '@/pages/AIPlatformNew';
import Checkout from '@/pages/Checkout';

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
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={AIPlatformNew} />
          <Route path="/platform" component={AIPlatformNew} />
          <Route path="/checkout" component={Checkout} />
          <Route>
            <Home />
          </Route>
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}