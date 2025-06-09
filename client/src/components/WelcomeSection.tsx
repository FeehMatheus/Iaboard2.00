import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  onStartClick: () => void;
}

export default function WelcomeSection({ onStartClick }: WelcomeSectionProps) {
  return (
    <div className="text-center mb-12 animate-slide-up">
      <h2 className="text-5xl font-bold mb-4">
        <span className="gradient-text">Plataforma Inteligente</span>
        <br />
        <span className="text-white">de Criação de Funis</span>
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
        Utilize múltiplas IAs (GPT, Claude, Gemini) para criar automaticamente um funil completo de vendas. 
        Fluxo estratégico de 8 etapas com conteúdo inteligente para cada fase.
      </p>
      
      <Button 
        onClick={onStartClick}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xl font-bold px-12 py-6 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 animate-pulse-glow"
      >
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6" />
          <span>Começar Produto Inteligente</span>
          <div className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
            Modo IA Total™
          </div>
        </div>
      </Button>
    </div>
  );
}
