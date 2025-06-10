import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Rocket, 
  Crown, 
  Play,
  FileText,
  Download,
  Eye,
  Plus,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  Video,
  Mail,
  Globe
} from 'lucide-react';
import VideoStudio from '@/components/VideoStudio';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  name: string;
  type: string;
  phase: number;
  status: string;
  data: any;
  furionResults: any;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: string;
  furionCredits: number;
}

interface DashboardProps {
  user?: any;
  onOpenFurionCanvas?: () => void;
}

export default function Dashboard({ user: currentUser, onOpenFurionCanvas }: DashboardProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [showVideoStudio, setShowVideoStudio] = useState(false);
  const queryClient = useQueryClient();

  // Usar dados do usuário passados como prop ou buscar da API
  const { data: apiUser } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
    enabled: !currentUser
  });

  const user = currentUser || apiUser;

  // Buscar projetos do usuário
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    retry: false,
  });

  // Criar novo projeto
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  // Avançar fase do projeto
  const advancePhase = useMutation({
    mutationFn: async ({ projectId, phase }: { projectId: number; phase: number }) => {
      const response = await apiRequest('PUT', `/api/projects/${projectId}/phase`, { phase });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });

  const phases = [
    {
      number: 1,
      title: "O seu ponto de partida",
      description: "Entenda como funciona e receba o mapa completo",
      icon: <Play className="w-6 h-6" />,
      color: "bg-blue-500",
      tasks: [
        "Assistir vídeo de boas-vindas",
        "Configurar perfil na plataforma",
        "Acessar materiais de apoio",
        "Definir objetivo principal"
      ]
    },
    {
      number: 2,
      title: "Dominando a Inteligência Artificial",
      description: "Crie seu produto do zero com o Furion.AI",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-purple-500",
      tasks: [
        "Definir nicho e público-alvo",
        "Usar Furion para criar produto",
        "Estruturar conteúdo",
        "Validar com mercado"
      ]
    },
    {
      number: 3,
      title: "Criando sua Máquina Milionária",
      description: "Monte o sistema completo de vendas",
      icon: <Target className="w-6 h-6" />,
      color: "bg-green-500",
      tasks: [
        "Criar página de vendas",
        "Configurar funil de conversão",
        "Integrar sistema de pagamento",
        "Testar todo o processo"
      ]
    },
    {
      number: 4,
      title: "Hora de imprimir dinheiro",
      description: "Lance campanhas no Meta Ads",
      icon: <Rocket className="w-6 h-6" />,
      color: "bg-orange-500",
      tasks: [
        "Configurar Facebook Business",
        "Criar campanhas de tráfego",
        "Otimizar anúncios",
        "Escalar resultados"
      ]
    },
    {
      number: 5,
      title: "Escalando seu faturamento",
      description: "Multiplique seus resultados",
      icon: <Crown className="w-6 h-6" />,
      color: "bg-red-500",
      tasks: [
        "Análise avançada de métricas",
        "Estratégias de escala",
        "Automações avançadas",
        "Expansão para novos mercados"
      ]
    }
  ];

  const currentProject = selectedProject || projects[0];
  const currentPhase = phases[activePhase - 1];

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
      setActivePhase(projects[0].phase || 1);
    }
  }, [projects, selectedProject]);

  const handleCreateProject = () => {
    createProjectMutation.mutate({
      name: "Novo Projeto Digital",
      type: "infoproduto",
      data: {
        description: "Projeto criado através da plataforma",
        targetAudience: "A definir",
      }
    });
  };

  const handleAdvancePhase = () => {
    if (currentProject && activePhase < 5) {
      const nextPhase = activePhase + 1;
      advancePhase.mutate({ 
        projectId: currentProject.id, 
        phase: nextPhase 
      });
      setActivePhase(nextPhase);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Máquina Milionária
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bem-vindo, {user?.firstName}! Plano: {user?.plan?.toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                <Brain className="w-4 h-4 mr-1" />
                {user?.furionCredits || 0} Créditos Furion
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Fases do Método */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Método 5 Fases</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {phases.map((phase) => (
                  <motion.div
                    key={phase.number}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      activePhase === phase.number
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setActivePhase(phase.number)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activePhase === phase.number ? 'bg-white/20' : phase.color
                      }`}>
                        <div className={activePhase === phase.number ? 'text-white' : 'text-white'}>
                          {phase.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">Fase {phase.number}</p>
                        <p className="text-xs opacity-90 truncate">{phase.title}</p>
                      </div>
                      {(currentProject?.phase || 1) >= phase.number && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Projetos */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Meus Projetos</span>
                  </span>
                  <Button size="sm" onClick={handleCreateProject}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {projectsLoading ? (
                  <div className="text-center py-4">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Carregando...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-4">
                    <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Nenhum projeto ainda</p>
                    <Button size="sm" className="mt-2" onClick={handleCreateProject}>
                      Criar Primeiro Projeto
                    </Button>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedProject?.id === project.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-300'
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <p className="font-semibold text-sm">{project.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{project.type}</p>
                      <div className="mt-2">
                        <Progress value={(project.phase / 5) * 100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Fase {project.phase}/5
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            {currentPhase && (
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Header da Fase */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${currentPhase.color}`}>
                          <div className="text-white">
                            {currentPhase.icon}
                          </div>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            Fase {currentPhase.number}: {currentPhase.title}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            {currentPhase.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Progress value={(activePhase / 5) * 100} className="w-32 mb-2" />
                        <p className="text-sm text-gray-600">
                          {activePhase}/5 Fases Concluídas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Conteúdo da Fase */}
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                    <TabsTrigger value="resources">Recursos</TabsTrigger>
                    <TabsTrigger value="results">Resultados</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Video className="w-5 h-5" />
                            <span>Aulas da Fase {activePhase}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {['Introdução', 'Conceitos Principais', 'Prática Guiada', 'Exercícios'].map((lesson, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Play className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{lesson}</span>
                              </div>
                              <Badge variant="outline">15 min</Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Brain className="w-5 h-5" />
                            <span>Furion.AI Disponível</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">
                            Use a inteligência artificial para acelerar seu progresso nesta fase.
                          </p>
                          <div className="space-y-2">
                            <Button 
                              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white" 
                              onClick={onOpenFurionCanvas}
                            >
                              <Brain className="w-4 h-4 mr-2" />
                              Abrir Canvas Infinito Furion
                            </Button>
                            <Button 
                              className="w-full" 
                              variant="outline"
                              onClick={() => setShowVideoStudio(true)}
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Criar Vídeo com IA
                            </Button>
                            <Button className="w-full" variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              Gerar Copy de Vendas
                            </Button>
                            <Button className="w-full" variant="outline">
                              <Target className="w-4 h-4 mr-2" />
                              Criar Anúncios
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lista de Tarefas - Fase {activePhase}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {currentPhase.tasks.map((task, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="flex-1">{task}</span>
                            <Badge variant="secondary">Concluído</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <FileText className="w-5 h-5" />
                            <span>Materiais</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {['Guia Completo PDF', 'Templates', 'Checklists', 'Planilhas'].map((material, index) => (
                            <Button key={index} variant="ghost" className="w-full justify-start">
                              <Download className="w-4 h-4 mr-2" />
                              {material}
                            </Button>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Globe className="w-5 h-5" />
                            <span>Ferramentas</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {['Plataforma de Vendas', 'Sistema de Email', 'Analytics', 'CRM'].map((tool, index) => (
                            <Button key={index} variant="ghost" className="w-full justify-start">
                              <Eye className="w-4 h-4 mr-2" />
                              {tool}
                            </Button>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Comunidade</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button variant="ghost" className="w-full justify-start">
                            <Mail className="w-4 h-4 mr-2" />
                            Grupo Telegram
                          </Button>
                          <Button variant="ghost" className="w-full justify-start">
                            <Users className="w-4 h-4 mr-2" />
                            Fórum de Dúvidas
                          </Button>
                          <Button variant="ghost" className="w-full justify-start">
                            <Video className="w-4 h-4 mr-2" />
                            Lives Semanais
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="results" className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold">R$ 0</p>
                          <p className="text-sm text-gray-600">Faturamento</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6 text-center">
                          <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold">0</p>
                          <p className="text-sm text-gray-600">Clientes</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6 text-center">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold">0%</p>
                          <p className="text-sm text-gray-600">Conversão</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6 text-center">
                          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                          <p className="text-2xl font-bold">0</p>
                          <p className="text-sm text-gray-600">Leads</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Ações da Fase */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">Próximo Passo</h3>
                        <p className="text-sm text-gray-600">
                          {activePhase < 5 
                            ? `Complete as tarefas desta fase para avançar para a Fase ${activePhase + 1}`
                            : 'Parabéns! Você completou todas as fases do método.'
                          }
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        {activePhase > 1 && (
                          <Button 
                            variant="outline" 
                            onClick={() => setActivePhase(activePhase - 1)}
                          >
                            Fase Anterior
                          </Button>
                        )}
                        {activePhase < 5 && (
                          <Button 
                            onClick={handleAdvancePhase}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                          >
                            Avançar para Fase {activePhase + 1}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Video Studio Modal */}
      {showVideoStudio && (
        <VideoStudio onClose={() => setShowVideoStudio(false)} />
      )}
    </div>
  );
}