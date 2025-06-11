import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { RenderStyleInfiniteBoard } from '@/components/ui/render-style-infinite-board';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
          <Switch>
            <Route path="/" component={RenderStyleInfiniteBoard} />
            <Route path="/board" component={RenderStyleInfiniteBoard} />
            <Route>
              {/* 404 - redirect to main board */}
              <RenderStyleInfiniteBoard />
            </Route>
          </Switch>
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;