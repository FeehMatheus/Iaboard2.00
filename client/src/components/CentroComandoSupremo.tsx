import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Brain, 
  Crown, 
  Zap, 
  Target, 
  Users, 
  Video, 
  Image, 
  FileText, 
  Globe, 
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Eye,
  Wand2,
  Sparkles,
  Cpu,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Rocket,
  Star
} from 'lucide-react';

interface IAModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: any;
  estimatedTime?: string;
  category: 'analise' | 'criacao' | 'otimizacao' | 'marketing';
}

interface ProjectNode {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'active' | 'completed';
  position: { x: number; y: number };
  connections: string[];
  aiModules: string[];
  data?: any;
}

interface CentroComandoProps {
  projectId?: string;
  onProjectUpdate?: (project: any) => void;
}

export default function CentroComandoSupremo({ projectId, onProjectUpdate }: CentroComandoProps) {
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [aiModules, setAiModules] = useState<IAModule[]>([]);
  const [projectNodes, setProjectNodes] = useState<ProjectNode[]>([]);
  const [isSupremaActive, setIsSupremaActive] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [learningMode, setLearningMode] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Initialize AI modules
  useEffect(() => {
    const modules: IAModule[] = [
      {
        id: 'ia-espia',
        name: 'IA Espiã Suprema',
        description: 'Analisa concorrentes e extrai estratégias vencedoras',
        icon: <Eye className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '2-3 min',
        category: 'analise'
      },
      {
        id: 'ia-branding',
        name: 'IA Branding Master',
        description: 'Cria nome, logo e identidade visual completa',
        icon: <Sparkles className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '3-4 min',
        category: 'criacao'
      },
      {
        id: 'ia-copywriting',
        name: 'IA Copywriter Pro',
        description: 'Gera textos persuasivos baseados em dados reais',
        icon: <FileText className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '2-3 min',
        category: 'criacao'
      },
      {
        id: 'ia-video',
        name: 'IA Vídeo Mestre',
        description: 'Cria vídeos completos com roteiro e edição',
        icon: <Video className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '5-8 min',
        category: 'criacao'
      },
      {
        id: 'ia-landing',
        name: 'IA Landing Page',
        description: 'Gera páginas de vendas com design otimizado',
        icon: <Globe className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '3-5 min',
        category: 'criacao'
      },
      {
        id: 'ia-trafego',
        name: 'IA Tráfego Ultra',
        description: 'Cria campanhas para Meta Ads e Google Ads',
        icon: <Target className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '4-6 min',
        category: 'marketing'
      },
      {
        id: 'ia-analytics',
        name: 'IA Analytics+',
        description: 'Análise profunda e otimização contínua',
        icon: <BarChart3 className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '2-3 min',
        category: 'otimizacao'
      },
      {
        id: 'ia-persuasao',
        name: 'IA Persuasão Neural',
        description: 'Aplica gatilhos mentais específicos por nicho',
        icon: <Brain className="w-5 h-5" />,
        status: 'idle',
        progress: 0,
        estimatedTime: '3-4 min',
        category: 'otimizacao'
      }
    ];
    
    setAiModules(modules);
  }, []);

  // Execute single AI module
  const executeAIModule = useCallback(async (moduleId: string, projectData: any) => {
    setActiveModule(moduleId);
    
    // Update module status to processing
    setAiModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, status: 'processing', progress: 0 } : m
    ));

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setAiModules(prev => prev.map(m => 
          m.id === moduleId ? { ...m, progress: i } : m
        ));
      }

      // Call real AI API
      const response = await fetch('/api/ai/suprema/execute-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          projectData,
          learningMode
        })
      });

      const result = await response.json();

      // Update module with result
      setAiModules(prev => prev.map(m => 
        m.id === moduleId ? { 
          ...m, 
          status: 'completed', 
          progress: 100, 
          result 
        } : m
      ));

      if (learningMode) {
        // Show explanation of what the AI did
        console.log(`IA ${moduleId} executada:`, result.explanation);
      }

    } catch (error) {
      setAiModules(prev => prev.map(m => 
        m.id === moduleId ? { ...m, status: 'error', progress: 0 } : m
      ));
    }

    setActiveModule(null);
  }, [learningMode]);

  // Execute IA Suprema (all modules in optimal order)
  const executeSupremaSequence = useCallback(async () => {
    setIsSupremaActive(true);
    setOverallProgress(0);

    const optimalSequence = [
      'ia-espia',      // First: analyze competitors
      'ia-branding',   // Second: create brand identity
      'ia-copywriting', // Third: generate copy
      'ia-landing',    // Fourth: create landing page
      'ia-video',      // Fifth: create video content
      'ia-trafego',    // Sixth: create traffic campaigns
      'ia-persuasao',  // Seventh: apply persuasion optimization
      'ia-analytics'   // Last: analyze and optimize everything
    ];

    for (let i = 0; i < optimalSequence.length; i++) {
      const moduleId = optimalSequence[i];
      await executeAIModule(moduleId, currentProject);
      setOverallProgress(((i + 1) / optimalSequence.length) * 100);
    }

    setIsSupremaActive(false);
  }, [currentProject, executeAIModule]);

  // Get status color for modules
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'processing': return 'text-cyan-400 bg-cyan-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analise': return 'from-blue-500 to-cyan-600';
      case 'criacao': return 'from-purple-500 to-pink-600';
      case 'marketing': return 'from-green-500 to-emerald-600';
      case 'otimizacao': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Header with controls */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Centro de Comando Supremo
              </h1>
              <p className="text-sm text-gray-400">Controle total sobre as IAs avançadas</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLearningMode(!learningMode)}
              className={`border-purple-400 ${learningMode ? 'bg-purple-400/20 text-purple-400' : 'text-purple-400'}`}
            >
              <Brain className="w-4 h-4 mr-2" />
              Modo Aprendizado
            </Button>

            <Button
              size="sm"
              onClick={executeSupremaSequence}
              disabled={isSupremaActive}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
            >
              {isSupremaActive ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  IA Suprema
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Overall progress */}
        {isSupremaActive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Progresso Geral da IA Suprema</span>
              <span className="text-cyan-400">{overallProgress.toFixed(0)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="p-6">
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
            <TabsTrigger value="modules">Módulos IA</TabsTrigger>
            <TabsTrigger value="fluxo">Fluxo Visual</TabsTrigger>
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
            <TabsTrigger value="otimizacao">Otimização</TabsTrigger>
          </TabsList>

          {/* AI Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['analise', 'criacao', 'marketing', 'otimizacao'].map(category => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white capitalize">{category}</h3>
                  {aiModules.filter(m => m.category === category).map(module => (
                    <motion.div
                      key={module.id}
                      layout
                      className="group"
                    >
                      <Card className="bg-slate-900/50 border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(module.category)}`}>
                              {module.icon}
                            </div>
                            <Badge className={`text-xs ${getStatusColor(module.status)}`}>
                              {module.status === 'processing' && activeModule === module.id && (
                                <Settings className="w-3 h-3 mr-1 animate-spin" />
                              )}
                              {module.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {module.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {module.status === 'idle' && <Clock className="w-3 h-3 mr-1" />}
                              {module.status}
                            </Badge>
                          </div>
                          <div>
                            <CardTitle className="text-sm text-white">{module.name}</CardTitle>
                            <p className="text-xs text-gray-400 mt-1">{module.description}</p>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {module.status === 'processing' && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Progresso</span>
                                <span className="text-cyan-400">{module.progress}%</span>
                              </div>
                              <Progress value={module.progress} className="h-1" />
                            </div>
                          )}
                          
                          {module.status === 'idle' && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500">Tempo estimado: {module.estimatedTime}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                                onClick={() => executeAIModule(module.id, currentProject)}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Executar
                              </Button>
                            </div>
                          )}
                          
                          {module.status === 'completed' && module.result && (
                            <div className="space-y-2">
                              <p className="text-xs text-green-400">✓ Concluído com sucesso</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs border-green-400/50 text-green-400 hover:bg-green-400/10"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Ver Resultado
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Visual Flow Tab */}
          <TabsContent value="fluxo" className="space-y-6">
            <Card className="bg-slate-900/50 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Fluxo Visual do Projeto</CardTitle>
                <p className="text-gray-400">Visualize e reorganize os componentes do seu funil</p>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-slate-800/50 rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Cpu className="w-16 h-16 text-cyan-400 mx-auto" />
                    <p className="text-gray-400">Interface de Fluxo Visual</p>
                    <p className="text-sm text-gray-500">Drag & drop, conexões inteligentes e reorganização automática</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="resultados" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiModules.filter(m => m.status === 'completed').map(module => (
                <Card key={module.id} className="bg-slate-900/50 border border-green-400/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {module.icon}
                      <div>
                        <CardTitle className="text-sm text-white">{module.name}</CardTitle>
                        <Badge className="text-xs bg-green-400/20 text-green-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Concluído
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300">Resultado disponível para download</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Visualizar
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="otimizacao" className="space-y-6">
            <Card className="bg-slate-900/50 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Otimização Suprema</CardTitle>
                <p className="text-gray-400">Análise avançada e melhorias automáticas</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Métricas de Performance</h4>
                    {[
                      { label: 'Taxa de Conversão Estimada', value: '12.5%', trend: '+2.3%' },
                      { label: 'Score de Persuasão', value: '9.2/10', trend: '+0.8' },
                      { label: 'Otimização SEO', value: '94%', trend: '+12%' },
                      { label: 'Engagement Previsto', value: '8.7/10', trend: '+1.2' }
                    ].map(metric => (
                      <div key={metric.label} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-sm text-gray-300">{metric.label}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white">{metric.value}</div>
                          <div className="text-xs text-green-400">{metric.trend}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Sugestões de Melhoria</h4>
                    <div className="space-y-3">
                      {[
                        'Ajustar headline principal para aumentar impacto',
                        'Otimizar call-to-action com cores mais contrastantes',
                        'Adicionar prova social na seção de benefícios',
                        'Melhorar velocidade de carregamento da página'
                      ].map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}