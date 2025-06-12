import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, Move, ZoomIn, ZoomOut, Grid, Save, Download,
  FileText, Video, Mail, Target, TrendingUp, Brain,
  Crown, Settings, Home, Trash2, Edit3, Maximize2,
  Play, Pause, RefreshCw, Copy, Share2, Eye, Link,
  Sparkles, Zap, Rocket, Star, Award, CheckCircle,
  AlertCircle, Clock, Loader2, Globe, BarChart3,
  Users, DollarSign, Monitor, Smartphone, Tablet
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Node {
  id: string;
  type: string;
  title: string;
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  connections: string[];
  data?: any;
  result?: any;
  files?: Array<{ name: string; type: string; content: string }>;
}

interface CanvasState {
  nodes: Node[];
  zoom: number;
  pan: { x: number; y: number };
}

interface AIRequest {
  prompt: string;
  type: string;
  nodeId: string;
  context?: any;
}

export default function Board() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<Node | null>(null);
  const [showNodePopup, setShowNodePopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodeCreator, setShowNodeCreator] = useState(false);
  const [showPensamentoPoderoso, setShowPensamentoPoderoso] = useState(false);
  const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 });
  const [executingNodes, setExecutingNodes] = useState<Set<string>>(new Set());
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNodeId, setLinkNodeId] = useState('');
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    nodes: [],
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  // Load canvas state
  const { data: canvasData } = useQuery({
    queryKey: ['/api/canvas/state'],
    staleTime: 0
  });

  // Initialize canvas state when data loads
  useEffect(() => {
    if (canvasData && typeof canvasData === 'object') {
      setCanvasState(canvasData as CanvasState);
    }
  }, [canvasData]);

  // AI Services - Real API Integration
  const executeAITask = async (request: AIRequest): Promise<any> => {
    try {
      const response = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error('AI service failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI execution error:', error);
      throw error;
    }
  };

  // Save canvas state
  const saveCanvasMutation = useMutation({
    mutationFn: async (state: CanvasState) => {
      const response = await fetch('/api/canvas/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });
      if (!response.ok) throw new Error('Failed to save canvas');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/canvas/state'] });
    }
  });

  // Create new node
  const createNodeMutation = useMutation({
    mutationFn: async (nodeData: Partial<Node>) => {
      const response = await fetch('/api/canvas/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nodeData)
      });
      if (!response.ok) throw new Error('Failed to create node');
      return response.json();
    },
    onSuccess: (newNode: Node) => {
      setCanvasState(prev => ({
        ...prev,
        nodes: [...prev.nodes, newNode]
      }));
      setShowNodeCreator(false);
      toast({
        title: "Novo módulo criado",
        description: "Módulo adicionado ao seu canvas.",
      });
    }
  });

  // Export system
  const exportProject = async (format: 'pdf' | 'zip' | 'json') => {
    try {
      const response = await fetch('/api/export/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvasState,
          format,
          projectName: 'IA Board Project'
        })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ia-board-project.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Projeto exportado",
        description: `Arquivo ${format.toUpperCase()} baixado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Falha ao exportar o projeto.",
        variant: "destructive"
      });
    }
  };

  const nodeTypes = [
    { 
      id: 'produto', 
      title: 'Criador de Produto IA', 
      icon: Brain, 
      color: 'bg-gradient-to-r from-purple-600 to-purple-700', 
      description: 'Gere produtos digitais completos com IA',
      prompt: 'Crie um produto digital inovador para:'
    },
    { 
      id: 'copywriting', 
      title: 'Copywriter Supremo', 
      icon: FileText, 
      color: 'bg-gradient-to-r from-blue-600 to-blue-700', 
      description: 'Crie copies persuasivas e headlines',
      prompt: 'Escreva uma copy persuasiva para:'
    },
    { 
      id: 'vsl', 
      title: 'Gerador VSL IA', 
      icon: Video, 
      color: 'bg-gradient-to-r from-red-600 to-red-700', 
      description: 'Roteiros de vídeo de alta conversão',
      prompt: 'Crie um roteiro VSL para:'
    },
    { 
      id: 'funnel', 
      title: 'Construtor Funil', 
      icon: Target, 
      color: 'bg-gradient-to-r from-green-600 to-green-700', 
      description: 'Funis completos otimizados',
      prompt: 'Construa um funil de vendas para:'
    },
    { 
      id: 'traffic', 
      title: 'Máquina de Tráfego', 
      icon: TrendingUp, 
      color: 'bg-gradient-to-r from-yellow-600 to-yellow-700', 
      description: 'Campanhas de tráfego inteligentes',
      prompt: 'Crie uma campanha de tráfego para:'
    },
    { 
      id: 'email', 
      title: 'Sequências Email IA', 
      icon: Mail, 
      color: 'bg-gradient-to-r from-indigo-600 to-indigo-700', 
      description: 'Automações de email marketing',
      prompt: 'Desenvolva uma sequência de emails para:'
    },
    { 
      id: 'strategy', 
      title: 'Estrategista IA Supremo', 
      icon: Crown, 
      color: 'bg-gradient-to-r from-orange-600 to-orange-700', 
      description: 'Planejamento estratégico completo',
      prompt: 'Elabore uma estratégia completa para:'
    },
    { 
      id: 'landing', 
      title: 'Landing Page IA', 
      icon: Monitor, 
      color: 'bg-gradient-to-r from-cyan-600 to-cyan-700', 
      description: 'Páginas de conversão otimizadas',
      prompt: 'Crie uma landing page para:'
    },
    { 
      id: 'analytics', 
      title: 'Analytics IA Plus', 
      icon: BarChart3, 
      color: 'bg-gradient-to-r from-pink-600 to-pink-700', 
      description: 'Análise e otimização com IA',
      prompt: 'Analise e otimize:'
    },
    { 
      id: 'branding', 
      title: 'Branding Master IA', 
      icon: Award, 
      color: 'bg-gradient-to-r from-teal-600 to-teal-700', 
      description: 'Identidade visual e branding',
      prompt: 'Desenvolva o branding para:'
    }
  ];

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasState.pan.x) / canvasState.zoom;
      const y = (e.clientY - rect.top - canvasState.pan.y) / canvasState.zoom;
      
      setNewNodePosition({ x, y });
      setShowNodeCreator(true);
    }
  }, [canvasState.pan, canvasState.zoom]);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node.id);
    setSelectedNodeData(node);
    setShowNodePopup(true);
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<Node>) => {
    setCanvasState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const createNode = (type: string) => {
    const nodeType = nodeTypes.find(t => t.id === type);
    if (!nodeType) return;

    const newNode = {
      type,
      title: nodeType.title,
      position: newNodePosition,
      size: { width: 350, height: 280 },
      status: 'pending' as const,
      progress: 0,
      connections: [],
      content: {},
      data: {}
    };

    createNodeMutation.mutate(newNode);
  };

  const executeNode = async (node: Node) => {
    if (executingNodes.has(node.id)) return;

    setExecutingNodes(prev => new Set(prev).add(node.id));
    handleNodeUpdate(node.id, { status: 'processing', progress: 10 });

    try {
      const nodeType = nodeTypes.find(t => t.id === node.type);
      const aiRequest: AIRequest = {
        prompt: nodeType?.prompt || 'Execute task',
        type: node.type,
        nodeId: node.id,
        context: node.data
      };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        handleNodeUpdate(node.id, { progress: Math.min(node.progress + 15, 90) });
      }, 500);

      const result = await executeAITask(aiRequest);

      clearInterval(progressInterval);

      handleNodeUpdate(node.id, {
        status: 'completed',
        progress: 100,
        result: result.data,
        content: result.data,
        files: result.files || []
      });

      toast({
        title: "Tarefa concluída",
        description: `${nodeType?.title} executado com sucesso!`,
      });

    } catch (error) {
      handleNodeUpdate(node.id, {
        status: 'error',
        progress: 0
      });

      toast({
        title: "Erro na execução",
        description: "Falha ao executar a tarefa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setExecutingNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        return newSet;
      });
    }
  };

  const connectLink = (nodeId: string, url: string) => {
    handleNodeUpdate(nodeId, {
      data: {
        ...canvasState.nodes.find(n => n.id === nodeId)?.data,
        externalLink: url
      }
    });
    
    toast({
      title: "Link conectado",
      description: "Link externo vinculado ao módulo.",
    });
  };

  const activatePensamentoPoderoso = async () => {
    setShowPensamentoPoderoso(true);
    
    try {
      const response = await fetch('/api/ai/pensamento-poderoso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasState })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.nodes) {
          setCanvasState(prev => ({
            ...prev,
            nodes: [...prev.nodes, ...result.nodes]
          }));
          
          toast({
            title: "Pensamento Poderoso™ Ativado",
            description: `${result.nodes.length} módulos IA criados automaticamente!`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro no Pensamento Poderoso™",
        description: "Falha ao ativar o modo automático.",
        variant: "destructive"
      });
    }
    
    setShowPensamentoPoderoso(false);
  };

  const renderNode = (node: Node) => {
    const nodeType = nodeTypes.find(t => t.id === node.type);
    const Icon = nodeType?.icon || Settings;
    const isSelected = selectedNode === node.id;
    const isExecuting = executingNodes.has(node.id);

    return (
      <motion.div
        key={node.id}
        drag
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const newPosition = {
            x: node.position.x + info.offset.x / canvasState.zoom,
            y: node.position.y + info.offset.y / canvasState.zoom
          };
          handleNodeUpdate(node.id, { position: newPosition });
        }}
        style={{
          position: 'absolute',
          left: node.position.x,
          top: node.position.y,
          width: node.size.width,
          height: node.size.height,
          zIndex: isSelected ? 10 : 1
        }}
        className="cursor-move"
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.05, zIndex: 20 }}
      >
        <Card 
          className={`h-full border-2 transition-all duration-200 ${
            isSelected 
              ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
              : 'border-gray-200 hover:border-gray-300'
          } bg-white/95 backdrop-blur-sm`}
          onClick={() => handleNodeClick(node)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${nodeType?.color || 'bg-gray-500'} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">{node.title}</CardTitle>
                  <Badge 
                    variant={node.status === 'completed' ? 'default' : 'secondary'} 
                    className="text-xs mt-1"
                  >
                    {node.status === 'completed' ? 'Concluído' : 
                     node.status === 'processing' ? 'Executando' : 
                     node.status === 'error' ? 'Erro' : 'Pendente'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {node.status === 'completed' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {node.status === 'processing' && (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                )}
                {node.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progresso</span>
                <span>{node.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    node.status === 'completed' ? 'bg-green-500' :
                    node.status === 'processing' ? 'bg-blue-500' :
                    node.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${node.progress}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  executeNode(node);
                }}
                disabled={isExecuting || node.status === 'processing'}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                {isExecuting ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Play className="h-3 w-3 mr-1" />
                )}
                {isExecuting ? 'Executando...' : 'Executar'}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node);
                }}
                className="text-xs px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>

            {/* Results and Export */}
            {node.status === 'completed' && node.result && (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportProject('pdf');
                    }}
                    className="flex-1 text-xs bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-300"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLinkNodeId(node.id);
                      setShowLinkDialog(true);
                    }}
                    className="flex-1 text-xs bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-300"
                  >
                    <Link className="h-3 w-3 mr-1" />
                    Link
                  </Button>
                </div>
              </div>
            )}

            {/* External Link Display */}
            {node.data?.externalLink && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Globe className="h-3 w-3" />
                  <span className="truncate">{node.data.externalLink}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Auto-save canvas state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvasState.nodes.length > 0) {
        saveCanvasMutation.mutate(canvasState);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [canvasState, saveCanvasMutation]);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IA BOARD BY FILIPPE™</h1>
                <p className="text-xs text-gray-600">Canvas IA Supremo</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Canvas Controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2) }))}
                className="h-8 w-8 p-0 hover:bg-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-xs text-gray-600 min-w-[3rem] text-center">
                {Math.round(canvasState.zoom * 100)}%
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }))}
                className="h-8 w-8 p-0 hover:bg-white"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Export Options */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportProject('pdf')}
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              
              <Button
                size="sm"
                onClick={() => saveCanvasMutation.mutate(canvasState)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium shadow-sm transition-colors focus:ring-2 focus:ring-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>

            {/* Pensamento Poderoso™ */}
            <Button
              onClick={activatePensamentoPoderoso}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-purple-500"
            >
              <Crown className="h-4 w-4 mr-2" />
              Pensamento Poderoso™
            </Button>
          </div>
        </div>
      </div>

      {/* Infinite Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20 cursor-crosshair"
        onClick={handleCanvasClick}
        style={{
          transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Render Nodes */}
        <AnimatePresence>
          {canvasState.nodes.map(renderNode)}
        </AnimatePresence>

        {/* Add Node Prompt */}
        {canvasState.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200"
            >
              <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg mb-4 inline-block">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bem-vindo ao IA BOARD™</h3>
              <p className="text-gray-600 mb-4">Clique em qualquer lugar para adicionar seu primeiro módulo IA</p>
              <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
                Canvas Infinito Ativado
              </Badge>
            </motion.div>
          </div>
        )}
      </div>

      {/* Node Creator Dialog */}
      <Dialog open={showNodeCreator} onOpenChange={setShowNodeCreator}>
        <DialogContent className="max-w-4xl bg-white border border-gray-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Criar Novo Módulo IA</DialogTitle>
            <DialogDescription className="text-gray-600">
              Escolha uma ferramenta IA para adicionar ao seu canvas
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 p-4">
            {nodeTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-lg"
                    onClick={() => createNode(type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-xl ${type.color} shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{type.title}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {type.id}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Connection Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Conectar Link Externo</DialogTitle>
            <DialogDescription className="text-gray-600">
              Vincule um link externo a este módulo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="https://exemplo.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (linkUrl && linkNodeId) {
                    connectLink(linkNodeId, linkUrl);
                    setShowLinkDialog(false);
                    setLinkUrl('');
                    setLinkNodeId('');
                  }
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Conectar Link
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                  setLinkNodeId('');
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pensamento Poderoso™ Modal */}
      <Dialog open={showPensamentoPoderoso} onOpenChange={setShowPensamentoPoderoso}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Crown className="h-6 w-6 text-purple-600" />
              Modo Pensamento Poderoso™
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              IA criando projeto completo automaticamente...
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 p-4">
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-900">Gerando projeto inteligente...</h3>
              <p className="text-sm text-gray-600">
                A IA está analisando as melhores estratégias e criando módulos otimizados para seu sucesso.
              </p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="absolute bottom-6 left-6 z-40">
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">{canvasState.nodes.length} módulos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">
                  {canvasState.nodes.filter(n => n.progress === 100).length} completos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">
                  {canvasState.nodes.filter(n => n.status === 'processing').length} executando
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Node Button */}
      <motion.div 
        className="absolute bottom-6 right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => {
            setNewNodePosition({ x: 400, y: 300 });
            setShowNodeCreator(true);
          }}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl border-0 transition-all duration-200 focus:ring-4 focus:ring-purple-300"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}