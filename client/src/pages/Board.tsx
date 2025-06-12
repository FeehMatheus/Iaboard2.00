import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, ZoomIn, ZoomOut, Save, Download, Home, Brain, Crown,
  FileText, Video, Mail, Target, TrendingUp, Award, Monitor, BarChart3,
  Play, Eye, Link, Globe, Sparkles, Zap, CheckCircle, AlertCircle, 
  Loader2, Settings, Trash2, Copy, Edit3, Grid3X3, Maximize2
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
  const [showNodeCreator, setShowNodeCreator] = useState(false);
  const [showPensamentoPoderoso, setShowPensamentoPoderoso] = useState(false);
  const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 });
  const [executingNodes, setExecutingNodes] = useState<Set<string>>(new Set());
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNodeId, setLinkNodeId] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
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
      toast({
        title: "Canvas salvo",
        description: "Seu progresso foi salvo automaticamente.",
      });
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
      color: 'from-violet-600 to-purple-600', 
      description: 'Gere produtos digitais completos com IA',
      prompt: 'Crie um produto digital inovador para:'
    },
    { 
      id: 'copywriting', 
      title: 'Copywriter Supremo', 
      icon: FileText, 
      color: 'from-blue-600 to-indigo-600', 
      description: 'Crie copies persuasivas e headlines',
      prompt: 'Escreva uma copy persuasiva para:'
    },
    { 
      id: 'vsl', 
      title: 'Gerador VSL IA', 
      icon: Video, 
      color: 'from-red-600 to-pink-600', 
      description: 'Roteiros de vídeo de alta conversão',
      prompt: 'Crie um roteiro VSL para:'
    },
    { 
      id: 'funnel', 
      title: 'Construtor Funil', 
      icon: Target, 
      color: 'from-green-600 to-emerald-600', 
      description: 'Funis completos otimizados',
      prompt: 'Construa um funil de vendas para:'
    },
    { 
      id: 'traffic', 
      title: 'Máquina de Tráfego', 
      icon: TrendingUp, 
      color: 'from-yellow-500 to-orange-500', 
      description: 'Campanhas de tráfego inteligentes',
      prompt: 'Crie uma campanha de tráfego para:'
    },
    { 
      id: 'email', 
      title: 'Sequências Email IA', 
      icon: Mail, 
      color: 'from-indigo-600 to-blue-600', 
      description: 'Automações de email marketing',
      prompt: 'Desenvolva uma sequência de emails para:'
    },
    { 
      id: 'strategy', 
      title: 'Estrategista IA Supremo', 
      icon: Crown, 
      color: 'from-orange-600 to-red-600', 
      description: 'Planejamento estratégico completo',
      prompt: 'Elabore uma estratégia completa para:'
    },
    { 
      id: 'landing', 
      title: 'Landing Page IA', 
      icon: Monitor, 
      color: 'from-cyan-600 to-teal-600', 
      description: 'Páginas de conversão otimizadas',
      prompt: 'Crie uma landing page para:'
    },
    { 
      id: 'analytics', 
      title: 'Analytics IA Plus', 
      icon: BarChart3, 
      color: 'from-pink-600 to-rose-600', 
      description: 'Análise e otimização com IA',
      prompt: 'Analise e otimize:'
    },
    { 
      id: 'branding', 
      title: 'Branding Master IA', 
      icon: Award, 
      color: 'from-teal-600 to-cyan-600', 
      description: 'Identidade visual e branding',
      prompt: 'Desenvolva o branding para:'
    }
  ];

  // Canvas interaction handlers
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom functionality
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.2, Math.min(3, canvasState.zoom * delta));
        
        // Zoom towards mouse position
        const zoomChange = newZoom / canvasState.zoom;
        setCanvasState(prev => ({
          ...prev,
          zoom: newZoom,
          pan: {
            x: mouseX - (mouseX - prev.pan.x) * zoomChange,
            y: mouseY - (mouseY - prev.pan.y) * zoomChange
          }
        }));
      }
    } else {
      // Pan functionality
      const sensitivity = 1.2;
      setCanvasState(prev => ({
        ...prev,
        pan: {
          x: prev.pan.x - e.deltaX * sensitivity,
          y: prev.pan.y - e.deltaY * sensitivity
        }
      }));
    }
  }, [canvasState.zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

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

  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    handleNodeUpdate(nodeId, { position: { x, y } });
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
        const currentNode = canvasState.nodes.find(n => n.id === node.id);
        if (currentNode && currentNode.progress < 90) {
          handleNodeUpdate(node.id, { progress: Math.min(currentNode.progress + 15, 90) });
        }
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
          handleNodeDrag(node.id, newPosition.x, newPosition.y);
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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className={`h-full border-2 transition-all duration-300 ${
            isSelected 
              ? 'border-violet-400 shadow-2xl shadow-violet-400/30' 
              : 'border-gray-200 hover:border-violet-300 hover:shadow-xl'
          } bg-white/95 backdrop-blur-sm`}
          onClick={() => handleNodeClick(node)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${nodeType?.color || 'from-gray-500 to-gray-600'} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-gray-900">{node.title}</CardTitle>
                  <Badge 
                    variant={node.status === 'completed' ? 'default' : 'secondary'} 
                    className={`text-xs mt-1 font-medium ${
                      node.status === 'completed' ? 'bg-green-100 text-green-800' :
                      node.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      node.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {node.status === 'completed' ? 'Concluído' : 
                     node.status === 'processing' ? 'Executando' : 
                     node.status === 'error' ? 'Erro' : 'Pendente'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {node.status === 'completed' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {node.status === 'processing' && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {node.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>Progresso</span>
                <span>{node.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    node.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    node.status === 'processing' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                    node.status === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 
                    'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${node.progress}%` }}
                  transition={{ duration: 0.5 }}
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
                className={`flex-1 bg-gradient-to-r ${nodeType?.color || 'from-gray-500 to-gray-600'} hover:opacity-90 text-white text-xs px-3 py-2 rounded-xl font-bold shadow-md transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2`}
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
                className="text-xs px-3 py-2 border-2 border-violet-300 text-violet-700 rounded-xl hover:bg-violet-50 transition-all duration-200 focus:ring-2 focus:ring-violet-300 focus:ring-offset-2"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>

            {/* Results and Export */}
            {node.status === 'completed' && node.result && (
              <div className="space-y-2 pt-2 border-t border-violet-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportProject('pdf');
                    }}
                    className="flex-1 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 rounded-xl hover:opacity-90 transition-all duration-200 focus:ring-2 focus:ring-purple-300 shadow-md font-medium"
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
                    className="flex-1 text-xs bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 rounded-xl hover:opacity-90 transition-all duration-200 focus:ring-2 focus:ring-cyan-300 shadow-md font-medium"
                  >
                    <Link className="h-3 w-3 mr-1" />
                    Link
                  </Button>
                </div>
              </div>
            )}

            {/* External Link Display */}
            {node.data?.externalLink && (
              <div className="pt-2 border-t border-violet-100">
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                  <Globe className="h-3 w-3" />
                  <span className="truncate font-medium">{node.data.externalLink}</span>
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
    <div className="h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/20 backdrop-blur-md border-b border-violet-500/30 z-50 shadow-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-white hover:text-violet-200 hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200 font-medium"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl shadow-xl">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                  IA BOARD BY FILIPPE™
                </h1>
                <p className="text-sm text-violet-200 font-medium">Canvas IA Supremo</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Canvas Controls */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur rounded-xl p-1 border border-violet-500/30">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 3) }))}
                className="h-8 w-8 p-0 hover:bg-white/10 text-white rounded-lg"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm text-violet-200 min-w-[3rem] text-center font-bold">
                {Math.round(canvasState.zoom * 100)}%
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.2) }))}
                className="h-8 w-8 p-0 hover:bg-white/10 text-white rounded-lg"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowGrid(!showGrid)}
                className="h-8 w-8 p-0 hover:bg-white/10 text-white rounded-lg"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            {/* Export Options */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => exportProject('pdf')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 focus:ring-2 focus:ring-cyan-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              
              <Button
                size="sm"
                onClick={() => saveCanvasMutation.mutate(canvasState)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 focus:ring-2 focus:ring-emerald-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>

            {/* Pensamento Poderoso™ */}
            <Button
              onClick={activatePensamentoPoderoso}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-2xl font-black shadow-2xl transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-violet-300 text-sm"
            >
              <Crown className="h-5 w-5 mr-2" />
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
      >
        <motion.div
          className="w-full h-full relative cursor-grab active:cursor-grabbing"
          style={{
            transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
            transformOrigin: '0 0'
          }}
          drag
          dragMomentum={false}
          onDrag={(_, info: PanInfo) => {
            setCanvasState(prev => ({
              ...prev,
              pan: {
                x: prev.pan.x + info.delta.x / canvasState.zoom,
                y: prev.pan.y + info.delta.y / canvasState.zoom
              }
            }));
          }}
        >
          {/* Enhanced Grid Background */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle, rgba(139,69,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}
            />
          )}

          {/* Render Nodes */}
          <AnimatePresence>
            {canvasState.nodes.map(renderNode)}
          </AnimatePresence>

          {/* Add Node Prompt */}
          {canvasState.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center p-10 bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-violet-500/30"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl shadow-2xl mb-6 inline-block"
                >
                  <Plus className="h-12 w-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-black text-white mb-3">Bem-vindo ao IA BOARD™</h3>
                <p className="text-violet-200 mb-6 text-lg font-medium">Clique em qualquer lugar para adicionar seu primeiro módulo IA</p>
                <div className="flex items-center gap-2 justify-center">
                  <Sparkles className="h-5 w-5 text-violet-300" />
                  <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-bold">
                    Canvas Infinito Ativado
                  </Badge>
                  <Zap className="h-5 w-5 text-violet-300" />
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Node Creator Dialog */}
      <Dialog open={showNodeCreator} onOpenChange={setShowNodeCreator}>
        <DialogContent className="max-w-6xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-violet-900">Criar Novo Módulo IA</DialogTitle>
            <DialogDescription className="text-violet-700 font-medium">
              Escolha uma ferramenta IA para adicionar ao seu canvas
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 p-6">
            {nodeTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="cursor-pointer border-2 border-violet-200 hover:border-violet-400 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur"
                    onClick={() => createNode(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${type.color} shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-black text-violet-900 text-lg">{type.title}</h4>
                          <Badge className={`bg-gradient-to-r ${type.color} text-white border-0 text-xs mt-1 font-bold`}>
                            {type.id}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-violet-700 font-medium">{type.description}</p>
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
        <DialogContent className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-violet-900">Conectar Link Externo</DialogTitle>
            <DialogDescription className="text-violet-700 font-medium">
              Vincule um link externo a este módulo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="https://exemplo.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="border-2 border-violet-300 focus:border-violet-500 focus:ring-violet-500 rounded-xl"
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
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 text-white rounded-xl font-bold"
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
                className="border-2 border-violet-300 text-violet-700 hover:bg-violet-50 rounded-xl font-bold"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pensamento Poderoso™ Modal */}
      <Dialog open={showPensamentoPoderoso} onOpenChange={setShowPensamentoPoderoso}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-violet-900 to-purple-900 border-2 border-violet-400 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="h-8 w-8 text-violet-300" />
              </motion.div>
              Modo Pensamento Poderoso™
            </DialogTitle>
            <DialogDescription className="text-violet-200 font-medium">
              IA criando projeto completo automaticamente...
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 p-6">
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
                className="p-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full shadow-2xl"
              >
                <Brain className="h-12 w-12 text-white" />
              </motion.div>
            </div>
            
            <div className="text-center space-y-4">
              <h3 className="font-black text-xl text-white">Gerando projeto inteligente...</h3>
              <p className="text-violet-200 font-medium">
                A IA está analisando as melhores estratégias e criando módulos otimizados para seu sucesso.
              </p>
            </div>
            
            <div className="w-full bg-violet-800/50 rounded-full h-4">
              <motion.div 
                className="bg-gradient-to-r from-violet-400 to-purple-400 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="absolute bottom-6 left-6 z-40">
        <Card className="bg-black/30 backdrop-blur-xl border border-violet-500/30 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                <span className="text-white font-bold">{canvasState.nodes.length} módulos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                <span className="text-white font-bold">
                  {canvasState.nodes.filter(n => n.progress === 100).length} completos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                <span className="text-white font-bold">
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => {
            setNewNodePosition({ x: 400, y: 300 });
            setShowNodeCreator(true);
          }}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 text-white shadow-2xl border-0 transition-all duration-200 focus:ring-4 focus:ring-violet-300"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </motion.div>
    </div>
  );
}