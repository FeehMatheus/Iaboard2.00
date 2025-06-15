import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Play,
  Settings,
  Download,
  Save,
  Zap,
  Brain,
  Video,
  FileText,
  Target,
  Users,
  TrendingUp,
  Crown,
  Sparkles,
  Rocket,
  Trash2,
  Grid3X3,
  Maximize2,
  RotateCcw,
  MousePointer2,
  Hand,
  Move3D
} from 'lucide-react';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  data: {
    title: string;
    description: string;
    prompt?: string;
    parameters?: Record<string, any>;
    result?: any;
  };
}

interface CanvasState {
  nodes: Node[];
  connections: Array<{ from: string; to: string }>;
  zoom: number;
  pan: { x: number; y: number };
}

const nodeTypes = [
  { id: 'ai-content', title: 'IA Content', description: 'Gerador de conteúdo', icon: Brain, color: 'from-purple-500 to-indigo-600' },
  { id: 'video-gen', title: 'Video Gen', description: 'Criador de vídeos', icon: Video, color: 'from-red-500 to-pink-600' },
  { id: 'copy-gen', title: 'Copy Gen', description: 'Copywriting AI', icon: FileText, color: 'from-blue-500 to-cyan-600' },
  { id: 'funnel-gen', title: 'Funnel Gen', description: 'Criador de funis', icon: Target, color: 'from-green-500 to-emerald-600' },
  { id: 'audience-gen', title: 'Audience Gen', description: 'Análise de audiência', icon: Users, color: 'from-orange-500 to-yellow-600' },
  { id: 'traffic-gen', title: 'Traffic Gen', description: 'Gerador de tráfego', icon: TrendingUp, color: 'from-violet-500 to-purple-600' },
];

