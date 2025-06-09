import { Brain, Zap, Sparkles, Star } from "lucide-react";

export default function AIStatusPanel() {
  return (
    <div className="glass-effect rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <span>IA Pensamento Poderoso™ (MPP)</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-semibold">Ativo</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-white mb-2">GPT-4o</h4>
          <p className="text-sm text-gray-300">Análise estratégica e criação de conteúdo</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-white mb-2">Claude Sonnet 4</h4>
          <p className="text-sm text-gray-300">Refinamento e otimização de textos</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-white mb-2">Gemini Pro</h4>
          <p className="text-sm text-gray-300">Análise de dados e insights avançados</p>
        </div>
      </div>
    </div>
  );
}
