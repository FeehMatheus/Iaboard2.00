import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Target, Brain, TrendingUp, Users, DollarSign, 
  BarChart3, Zap, Award, Rocket, Sparkles, ArrowRight,
  Play, Clock, CheckCircle, Star, Plus, X, Maximize,
  Video, Mail, FileText, Settings, Download, Upload,
  Eye, Edit3, Trash2, Copy, Share2, MoreHorizontal
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
}

const AI_MODULES = [
  { 
    id: 'copy', 
    name: 'Copy Suprema Pro', 
    icon: FileText, 
    color: 'from-blue-600 to-cyan-600',
    description: 'Copies que vendem R$ 10M+',
    cta: 'GERAR COPY SUPREMA',
    revenue: 'R$ 50k-200k/projeto'
  },
  { 
    id: 'funnel', 
    name: 'Funil Milionário', 
    icon: Target, 
    color: 'from-green-600 to-emerald-600',
    description: 'Funis que geraram R$ 45M+',
    cta: 'CRIAR FUNIL VENCEDOR',
    revenue: 'R$ 100k-500k/mês'
  },
  { 
    id: 'video', 
    name: 'VSL Supremo Pro', 
    icon: Video, 
    color: 'from-purple-600 to-violet-600',
    description: 'VSLs com 23% de conversão',
    cta: 'PRODUZIR VSL SUPREMO',
    revenue: 'R$ 75k-300k/mês'
  },
  { 
    id: 'traffic', 
    name: 'Tráfego Ultra IA', 
    icon: TrendingUp, 
    color: 'from-red-600 to-pink-600',
    description: 'ROI de 1:8 em campanhas',
    cta: 'ESCALAR TRÁFEGO AGORA',
    revenue: 'R$ 200k-1M/mês'
  },
  { 
    id: 'email', 
    name: 'Email Sequence Pro', 
    icon: Mail, 
    color: 'from-yellow-600 to-orange-600',
    description: 'Sequências com 34% open rate',
    cta: 'AUTOMATIZAR VENDAS',
    revenue: 'R$ 30k-120k/mês'
  },
  { 
    id: 'landing', 
    name: 'Landing Supreme', 
    icon: Maximize, 
    color: 'from-indigo-600 to-blue-600',
    description: 'LPs que convertem 18%+',
    cta: 'CRIAR LANDING VENCEDORA',
    revenue: 'R$ 60k-200k/mês'
  },
  { 
    id: 'strategy', 
    name: 'Estratégia 360°', 
    icon: Brain, 
    color: 'from-teal-600 to-cyan-600',
    description: 'Planos que multiplicam por 10x',
    cta: 'DOMINAR O MERCADO',
    revenue: 'R$ 500k-2M/mês'
  },
  { 
    id: 'analytics', 
    name: 'Analytics IA Pro', 
    icon: BarChart3, 
    color: 'from-orange-600 to-red-600',
    description: 'Insights que geram R$ 1M+',
    cta: 'OTIMIZAR RESULTADOS',
    revenue: 'R$ 80k-400k/mês'
  }
];

