import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Crown, Target, Brain, TrendingUp, Users, DollarSign, 
  BarChart3, Zap, Award, Rocket, Sparkles, ArrowRight,
  Play, Clock, CheckCircle, Star, Plus, X, Maximize,
  Video, Mail, FileText, Settings, Download, Upload,
  Eye, Edit3, Trash2, Copy, Share2, MoreHorizontal,
  MousePointer2, Move, ZoomIn, ZoomOut, Grid3X3,
  Layers, PenTool, Palette, Save, ExternalLink,
  Cpu, Globe, Shield, Headphones, RefreshCw,
  Search, Filter, Mic, Camera, Image, Music,
  Calendar, Timer, Bell, Lock, Unlock, Link2,
  Heart, MessageCircle, ThumbsUp, Bookmark,
  Flame, Bolt, Hexagon, Triangle, Square
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CanvasProject {
  id: string;
  title: string;
  type: string;
  category: 'creation' | 'analysis' | 'optimization' | 'automation';
  status: 'idle' | 'processing' | 'completed' | 'error' | 'paused';
  progress: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isExpanded: boolean;
  isMinimized: boolean;
  content: any;
  metadata: {
    revenue?: number;
    roi?: number;
    conversionRate?: number;
    engagement?: number;
    views?: number;
    clicks?: number;
    estimatedCompletion?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  };
  connections: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  viewportSize: { width: number; height: number };
  canvasSize: { width: number; height: number };
  isDragging: boolean;
  isSpacePressed: boolean;
  selectedProjects: string[];
  dragStart: { x: number; y: number };
  lastTap: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

const PROJECT_TEMPLATES = [
  {
    id: 'copy-supreme',
    name: 'Copy Suprema IA',
    type: 'copywriting',
    category: 'creation' as const,
    icon: FileText,
    color: 'from-blue-600 via-blue-500 to-cyan-500',
    description: 'Gerador de copies que converteram R$ 50M+',
    features: ['Headlines virais', 'CTAs magnéticos', 'Storytelling emocional', 'Prova social estratégica'],
    estimatedTime: '3-5 min',
    difficulty: 'easy' as const,
    expectedROI: 'R$ 15k-80k',
    prompt: 'Crie uma copy suprema que combine neuromarketing, psicologia comportamental e gatilhos de urgência para maximizar conversões'
  },
  {
    id: 'vsl-master',
    name: 'VSL Master Pro',
    type: 'video',
    category: 'creation' as const,
    icon: Video,
    color: 'from-purple-600 via-violet-500 to-purple-400',
    description: 'VSLs com conversão de 25%+',
    features: ['Script psicológico', 'Timing otimizado', 'Edição profissional', 'A/B testing'],
    estimatedTime: '8-12 min',
    difficulty: 'medium' as const,
    expectedROI: 'R$ 100k-500k',
    prompt: 'Desenvolva um VSL supremo com narrativa magnética, gatilhos emocionais e estrutura de conversão máxima'
  },
  {
    id: 'funnel-quantum',
    name: 'Funil Quântico',
    type: 'funnel',
    category: 'automation' as const,
    icon: Target,
    color: 'from-green-600 via-emerald-500 to-teal-500',
    description: 'Funis completos que geraram R$ 100M+',
    features: ['7 etapas otimizadas', 'Automação completa', 'ROI garantido', 'Integração total'],
    estimatedTime: '15-20 min',
    difficulty: 'hard' as const,
    expectedROI: 'R$ 200k-2M',
    prompt: 'Construa um funil quântico com múltiplas etapas, automações inteligentes e otimização contínua'
  },
  {
    id: 'traffic-ultra',
    name: 'Tráfego Ultra IA',
    type: 'traffic',
    category: 'optimization' as const,
    icon: TrendingUp,
    color: 'from-red-600 via-pink-500 to-rose-400',
    description: 'Campanhas com ROI de 1:12',
    features: ['Targeting avançado', 'Otimização automática', 'Multi-plataforma', 'IA predictiva'],
    estimatedTime: '10-15 min',
    difficulty: 'medium' as const,
    expectedROI: 'R$ 500k-5M',
    prompt: 'Desenvolva estratégia de tráfego ultra-otimizada com IA para múltiplas plataformas'
  },
  {
    id: 'email-sequence',
    name: 'Email Sequence Ultra',
    type: 'email',
    category: 'automation' as const,
    icon: Mail,
    color: 'from-yellow-600 via-orange-500 to-amber-400',
    description: 'Sequências com 45% open rate',
    features: ['Automação inteligente', 'Segmentação avançada', 'A/B testing', 'Personalização IA'],
    estimatedTime: '6-8 min',
    difficulty: 'easy' as const,
    expectedROI: 'R$ 50k-300k',
    prompt: 'Crie sequência de emails suprema com automação inteligente e personalização máxima'
  },
  {
    id: 'landing-supreme',
    name: 'Landing Supreme',
    type: 'landing',
    category: 'creation' as const,
    icon: Globe,
    color: 'from-indigo-600 via-blue-500 to-cyan-400',
    description: 'Landing pages que convertem 35%+',
    features: ['Design responsivo', 'Otimização CRO', 'Integração completa', 'Analytics avançado'],
    estimatedTime: '5-7 min',
    difficulty: 'easy' as const,
    expectedROI: 'R$ 80k-400k',
    prompt: 'Desenvolva landing page suprema com design otimizado e elementos de conversão máxima'
  },
  {
    id: 'strategy-quantum',
    name: 'Estratégia Quântica 360°',
    type: 'strategy',
    category: 'analysis' as const,
    icon: Brain,
    color: 'from-teal-600 via-cyan-500 to-blue-400',
    description: 'Estratégias que multiplicam por 50x',
    features: ['Análise de mercado', 'Posicionamento único', 'Execução otimizada', 'Monitoramento IA'],
    estimatedTime: '20-25 min',
    difficulty: 'hard' as const,
    expectedROI: 'R$ 1M-10M',
    prompt: 'Crie estratégia empresarial quântica com análise profunda e posicionamento único'
  },
  {
    id: 'analytics-supreme',
    name: 'Analytics IA Supreme',
    type: 'analytics',
    category: 'analysis' as const,
    icon: BarChart3,
    color: 'from-orange-600 via-red-500 to-pink-400',
    description: 'Insights que geram R$ 5M+',
    features: ['BI avançado', 'Previsões IA', 'Dashboards interativos', 'Alertas inteligentes'],
    estimatedTime: '8-10 min',
    difficulty: 'medium' as const,
    expectedROI: 'R$ 200k-1M',
    prompt: 'Desenvolva sistema de analytics supremo com IA preditiva e insights acionáveis'
  }
];

const CANVAS_CONFIG = {
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 3,
  ZOOM_STEP: 0.1,
  PAN_SENSITIVITY: 1,
  GRID_SIZE: 50,
  SNAP_THRESHOLD: 10,
  VIEWPORT_PADDING: 200,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  INFINITE_SCROLL_BUFFER: 1000
};

export function CaktoStyleInfiniteCanvas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    viewportSize: { width: 0, height: 0 },
    canvasSize: { width: 4000, height: 3000 },
    isDragging: false,
    isSpacePressed: false,
    selectedProjects: [],
    dragStart: { x: 0, y: 0 },
    lastTap: 0,
    showGrid: true,
    snapToGrid: false,
    gridSize: CANVAS_CONFIG.GRID_SIZE
  });

  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PROJECT_TEMPLATES[0] | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    prompt: '',
    targetAudience: '',
    budget: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  // Load projects with real API integration
  const { data: projects = [], isLoading, error } = useQuery<CanvasProject[]>({
    queryKey: ['/api/projects'],
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
    staleTime: 5000
  });

  // Create project mutation with real API
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setShowProjectDialog(false);
      setSelectedTemplate(null);
      setProjectForm({
        title: '',
        prompt: '',
        targetAudience: '',
        budget: '',
        priority: 'medium'
      });
      toast({
        title: "Projeto criado com sucesso!",
        description: "Seu projeto está sendo processado pela IA suprema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar projeto",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  });

  // AI content generation mutation
  const generateContentMutation = useMutation({
    mutationFn: async ({ type, prompt, options }: { type: string; prompt: string; options: any }) => {
      const response = await apiRequest('POST', '/api/ai/generate', {
        type,
        prompt,
        targetAudience: options.targetAudience,
        productType: options.productType,
        budget: options.budget,
        platform: options.platform,
        videoUrl: options.videoUrl
      });
      return response;
    },
    onSuccess: (data, variables) => {
      // Update project with generated content
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: `${variables.type} criado pela IA suprema.`,
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CanvasProject> }) => {
      const response = await apiRequest('PATCH', `/api/projects/${id}`, updates);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/projects/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Projeto excluído",
        description: "Projeto removido com sucesso.",
      });
    }
  });

  // Initialize viewport size
  useEffect(() => {
    const updateViewportSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasState(prev => ({
          ...prev,
          viewportSize: { width: rect.width, height: rect.height }
        }));
      }
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setCanvasState(prev => ({ ...prev, isSpacePressed: true }));
      }
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleResetView();
            break;
          case 's':
            e.preventDefault();
            handleSaveCanvas();
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setCanvasState(prev => ({ ...prev, isSpacePressed: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Canvas interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current && (e.button === 1 || canvasState.isSpacePressed)) {
      e.preventDefault();
      setCanvasState(prev => ({
        ...prev,
        isDragging: true,
        dragStart: { x: e.clientX - prev.pan.x, y: e.clientY - prev.pan.y }
      }));
    }
  }, [canvasState.isSpacePressed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (canvasState.isDragging) {
      const newPanX = e.clientX - canvasState.dragStart.x;
      const newPanY = e.clientY - canvasState.dragStart.y;
      
      setCanvasState(prev => ({
        ...prev,
        pan: { x: newPanX, y: newPanY }
      }));
    }
  }, [canvasState.isDragging, canvasState.dragStart]);

  const handleMouseUp = useCallback(() => {
    setCanvasState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setCanvasState(prev => {
        const newZoom = Math.max(
          CANVAS_CONFIG.MIN_ZOOM,
          Math.min(CANVAS_CONFIG.MAX_ZOOM, prev.zoom * zoomFactor)
        );
        
        const zoomDelta = newZoom - prev.zoom;
        const newPanX = prev.pan.x - (mouseX * zoomDelta);
        const newPanY = prev.pan.y - (mouseY * zoomDelta);
        
        return {
          ...prev,
          zoom: newZoom,
          pan: { x: newPanX, y: newPanY }
        };
      });
    } else {
      // Pan
      setCanvasState(prev => ({
        ...prev,
        pan: {
          x: prev.pan.x - e.deltaX * CANVAS_CONFIG.PAN_SENSITIVITY,
          y: prev.pan.y - e.deltaY * CANVAS_CONFIG.PAN_SENSITIVITY
        }
      }));
    }
  }, []);

  // Canvas controls
  const handleZoomIn = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(CANVAS_CONFIG.MAX_ZOOM, prev.zoom * 1.2)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(CANVAS_CONFIG.MIN_ZOOM, prev.zoom / 1.2)
    }));
  }, []);

  const handleResetView = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 }
    }));
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (projects.length === 0) return;
    
    const bounds = projects.reduce((acc, project) => {
      const right = project.position.x + project.size.width;
      const bottom = project.position.y + project.size.height;
      
      return {
        minX: Math.min(acc.minX, project.position.x),
        minY: Math.min(acc.minY, project.position.y),
        maxX: Math.max(acc.maxX, right),
        maxY: Math.max(acc.maxY, bottom)
      };
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    
    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    const padding = 100;
    
    const scaleX = (canvasState.viewportSize.width - padding * 2) / contentWidth;
    const scaleY = (canvasState.viewportSize.height - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, CANVAS_CONFIG.MAX_ZOOM);
    
    const centerX = bounds.minX + contentWidth / 2;
    const centerY = bounds.minY + contentHeight / 2;
    
    const newPanX = canvasState.viewportSize.width / 2 - centerX * scale;
    const newPanY = canvasState.viewportSize.height / 2 - centerY * scale;
    
    setCanvasState(prev => ({
      ...prev,
      zoom: scale,
      pan: { x: newPanX, y: newPanY }
    }));
  }, [projects, canvasState.viewportSize]);

  const handleSaveCanvas = useCallback(() => {
    const canvasData = {
      projects,
      canvasState,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('canvas-save', JSON.stringify(canvasData));
    toast({
      title: "Canvas salvo",
      description: "Seu trabalho foi salvo localmente.",
    });
  }, [projects, canvasState, toast]);

  // Project creation handlers
  const handleCreateProject = useCallback((template: typeof PROJECT_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setProjectForm(prev => ({
      ...prev,
      title: template.name,
      prompt: template.prompt
    }));
    setShowProjectDialog(true);
  }, []);

  const handleSubmitProject = useCallback(() => {
    if (!selectedTemplate || !projectForm.title) return;
    
    const newProject = {
      title: projectForm.title,
      type: selectedTemplate.type,
      category: selectedTemplate.category,
      position: {
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100
      },
      size: { width: 350, height: 250 },
      status: 'processing' as const,
      progress: 0,
      metadata: {
        difficulty: selectedTemplate.difficulty,
        priority: projectForm.priority,
        estimatedCompletion: selectedTemplate.estimatedTime
      },
      connections: [],
      tags: [selectedTemplate.category, selectedTemplate.type],
      prompt: projectForm.prompt,
      targetAudience: projectForm.targetAudience,
      budget: projectForm.budget
    };
    
    createProjectMutation.mutate(newProject);
  }, [selectedTemplate, projectForm, createProjectMutation]);

  // Project interaction handlers
  const handleProjectSelect = useCallback((projectId: string, isMultiSelect: boolean = false) => {
    setCanvasState(prev => ({
      ...prev,
      selectedProjects: isMultiSelect 
        ? prev.selectedProjects.includes(projectId)
          ? prev.selectedProjects.filter(id => id !== projectId)
          : [...prev.selectedProjects, projectId]
        : [projectId]
    }));
  }, []);

  const handleProjectMove = useCallback((projectId: string, newPosition: { x: number; y: number }) => {
    if (canvasState.snapToGrid) {
      newPosition.x = Math.round(newPosition.x / canvasState.gridSize) * canvasState.gridSize;
      newPosition.y = Math.round(newPosition.y / canvasState.gridSize) * canvasState.gridSize;
    }
    
    updateProjectMutation.mutate({
      id: projectId,
      updates: { position: newPosition }
    });
  }, [canvasState.snapToGrid, canvasState.gridSize, updateProjectMutation]);

  const handleProjectResize = useCallback((projectId: string, newSize: { width: number; height: number }) => {
    updateProjectMutation.mutate({
      id: projectId,
      updates: { size: newSize }
    });
  }, [updateProjectMutation]);

  const handleProjectDelete = useCallback((projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  }, [deleteProjectMutation]);

  const handleGenerateContent = useCallback((projectId: string, project: CanvasProject) => {
    generateContentMutation.mutate({
      type: project.type,
      prompt: `Gere conteúdo supremo para ${project.title}: ${project.content?.prompt || 'Conteúdo de alta conversão'}`,
      options: {
        targetAudience: project.content?.targetAudience,
        productType: project.type,
        budget: project.content?.budget
      }
    });
  }, [generateContentMutation]);

  // Grid rendering
  const gridPattern = useMemo(() => {
    if (!canvasState.showGrid) return null;
    
    const gridSize = canvasState.gridSize * canvasState.zoom;
    const offsetX = canvasState.pan.x % gridSize;
    const offsetY = canvasState.pan.y % gridSize;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${offsetX}px ${offsetY}px`
        }}
      />
    );
  }, [canvasState.showGrid, canvasState.gridSize, canvasState.zoom, canvasState.pan]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-orange-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Carregando Canvas IA Supremo</h3>
          <p className="text-gray-400">Preparando ambiente de criação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Erro ao carregar Canvas</h3>
          <p className="text-gray-400 mb-4">Verifique sua conexão e tente novamente</p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/projects'] })}
            className="bg-red-500 hover:bg-red-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden select-none"
    >
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-orange-500/30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Canvas IA Supremo
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  QUANTUM EDITION
                </Badge>
              </h1>
              <p className="text-gray-400 text-sm">
                {projects.length} projetos • R$ {projects.reduce((sum, p) => sum + (p.metadata?.revenue || 0), 0).toLocaleString('pt-BR')} gerados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCanvasState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
              className={`border-gray-600 ${canvasState.showGrid ? 'bg-gray-700 text-white' : 'text-gray-300'} hover:bg-gray-700`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCanvasState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }))}
              className={`border-gray-600 ${canvasState.snapToGrid ? 'bg-gray-700 text-white' : 'text-gray-300'} hover:bg-gray-700`}
            >
              <Layers className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1 border border-gray-600 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-gray-300 hover:bg-gray-700 p-1 h-8 w-8"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-white text-sm font-mono px-2 min-w-[60px] text-center">
                {Math.round(canvasState.zoom * 100)}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-gray-300 hover:bg-gray-700 p-1 h-8 w-8"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToScreen}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Maximize className="w-4 h-4 mr-2" />
              Ajustar
            </Button>

            <Button
              onClick={() => setShowProjectDialog(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              CRIAR PROJETO
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div 
        ref={canvasRef}
        className={`absolute inset-0 pt-20 ${canvasState.isDragging ? 'cursor-grabbing' : canvasState.isSpacePressed ? 'cursor-grab' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {gridPattern}
        
        {/* Projects */}
        <AnimatePresence>
          {projects.map((project: CanvasProject) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={canvasState.selectedProjects.includes(project.id)}
              onSelect={handleProjectSelect}
              onMove={handleProjectMove}
              onResize={handleProjectResize}
              onDelete={handleProjectDelete}
              onGenerateContent={handleGenerateContent}
              zoom={canvasState.zoom}
            />
          ))}
        </AnimatePresence>

        {/* Welcome State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 p-8 max-w-5xl mx-4">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-white mb-2">
                  Canvas IA Supremo
                </CardTitle>
                <p className="text-gray-400 text-lg">
                  Crie projetos extraordinários com tecnologia IA quântica
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PROJECT_TEMPLATES.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleCreateProject(template)}
                        className={`w-full h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br ${template.color} hover:opacity-90 text-white border-0 rounded-xl shadow-lg`}
                      >
                        <template.icon className="w-8 h-8" />
                        <div className="text-center">
                          <div className="font-semibold text-sm">{template.name}</div>
                          <div className="text-xs opacity-80">{template.expectedROI}</div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Project Creation Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-3">
              {selectedTemplate && (
                <div className={`w-12 h-12 bg-gradient-to-r ${selectedTemplate.color} rounded-xl flex items-center justify-center`}>
                  <selectedTemplate.icon className="w-6 h-6 text-white" />
                </div>
              )}
              Criar Projeto Supremo
            </DialogTitle>
          </DialogHeader>

          {!selectedTemplate ? (
            <div className="grid grid-cols-2 gap-4 py-4">
              {PROJECT_TEMPLATES.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${template.color} hover:opacity-90 text-white border-0`}
                  >
                    <template.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{template.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedTemplate.color} bg-opacity-20 border border-gray-600`}>
                <h3 className="text-white font-semibold mb-2">{selectedTemplate.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-white">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium mb-2 block">
                    Título do Projeto
                  </label>
                  <Input
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={selectedTemplate.name}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">
                    Prompt Personalizado
                  </label>
                  <Textarea
                    value={projectForm.prompt}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder={selectedTemplate.prompt}
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">
                      Público-Alvo
                    </label>
                    <Input
                      value={projectForm.targetAudience}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                      placeholder="Ex: Empreendedores 25-45 anos"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block">
                      Orçamento
                    </label>
                    <Input
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Ex: R$ 10.000"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">
                    Prioridade
                  </label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high', 'urgent'].map((priority) => (
                      <Button
                        key={priority}
                        variant={projectForm.priority === priority ? "default" : "outline"}
                        size="sm"
                        onClick={() => setProjectForm(prev => ({ ...prev, priority: priority as any }))}
                        className={`${
                          projectForm.priority === priority 
                            ? 'bg-orange-500 text-white' 
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {priority === 'low' && 'Baixa'}
                        {priority === 'medium' && 'Média'}
                        {priority === 'high' && 'Alta'}
                        {priority === 'urgent' && 'Urgente'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmitProject}
                  disabled={!projectForm.title || createProjectMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex-1"
                >
                  {createProjectMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Criar Projeto
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Canvas Stats */}
      <div className="absolute bottom-6 left-6 z-40">
        <Card className="bg-black/50 backdrop-blur-sm border-gray-700/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-gray-400">
                Zoom: <span className="text-white font-mono">{Math.round(canvasState.zoom * 100)}%</span>
              </div>
              <div className="text-gray-400">
                Projetos: <span className="text-white">{projects.length}</span>
              </div>
              <div className="text-gray-400">
                Selecionados: <span className="text-white">{canvasState.selectedProjects.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas Controls */}
      <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-2">
        <div className="bg-black/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-2 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="text-gray-300 hover:bg-gray-700 p-2 h-10 w-10"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetView}
            className="text-gray-300 hover:bg-gray-700 p-2 h-10 w-10"
          >
            <Target className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-gray-300 hover:bg-gray-700 p-2 h-10 w-10"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveCanvas}
          className="border-gray-700 bg-black/50 backdrop-blur-sm text-gray-300 hover:bg-gray-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: CanvasProject;
  isSelected: boolean;
  onSelect: (id: string, isMultiSelect?: boolean) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onDelete: (id: string) => void;
  onGenerateContent: (id: string, project: CanvasProject) => void;
  zoom: number;
}

function ProjectCard({ 
  project, 
  isSelected, 
  onSelect, 
  onMove, 
  onResize, 
  onDelete, 
  onGenerateContent,
  zoom 
}: ProjectCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(false);
  
  const template = PROJECT_TEMPLATES.find(t => t.type === project.type);
  const IconComponent = template?.icon || FileText;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(project.id, e.ctrlKey || e.metaKey);
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - project.position.x * zoom,
      y: e.clientY - project.position.y * zoom
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = (e.clientX - dragStart.x) / zoom;
      const newY = (e.clientY - dragStart.y) / zoom;
      onMove(project.id, { x: newX, y: newY });
    }
  }, [isDragging, dragStart, zoom, onMove, project.id]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getStatusColor = () => {
    switch (project.status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = () => {
    switch (project.metadata.priority) {
      case 'urgent': return 'border-red-500';
      case 'high': return 'border-orange-500';
      case 'medium': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`absolute cursor-move select-none ${isSelected ? 'z-20' : 'z-10'}`}
      style={{
        left: project.position.x,
        top: project.position.y,
        width: project.size.width,
        height: project.size.height
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className={`h-full bg-gray-800/95 backdrop-blur-sm border-2 transition-all duration-200 ${
        isSelected ? `${getPriorityColor()} shadow-2xl` : 'border-gray-700 hover:border-gray-600'
      }`}>
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-r ${template?.color || 'from-gray-500 to-gray-400'} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm truncate max-w-[200px]">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-xs">{template?.name || project.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className="text-gray-400 hover:text-white p-1 h-6 w-6"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-0">
          {project.status === 'processing' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Processando IA...</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1 bg-gray-700" />
            </div>
          )}

          <div className="space-y-2">
            {project.metadata.revenue && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Receita:</span>
                <span className="text-green-400 font-semibold">
                  R$ {project.metadata.revenue.toLocaleString('pt-BR')}
                </span>
              </div>
            )}

            {project.metadata.roi && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">ROI:</span>
                <span className="text-blue-400 font-semibold">
                  {project.metadata.roi.toFixed(1)}x
                </span>
              </div>
            )}

            {project.metadata.conversionRate && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Conversão:</span>
                <span className="text-purple-400 font-semibold">
                  {project.metadata.conversionRate.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-1 mt-3">
            {project.status === 'completed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
                className="text-gray-400 hover:text-white flex-1 h-7 text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Ver
              </Button>
            )}

            {project.status === 'idle' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateContent(project.id, project);
                }}
                className="text-gray-400 hover:text-white flex-1 h-7 text-xs"
              >
                <Play className="w-3 h-3 mr-1" />
                Gerar
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="text-gray-400 hover:text-red-400 h-7 w-7 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${template?.color || 'from-gray-500 to-gray-400'} rounded-xl flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              {project.title}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="bg-gray-700 border-gray-600">
              <TabsTrigger value="content" className="text-gray-300">Conteúdo</TabsTrigger>
              <TabsTrigger value="metrics" className="text-gray-300">Métricas</TabsTrigger>
              <TabsTrigger value="settings" className="text-gray-300">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4">
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-4">
                  {project.content ? (
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                        {typeof project.content === 'string' 
                          ? project.content 
                          : JSON.stringify(project.content, null, 2)
                        }
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400">
                        {project.status === 'processing' 
                          ? 'Conteúdo sendo gerado pela IA...' 
                          : 'Nenhum conteúdo gerado ainda'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="metrics" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.metadata.revenue && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Receita:</span>
                        <span className="text-green-400 font-semibold">
                          R$ {project.metadata.revenue.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {project.metadata.roi && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">ROI:</span>
                        <span className="text-blue-400 font-semibold">
                          {project.metadata.roi.toFixed(1)}x
                        </span>
                      </div>
                    )}
                    {project.metadata.conversionRate && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Taxa de Conversão:</span>
                        <span className="text-purple-400 font-semibold">
                          {project.metadata.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Engajamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {project.metadata.views && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Visualizações:</span>
                        <span className="text-yellow-400 font-semibold">
                          {project.metadata.views.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {project.metadata.clicks && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Cliques:</span>
                        <span className="text-orange-400 font-semibold">
                          {project.metadata.clicks.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {project.metadata.engagement && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Engajamento:</span>
                        <span className="text-pink-400 font-semibold">
                          {project.metadata.engagement.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">
                      Prioridade
                    </label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high', 'urgent'].map((priority) => (
                        <Button
                          key={priority}
                          variant={project.metadata.priority === priority ? "default" : "outline"}
                          size="sm"
                          className={`text-xs ${
                            project.metadata.priority === priority 
                              ? 'bg-orange-500 text-white' 
                              : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {priority === 'low' && 'Baixa'}
                          {priority === 'medium' && 'Média'}
                          {priority === 'high' && 'Alta'}
                          {priority === 'urgent' && 'Urgente'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">
                      Dificuldade
                    </label>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        project.metadata.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        project.metadata.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {project.metadata.difficulty === 'easy' && 'Fácil'}
                      {project.metadata.difficulty === 'medium' && 'Médio'}
                      {project.metadata.difficulty === 'hard' && 'Difícil'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block text-sm">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Criado em:</span>
                    <p className="text-white">{new Date(project.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Atualizado em:</span>
                    <p className="text-white">{new Date(project.updatedAt).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}