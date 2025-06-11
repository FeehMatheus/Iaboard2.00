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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Flame, Bolt, Hexagon, Triangle, Square,
  Workflow, Network, Database, Server, Code,
  Layout, Monitor, Smartphone, Tablet, Gamepad2,
  PaintBucket, Brush, Scissors, Wand2, Layers3,
  GitBranch, GitCommit, GitMerge, Activity,
  TrendingDown, Minimize, Maximize2, RotateCcw,
  RotateCw, FlipHorizontal, FlipVertical, Crop
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FunnelNode {
  id: string;
  title: string;
  type: 'landing' | 'vsl' | 'checkout' | 'upsell' | 'email' | 'traffic' | 'analytics' | 'api';
  category: 'acquisition' | 'conversion' | 'retention' | 'monetization';
  status: 'draft' | 'active' | 'processing' | 'completed' | 'paused' | 'error';
  position: { x: number; y: number };
  size: { width: number; height: number };
  connections: string[];
  content: {
    config: any;
    metrics: {
      visitors?: number;
      conversions?: number;
      revenue?: number;
      ctr?: number;
      cost?: number;
    };
    assets: {
      images?: string[];
      videos?: string[];
      scripts?: string[];
    };
  };
  metadata: {
    created: Date;
    updated: Date;
    owner: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    version: string;
  };
}

interface BoardState {
  zoom: number;
  pan: { x: number; y: number };
  selection: string[];
  mode: 'select' | 'pan' | 'connect' | 'create';
  viewport: { width: number; height: number };
  grid: { size: number; visible: boolean; snap: boolean };
  minimap: { visible: boolean; position: 'top-right' | 'bottom-right' };
}

const FUNNEL_TEMPLATES = [
  {
    id: 'high-ticket-webinar',
    name: 'Webinar Alto Ticket',
    description: 'Funil completo para produtos de R$ 2k-20k',
    category: 'conversion',
    expectedROI: '1:8-1:15',
    conversionRate: '12-25%',
    nodes: [
      { type: 'traffic', title: 'Tráfego Quente', position: { x: 100, y: 200 } },
      { type: 'landing', title: 'Página de Inscrição', position: { x: 300, y: 200 } },
      { type: 'email', title: 'Sequência de Aquecimento (5 emails)', position: { x: 500, y: 100 } },
      { type: 'vsl', title: 'Webinar ao Vivo', position: { x: 700, y: 200 } },
      { type: 'checkout', title: 'Página de Vendas', position: { x: 900, y: 200 } },
      { type: 'upsell', title: 'Oferta Complementar', position: { x: 1100, y: 150 } },
      { type: 'email', title: 'Follow-up Pós-venda', position: { x: 1100, y: 250 } }
    ]
  },
  {
    id: 'ecommerce-complete',
    name: 'E-commerce Completo',
    description: 'Funil de vendas para produtos físicos',
    category: 'monetization',
    expectedROI: '1:4-1:8',
    conversionRate: '3-8%',
    nodes: [
      { type: 'traffic', title: 'Ads + SEO', position: { x: 100, y: 300 } },
      { type: 'landing', title: 'Página do Produto', position: { x: 300, y: 300 } },
      { type: 'checkout', title: 'Carrinho Otimizado', position: { x: 500, y: 300 } },
      { type: 'upsell', title: 'Cross-sell', position: { x: 700, y: 250 } },
      { type: 'email', title: 'Remarketing', position: { x: 500, y: 400 } },
      { type: 'analytics', title: 'Tracking Avançado', position: { x: 700, y: 350 } }
    ]
  },
  {
    id: 'saas-onboarding',
    name: 'SaaS + Onboarding',
    description: 'Funil de assinatura com trial gratuito',
    category: 'retention',
    expectedROI: '1:12-1:25',
    conversionRate: '15-35%',
    nodes: [
      { type: 'landing', title: 'Landing SaaS', position: { x: 200, y: 150 } },
      { type: 'api', title: 'Cadastro + Trial', position: { x: 400, y: 150 } },
      { type: 'email', title: 'Onboarding (7 dias)', position: { x: 600, y: 100 } },
      { type: 'analytics', title: 'Métricas de Uso', position: { x: 600, y: 200 } },
      { type: 'checkout', title: 'Conversão Premium', position: { x: 800, y: 150 } },
      { type: 'email', title: 'Retenção + Upsell', position: { x: 1000, y: 150 } }
    ]
  }
];

