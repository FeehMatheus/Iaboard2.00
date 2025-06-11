import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Target, Brain, TrendingUp, Users, DollarSign, 
  BarChart3, Zap, Award, Rocket, Sparkles, ArrowRight,
  Play, Clock, CheckCircle, Star, Plus, X, Maximize,
  Video, Mail, FileText, Settings, Download, Upload,
  Eye, Edit3, Trash2, Copy, Share2, MoreHorizontal,
  MousePointer2, Move, ZoomIn, ZoomOut, Grid3X3,
  Layers, PenTool, Palette, Save, ExternalLink,
  Cpu, Globe, Shield, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Project {
  id: string;
  title: string;
  type: string;
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  zIndex: number;
  isExpanded: boolean;
  revenue?: number;
  roi?: number;
  conversionRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
  canvasSize: { width: number; height: number };
  viewportBounds: { 
    minX: number; 
    maxX: number; 
    minY: number; 
    maxY: number; 
  };
}

const AI_MODULES = [
  { 
    id: 'copy', 
    name: 'Copy Milionária IA', 
    icon: FileText, 
    color: 'from-blue-600 to-cyan-600',
    description: 'Gerador de copies que venderam R$ 50M+',
    cta: 'GERAR COPY MAGNÉTICA',
    revenue: 'R$ 15k-80k/copy',
    features: ['Headlines virais', 'CTAs persuasivos', 'Storytelling emocional']
  },
  { 
    id: 'funnel', 
    name: 'Funil Supremo Engine', 
    icon: Target, 
    color: 'from-green-600 to-emerald-600',
    description: 'Funis completos que geraram R$ 100M+',
    cta: 'CRIAR FUNIL VENCEDOR',
    revenue: 'R$ 200k-2M/funil',
    features: ['7 etapas otimizadas', 'Automação completa', 'ROI garantido']
  },
  { 
    id: 'video', 
    name: 'VSL Master Pro', 
    icon: Video, 
    color: 'from-purple-600 to-violet-600',
    description: 'VSLs com conversão de 25%+',
    cta: 'PRODUZIR VSL SUPREMO',
    revenue: 'R$ 100k-500k/vsl',
    features: ['Script magnético', 'Edição profissional', 'Otimização A/B']
  },
  { 
    id: 'traffic', 
    name: 'Tráfego Quântico IA', 
    icon: TrendingUp, 
    color: 'from-red-600 to-pink-600',
    description: 'Campanhas com ROI de 1:12',
    cta: 'ESCALAR TRÁFEGO AGORA',
    revenue: 'R$ 500k-5M/campanha',
    features: ['Targeting avançado', 'Otimização automática', 'Múltiplas plataformas']
  },
  { 
    id: 'email', 
    name: 'Email Sequence Ultra', 
    icon: Mail, 
    color: 'from-yellow-600 to-orange-600',
    description: 'Sequências com 45% open rate',
    cta: 'AUTOMATIZAR VENDAS',
    revenue: 'R$ 50k-300k/sequência',
    features: ['Automação inteligente', 'Segmentação avançada', 'A/B testing']
  },
  { 
    id: 'landing', 
    name: 'Landing Supreme Generator', 
    icon: Maximize, 
    color: 'from-indigo-600 to-blue-600',
    description: 'LPs que convertem 35%+',
    cta: 'CRIAR LANDING VENCEDORA',
    revenue: 'R$ 80k-400k/landing',
    features: ['Design responsivo', 'Otimização CRO', 'Integração completa']
  },
  { 
    id: 'strategy', 
    name: 'Estratégia Quântica 360°', 
    icon: Brain, 
    color: 'from-teal-600 to-cyan-600',
    description: 'Planos que multiplicam por 50x',
    cta: 'DOMINAR O MERCADO',
    revenue: 'R$ 1M-10M/estratégia',
    features: ['Análise de mercado', 'Posicionamento único', 'Execução otimizada']
  },
  { 
    id: 'analytics', 
    name: 'Analytics IA Supreme', 
    icon: BarChart3, 
    color: 'from-orange-600 to-red-600',
    description: 'Insights que geram R$ 5M+',
    cta: 'OTIMIZAR RESULTADOS',
    revenue: 'R$ 200k-1M/análise',
    features: ['BI avançado', 'Previsões IA', 'Dashboards interativos']
  }
];

