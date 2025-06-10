import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import MaquinaMilionariaLanding from '@/pages/MaquinaMilionariaLanding';
import FurionAI from '@/pages/FurionAI';
import Checkout from '@/pages/Checkout';
import MaquinaMilionaria from '@/pages/MaquinaMilionaria';

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
      <div className="min-h-screen bg-black">
        <Switch>
          <Route path="/" component={MaquinaMilionariaLanding} />
          <Route path="/furion-ai" component={FurionAI} />
          <Route path="/furion-access" component={FurionAI} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/maquina-milionaria" component={MaquinaMilionaria} />
          <Route>
            <MaquinaMilionariaLanding />
          </Route>
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}