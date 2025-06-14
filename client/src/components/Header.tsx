import { Settings, Download, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/onboardingStore";

export default function Header() {
  const { setWizardOpen } = useOnboardingStore();

  const handleStartOnboarding = () => {
    setWizardOpen(true);
  };

  return (
    <header className="relative z-10 p-6">
      <nav className="glass-effect rounded-2xl p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 text-white">🧠</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">IA Board V2</h1>
              <p className="text-sm text-gray-300">by FILIPPE</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleStartOnboarding}
              className="glass-effect hover:bg-white/20 transition-all duration-300 text-white border-white/20"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Tutorial
            </Button>
            <Button 
              variant="ghost" 
              className="glass-effect hover:bg-white/20 transition-all duration-300 text-white border-white/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-white font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Funil
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
