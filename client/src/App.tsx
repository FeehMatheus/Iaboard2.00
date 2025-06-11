import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Landing from '@/pages/Landing';
import PostLoginDashboard from '@/pages/PostLoginDashboard';
import { RenderStyleInfiniteBoard } from '@/components/ui/render-style-infinite-board';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

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
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900">
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={PostLoginDashboard} />
            <Route path="/board" component={() => <RenderStyleInfiniteBoard />} />
            <Route>
              <Landing />
            </Route>
          </Switch>
          <Toaster />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}