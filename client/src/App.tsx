import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import SupremaLanding from "@/pages/suprema-landing";
import SuperiorLanding from "@/pages/superior-landing";
import MaquinaMilionariaPage from "@/pages/maquina-milionaria";
import Dashboard from "@/pages/dashboard";
import AIDashboard from "@/pages/ai-dashboard";
import Home from "@/pages/home";
import CanvasPage from "@/pages/canvas";
import CompetitorAnalysisPage from "@/pages/competitor-analysis";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Dashboard /> : <MaquinaMilionariaPage />}
      </Route>
      <Route path="/landing" component={Landing} />
      <Route path="/suprema" component={SupremaLanding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ai" component={AIDashboard} />
      <Route path="/canvas" component={CanvasPage} />
      <Route path="/funnel" component={Home} />
      <Route path="/superior" component={SuperiorLanding} />
      <Route path="/maquina-milionaria" component={MaquinaMilionariaPage} />
      <Route path="/competitor-analysis" component={CompetitorAnalysisPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