export default function IABoardSupreme() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    nodes: [],
    connections: [],
    zoom: 1,
    pan: { x: 0, y: 0 }
  });
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodePopup, setShowNodePopup] = useState(false);
  const [executingNodes, setExecutingNodes] = useState<Set<string>>(new Set());
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);

  // Initialize canvas with sample nodes
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: '1',
        type: 'ai-content',
        position: { x: 200, y: 150 },
        size: { width: 280, height: 200 },
        status: 'idle',
        progress: 0,
        data: {
          title: 'IA Content Generator',
          description: 'Gerador de conteúdo com IA avançada',
          prompt: 'Crie um artigo sobre marketing digital'
        }
      },
      {
        id: '2',
        type: 'video-gen',
        position: { x: 600, y: 150 },
        size: { width: 280, height: 200 },
        status: 'idle',
        progress: 0,
        data: {
          title: 'Video Generator',
          description: 'Criador automático de vídeos',
          prompt: 'Gere um vídeo promocional'
        }
      },
      {
        id: '3',
        type: 'copy-gen',
        position: { x: 200, y: 400 },
        size: { width: 280, height: 200 },
        status: 'idle',
        progress: 0,
        data: {
          title: 'Copy Generator',
          description: 'Copywriting automático',
          prompt: 'Escreva copy para landing page'
        }
      }
    ];
    
    setCanvasState(prev => ({ ...prev, nodes: initialNodes }));
  }, []);

  const handleCanvasRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - canvasState.pan.x) / canvasState.zoom;
    const y = (e.clientY - rect.top - canvasState.pan.y) / canvasState.zoom;

    setShowNodePopup(true);
  }, [canvasState.pan, canvasState.zoom]);

  const addNode = useCallback((type: string) => {
    const nodeType = nodeTypes.find(t => t.id === type);
    if (!nodeType) return;

    const newNode: Node = {
      id: Date.now().toString(),
      type,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
      size: { width: 280, height: 200 },
      status: 'idle',
      progress: 0,
      data: {
        title: nodeType.title,
        description: nodeType.description,
        prompt: ''
      }
    };

    setCanvasState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));

    setShowNodePopup(false);
    toast({
      title: "Módulo adicionado",
      description: `${nodeType.title} foi adicionado ao canvas.`,
    });
  }, [toast]);

  const executeNode = useCallback(async (nodeId: string) => {
    setExecutingNodes(prev => {
      const newSet = new Set(prev);
      newSet.add(nodeId);
      return newSet;
    });
    
    setCanvasState(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === nodeId 
          ? { ...n, status: 'processing', progress: 0 }
          : n
      )
    }));

    try {
      const node = canvasState.nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Simulate AI processing with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setCanvasState(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => 
            n.id === nodeId 
              ? { ...n, progress }
              : n
          )
        }));
      }

      // Mock API call
      const response = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: node.type,
          prompt: node.data.prompt,
          parameters: node.data.parameters
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        setCanvasState(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => 
            n.id === nodeId 
              ? { 
                  ...n, 
                  status: 'completed', 
                  progress: 100,
                  data: { ...n.data, result: result.content }
                }
              : n
          )
        }));

        toast({
          title: "Execução concluída",
          description: `${node.data.title} foi executado com sucesso.`,
        });
      }
    } catch (error) {
      setCanvasState(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === nodeId 
            ? { ...n, status: 'error', progress: 0 }
            : n
        )
      }));

      toast({
        title: "Erro na execução",
        description: "Falha ao executar o módulo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setExecutingNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    }
  }, [canvasState.nodes, toast]);

  const deleteNode = useCallback((nodeId: string) => {
    setCanvasState(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
    }));
    
    toast({
      title: "Módulo removido",
      description: "O módulo foi removido do canvas.",
    });
  }, [toast]);

  const updateNodeData = useCallback((nodeId: string, data: Partial<Node['data']>) => {
    setCanvasState(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === nodeId 
          ? { ...n, data: { ...n.data, ...data } }
          : n
      )
    }));
  }, []);

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
          setCanvasState(prev => ({
            ...prev,
            nodes: prev.nodes.map(n => 
              n.id === node.id ? { ...n, position: newPosition } : n
            )
          }));
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
        whileDrag={{ scale: 1.05 }}
        onClick={() => setSelectedNode(node.id)}
      >
        <Card className={`h-full transition-all duration-300 ${
          isSelected ? 'ring-2 ring-cyan-400 shadow-2xl shadow-cyan-400/20' : 'shadow-xl'
        } ${node.status === 'processing' ? 'animate-pulse border-yellow-400' : 
          node.status === 'completed' ? 'border-green-400' : 
          node.status === 'error' ? 'border-red-400' : 'border-gray-700'
        } bg-black/60 backdrop-blur-lg border-2`}>
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-gradient-to-r ${nodeType?.color} text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-white">{node.data.title}</CardTitle>
                  <p className="text-xs text-gray-400">{node.data.description}</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    executeNode(node.id);
                  }}
                  disabled={isExecuting}
                  className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                >
                  {isExecuting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Badge 
                variant={node.status === 'completed' ? 'default' : 'secondary'} 
                className={`text-xs ${
                  node.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500' :
                  node.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' :
                  node.status === 'error' ? 'bg-red-500/20 text-red-400 border-red-500' :
                  'bg-gray-500/20 text-gray-400 border-gray-500'
                }`}
              >
                {node.status === 'idle' ? 'Pronto' : 
                 node.status === 'processing' ? 'Processando...' : 
                 node.status === 'completed' ? 'Concluído' : 'Erro'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-300">Prompt:</label>
                <Textarea
                  value={node.data.prompt || ''}
                  onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
                  className="text-xs mt-1 bg-gray-800/50 border-gray-600 text-white"
                  rows={2}
                  placeholder="Digite seu prompt aqui..."
                />
              </div>
              
              {node.status === 'processing' && (
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progresso</span>
                    <span>{node.progress}%</span>
                  </div>
                  <Progress 
                    value={node.progress} 
                    className="h-2 bg-gray-700"
                  />
                </div>
              )}
              
              {node.data.result && (
                <div>
                  <label className="text-xs font-medium text-gray-300">Resultado:</label>
                  <div className="text-xs mt-1 p-2 bg-gray-800/50 border border-gray-600 rounded text-gray-300 max-h-20 overflow-y-auto">
                    {typeof node.data.result === 'string' ? node.data.result : JSON.stringify(node.data.result, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,122,122,0.3),_transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-white">IA Board Supreme</h1>
                <Badge variant="secondary" className="text-xs">Pro</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grade
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: 1, pan: { x: 0, y: 0 } }))}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>

              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20 cursor-crosshair"
        onContextMenu={handleCanvasRightClick}
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
          {/* Grid Background */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />
          )}

          {/* Nodes */}
          {canvasState.nodes.map(renderNode)}

          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none">
            {canvasState.connections.map((connection, index) => {
              const fromNode = canvasState.nodes.find(n => n.id === connection.from);
              const toNode = canvasState.nodes.find(n => n.id === connection.to);
              
              if (!fromNode || !toNode) return null;
              
              const fromX = fromNode.position.x + fromNode.size.width;
              const fromY = fromNode.position.y + fromNode.size.height / 2;
              const toX = toNode.position.x;
              const toY = toNode.position.y + toNode.size.height / 2;
              
              return (
                <line
                  key={index}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="rgba(59, 130, 246, 0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Add Node Popup */}
      <AnimatePresence>
        {showNodePopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNodePopup(false)}
          >
            <motion.div
              className="bg-gray-900/90 backdrop-blur-lg rounded-2xl p-6 border border-white/10 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Adicionar Módulo IA
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {nodeTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addNode(type.id)}
                      className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{type.title}</div>
                          <div className="text-xs text-gray-400">{type.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.1) }))}
          className="bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 border border-white/10"
        >
          +
        </Button>
        <div className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/10">
          {Math.round(canvasState.zoom * 100)}%
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom - 0.1) }))}
          className="bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 border border-white/10"
        >
          -
        </Button>
      </div>

      {/* Stats */}
      <div className="absolute bottom-6 left-6 z-40">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/10">
          <div className="text-xs text-white/70 space-y-1">
            <div>Módulos: {canvasState.nodes.length}</div>
            <div>Conexões: {canvasState.connections.length}</div>
            <div>Executando: {Array.from(executingNodes).length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}