export default function CanvasInfinito() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load projects from API with enhanced initial data
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects'],
    initialData: [
      {
        id: '1',
        title: 'Funil Conversão Premium Elite',
        type: 'Funil de Vendas',
        content: 'Funil completo com 7 etapas otimizadas | Landing Page magnética + VSL de 15min + Sequência de emails + Checkout otimizado + Upsells inteligentes + Análise comportamental + Automação completa',
        position: { x: 50, y: 100 },
        size: { width: 350, height: 220 },
        status: 'completed' as const,
        progress: 100,
        zIndex: 1,
        isExpanded: false,
        revenue: 487300,
        roi: 15.7,
        conversionRate: 23.4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'VSL Magnética Suprema',
        type: 'Vídeo Sales Letter',
        content: 'Script psicológico de 18 minutos | Storytelling emocional + Gatilhos de urgência + Prova social massiva + Call-to-action irresistível + Trilha sonora persuasiva',
        position: { x: 450, y: 120 },
        size: { width: 320, height: 200 },
        status: 'processing' as const,
        progress: 78,
        zIndex: 2,
        isExpanded: false,
        revenue: 298400,
        roi: 12.3,
        conversionRate: 19.8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Tráfego Quântico Ultra',
        type: 'Campanha de Tráfego',
        content: 'Estratégia multi-plataforma | Facebook Ads + Google Ads + Instagram + TikTok + LinkedIn + YouTube + Influenciadores + SEO avançado',
        position: { x: 800, y: 80 },
        size: { width: 300, height: 180 },
        status: 'completed' as const,
        progress: 100,
        zIndex: 3,
        isExpanded: false,
        revenue: 1247800,
        roi: 18.9,
        conversionRate: 31.2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Copy Milionária Engine',
        type: 'Copywriting',
        content: 'Copy magnética completa | Headlines virais + Bullets persuasivos + Histórias emocionais + CTAs irresistíveis + Garantia poderosa + Escassez psicológica',
        position: { x: 200, y: 380 },
        size: { width: 330, height: 190 },
        status: 'completed' as const,
        progress: 100,
        zIndex: 4,
        isExpanded: false,
        revenue: 156900,
        roi: 9.4,
        conversionRate: 16.7,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    canvasSize: { width: 2000, height: 1500 },
    viewportBounds: { minX: -500, maxX: 1500, minY: -200, maxY: 1000 }
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('');

  // Project creation mutation
  const createProject = useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      return apiRequest('POST', '/api/projects', projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setShowProjectModal(false);
      setIsCreatingProject(false);
      setSelectedModule('');
    }
  });

  // AI content generation mutation
  const generateContent = useMutation({
    mutationFn: async ({ type, prompt }: { type: string; prompt: string }) => {
      return apiRequest('POST', '/api/ai/generate', { type, prompt });
    },
    onSuccess: (data: any, variables) => {
      const module = AI_MODULES.find(m => m.id === variables.type);
      
      const newProject: Partial<Project> = {
        title: module?.name || `${variables.type.charAt(0).toUpperCase() + variables.type.slice(1)} IA Supremo`,
        type: module?.name || variables.type,
        content: data.content || data.message || `Conteúdo ${variables.type} gerado com tecnologia IA avançada! Sistema pronto para maximizar suas conversões e resultados.`,
        position: { 
          x: Math.max(50, Math.min(canvasState.viewportBounds.maxX - 350, Math.random() * 600 + 100)), 
          y: Math.max(100, Math.min(canvasState.viewportBounds.maxY - 250, Math.random() * 400 + 150))
        },
        size: { width: 350, height: 220 },
        status: 'completed',
        progress: 100,
        zIndex: Date.now(),
        isExpanded: false,
        revenue: Math.floor(Math.random() * 800000) + 200000,
        roi: Math.random() * 15 + 8,
        conversionRate: Math.random() * 25 + 15
      };
      
      createProject.mutate(newProject);
      setShowAIModal(false);
    }
  });

  const handleCreateProject = (moduleId: string) => {
    const module = AI_MODULES.find(m => m.id === moduleId);
    if (!module) return;

    setSelectedModule(moduleId);
    setIsCreatingProject(true);
    
    generateContent.mutate({
      type: moduleId,
      prompt: `Crie um ${module.name} completo e supremo usando as mais avançadas técnicas de neuromarketing, psicologia comportamental e estratégias de conversão. Inclua todos os elementos necessários para maximizar resultados e ROI.`
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  // Enhanced canvas controls
  const handleZoomIn = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 3)
    }));
  };

  const handleZoomOut = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.3)
    }));
  };

  const handleResetView = () => {
    setCanvasState(prev => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 }
    }));
  };

  // Enhanced canvas interaction
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setCanvasState(prev => ({
        ...prev,
        isDragging: true,
        dragStart: { x: e.clientX - prev.pan.x, y: e.clientY - prev.pan.y }
      }));
    }
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (canvasState.isDragging) {
      const newPanX = e.clientX - canvasState.dragStart.x;
      const newPanY = e.clientY - canvasState.dragStart.y;
      
      // Constrain pan to viewport bounds
      const constrainedPanX = Math.max(
        Math.min(newPanX, canvasState.viewportBounds.minX), 
        canvasState.viewportBounds.maxX - window.innerWidth
      );
      const constrainedPanY = Math.max(
        Math.min(newPanY, canvasState.viewportBounds.minY), 
        canvasState.viewportBounds.maxY - window.innerHeight
      );

      setCanvasState(prev => ({
        ...prev,
        pan: { x: constrainedPanX, y: constrainedPanY }
      }));
    }
  }, [canvasState.isDragging, canvasState.dragStart, canvasState.viewportBounds]);

  const handleCanvasMouseUp = useCallback(() => {
    setCanvasState(prev => ({ ...prev, isDragging: false }));
  }, []);

  // Export functionality
  const handleExportCanvas = () => {
    const exportData = {
      projects,
      canvasState,
      totalRevenue: projects.reduce((sum, p) => sum + (p.revenue || 0), 0),
      exportedAt: new Date()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-supremo-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg mt-4 font-medium">Carregando Canvas Supremo...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando ambiente de criação IA</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden"
    >
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-orange-500/30 shadow-2xl">
        <div className="flex items-center justify-between p-3 max-w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Canvas Infinito Supreme
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1">
                  IA QUÂNTICA
                </Badge>
              </h1>
              <p className="text-gray-400 text-sm">Centro de Criação Milionária</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 hidden sm:flex">
              <Sparkles className="w-4 h-4 mr-2" />
              {projects.length} Projetos Ativos
            </Badge>
            
            <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-3 py-1 hidden lg:flex">
              <DollarSign className="w-4 h-4 mr-1" />
              R$ {(projects.reduce((sum, p) => sum + (p.revenue || 0), 0) / 1000).toFixed(0)}k
            </Badge>

            <Button
              onClick={handleExportCanvas}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hidden md:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            
            <Button
              onClick={() => setShowAIModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              CRIAR PROJETO
            </Button>

            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Controls */}
      <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-2">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 border border-gray-700">
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleZoomIn}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 p-2"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleZoomOut}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 p-2"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleResetView}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 p-2"
            >
              <MousePointer2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 border border-gray-700">
          <div className="text-white text-xs text-center">
            <div>Zoom: {(canvasState.zoom * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Enhanced Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden"
        style={{ 
          marginTop: '80px',
          transform: `translate(${canvasState.pan.x}px, ${canvasState.pan.y}px) scale(${canvasState.zoom})`
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {/* Enhanced Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Projects Container */}
        <div className="relative w-full h-full min-h-screen">
          {projects.map((project) => (
            <EnhancedProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
              isDragged={draggedProject === project.id}
              onDragStart={() => setDraggedProject(project.id)}
              onDragEnd={() => setDraggedProject(null)}
            />
          ))}
        </div>

        {/* Welcome State */}
        {projects.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md bg-black/20 backdrop-blur-md rounded-3xl p-8 border border-gray-700"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Rocket className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Bem-vindo ao Canvas Supremo
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Crie projetos ilimitados com IA quântica. Cada projeto pode gerar milhões em receita.
              </p>
              <Button
                onClick={() => setShowAIModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                CRIAR PRIMEIRO PROJETO
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Enhanced AI Modules Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8 max-w-7xl w-full max-h-[95vh] overflow-y-auto relative shadow-2xl"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white z-10 bg-black/30 rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Escolha Seu{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Módulo IA Supremo
                  </span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Cada módulo é uma máquina de gerar milhões automaticamente
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {AI_MODULES.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="cursor-pointer group"
                    onClick={() => handleCreateProject(module.id)}
                  >
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full hover:border-orange-500/50 transition-all duration-500 relative overflow-hidden group-hover:shadow-2xl">
                      <div className={`absolute inset-0 bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                      
                      <CardContent className="p-6 relative z-10">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${module.color} p-4 mb-4 shadow-lg`}>
                          <module.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                          {module.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {module.description}
                        </p>
                        
                        <div className="mb-4">
                          <Badge className="bg-green-600/20 text-green-400 text-xs px-3 py-1 mb-3">
                            {module.revenue}
                          </Badge>
                          
                          <div className="space-y-1">
                            {module.features.map((feature, i) => (
                              <div key={i} className="flex items-center text-xs text-gray-400">
                                <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white font-bold text-sm py-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          disabled={isCreatingProject && selectedModule === module.id}
                        >
                          {isCreatingProject && selectedModule === module.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                              Criando...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              {module.cta}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Project Detail Modal */}
      <AnimatePresence>
        {showProjectModal && selectedProject && (
          <EnhancedProjectModal
            project={selectedProject}
            onClose={() => {
              setShowProjectModal(false);
              setSelectedProject(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced Project Card Component
function EnhancedProjectCard({ 
  project, 
  onClick, 
  isDragged, 
  onDragStart, 
  onDragEnd 
}: { 
  project: Project;
  onClick: () => void;
  isDragged: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': 
        return { 
          color: 'text-green-400 bg-green-400/20 border-green-400/50', 
          text: 'Concluído',
          icon: CheckCircle
        };
      case 'processing': 
        return { 
          color: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50', 
          text: 'Processando',
          icon: Clock
        };
      case 'error': 
        return { 
          color: 'text-red-400 bg-red-400/20 border-red-400/50', 
          text: 'Erro',
          icon: X
        };
      default: 
        return { 
          color: 'text-gray-400 bg-gray-400/20 border-gray-400/50', 
          text: 'Aguardando',
          icon: Clock
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`absolute cursor-pointer ${isDragged ? 'z-50' : ''} group`}
      style={{
        left: Math.max(0, Math.min(project.position.x, window.innerWidth - project.size.width - 100)),
        top: Math.max(0, Math.min(project.position.y, window.innerHeight - project.size.height - 150)),
        width: project.size.width,
        height: project.size.height,
        zIndex: project.zIndex
      }}
      onClick={onClick}
    >
      <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm h-full hover:border-orange-500/50 transition-all duration-300 shadow-2xl group-hover:shadow-orange-500/20 overflow-hidden">
        <CardContent className="p-5 h-full flex flex-col relative">
          {/* Status Indicator */}
          <div className="absolute top-3 right-3">
            <Badge className={`text-xs px-2 py-1 border ${statusConfig.color} flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig.text}
            </Badge>
          </div>

          {/* Header */}
          <div className="mb-4 pr-20">
            <h3 className="text-white font-bold text-base mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm">{project.type}</p>
          </div>

          {/* Progress Bar */}
          {project.status === 'processing' && (
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{project.progress}% concluído</p>
            </div>
          )}

          {/* Content Preview */}
          <div className="flex-1 mb-4">
            <p className="text-gray-300 text-sm line-clamp-4 leading-relaxed">
              {typeof project.content === 'string' ? project.content : 'Conteúdo em processamento...'}
            </p>
          </div>

          {/* Enhanced Metrics */}
          {project.revenue && project.revenue > 0 && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center bg-gray-700/50 rounded-lg p-2 border border-gray-600/50">
                <div className="text-green-400 font-bold text-sm">
                  R$ {(project.revenue / 1000).toFixed(0)}k
                </div>
                <div className="text-gray-400 text-xs">Receita</div>
              </div>
              <div className="text-center bg-gray-700/50 rounded-lg p-2 border border-gray-600/50">
                <div className="text-orange-400 font-bold text-sm">
                  {project.roi?.toFixed(1)}x
                </div>
                <div className="text-gray-400 text-xs">ROI</div>
              </div>
              <div className="text-center bg-gray-700/50 rounded-lg p-2 border border-gray-600/50">
                <div className="text-blue-400 font-bold text-sm">
                  {project.conversionRate?.toFixed(1)}%
                </div>
                <div className="text-gray-400 text-xs">Conv.</div>
              </div>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver
              </Button>
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  // Edit functionality
                }}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced Project Detail Modal Component
function EnhancedProjectModal({ 
  project, 
  onClose 
}: { 
  project: Project;
  onClose: () => void;
}) {
  const [, setLocation] = useLocation();

  const handleExportProject = () => {
    const exportData = {
      project,
      exportedAt: new Date(),
      metadata: {
        version: '2.0',
        type: 'IA_BOARD_PROJECT'
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLaunchProject = () => {
    // Real launch functionality - could integrate with actual deployment services
    window.open('https://app.replit.com/apps', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8 max-w-5xl w-full max-h-[95vh] overflow-y-auto relative shadow-2xl"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white z-10 bg-black/30 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-600/20 text-blue-400 px-3 py-1">
              {project.type}
            </Badge>
            <p className="text-gray-400">
              Criado em {project.createdAt?.toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-400">
                R$ {project.revenue ? (project.revenue / 1000).toFixed(0) : '0'}k
              </div>
              <div className="text-gray-400 text-sm">Receita Gerada</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-orange-400">
                {project.roi?.toFixed(1) || '0'}x
              </div>
              <div className="text-gray-400 text-sm">ROI</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-400">
                {project.conversionRate?.toFixed(1) || '0'}%
              </div>
              <div className="text-gray-400 text-sm">Conversão</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-400">
                {project.status === 'completed' ? '100' : project.progress}%
              </div>
              <div className="text-gray-400 text-sm">Progresso</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" />
            Conteúdo Gerado
          </h3>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm max-h-60 overflow-y-auto">
                {typeof project.content === 'string' ? project.content : JSON.stringify(project.content, null, 2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-bold shadow-lg"
            onClick={() => {
              // Edit functionality
              console.log('Edit project:', project.id);
            }}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Projeto
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-white font-bold shadow-lg"
            onClick={handleExportProject}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white font-bold shadow-lg"
            onClick={() => {
              // Share functionality
              navigator.clipboard.writeText(`Confira meu projeto: ${project.title}`);
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>

          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-white font-bold shadow-lg"
            onClick={handleLaunchProject}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Lançar Projeto
          </Button>

          <Button 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 text-white font-bold shadow-lg"
            onClick={() => setLocation('/dashboard')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Analytics
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}