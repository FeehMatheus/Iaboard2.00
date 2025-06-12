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
  Loader2, Settings, Trash2, Copy, Edit3, Grid3X3, Maximize2,
  Users, DollarSign, Rocket, Star
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

interface ContextMenu {
  x: number;
  y: number;
  show: boolean;
}

export default function Board() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodePopup, setShowNodePopup] = useState(false);
  const [executingNodes, setExecutingNodes] = useState<Set<string>>(new Set());
  const [showGrid, setShowGrid] = useState(true);
  const [showInitialDecision, setShowInitialDecision] = useState(true);
  const [workflowMode, setWorkflowMode] = useState<'mpp' | 'manual' | null>(null);
  const [showPensamentoPoderoso, setShowPensamentoPoderoso] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const { updateContext, markActionCompleted, state } = useGuidance();
  const [selectedVideoNode, setSelectedVideoNode] = useState<string | null>(null);
  const [videoGenerating, setVideoGenerating] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNodeId, setLinkNodeId] = useState('');
  
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    x: 0,
    y: 0,
    show: false
  });
  
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

  useEffect(() => {
    if (canvasData && typeof canvasData === 'object') {
      setCanvasState(canvasData as CanvasState);
    }
  }, [canvasData]);

  // Update guidance context when entering board
  useEffect(() => {
    updateContext('board');
  }, [updateContext]);

  // Real AI Integration
  const executeRealAI = async (prompt: string, type: string): Promise<any> => {
    try {
      const response = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type,
          context: { workflowMode }
        })
      });
      
      if (!response.ok) throw new Error('AI service failed');
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

  const nodeTypes = [
    { 
      id: 'produto', 
      title: 'Criador de Produto IA', 
      icon: Brain, 
      color: 'from-violet-600 to-purple-600', 
      description: 'Gere produtos digitais completos com IA'
    },
    { 
      id: 'copywriting', 
      title: 'Copywriter Supremo', 
      icon: FileText, 
      color: 'from-blue-600 to-indigo-600', 
      description: 'Crie copies persuasivas e headlines'
    },
    { 
      id: 'vsl', 
      title: 'Gerador VSL IA', 
      icon: Video, 
      color: 'from-red-600 to-pink-600', 
      description: 'Roteiros de vídeo de alta conversão'
    },
    { 
      id: 'funnel', 
      title: 'Construtor Funil', 
      icon: Target, 
      color: 'from-green-600 to-emerald-600', 
      description: 'Funis completos otimizados'
    },
    { 
      id: 'traffic', 
      title: 'Máquina de Tráfego', 
      icon: TrendingUp, 
      color: 'from-yellow-500 to-orange-500', 
      description: 'Campanhas de tráfego inteligentes'
    },
    { 
      id: 'email', 
      title: 'Sequências Email IA', 
      icon: Mail, 
      color: 'from-indigo-600 to-blue-600', 
      description: 'Automações de email marketing'
    },
    { 
      id: 'strategy', 
      title: 'Estrategista IA Supremo', 
      icon: Crown, 
      color: 'from-orange-600 to-red-600', 
      description: 'Planejamento estratégico completo'
    },
    { 
      id: 'landing', 
      title: 'Landing Page IA', 
      icon: Monitor, 
      color: 'from-cyan-600 to-teal-600', 
      description: 'Páginas de conversão otimizadas'
    },
    { 
      id: 'analytics', 
      title: 'Analytics IA Plus', 
      icon: BarChart3, 
      color: 'from-pink-600 to-rose-600', 
      description: 'Análise e otimização com IA'
    },
    { 
      id: 'branding', 
      title: 'Branding Master IA', 
      icon: Award, 
      color: 'from-teal-600 to-cyan-600', 
      description: 'Identidade visual e branding'
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

  // Right-click context menu
  const handleCanvasRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (workflowMode === 'manual') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          show: true
        });
      }
    }
  }, [workflowMode]);

  const handleCanvasLeftClick = useCallback((e: React.MouseEvent) => {
    if (contextMenu.show) {
      setContextMenu(prev => ({ ...prev, show: false }));
    }
  }, [contextMenu.show]);

  const createNodeFromContextMenu = async (type: string) => {
    const nodeType = nodeTypes.find(t => t.id === type);
    if (!nodeType) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (contextMenu.x - rect.left - canvasState.pan.x) / canvasState.zoom;
    const y = (contextMenu.y - rect.top - canvasState.pan.y) / canvasState.zoom;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      title: nodeType.title,
      position: { x, y },
      size: { width: 350, height: 280 },
      status: 'pending',
      progress: 0,
      connections: [],
      content: {},
      data: {}
    };

    setCanvasState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));

    setContextMenu(prev => ({ ...prev, show: false }));

    toast({
      title: "Módulo criado",
      description: `${nodeType.title} adicionado ao canvas.`,
    });
  };

  const executeNode = async (node: Node) => {
    if (executingNodes.has(node.id)) return;

    setExecutingNodes(prev => new Set(prev).add(node.id));
    
    // Update node status
    setCanvasState(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === node.id 
          ? { ...n, status: 'processing', progress: 10 }
          : n
      )
    }));

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setCanvasState(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => 
            n.id === node.id && n.progress < 90
              ? { ...n, progress: Math.min(n.progress + 15, 90) }
              : n
          )
        }));
      }, 500);

      // Real AI execution
      const aiPrompt = `Execute ${node.type} task for: ${node.title}`;
      const result = await executeRealAI(aiPrompt, node.type);

      clearInterval(progressInterval);

      // Update with real results
      setCanvasState(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === node.id 
            ? { 
                ...n, 
                status: 'completed', 
                progress: 100,
                result: result.data,
                content: result.data
              }
            : n
        )
      }));

      toast({
        title: "Tarefa concluída",
        description: `${node.title} executado com sucesso!`,
      });

    } catch (error) {
      setCanvasState(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => 
          n.id === node.id 
            ? { ...n, status: 'error', progress: 0 }
            : n
        )
      }));

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

  const startMPPMode = async () => {
    setWorkflowMode('mpp');
    setShowInitialDecision(false);
    setShowPensamentoPoderoso(true);

    try {
      const response = await fetch('/api/ai/pensamento-poderoso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'full_auto' })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.nodes) {
          setCanvasState(prev => ({
            ...prev,
            nodes: result.nodes
          }));
          
          toast({
            title: "Modo Pensamento Poderoso™ Ativado",
            description: `${result.nodes.length} módulos criados automaticamente!`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro no MPP",
        description: "Falha ao ativar o modo automático.",
        variant: "destructive"
      });
    }
    
    setShowPensamentoPoderoso(false);
  };

  const startManualMode = () => {
    setWorkflowMode('manual');
    setShowInitialDecision(false);
    
    toast({
      title: "Modo Manual Ativado",
      description: "Clique com o botão direito para adicionar módulos.",
    });
  };

  // Video generation functions
  const generateNodeVideo = async (node: Node) => {
    if (videoGenerating) return;

    setVideoGenerating(true);
    setSelectedVideoNode(node.id);

    try {
      let videoResponse;
      
      if (node.type === 'vsl') {
        videoResponse = await fetch('/api/video/generate-vsl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productInfo: node.title + ' - ' + (node.content?.description || 'Produto digital inovador'),
            duration: 120
          })
        });
      } else {
        videoResponse = await fetch('/api/video/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: `Apresentando ${node.title}: ${node.type === 'copywriting' ? 'Textos de alta conversão' : 
                     node.type === 'funnel' ? 'Funis otimizados para vendas' :
                     node.type === 'traffic' ? 'Campanhas de tráfego inteligentes' :
                     'Solução completa com IA'}. Transforme seu negócio com tecnologia avançada.`,
            style: node.type === 'vsl' ? 'vsl' : 'promotional',
            duration: 90,
            voiceGender: 'female'
          })
        });
      }

      if (videoResponse.ok) {
        const result = await videoResponse.json();
        
        // Update node with video data
        setCanvasState(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => 
            n.id === node.id 
              ? { 
                  ...n, 
                  result: { ...n.result, video: result.video },
                  content: { ...n.content, video: result.video }
                }
              : n
          )
        }));

        toast({
          title: "Vídeo gerado com sucesso",
          description: "Vídeo real criado com IA e disponível para visualização.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na geração do vídeo",
        description: "Falha ao gerar vídeo com IA.",
        variant: "destructive"
      });
    } finally {
      setVideoGenerating(false);
      setSelectedVideoNode(null);
    }
  };

  const processExternalLink = async (nodeId: string, url: string) => {
    try {
      const response = await fetch('/api/video/process-external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update node with processed link data
        setCanvasState(prev => ({
          ...prev,
          nodes: prev.nodes.map(n => 
            n.id === nodeId 
              ? { 
                  ...n, 
                  data: { ...n.data, externalLink: url, processedData: result.data }
                }
              : n
          )
        }));

        toast({
          title: "Link processado",
          description: "Link externo analisado e integrado com IA.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Falha ao processar link externo.",
        variant: "destructive"
      });
    }
  };

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
          onClick={() => setSelectedNode(isSelected ? null : node.id)}
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
                  setShowNodePopup(true);
                }}
                className="text-xs px-3 py-2 border-2 border-violet-300 text-violet-700 rounded-xl hover:bg-violet-50 transition-all duration-200 focus:ring-2 focus:ring-violet-300 focus:ring-offset-2"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>

            {/* Results Display */}
            {node.status === 'completed' && node.result && (
              <div className="space-y-2 pt-2 border-t border-violet-100">
                <div className="text-xs text-gray-700 bg-green-50 p-2 rounded-lg">
                  <strong>Resultado:</strong> {typeof node.result === 'string' 
                    ? node.result.substring(0, 100) + '...' 
                    : 'Conteúdo gerado com sucesso'}
                </div>
                
                {/* Video Display */}
                {node.result?.video && (
                  <div className="bg-gray-100 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-bold text-gray-800">Vídeo Gerado com IA</span>
                    </div>
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-2 relative group cursor-pointer"
                         onClick={() => window.open(node.result.video.videoUrl, '_blank')}>
                      {node.result.video.thumbnailUrl ? (
                        <img 
                          src={node.result.video.thumbnailUrl} 
                          alt="Video thumbnail" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-white">
                          <Play className="h-8 w-8 mx-auto mb-1" />
                          <span className="text-xs">Clique para assistir</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-purple-600 ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      Duração: {node.result.video.scriptData?.totalDuration || 60}s | 
                      Criado com {node.result.video.metadata?.style || 'IA'}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      generateNodeVideo(node);
                    }}
                    disabled={videoGenerating && selectedVideoNode === node.id}
                    className="flex-1 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 rounded-xl hover:opacity-90 transition-all duration-200 shadow-md font-medium"
                  >
                    {videoGenerating && selectedVideoNode === node.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Video className="h-3 w-3 mr-1" />
                    )}
                    {videoGenerating && selectedVideoNode === node.id ? 'Gerando...' : 'Gerar Vídeo'}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLinkNodeId(node.id);
                      setShowLinkDialog(true);
                    }}
                    className="flex-1 text-xs bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 rounded-xl hover:opacity-90 transition-all duration-200 shadow-md font-medium"
                  >
                    <Link className="h-3 w-3 mr-1" />
                    Link
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportProject('pdf');
                    }}
                    className="flex-1 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 rounded-xl hover:opacity-90 transition-all duration-200 shadow-md font-medium"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            )}

            {/* External Link Display */}
            {node.data?.externalLink && (
              <div className="pt-2 border-t border-violet-100">
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-3 w-3" />
                    <span className="font-bold">Link Conectado</span>
                  </div>
                  <div className="truncate">{node.data.externalLink}</div>
                  {node.data.processedData && (
                    <div className="mt-1 text-xs text-gray-600">
                      ✓ Processado com IA - Insights disponíveis
                    </div>
                  )}
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

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        setContextMenu(prev => ({ ...prev, show: false }));
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu.show]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
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
                onClick={() => exportProject('zip')}
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
          </div>
        </div>
      </div>

      {/* Infinite Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20 cursor-crosshair"
        onContextMenu={handleCanvasRightClick}
        onClick={handleCanvasLeftClick}
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
                  linear-gradient(rgba(139,69,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(139,69,255,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          )}

          {/* Render Nodes */}
          <AnimatePresence>
            {canvasState.nodes.map(renderNode)}
          </AnimatePresence>

          {/* Welcome Message */}
          {canvasState.nodes.length === 0 && workflowMode === 'manual' && (
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
                <h3 className="text-3xl font-black text-white mb-3">Clique com o botão direito</h3>
                <p className="text-violet-200 mb-6 text-lg font-medium">para adicionar módulos IA ao canvas</p>
                <div className="flex items-center gap-2 justify-center">
                  <Sparkles className="h-5 w-5 text-violet-300" />
                  <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-bold">
                    Modo Manual Ativado
                  </Badge>
                  <Zap className="h-5 w-5 text-violet-300" />
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Initial Decision Dialog */}
      <Dialog open={showInitialDecision} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-violet-900 text-center mb-4">
              Como deseja começar sua criação?
            </DialogTitle>
            <DialogDescription className="text-violet-700 font-medium text-center text-lg">
              Escolha o modo de trabalho ideal para seu projeto
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer border-2 border-violet-300 hover:border-violet-500 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-violet-100 to-purple-100"
                onClick={startMPPMode}
              >
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-xl mb-6 inline-block"
                  >
                    <Crown className="h-12 w-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-violet-900 mb-4">
                    Modo Pensamento Poderoso™
                  </h3>
                  <p className="text-violet-700 font-medium mb-6">
                    A IA executa tudo automaticamente e cria o projeto completo para você
                  </p>
                  <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 px-4 py-2 font-bold">
                    Automático
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer border-2 border-blue-300 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-blue-100 to-indigo-100"
                onClick={startManualMode}
              >
                <CardContent className="p-8 text-center">
                  <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-xl mb-6 inline-block">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-blue-900 mb-4">
                    Criar Manualmente
                  </h3>
                  <p className="text-blue-700 font-medium mb-6">
                    Você decide quais módulos adicionar e controla cada etapa do processo
                  </p>
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-4 py-2 font-bold">
                    Manual
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Right-Click Context Menu */}
      <AnimatePresence>
        {contextMenu.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 1000
            }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-violet-200 p-2 min-w-64"
          >
            <div className="py-2">
              <h4 className="text-sm font-bold text-gray-700 px-3 py-2 border-b border-gray-200 mb-2">
                Adicionar Módulo IA
              </h4>
              {nodeTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-xl transition-colors"
                    onClick={() => createNodeFromContextMenu(type.id)}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} shadow-md`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{type.title}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* External Link Processing Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-violet-900 flex items-center gap-3">
              <Globe className="h-6 w-6 text-violet-600" />
              Processar Link Externo com IA
            </DialogTitle>
            <DialogDescription className="text-violet-700 font-medium">
              Cole um link de vídeo ou conteúdo para análise e integração automática com IA
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-violet-900">URL do Conteúdo</label>
              <Input
                placeholder="https://youtube.com/watch?v=... ou qualquer link de vídeo/conteúdo"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="border-2 border-violet-300 focus:border-violet-500 focus:ring-violet-500 rounded-xl h-12 text-base"
              />
              <div className="text-xs text-violet-600 bg-violet-100 p-3 rounded-lg">
                <strong>Suporte para:</strong> YouTube, Vimeo, Instagram, TikTok, links de landing pages, 
                VSLs, páginas de vendas e qualquer conteúdo online
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                O que a IA irá analisar:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Estratégias de marketing utilizadas</li>
                <li>• Elementos de conversão identificados</li>
                <li>• Análise competitiva automática</li>
                <li>• Sugestões de melhorias</li>
                <li>• Extração de insights valiosos</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (linkUrl && linkNodeId) {
                    processExternalLink(linkNodeId, linkUrl);
                    setShowLinkDialog(false);
                    setLinkUrl('');
                    setLinkNodeId('');
                  }
                }}
                disabled={!linkUrl}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 text-white rounded-xl font-bold px-6 py-3 text-base shadow-lg transition-all duration-200"
              >
                <Brain className="h-5 w-5 mr-2" />
                Processar com IA
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                  setLinkNodeId('');
                }}
                className="border-2 border-violet-300 text-violet-700 hover:bg-violet-50 rounded-xl font-bold px-6 py-3"
              >
                Cancelar
              </Button>
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

      {/* Mode Indicator */}
      {workflowMode && (
        <div className="absolute bottom-6 right-6 z-40">
          <Card className="bg-black/30 backdrop-blur-xl border border-violet-500/30 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {workflowMode === 'mpp' ? (
                  <>
                    <Crown className="h-5 w-5 text-violet-300" />
                    <span className="text-white font-bold">Modo Pensamento Poderoso™</span>
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5 text-blue-300" />
                    <span className="text-white font-bold">Modo Manual</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}