const NODE_TYPES = {
  landing: { 
    icon: Globe, 
    color: 'from-blue-500 to-cyan-500',
    description: 'Página de captura/vendas otimizada',
    features: ['Design responsivo', 'A/B testing', 'Otimização de conversão']
  },
  vsl: { 
    icon: Video, 
    color: 'from-purple-500 to-violet-500',
    description: 'Video Sales Letter profissional',
    features: ['Script persuasivo', 'CTAs dinâmicos', 'Analytics de engajamento']
  },
  checkout: { 
    icon: CreditCard, 
    color: 'from-green-500 to-emerald-500',
    description: 'Sistema de pagamento otimizado',
    features: ['Múltiplos gateways', 'One-click checkout', 'Carrinho abandonado']
  },
  upsell: { 
    icon: TrendingUp, 
    color: 'from-orange-500 to-red-500',
    description: 'Ofertas adicionais estratégicas',
    features: ['Timing perfeito', 'Ofertas relevantes', 'Bump offers']
  },
  email: { 
    icon: Mail, 
    color: 'from-yellow-500 to-orange-500',
    description: 'Automação de email marketing',
    features: ['Sequências inteligentes', 'Segmentação avançada', 'Personalização']
  },
  traffic: { 
    icon: Target, 
    color: 'from-red-500 to-pink-500',
    description: 'Estratégias de tráfego pago',
    features: ['Multi-plataforma', 'Otimização automática', 'ROI tracking']
  },
  analytics: { 
    icon: BarChart3, 
    color: 'from-indigo-500 to-blue-500',
    description: 'Dashboards e métricas avançadas',
    features: ['Real-time data', 'Insights IA', 'Relatórios automáticos']
  },
  api: { 
    icon: Database, 
    color: 'from-gray-500 to-slate-500',
    description: 'Integrações e automações',
    features: ['Webhooks', 'API REST', 'Automações personalizadas']
  }
};

