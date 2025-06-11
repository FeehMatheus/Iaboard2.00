import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  Crown, Zap, Brain, TrendingUp, Target, Star, Rocket, 
  Flame, Sparkles, Award, Eye, BarChart3, Play, Settings,
  Users, DollarSign, Clock, ArrowRight, Plus, Video,
  FileText, Mail, Image, MousePointer, Layers, PieChart
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalRevenue: number;
  conversionRate: number;
  credits: number;
  plan: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
  credits: number;
}

export default function PostLoginDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isQuantumMode, setIsQuantumMode] = useState(false);
  const [quickActionDialogOpen, setQuickActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: 30000
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/advanced'],
    refetchInterval: 10000
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = data.isQuantum ? '/api/quantum/generate' : '/api/ai/generate';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Conteúdo Gerado!",
        description: `${result.quantumEnergy ? 'Conteúdo quântico' : 'Conteúdo'} criado com sucesso`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      setQuickActionDialogOpen(false);
      setCustomPrompt('');
    },
    onError: (error) => {
      toast({
        title: "Erro na Geração",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  });

  // Create traffic campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/traffic/supreme-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Campanha Criada!",
        description: "Campanha de tráfego suprema ativada"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    }
  });

  const quickActions: QuickAction[] = [
    {
      id: 'copy',
      title: 'Copy Persuasivo',
      description: 'Gere textos que convertem 10x mais',
      icon: FileText,
      color: 'bg-blue-600',
      credits: 8,
      action: () => handleQuickAction('copy', 'Criar copy persuasivo para produto digital')
    },
    {
      id: 'vsl',
      title: 'Video Sales Letter',
      description: 'Roteiro de vídeo de alta conversão',
      icon: Video,
      color: 'bg-purple-600',
      credits: 15,
      action: () => handleQuickAction('vsl', 'Criar roteiro de VSL para curso online')
    },
    {
      id: 'email',
      title: 'Sequência de Email',
      description: 'Automação que vende no piloto automático',
      icon: Mail,
      color: 'bg-green-600',
      credits: 12,
      action: () => handleQuickAction('email', 'Criar sequência de 7 emails para nutrição')
    },
    {
      id: 'ads',
      title: 'Anúncios Supremos',
      description: 'Criativos que param o scroll e vendem',
      icon: MousePointer,
      color: 'bg-red-600',
      credits: 10,
      action: () => handleQuickAction('ads', 'Criar anúncios para Facebook e Instagram')
    },
    {
      id: 'landing',
      title: 'Landing Page',
      description: 'Página que converte visitas em vendas',
      icon: Layers,
      color: 'bg-orange-600',
      credits: 12,
      action: () => handleQuickAction('landing', 'Criar landing page para captura de leads')
    },
    {
      id: 'quantum',
      title: 'IA Quântica',
      description: 'Processamento multidimensional supremo',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      credits: 25,
      action: () => handleQuantumAction()
    }
  ];

  const handleQuickAction = (type: string, defaultPrompt: string) => {
    setSelectedAction(quickActions.find(a => a.id === type) || null);
    setCustomPrompt(defaultPrompt);
    setQuickActionDialogOpen(true);
  };

  const handleQuantumAction = () => {
    setIsQuantumMode(true);
    setSelectedAction(quickActions.find(a => a.id === 'quantum') || null);
    setCustomPrompt('Ativar processamento quântico supremo para geração multidimensional');
    setQuickActionDialogOpen(true);
  };

  const executeQuickAction = () => {
    if (!selectedAction) return;

    const payload = {
      type: selectedAction.id,
      prompt: customPrompt,
      isQuantum: isQuantumMode,
      quantumLevel: isQuantumMode ? 100 : undefined,
      supremeMode: isQuantumMode,
      options: {
        audience: 'empreendedores digitais brasileiros',
        product: 'infoproduto de alta qualidade',
        goal: 'maximizar conversões e vendas'
      }
    };

    generateContentMutation.mutate(payload);
  };

  const createSupremeCampaign = () => {
    createCampaignMutation.mutate({
      productType: 'Curso de Marketing Digital',
      targetAudience: 'Empreendedores 25-45 anos',
      budget: 5000,
      goal: 'Maximizar vendas',
      platforms: ['meta', 'google'],
      supremeMode: true,
      quantumOptimization: isQuantumMode
    });
  };

  const stats: DashboardStats = {
    totalProjects: dashboardData?.totalProjects || 0,
    completedProjects: dashboardData?.completedProjects || 0,
    activeProjects: dashboardData?.activeProjects || 0,
    totalRevenue: dashboardData?.totalRevenue || 0,
    conversionRate: dashboardData?.conversionRate || 0,
    credits: dashboardData?.user?.credits || 1000,
    plan: dashboardData?.user?.plan || 'Professional'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando Dashboard Supremo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Bem-vindo à Máquina Milionária
          </h1>
          <p className="text-gray-300">Transforme ideias em resultados extraordinários</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            {stats.plan}
          </Badge>
          <Badge className="bg-blue-600 text-white px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            {stats.credits} Créditos
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Projetos</p>
                <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
              </div>
              <Layers className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Concluídos</p>
                <p className="text-2xl font-bold text-green-400">{stats.completedProjects}</p>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Faturamento</p>
                <p className="text-2xl font-bold text-yellow-400">R$ {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Conversão</p>
                <p className="text-2xl font-bold text-purple-400">{stats.conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="w-6 h-6 text-orange-400" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={action.action}
                className={`${action.color} hover:opacity-90 text-white p-4 h-auto flex flex-col items-center gap-2 relative group transition-all duration-300 hover:scale-105`}
                disabled={generateContentMutation.isPending}
              >
                <action.icon className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.credits} créditos</div>
                </div>
                {generateContentMutation.isPending && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="canvas" className="text-white data-[state=active]:bg-blue-600">
            Canvas IA
          </TabsTrigger>
          <TabsTrigger value="traffic" className="text-white data-[state=active]:bg-red-600">
            Tráfego
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-green-600">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Projetos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">Copy Persuasivo #{i}</p>
                            <p className="text-gray-400 text-sm">Concluído há 2 horas</p>
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Taxa de Conversão</span>
                    <span className="text-white">{stats.conversionRate}%</span>
                  </div>
                  <Progress value={stats.conversionRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Projetos Concluídos</span>
                    <span className="text-white">{Math.round((stats.completedProjects / stats.totalProjects) * 100)}%</span>
                  </div>
                  <Progress value={(stats.completedProjects / stats.totalProjects) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Eficiência IA</span>
                    <span className="text-white">97%</span>
                  </div>
                  <Progress value={97} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="canvas">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Canvas IA Infinito
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/platform">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Abrir Canvas
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Layers className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Canvas IA Infinito</h3>
                <p className="text-gray-400 mb-6">
                  Crie, edite e gerencie seus projetos de IA em um espaço infinito e intuitivo
                </p>
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/platform">Acessar Canvas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Tráfego Supremo
                <Button 
                  onClick={createSupremeCampaign}
                  disabled={createCampaignMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {createCampaignMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  ) : (
                    <Target className="w-4 h-4 mr-2" />
                  )}
                  Nova Campanha
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-900/50 border border-green-500 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 font-medium">Meta Ads</span>
                  </div>
                  <p className="text-2xl font-bold text-white">R$ 47.231</p>
                  <p className="text-gray-400 text-sm">ROAS 4.7x</p>
                </div>
                <div className="bg-blue-900/50 border border-blue-500 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-400 font-medium">Google Ads</span>
                  </div>
                  <p className="text-2xl font-bold text-white">R$ 32.856</p>
                  <p className="text-gray-400 text-sm">ROAS 3.9x</p>
                </div>
                <div className="bg-red-900/50 border border-red-500 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-400 font-medium">YouTube</span>
                  </div>
                  <p className="text-2xl font-bold text-white">R$ 18.492</p>
                  <p className="text-gray-400 text-sm">ROAS 6.2x</p>
                </div>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Link href="/supreme">Ver Dashboard Completo</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Analytics Avançado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Analytics Quântico</h3>
                <p className="text-gray-400 mb-6">
                  Métricas avançadas e insights multidimensionais dos seus projetos
                </p>
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/supreme">Ver Analytics Completo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Action Dialog */}
      <Dialog open={quickActionDialogOpen} onOpenChange={setQuickActionDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAction?.icon && <selectedAction.icon className="w-6 h-6" />}
              {selectedAction?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">{selectedAction?.description}</p>
            <div>
              <label className="block text-sm font-medium mb-2">Prompt Personalizado:</label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Descreva o que você quer criar..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
              />
            </div>
            {isQuantumMode && (
              <div className="bg-purple-900/50 border border-purple-500 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-medium">Modo Quântico Ativado</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Processamento multidimensional com 12 camadas neurais e alinhamento cósmico
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-600">
                {selectedAction?.credits} créditos necessários
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setQuickActionDialogOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={executeQuickAction}
                  disabled={generateContentMutation.isPending || !customPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {generateContentMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Gerar Conteúdo
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}