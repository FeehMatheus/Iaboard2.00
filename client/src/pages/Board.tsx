import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, Move, ZoomIn, ZoomOut, Grid, Save, Download,
  FileText, Video, Mail, Target, TrendingUp, Brain,
  Crown, Settings, Home, Trash2, Edit3, Maximize2,
  Play, Pause, RefreshCw, Copy, Share2
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
  const { data: savedState } = useQuery({
    queryKey: ['/api/canvas/state'],
    retry: 1,
  });

  // Save canvas state mutation
  const saveStateMutation = useMutation({
    mutationFn: async (state: CanvasState) => {
      return await apiRequest('POST', '/api/canvas/save', state);
    },
    onSuccess: () => {
      toast({
        title: "Canvas Salvo",
        description: "Seu trabalho foi salvo automaticamente.",
      });
    },
  });

  // Create node mutation
  const createNodeMutation = useMutation({
    mutationFn: async (nodeData: any) => {
      return await apiRequest('POST', '/api/canvas/nodes', nodeData);
    },
    onSuccess: (newNode) => {
      setCanvasState(prev => ({
        ...prev,
        nodes: [...prev.nodes, newNode]
      }));
      setShowNodeCreator(false);
      toast({
        title: "Nó Criado",
        description: "Novo nó adicionado ao canvas.",
      });
    },
  });

  useEffect(() => {
    if (savedState) {
      setCanvasState(savedState);
    }
  }, [savedState]);

  const nodeTypes = [
    { id: 'copywriting', name: 'Copy de Vendas', icon: FileText, color: 'bg-blue-500' },
    { id: 'vsl', name: 'VSL', icon: Video, color: 'bg-red-500' },
    { id: 'email', name: 'Email Marketing', icon: Mail, color: 'bg-green-500' },
    { id: 'ads', name: 'Anúncios', icon: Target, color: 'bg-yellow-500' },
    { id: 'funnel', name: 'Funil', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'strategy', name: 'Estratégia', icon: Brain, color: 'bg-pink-500' },
  ];

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - canvasState.pan.x) / canvasState.zoom;
        const y = (e.clientY - rect.top - canvasState.pan.y) / canvasState.zoom;
        setNewNodePosition({ x, y });
        setShowNodeCreator(true);
      }
    }
  }, [canvasState.pan, canvasState.zoom]);

  const handleNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode(nodeId);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    const node = canvasState.nodes.find(n => n.id === nodeId);
    if (rect && node) {
      const offsetX = e.clientX - rect.left - (node.position.x * canvasState.zoom + canvasState.pan.x);
      const offsetY = e.clientY - rect.top - (node.position.y * canvasState.zoom + canvasState.pan.y);
      setDragOffset({ x: offsetX, y: offsetY });
    }
  }, [canvasState]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && selectedNode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - canvasState.pan.x - dragOffset.x) / canvasState.zoom;
        const y = (e.clientY - rect.top - canvasState.pan.y - dragOffset.y) / canvasState.zoom;
        
        setCanvasState(prev => ({
          ...prev,
          nodes: prev.nodes.map(node =>
            node.id === selectedNode
              ? { ...node, position: { x, y } }
              : node
          )
        }));
      }
    }
  }, [isDragging, selectedNode, canvasState.pan, canvasState.zoom, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelectedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const createNode = (type: string) => {
    const nodeType = nodeTypes.find(t => t.id === type);
    if (!nodeType) return;

    const newNode = {
      type,
      title: `Novo ${nodeType.name}`,
      position: newNodePosition,
      size: { width: 280, height: 200 },
      content: {},
      status: 'pending',
      progress: 0,
    };

    createNodeMutation.mutate(newNode);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setCanvasState(prev => ({
      ...prev,
      zoom: direction === 'in' 
        ? Math.min(prev.zoom * 1.2, 3)
        : Math.max(prev.zoom / 1.2, 0.1)
    }));
  };

  const handleSave = () => {
    saveStateMutation.mutate(canvasState);
  };

  const renderNode = (node: Node) => {
    const nodeType = nodeTypes.find(t => t.id === node.type);
    if (!nodeType) return null;

    return (
      <motion.div
        key={node.id}
        className={`absolute cursor-move ${selectedNode === node.id ? 'z-50' : 'z-10'}`}
        style={{
          left: node.position.x * canvasState.zoom + canvasState.pan.x,
          top: node.position.y * canvasState.zoom + canvasState.pan.y,
          width: node.size.width * canvasState.zoom,
          height: node.size.height * canvasState.zoom,
        }}
        onMouseDown={(e) => handleNodeDragStart(e, node.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className={`h-full bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-2xl ${
          selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${nodeType.color}`} />
                <CardTitle className="text-sm text-white truncate">{node.title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Edit node
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCanvasState(prev => ({
                      ...prev,
                      nodes: prev.nodes.filter(n => n.id !== node.id)
                    }));
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {node.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <nodeType.icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">{nodeType.name}</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${node.progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{node.progress}% completo</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Execute node action
                  }}
                >
                  <Play className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-screen bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/dashboard')}
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <div className="h-6 w-px bg-gray-700" />
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Canvas Infinito</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('out')}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-400 min-w-12 text-center">
            {Math.round(canvasState.zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('in')}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <div className="h-6 w-px bg-gray-700" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saveStateMutation.isPending}
          >
            {saveStateMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="h-full bg-gray-950 relative overflow-hidden cursor-crosshair"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)
          `,
          backgroundSize: `${20 * canvasState.zoom}px ${20 * canvasState.zoom}px`,
          backgroundPosition: `${canvasState.pan.x}px ${canvasState.pan.y}px`,
        }}
      >
        {canvasState.nodes.map(renderNode)}
        
        {/* Node Creator Modal */}
        <AnimatePresence>
          {showNodeCreator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-2xl"
              style={{
                left: newNodePosition.x * canvasState.zoom + canvasState.pan.x,
                top: newNodePosition.y * canvasState.zoom + canvasState.pan.y,
              }}
            >
              <h3 className="text-sm font-semibold mb-3 text-white">Criar Novo Nó</h3>
              <div className="grid grid-cols-2 gap-2">
                {nodeTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center space-y-1"
                    onClick={() => createNode(type.id)}
                  >
                    <type.icon className="w-4 h-4" />
                    <span className="text-xs">{type.name}</span>
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => setShowNodeCreator(false)}
              >
                Cancelar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="h-8 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-6 text-xs text-gray-400">
        <div>
          {canvasState.nodes.length} nós • Zoom: {Math.round(canvasState.zoom * 100)}%
        </div>
        <div>
          Clique no canvas para criar um novo nó
        </div>
      </div>
    </div>
  );
}