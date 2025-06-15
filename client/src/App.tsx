import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Route, Switch } from "wouter";
import "./index.css";
import Landing from "./pages/Landing";
import Board from "./pages/Board";
import AdvancedBoard from "./pages/AdvancedBoard";
import SupremeFurionDashboard from "./pages/SupremeFurionDashboard";
import InfiniteCanvasPage from "./pages/InfiniteCanvasPage";
import IABoardSupremePage from "./pages/IABoardSupremePage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,122,122,0.3),_transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(147,51,234,0.2),_transparent_50%)] pointer-events-none" />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10">
          <Switch>
            <Route path="/" component={SupremeFurionDashboard} />
            <Route path="/landing" component={Landing} />
            <Route path="/board" component={Board} />
            <Route path="/advanced-board" component={AdvancedBoard} />
            <Route path="/supreme" component={SupremeFurionDashboard} />
            <Route path="/canvas" component={InfiniteCanvasPage} />
            <Route path="/ia-board-supreme" component={IABoardSupremePage} />
            <Route>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    404 - Página não encontrada
                  </h1>
                  <a 
                    href="/" 
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-semibold"
                  >
                    ← Voltar ao IA Board
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;