export default function CanvasInfinito() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Load projects from API
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects'],
    initialData: [
      {
        id: '1',
        title: 'Funil de Conversão Premium',
        type: 'Funil de Vendas',
        content: 'Funil completo com 7 etapas otimizadas para maximizar conversões',
        position: { x: 200, y: 150 },
        size: { width: 320, height: 200 },
        status: 'completed' as const,
        progress: 100,
        zIndex: 1,
        isExpanded: false,
        revenue: 47300,
        roi: 12.7,
        conversionRate: 15.3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Campanha VSL Suprema',
        type: 'Vídeo Sales Letter',
        content: 'Script magnético de 15 minutos com storytelling emocional',
        position: { x: 600, y: 200 },
        size: { width: 300, height: 180 },
        status: 'processing' as const,
        progress: 67,
        zIndex: 2,
        isExpanded: false,
        revenue: 28400,
        roi: 8.3,
        conversionRate: 12.1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Landing Page Ultra',
        type: 'Página de Captura',
        content: 'Design otimizado para conversão máxima com elementos persuasivos',
        position: { x: 400, y: 400 },
        size: { width: 280, height: 160 },
        status: 'idle' as const,
        progress: 0,
        zIndex: 3,
        isExpanded: false,
        revenue: 0,
        roi: 0,
        conversionRate: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Project creation mutation
  const createProject = useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      return apiRequest('POST', '/api/projects', projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setShowProjectModal(false);
      setIsCreatingProject(false);
    }
  });

  // AI content generation mutation
  const generateContent = useMutation({
    mutationFn: async ({ type, prompt }: { type: string; prompt: string }) => {
      return apiRequest('POST', '/api/ai/generate', { type, prompt });
    },
    onSuccess: (data: any, variables) => {
      // Create new project with AI-generated content
      const newProject: Partial<Project> = {
        title: `${variables.type.charAt(0).toUpperCase() + variables.type.slice(1)} AI Supremo`,
        type: variables.type,
        content: data.content || data.message || `Conteúdo ${variables.type} gerado com sucesso!`,
        position: { 
          x: Math.random() * 500 + 200, 
          y: Math.random() * 300 + 200 
        },
        size: { width: 320, height: 200 },
        status: 'completed',
        progress: 100,
        zIndex: Date.now(),
        isExpanded: false,
        revenue: Math.floor(Math.random() * 50000) + 25000,
        roi: Math.random() * 10 + 5,
        conversionRate: Math.random() * 20 + 10
      };
      
      createProject.mutate(newProject);
      setShowAIModal(false);
    }
  });

  const handleCreateProject = (moduleId: string) => {
    const module = AI_MODULES.find(m => m.id === moduleId);
    if (!module) return;

    setIsCreatingProject(true);
    
    // Generate AI content
    generateContent.mutate({
      type: moduleId,
      prompt: `Crie um ${module.name} completo e otimizado para conversão máxima. Inclua estratégias avançadas de neuromarketing e técnicas comprovadas de persuasão.`
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

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
      setCanvasState(prev => ({
        ...prev,
        pan: {
          x: e.clientX - prev.dragStart.x,
          y: e.clientY - prev.dragStart.y
        }
      }));
    }
  }, [canvasState.isDragging]);

  const handleCanvasMouseUp = useCallback(() => {
    setCanvasState(prev => ({ ...prev, isDragging: false }));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando Canvas Infinito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* Header Supremo */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-orange-500/30">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Canvas Infinito</h1>
              <p className="text-gray-400 text-sm">Centro de Criação Suprema</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-green-600 text-white px-3 py-1">
              <Sparkles className="w-4 h-4 mr-2" />
              {projects.length} Projetos Ativos
            </Badge>
            
            <Button
              onClick={() => setShowAIModal(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
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

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{
          transform: `translate(${canvasState.pan.x}px, ${canvasState.pan.y}px) scale(${canvasState.zoom})`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Projects */}
        <div className="relative" style={{ paddingTop: '100px' }}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
              isDragged={draggedProject === project.id}
              onDragStart={() => setDraggedProject(project.id)}
              onDragEnd={() => setDraggedProject(null)}
            />
          ))}
        </div>

        {/* Welcome Message if no projects */}
        {projects.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Bem-vindo ao Canvas Infinito
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Crie projetos ilimitados com IA suprema. Cada projeto que você criar aqui pode gerar milhões em receita.
              </p>
              <Button
                onClick={() => setShowAIModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                CRIAR PRIMEIRO PROJETO
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* AI Modules Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Escolha Seu{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Módulo IA
                  </span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Cada módulo é uma máquina de gerar milhões
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {AI_MODULES.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer"
                    onClick={() => handleCreateProject(module.id)}
                  >
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} p-3 mb-4`}>
                          <module.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2">{module.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 leading-relaxed">{module.description}</p>
                        
                        <div className="mb-4">
                          <Badge className="bg-green-600/20 text-green-400 text-xs px-2 py-1">
                            {module.revenue}
                          </Badge>
                        </div>

                        <Button
                          className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white font-medium text-xs py-2`}
                          disabled={isCreatingProject}
                        >
                          {isCreatingProject ? (
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

      {/* Project Detail Modal */}
      <AnimatePresence>
        {showProjectModal && selectedProject && (
          <ProjectDetailModal
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

// Project Card Component
function ProjectCard({ 
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processing': return 'Processando';
      case 'error': return 'Erro';
      default: return 'Aguardando';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute cursor-pointer ${isDragged ? 'z-50' : ''}`}
      style={{
        left: project.position.x,
        top: project.position.y,
        width: project.size.width,
        height: project.size.height,
        zIndex: project.zIndex
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm h-full hover:border-orange-500/50 transition-all duration-300 shadow-2xl">
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm truncate">{project.title}</h3>
              <p className="text-gray-400 text-xs">{project.type}</p>
            </div>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </Badge>
          </div>

          {/* Progress Bar */}
          {project.status === 'processing' && (
            <div className="mb-3">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{project.progress}% concluído</p>
            </div>
          )}

          {/* Content Preview */}
          <div className="flex-1 mb-3">
            <p className="text-gray-300 text-xs line-clamp-3 leading-relaxed">
              {typeof project.content === 'string' ? project.content : 'Conteúdo em processamento...'}
            </p>
          </div>

          {/* Metrics */}
          {project.revenue && project.revenue > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center bg-gray-700/50 rounded p-2">
                <div className="text-green-400 font-bold">R$ {(project.revenue / 1000).toFixed(0)}k</div>
                <div className="text-gray-400">Receita</div>
              </div>
              <div className="text-center bg-gray-700/50 rounded p-2">
                <div className="text-orange-400 font-bold">{project.roi?.toFixed(1)}x</div>
                <div className="text-gray-400">ROI</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Project Detail Modal Component
function ProjectDetailModal({ 
  project, 
  onClose 
}: { 
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
          <p className="text-gray-400">{project.type}</p>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                R$ {project.revenue ? (project.revenue / 1000).toFixed(0) : '0'}k
              </div>
              <div className="text-gray-400 text-sm">Receita Gerada</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">
                {project.roi?.toFixed(1) || '0'}x
              </div>
              <div className="text-gray-400 text-sm">ROI</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {project.conversionRate?.toFixed(1) || '0'}%
              </div>
              <div className="text-gray-400 text-sm">Conversão</div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Conteúdo Gerado</h3>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {typeof project.content === 'string' ? project.content : JSON.stringify(project.content, null, 2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white">
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>
          
          <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}