import React from 'react';
import { ContentCreationOrchestrator } from '@/components/ContentCreationOrchestrator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Video, FileText, BarChart3, Sparkles } from 'lucide-react';

export function ProgressDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Visualização Dinâmica de Progresso
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Acompanhe em tempo real o processo de criação de conteúdo com IA, desde a análise inicial até a entrega final.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Criação de Vídeo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Geração de vídeos profissionais com IA, incluindo roteiro, produção e pós-processamento.
                </p>
                <div className="flex justify-center mt-3">
                  <Badge variant="secondary">5-8 etapas</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Copy & Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Desenvolvimento de textos persuasivos, headlines e materiais de marketing.
                </p>
                <div className="flex justify-center mt-3">
                  <Badge variant="secondary">3-6 etapas</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Análise Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Pesquisa de mercado, análise de concorrentes e estratégias de posicionamento.
                </p>
                <div className="flex justify-center mt-3">
                  <Badge variant="secondary">4-7 etapas</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Features */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Recursos da Visualização de Progresso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm">Tempo Real</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Acompanhe cada etapa conforme ela acontece
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Estimativas Precisas</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Tempo restante calculado dinamicamente
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Recuperação de Erros</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Reexecução automática de etapas falhadas
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Metadata Rica</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Informações detalhadas sobre cada processo
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Orchestrator */}
          <ContentCreationOrchestrator />

          {/* Technical Details */}
          <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Detalhes Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Integrações de IA</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• OpenAI GPT-4o para geração de texto</li>
                    <li>• Stability AI para criação de vídeos</li>
                    <li>• Mistral para análises especializadas</li>
                    <li>• Sistema multi-provider para redundância</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Recursos de Monitoramento</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Tracking de tempo por etapa</li>
                    <li>• Contagem de tokens utilizados</li>
                    <li>• Métricas de performance em tempo real</li>
                    <li>• Logs detalhados para debugging</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

export default ProgressDemo;