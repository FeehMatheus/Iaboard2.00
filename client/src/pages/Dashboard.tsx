import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Crown, Zap, 
  Play, Pause, Settings, Plus, FileText, Video, Mail,
  Target, Brain, Rocket, Award, Globe, Download,
  RefreshCw, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  progress: number;
  content?: any;
  createdAt: string;
}

interface UserStats {
  totalProjects: number;
  completedProjects: number;
  creditsUsed: number;
  creditsRemaining: number;
  conversionRate: number;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('copywriting');
  const [prompt, setPrompt] = useState('');
  const [audience, setAudience] = useState('');
  const [product, setProduct] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user projects
  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['/api/projects'],
    retry: 1,
  });

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ['/api/analytics/stats'],
    retry: 1,
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsGenerating(true);
      const response = await apiRequest('POST', '/api/ai/generate', data);
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Conteúdo Gerado com Sucesso!",
        description: "Seu projeto foi criado e está pronto para uso.",
      });
      refetchProjects();
      setPrompt('');
      setAudience('');
      setProduct('');
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Geração",
        description: error.message || "Erro ao gerar conteúdo. Tente novamente.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleGenerate = () => {
    if (!prompt || !audience || !product) {
      toast({
        title: "Campos Obrigatórios",
        description: "Preencha todos os campos para gerar o conteúdo.",
        variant: "destructive",
      });
      return;
    }

    generateContentMutation.mutate({
      type: selectedType,
      prompt,
      audience,
      product,
    });
  };

  const contentTypes = [
    { id: 'copywriting', name: 'Copy de Vendas', icon: FileText, description: 'Textos persuasivos para vendas' },
    { id: 'vsl', name: 'Vídeo Sales Letter', icon: Video, description: 'Roteiros para vídeos de vendas' },
    { id: 'email', name: 'Sequência de Emails', icon: Mail, description: 'Campanhas de email marketing' },
    { id: 'ads', name: 'Anúncios Pagos', icon: Target, description: 'Anúncios para Facebook e Google' },
    { id: 'funnel', name: 'Funil de Vendas', icon: TrendingUp, description: 'Estratégias de funil completo' },
    { id: 'strategy', name: 'Estratégia Digital', icon: Brain, description: 'Planejamento estratégico completo' },
  ];

  const userStats: UserStats = stats || {
    totalProjects: projects.length || 0,
    completedProjects: projects.filter((p: Project) => p.status === 'completed').length || 0,
    creditsUsed: 0,
    creditsRemaining: 1000,
    conversionRate: 0,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Máquina Milionária AI</h1>
                <p className="text-sm text-gray-400">Dashboard Principal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                {userStats.creditsRemaining} Créditos
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/board')}
              >
                <Globe className="w-4 h-4 mr-2" />
                Canvas Infinito
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/')}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total de Projetos</p>
                  <p className="text-2xl font-bold">{userStats.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Concluídos</p>
                  <p className="text-2xl font-bold">{userStats.completedProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Créditos Restantes</p>
                  <p className="text-2xl font-bold">{userStats.creditsRemaining}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Taxa de Conversão</p>
                  <p className="text-2xl font-bold">{userStats.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generator" className="space-y-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="generator" className="data-[state=active]:bg-blue-600">
              <Rocket className="w-4 h-4 mr-2" />
              Gerador IA
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Content Generator */}
          <TabsContent value="generator" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <span>Gerador de Conteúdo IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contentTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all ${
                        selectedType === type.id
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <type.icon className="w-5 h-5 text-blue-400" />
                          <div>
                            <h3 className="font-semibold">{type.name}</h3>
                            <p className="text-sm text-gray-400">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Público-Alvo</label>
                      <Input
                        placeholder="Ex: Empreendedores iniciantes de 25-40 anos"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Produto/Serviço</label>
                      <Input
                        placeholder="Ex: Curso de marketing digital"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prompt Detalhado</label>
                    <Textarea
                      placeholder="Descreva detalhadamente o que você quer gerar..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="bg-gray-700 border-gray-600 h-32"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || generateContentMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  size="lg"
                >
                  {isGenerating || generateContentMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Gerando Conteúdo...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Gerar Conteúdo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Seus Projetos</h2>
              <Button
                onClick={() => setLocation('/board')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((project: Project) => (
                  <Card key={project.id} className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{project.type}</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                          <Button size="sm" variant="outline">
                            <Play className="w-3 h-3 mr-1" />
                            Abrir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
                  <p className="text-gray-400 mb-4">Comece criando seu primeiro projeto IA</p>
                  <Button onClick={() => setLocation('/board')} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics e Performance</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Performance dos Projetos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Taxa de Conclusão</span>
                      <span className="font-bold">
                        {userStats.totalProjects > 0 
                          ? Math.round((userStats.completedProjects / userStats.totalProjects) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={userStats.totalProjects > 0 
                        ? (userStats.completedProjects / userStats.totalProjects) * 100
                        : 0} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Uso de Créditos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Créditos Utilizados</span>
                      <span className="font-bold">{userStats.creditsUsed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Créditos Restantes</span>
                      <span className="font-bold text-green-400">{userStats.creditsRemaining}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}