export function RenderStyleInfiniteBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardState, setBoardState] = useState<BoardState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selection: [],
    mode: 'select',
    viewport: { width: 0, height: 0 },
    grid: { size: 50, visible: true, snap: true },
    minimap: { visible: true, position: 'bottom-right' }
  });

  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof FUNNEL_TEMPLATES[0] | null>(null);
  const [editingNode, setEditingNode] = useState<FunnelNode | null>(null);
  const [connectionMode, setConnectionMode] = useState<{
    active: boolean;
    from: string | null;
    to: string | null;
  }>({ active: false, from: null, to: null });

  // Load funnels from API
  const { data: funnels = [], isLoading, error } = useQuery<FunnelNode[]>({
    queryKey: ['/api/funnels'],
    refetchInterval: 30000,
    staleTime: 10000
  });

  // Real-time funnel creation with AI
  const createFunnelMutation = useMutation({
    mutationFn: async (funnelData: any) => {
      const response = await apiRequest('POST', '/api/funnels/create', funnelData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/funnels'] });
      setShowTemplateDialog(false);
      toast({
        title: "Funil criado com sucesso!",
        description: "Seu funil está sendo processado com tecnologia IA.",
      });
    }
  });

  // AI optimization for nodes
  const optimizeNodeMutation = useMutation({
    mutationFn: async ({ nodeId, optimizationType }: { nodeId: string; optimizationType: string }) => {
      const response = await apiRequest('POST', `/api/funnels/optimize/${nodeId}`, {
        type: optimizationType,
        aiModel: 'gpt-4o'
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/funnels'] });
      toast({
        title: "Otimização concluída!",
        description: "Node otimizado com IA para melhor performance.",
      });
    }
  });

  // Initialize viewport
  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBoardState(prev => ({
          ...prev,
          viewport: { width: rect.width, height: rect.height }
        }));
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Advanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          case 'a':
            e.preventDefault();
            setBoardState(prev => ({ 
              ...prev, 
              selection: funnels.map(f => f.id) 
            }));
            break;
          case 's':
            e.preventDefault();
            handleSaveBoard();
            break;
          case 'g':
            e.preventDefault();
            setBoardState(prev => ({ 
              ...prev, 
              grid: { ...prev.grid, visible: !prev.grid.visible } 
            }));
            break;
        }
      }

      switch (e.key) {
        case 'Delete':
          if (boardState.selection.length > 0) {
            handleDeleteNodes(boardState.selection);
          }
          break;
        case 'Escape':
          setBoardState(prev => ({ 
            ...prev, 
            selection: [],
            mode: 'select'
          }));
          setConnectionMode({ active: false, from: null, to: null });
          break;
        case ' ':
          e.preventDefault();
          setBoardState(prev => ({ 
            ...prev, 
            mode: prev.mode === 'pan' ? 'select' : 'pan' 
          }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [boardState.selection, funnels]);

  // Board controls
  const handleZoomIn = useCallback(() => {
    setBoardState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 5)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setBoardState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.1)
    }));
  }, []);

  const handleResetView = useCallback(() => {
    setBoardState(prev => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 }
    }));
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (funnels.length === 0) return;
    
    const bounds = funnels.reduce((acc, node) => {
      return {
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + node.size.width),
        maxY: Math.max(acc.maxY, node.position.y + node.size.height)
      };
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    
    const padding = 100;
    const contentWidth = bounds.maxX - bounds.minX + padding * 2;
    const contentHeight = bounds.maxY - bounds.minY + padding * 2;
    
    const scaleX = boardState.viewport.width / contentWidth;
    const scaleY = boardState.viewport.height / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 2);
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    setBoardState(prev => ({
      ...prev,
      zoom: newZoom,
      pan: {
        x: boardState.viewport.width / 2 - centerX * newZoom,
        y: boardState.viewport.height / 2 - centerY * newZoom
      }
    }));
  }, [funnels, boardState.viewport]);

  const handleSaveBoard = useCallback(() => {
    const boardData = {
      funnels,
      boardState,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('infinite-board-save', JSON.stringify(boardData));
    toast({
      title: "Board salvo",
      description: "Seu trabalho foi salvo automaticamente.",
    });
  }, [funnels, boardState, toast]);

  // Template creation
  const handleCreateFromTemplate = useCallback((template: typeof FUNNEL_TEMPLATES[0]) => {
    const funnelData = {
      templateId: template.id,
      name: template.name,
      category: template.category,
      nodes: template.nodes.map(node => ({
        ...node,
        id: `${template.id}-${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'draft',
        content: {
          config: {},
          metrics: {},
          assets: {}
        },
        metadata: {
          created: new Date(),
          updated: new Date(),
          owner: 'current-user',
          tags: [template.category, node.type],
          priority: 'medium',
          version: '1.0.0'
        }
      }))
    };
    
    createFunnelMutation.mutate(funnelData);
  }, [createFunnelMutation]);

  // Node operations
  const handleNodeSelect = useCallback((nodeId: string, multiSelect: boolean = false) => {
    setBoardState(prev => ({
      ...prev,
      selection: multiSelect 
        ? prev.selection.includes(nodeId)
          ? prev.selection.filter(id => id !== nodeId)
          : [...prev.selection, nodeId]
        : [nodeId]
    }));
  }, []);

  const handleNodeEdit = useCallback((node: FunnelNode) => {
    setEditingNode(node);
    setShowNodeEditor(true);
  }, []);

  const handleDeleteNodes = useCallback((nodeIds: string[]) => {
    // Implementation for deleting nodes
    nodeIds.forEach(id => {
      // Delete from API
      apiRequest('DELETE', `/api/funnels/nodes/${id}`).then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/funnels'] });
      });
    });
    
    setBoardState(prev => ({ ...prev, selection: [] }));
  }, [queryClient]);

  const handleOptimizeNode = useCallback((nodeId: string, type: string) => {
    optimizeNodeMutation.mutate({ nodeId, optimizationType: type });
  }, [optimizeNodeMutation]);

  // Grid rendering
  const gridPattern = useMemo(() => {
    if (!boardState.grid.visible) return null;
    
    const gridSize = boardState.grid.size * boardState.zoom;
    const offsetX = boardState.pan.x % gridSize;
    const offsetY = boardState.pan.y % gridSize;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${offsetX}px ${offsetY}px`
        }}
      />
    );
  }, [boardState.grid.visible, boardState.grid.size, boardState.zoom, boardState.pan]);

  // Connection lines
  const connectionLines = useMemo(() => {
    return funnels.map(node => 
      node.connections.map(targetId => {
        const target = funnels.find(f => f.id === targetId);
        if (!target) return null;
        
        const startX = node.position.x + node.size.width / 2;
        const startY = node.position.y + node.size.height / 2;
        const endX = target.position.x + target.size.width / 2;
        const endY = target.position.y + target.size.height / 2;
        
        return (
          <svg
            key={`${node.id}-${targetId}`}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <path
              d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${startY} ${endX} ${endY}`}
              stroke="rgba(59, 130, 246, 0.6)"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="rgba(59, 130, 246, 0.6)"
                />
              </marker>
            </defs>
          </svg>
        );
      })
    ).flat().filter(Boolean);
  }, [funnels]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 border-4 border-orange-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Carregando Board Infinito</h3>
          <p className="text-gray-400">Preparando ambiente de criação...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden select-none"
    >
      {/* Enhanced Header with Real-time Stats */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-blue-500/30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Workflow className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Board Infinito Supreme
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  RENDER STYLE
                </Badge>
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{funnels.length} funis ativos</span>
                <span>•</span>
                <span>R$ {funnels.reduce((sum, f) => sum + (f.content?.metrics?.revenue || 0), 0).toLocaleString('pt-BR')} gerados</span>
                <span>•</span>
                <span>{funnels.filter(f => f.status === 'active').length} em produção</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Board Controls */}
            <div className="flex items-center gap-1 border border-gray-600 rounded-lg p-1">
              {['select', 'pan', 'connect', 'create'].map((mode) => (
                <Button
                  key={mode}
                  variant={boardState.mode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBoardState(prev => ({ ...prev, mode: mode as any }))}
                  className={`p-2 h-8 w-8 ${boardState.mode === mode ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {mode === 'select' && <MousePointer2 className="w-4 h-4" />}
                  {mode === 'pan' && <Move className="w-4 h-4" />}
                  {mode === 'connect' && <GitBranch className="w-4 h-4" />}
                  {mode === 'create' && <Plus className="w-4 h-4" />}
                </Button>
              ))}
            </div>

            {/* Zoom Controls */}
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
                {Math.round(boardState.zoom * 100)}%
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

            {/* Additional Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToScreen}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Ajustar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setBoardState(prev => ({ 
                ...prev, 
                grid: { ...prev.grid, visible: !prev.grid.visible } 
              }))}
              className={`border-gray-600 ${boardState.grid.visible ? 'bg-gray-700 text-white' : 'text-gray-300'} hover:bg-gray-700`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setShowTemplateDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              CRIAR FUNIL
            </Button>
          </div>
        </div>
      </div>

      {/* Main Board Area */}
      <div 
        ref={boardRef}
        className={`absolute inset-0 pt-20 ${
          boardState.mode === 'pan' ? 'cursor-grab' : 
          boardState.mode === 'connect' ? 'cursor-crosshair' :
          'cursor-default'
        }`}
        style={{
          transform: `scale(${boardState.zoom}) translate(${boardState.pan.x}px, ${boardState.pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {gridPattern}
        {connectionLines}
        
        {/* Funnel Nodes */}
        <AnimatePresence>
          {funnels.map((node) => (
            <FunnelNodeCard
              key={node.id}
              node={node}
              isSelected={boardState.selection.includes(node.id)}
              onSelect={handleNodeSelect}
              onEdit={handleNodeEdit}
              onOptimize={handleOptimizeNode}
              zoom={boardState.zoom}
            />
          ))}
        </AnimatePresence>

        {/* Welcome State */}
        {funnels.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 p-8 max-w-4xl mx-4">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Workflow className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-white mb-2">
                  Board Infinito Supreme
                </CardTitle>
                <p className="text-gray-400 text-lg">
                  Crie funis milionários com tecnologia render.com e funcionalidades cakto.com.br
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FUNNEL_TEMPLATES.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card className="bg-gray-700/50 border-gray-600 hover:border-blue-500 transition-all cursor-pointer">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                          <p className="text-gray-400 text-sm">{template.description}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">ROI Esperado:</span>
                              <span className="text-green-400 font-semibold">{template.expectedROI}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Conversão:</span>
                              <span className="text-blue-400 font-semibold">{template.conversionRate}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleCreateFromTemplate(template)}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                            disabled={createFunnelMutation.isPending}
                          >
                            {createFunnelMutation.isPending ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Criando...
                              </>
                            ) : (
                              <>
                                <Rocket className="w-4 h-4 mr-2" />
                                Criar Funil
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Minimap */}
      {boardState.minimap.visible && funnels.length > 0 && (
        <div className={`absolute ${boardState.minimap.position === 'top-right' ? 'top-24 right-6' : 'bottom-6 right-6'} z-40`}>
          <Card className="bg-black/50 backdrop-blur-sm border-gray-700/50 p-3">
            <div className="w-48 h-32 relative bg-gray-800/50 rounded border">
              {/* Minimap implementation */}
              <div className="absolute inset-1">
                {funnels.map(node => (
                  <div
                    key={node.id}
                    className="absolute w-2 h-2 bg-blue-500 rounded"
                    style={{
                      left: `${(node.position.x / 2000) * 100}%`,
                      top: `${(node.position.y / 1500) * 100}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-sm border-t border-gray-700/50">
        <div className="flex items-center justify-between p-3 text-sm">
          <div className="flex items-center gap-6 text-gray-400">
            <span>Modo: <span className="text-white font-medium">{boardState.mode}</span></span>
            <span>Zoom: <span className="text-white font-mono">{Math.round(boardState.zoom * 100)}%</span></span>
            <span>Selecionados: <span className="text-white">{boardState.selection.length}</span></span>
            <span>Total: <span className="text-white">{funnels.length} funis</span></span>
          </div>
          
          <div className="flex items-center gap-4 text-gray-400">
            <span>Performance: <span className="text-green-400">Ótimo</span></span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-3">
              <Workflow className="w-8 h-8 text-blue-500" />
              Escolher Template de Funil
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {FUNNEL_TEMPLATES.map((template) => (
              <Card key={template.id} className="bg-gray-700 border-gray-600 hover:border-blue-500 transition-all">
                <CardHeader>
                  <CardTitle className="text-white">{template.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Categoria:</span>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">ROI:</span>
                      <span className="text-green-400 font-semibold">{template.expectedROI}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Conversão:</span>
                      <span className="text-blue-400 font-semibold">{template.conversionRate}</span>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-gray-400 text-xs mb-2">Nodes do funil:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.nodes.map((node, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {node.title}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleCreateFromTemplate(template)}
                      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      disabled={createFunnelMutation.isPending}
                    >
                      {createFunnelMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Usar Template
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Funnel Node Component
interface FunnelNodeCardProps {
  node: FunnelNode;
  isSelected: boolean;
  onSelect: (id: string, multiSelect?: boolean) => void;
  onEdit: (node: FunnelNode) => void;
  onOptimize: (nodeId: string, type: string) => void;
  zoom: number;
}

function FunnelNodeCard({ node, isSelected, onSelect, onEdit, onOptimize, zoom }: FunnelNodeCardProps) {
  const nodeType = NODE_TYPES[node.type as keyof typeof NODE_TYPES];
  const IconComponent = nodeType?.icon || Database;

  const getStatusColor = () => {
    switch (node.status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-orange-500';
      case 'completed': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = () => {
    switch (node.metadata.priority) {
      case 'critical': return 'border-red-500';
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
      className={`absolute cursor-pointer select-none ${isSelected ? 'z-20' : 'z-10'}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size.width,
        height: node.size.height
      }}
      onClick={(e) => onSelect(node.id, e.ctrlKey || e.metaKey)}
    >
      <Card className={`h-full bg-gray-800/95 backdrop-blur-sm border-2 transition-all duration-200 ${
        isSelected ? `${getPriorityColor()} shadow-2xl shadow-blue-500/20` : 'border-gray-700 hover:border-gray-600'
      }`}>
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-r ${nodeType?.color || 'from-gray-500 to-gray-400'} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm truncate max-w-[180px]">
                  {node.title}
                </h3>
                <p className="text-gray-400 text-xs">{nodeType?.description.slice(0, 30)}...</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Show context menu
                }}
                className="text-gray-400 hover:text-white p-1 h-6 w-6"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-0 space-y-3">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {node.content.metrics.visitors && (
              <div className="flex justify-between">
                <span className="text-gray-400">Visitors:</span>
                <span className="text-white font-medium">{node.content.metrics.visitors.toLocaleString()}</span>
              </div>
            )}
            {node.content.metrics.conversions && (
              <div className="flex justify-between">
                <span className="text-gray-400">Conv:</span>
                <span className="text-green-400 font-medium">{node.content.metrics.conversions}</span>
              </div>
            )}
            {node.content.metrics.revenue && (
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue:</span>
                <span className="text-blue-400 font-medium">
                  R$ {(node.content.metrics.revenue / 1000).toFixed(1)}k
                </span>
              </div>
            )}
            {node.content.metrics.ctr && (
              <div className="flex justify-between">
                <span className="text-gray-400">CTR:</span>
                <span className="text-purple-400 font-medium">{node.content.metrics.ctr.toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {node.metadata.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(node);
              }}
              className="text-gray-400 hover:text-white flex-1 h-7 text-xs"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onOptimize(node.id, 'conversion');
              }}
              className="text-gray-400 hover:text-blue-400 flex-1 h-7 text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              IA
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Analytics view
              }}
              className="text-gray-400 hover:text-green-400 h-7 w-7 p-0"
            >
              <BarChart3 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}