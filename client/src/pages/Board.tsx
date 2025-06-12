import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NodePopup } from '@/components/NodePopup';
import { ActionButton, DownloadButton } from '@/components/ActionButton';
import { InteractiveFeedback, FeedbackButton } from '@/components/InteractiveFeedback';
import { 
  Plus, Move, ZoomIn, ZoomOut, Grid, Save, Download,
  FileText, Video, Mail, Target, TrendingUp, Brain,
  Crown, Settings, Home, Trash2, Edit3, Maximize2,
  Play, Pause, RefreshCw, Copy, Share2, Eye
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  gerarProdutoIA,
  gerarPaginaVendas,
  gerarVideoIA,
  iniciarCampanhaAds,
  gerarFunilCompleto,
  baixarPDF,
  gerarCopy,
  gerarAvatarIA,
  ativarIAEspia,
  criarPaginaVendas
} from '@/lib/aiActions';

interface Node {
  id: string;
  type: string;
  title: string;
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: string;
  progress: number;
  connections: string[];
  data?: any;
}

interface CanvasState {
  nodes: Node[];
  zoom: number;
  pan: { x: number; y: number };
}

export default function Board() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<Node | null>(null);
  const [showNodePopup, setShowNodePopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodeCreator, setShowNodeCreator] = useState(false);
  const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 });
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    nodes: [],
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  // Load canvas state
  const { data: canvasData } = useQuery({
    queryKey: ['/api/canvas/state']
  });

  // Initialize canvas state when data loads
  React.useEffect(() => {
    if (canvasData && typeof canvasData === 'object') {
      setCanvasState(canvasData as CanvasState);
    }
  }, [canvasData]);

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

  const nodeTypes = [
    { id: 'produto', title: 'Criador de Produto', icon: Brain, color: 'bg-purple-500', description: 'Gere produtos digitais completos com IA' },
    { id: 'copywriting', title: 'Copywriter IA', icon: FileText, color: 'bg-blue-500', description: 'Crie copies persuasivas e headlines' },
    { id: 'vsl', title: 'Gerador de VSL', icon: Video, color: 'bg-red-500', description: 'Roteiros de vídeo de alta conversão' },
    { id: 'funnel', title: 'Construtor de Funil', icon: Target, color: 'bg-green-500', description: 'Funis completos otimizados' },
    { id: 'traffic', title: 'Máquina de Tráfego', icon: TrendingUp, color: 'bg-yellow-500', description: 'Campanhas de tráfego inteligentes' },
    { id: 'email', title: 'Sequências de Email', icon: Mail, color: 'bg-indigo-500', description: 'Automações de email marketing' },
    { id: 'strategy', title: 'Estrategista IA', icon: Crown, color: 'bg-orange-500', description: 'Planejamento estratégico completo' }
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
      size: { width: 300, height: 200 },
      status: 'pending',
      progress: 0,
      connections: [],
      content: {}
    };

    createNodeMutation.mutate(newNode);
  };

  const renderNode = (node: Node) => {
    const nodeType = nodeTypes.find(t => t.id === node.type);
    const Icon = nodeType?.icon || Settings;
    const isSelected = selectedNode === node.id;

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
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${nodeType?.color || 'bg-gray-500'}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">{node.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {node.type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progresso</span>
                <span>{node.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${node.progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <FeedbackButton
                nodeId={node.id}
                nodeType={node.type}
                actionName={`Executar ${nodeType?.title || node.type}`}
                className="flex-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={async () => {
                  // Execute based on node type with real functions
                  switch (node.type) {
                    case 'produto':
                      const productResult = await gerarProdutoIA({
                        niche: 'marketing-digital',
                        audience: 'empreendedores',
                        priceRange: 'R$ 297 - R$ 497'
                      });
                      handleNodeUpdate(node.id, { 
                        progress: 100, 
                        status: 'completed',
                        content: productResult.data 
                      });
                      return productResult;
                    case 'copywriting':
                      const copyResult = await gerarCopy({
                        tipo: 'headline',
                        produto: 'Produto Digital',
                        audience: 'empreendedores',
                        objetivo: 'conversão'
                      });
                      handleNodeUpdate(node.id, { 
                        progress: 100, 
                        status: 'completed',
                        content: copyResult.data 
                      });
                      return copyResult;
                    case 'vsl':
                      const vslResult = await gerarVideoIA({
                        produto: 'Curso Digital',
                        duracao: '10-15 minutos',
                        audience: 'empreendedores'
                      });
                      handleNodeUpdate(node.id, { 
                        progress: 100, 
                        status: 'completed',
                        content: vslResult.data 
                      });
                      return vslResult;
                    case 'funnel':
                      const funnelResult = await gerarFunilCompleto({
                        produto: 'Produto Digital',
                        audience: 'empreendedores',
                        objetivo: 'vendas'
                      });
                      handleNodeUpdate(node.id, { 
                        progress: 100, 
                        status: 'completed',
                        content: funnelResult.data 
                      });
                      return funnelResult;
                    case 'traffic':
                      const trafficResult = await iniciarCampanhaAds({
                        produto: 'Produto Digital',
                        budget: 100,
                        platform: 'Facebook',
                        audience: 'empreendedores'
                      });
                      handleNodeUpdate(node.id, { 
                        progress: 100, 
                        status: 'completed',
                        content: trafficResult.data 
                      });
                      return trafficResult;
                    default:
                      const defaultResult = { success: true, data: { message: 'Ação executada com sucesso' } };
                      handleNodeUpdate(node.id, { 
                        progress: 100, 
                        status: 'completed',
                        content: defaultResult.data 
                      });
                      return defaultResult;
                  }
                }}
              >
                <Play className="h-3 w-3 mr-1" />
                Executar
              </FeedbackButton>
              
              <FeedbackButton
                nodeId={node.id}
                nodeType={node.type}
                actionName="Abrir configurações"
                className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={async () => {
                  handleNodeClick(node);
                  return { success: true, data: { message: 'Configurações abertas' } };
                }}
              >
                <Eye className="h-3 w-3" />
              </FeedbackButton>
            </div>

            {node.content && Object.keys(node.content).length > 0 && (
              <div className="pt-2 border-t">
                <DownloadButton
                  label="PDF"
                  downloadAction={() => baixarPDF({
                    nome: node.title,
                    tipo: node.type,
                    conteudo: node.content
                  })}
                  className="w-full text-xs"
                />
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
  }, [canvasState]);

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Canvas IA Supremo</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.1) }))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(canvasState.zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.1) }))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <ActionButton
              label="Salvar"
              loadingLabel="Salvando"
              successLabel="Salvo!"
              size="sm"
              action={async () => {
                await saveCanvasMutation.mutateAsync(canvasState);
                return { success: true, data: { message: 'Canvas salvo' } };
              }}
            />
            
            <DownloadButton
              label="Exportar"
              downloadAction={() => baixarPDF({
                nome: 'Canvas_Completo',
                tipo: 'canvas',
                conteudo: canvasState
              })}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20"
        onClick={handleCanvasClick}
        style={{
          transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Nodes */}
        <AnimatePresence>
          {canvasState.nodes.map(renderNode)}
        </AnimatePresence>

        {/* Welcome message when empty */}
        {canvasState.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-dashed border-2 border-gray-300">
              <div className="text-center space-y-4">
                <Brain className="h-12 w-12 text-purple-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Canvas IA Vazio</h2>
                <p className="text-gray-600">Clique em qualquer lugar para adicionar seu primeiro módulo IA</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {nodeTypes.slice(0, 4).map(type => (
                    <Badge key={type.id} variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {type.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Node Creator Dialog */}
      <Dialog open={showNodeCreator} onOpenChange={setShowNodeCreator}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Adicionar Módulo IA</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {nodeTypes.map(type => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => createNode(type.id)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`p-4 rounded-lg ${type.color} mx-auto w-fit`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Node Configuration Popup */}
      <NodePopup
        node={selectedNodeData}
        isOpen={showNodePopup}
        onClose={() => {
          setShowNodePopup(false);
          setSelectedNode(null);
          setSelectedNodeData(null);
        }}
        onUpdate={handleNodeUpdate}
      />

      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          onClick={() => setShowNodeCreator(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-6 left-6 z-40">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{canvasState.nodes.length} módulos</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{canvasState.nodes.filter(n => n.progress === 100).length} completos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Feedback System */}
      <InteractiveFeedback 
        nodeId="board-main"
        nodeType="canvas"
        onFeedback={(feedback) => {
          console.log('Board feedback:', feedback);
        }}
      />
    </div>
  );
}