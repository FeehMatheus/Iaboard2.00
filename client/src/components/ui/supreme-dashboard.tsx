import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Crown, Zap, Brain, TrendingUp, Target, Star,
  Rocket, Flame, Sparkles, Award, Eye, BarChart3
} from 'lucide-react';

interface QuantumMetrics {
  totalQuantumEnergy: number;
  averageDimensions: number;
  neuralConnections: number;
  fieldStrength: number;
  activeFrequencies: number;
  dimensionalStability: string;
  quantumCoherence: string;
}

interface AnalyticsData {
  user: {
    plan: string;
    credits: number;
    totalProjects: number;
  };
  quantumMetrics: QuantumMetrics;
  performance: {
    completedProjects: number;
    activeProjects: number;
    supremeProjects: number;
  };
  insights: string[];
}

export function SupremeDashboard() {
  const [quantumMode, setQuantumMode] = useState(false);
  const [supremeAIActive, setSupremeAIActive] = useState(false);
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery<{ analytics: AnalyticsData }>({
    queryKey: ['/api/analytics/advanced'],
    refetchInterval: 5000
  });

  const { data: quantumStatus } = useQuery({
    queryKey: ['/api/quantum/status'],
    refetchInterval: 3000,
    enabled: quantumMode
  });

  const activateQuantumMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/quantum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      setQuantumMode(true);
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/advanced'] });
    }
  });

  const generateSupremeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/supreme/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      setSupremeAIActive(true);
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/advanced'] });
    }
  });

  const createTrafficCampaignMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/traffic/supreme-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  });

  const handleQuantumActivation = () => {
    activateQuantumMutation.mutate({
      type: 'quantum-analysis',
      prompt: 'Ativar modo quântico supremo na plataforma',
      quantumLevel: 100,
      supremeMode: true,
      cosmicAlignment: true
    });
  };

  const handleSupremeGeneration = () => {
    generateSupremeMutation.mutate({
      type: 'copy',
      prompt: 'Criar copy supremo com múltiplas IAs',
      enhancementLevel: 'maximum'
    });
  };

  const handleTrafficCampaign = () => {
    createTrafficCampaignMutation.mutate({
      productType: 'Curso de Marketing Digital',
      targetAudience: 'Empreendedores digitais 25-45 anos',
      budget: 10000,
      goal: 'Maximizar conversões',
      platforms: ['meta', 'google', 'youtube'],
      supremeMode: true,
      quantumOptimization: true
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const data = analytics?.analytics;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Supremo</h1>
            <p className="text-gray-400">Controle total da Máquina Milionária</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
            {data?.user.plan.toUpperCase()} PLAN
          </Badge>
          <Badge className="bg-blue-600 text-white">
            {data?.user.credits} Créditos
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={handleQuantumActivation}
          disabled={activateQuantumMutation.isPending || quantumMode}
          className="h-16 bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {quantumMode ? 'Modo Quântico Ativo' : 'Ativar Modo Quântico'}
        </Button>

        <Button
          onClick={handleSupremeGeneration}
          disabled={generateSupremeMutation.isPending}
          className="h-16 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold"
        >
          <Crown className="w-5 h-5 mr-2" />
          Geração Suprema
        </Button>

        <Button
          onClick={handleTrafficCampaign}
          disabled={createTrafficCampaignMutation.isPending}
          className="h-16 bg-red-600 hover:bg-red-700 text-white font-bold"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Campanha Suprema
        </Button>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
          <TabsTrigger value="quantum" className="text-white">Quantum</TabsTrigger>
          <TabsTrigger value="traffic" className="text-white">Tráfego</TabsTrigger>
          <TabsTrigger value="insights" className="text-white">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Projetos Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{data?.user.totalProjects}</div>
                <p className="text-xs text-gray-400">+12% este mês</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{data?.performance.completedProjects}</div>
                <p className="text-xs text-gray-400">Taxa de 94%</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Supremos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">{data?.performance.supremeProjects}</div>
                <p className="text-xs text-gray-400">Nível máximo</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Energia Quântica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(data?.quantumMetrics.totalQuantumEnergy || 0)}
                </div>
                <p className="text-xs text-gray-400">Watts acumulados</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Eficiência Geral</span>
                  <span className="text-white">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Otimização Quântica</span>
                  <span className="text-white">{quantumMode ? '100%' : '67%'}</span>
                </div>
                <Progress value={quantumMode ? 100 : 67} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Poder Supremo</span>
                  <span className="text-white">{supremeAIActive ? '100%' : '45%'}</span>
                </div>
                <Progress value={supremeAIActive ? 100 : 45} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantum" className="space-y-4">
          {quantumStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-purple-900/50 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Campo Quântico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Força do Campo</span>
                    <span className="text-purple-400">{Math.round(quantumStatus.quantumField?.fieldStrength || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Frequências Ativas</span>
                    <span className="text-purple-400">{quantumStatus.quantumField?.activeFrequencies || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Estabilidade</span>
                    <span className="text-green-400">{quantumStatus.quantumField?.dimensionalStability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Coerência</span>
                    <span className="text-blue-400">{quantumStatus.quantumField?.quantumCoherence}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-900/50 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    Rede Neural
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Conexões</span>
                    <span className="text-blue-400">{data?.quantumMetrics.neuralConnections.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dimensões</span>
                    <span className="text-blue-400">{Math.round(data?.quantumMetrics.averageDimensions || 3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Densidade da Matriz</span>
                    <span className="text-green-400">{quantumStatus.quantumField?.neuralMatrixDensity?.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Campo Quântico Inativo</h3>
                <p className="text-gray-400 mb-4">Ative o modo quântico para acessar métricas avançadas</p>
                <Button onClick={handleQuantumActivation} className="bg-purple-600 hover:bg-purple-700">
                  Ativar Agora
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-900/50 border-green-500">
              <CardHeader>
                <CardTitle className="text-white text-sm">Meta Ads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">R$ 47.231</div>
                <p className="text-xs text-gray-400">Faturamento este mês</p>
                <div className="mt-2">
                  <Badge className="bg-green-600 text-white">ROAS 4.7x</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/50 border-blue-500">
              <CardHeader>
                <CardTitle className="text-white text-sm">Google Ads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">R$ 32.856</div>
                <p className="text-xs text-gray-400">Faturamento este mês</p>
                <div className="mt-2">
                  <Badge className="bg-blue-600 text-white">ROAS 3.9x</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/50 border-red-500">
              <CardHeader>
                <CardTitle className="text-white text-sm">YouTube</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">R$ 18.492</div>
                <p className="text-xs text-gray-400">Faturamento este mês</p>
                <div className="mt-2">
                  <Badge className="bg-red-600 text-white">ROAS 6.2x</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Campanhas Supremas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <h4 className="text-white font-medium">Curso Marketing Digital Pro</h4>
                    <p className="text-gray-400 text-sm">Meta + Google + YouTube</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">+847%</div>
                    <div className="text-gray-400 text-sm">vs. baseline</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <h4 className="text-white font-medium">Infoproduto Supremo</h4>
                    <p className="text-gray-400 text-sm">Quantum Optimized</p>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 font-bold">+1.247%</div>
                    <div className="text-gray-400 text-sm">quantum boost</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Insights da IA Suprema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {data?.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded">
                      <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">{insight}</p>
                    </div>
                  ))}
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-900/50 rounded border border-purple-500">
                    <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-purple-300">Campo quântico detectou 7 oportunidades de crescimento exponencial nas próximas 48 horas</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-900/50 rounded border border-blue-500">
                    <Brain className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-300">Rede neural identificou padrão de sucesso com 97.3% de precisão para seu nicho</p>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-900/50 rounded border border-green-500">
                    <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-green-300">Sincronicidades cósmicas favoráveis para lançamento de novos produtos na próxima lua nova</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}