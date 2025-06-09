import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Brain, Target, Rocket, Users, TrendingUp, FileText, Video, Mail, Download, CheckCircle, Plus, Trash2, Edit3, Copy, ZoomIn, ZoomOut, Grid, Settings, Save, Download as DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
  type: 'step' | 'decision' | 'action';
  connections: string[];
  data?: any;
  width?: number;
  height?: number;
}

interface Connection {
  from: string;
  to: string;
  type: 'flow' | 'condition' | 'dependency';
}

interface InfiniteCanvasProps {
  onExport?: (data: any) => void;
  onSave?: (data: any) => void;
  powerfulAIMode?: boolean;
}

export default function InfiniteCanvas({ onExport, onSave, powerfulAIMode }: InfiniteCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [nodes, setNodes] = useState<CanvasNode[]>([
    {
      id: '1',
      x: 400,
      y: 100,
      title: 'Análise de Mercado',
      description: 'Pesquisa e análise competitiva com IA',
      icon: <Brain className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['2', '3', '4', '5'],
      width: 200,
      height: 120
    },
    {
      id: '2',
      x: 200,
      y: 280,
      title: 'Público-Alvo',
      description: 'Identificação e segmentação',
      icon: <Target className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['6', '7'],
      width: 180,
      height: 100
    },
    {
      id: '3',
      x: 400,
      y: 280,
      title: 'Estratégia de Produto',
      description: 'Posicionamento e diferenciação',
      icon: <Rocket className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['6', '7'],
      width: 180,
      height: 100
    },
    {
      id: '4',
      x: 600,
      y: 280,
      title: 'Análise Competitiva',
      description: 'Mapeamento da concorrência',
      icon: <Users className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['8', '9'],
      width: 180,
      height: 100
    },
    {
      id: '5',
      x: 800,
      y: 280,
      title: 'Projeção ROI',
      description: 'Estimativas e métricas',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['8', '9'],
      width: 180,
      height: 100
    },
    {
      id: '6',
      x: 300,
      y: 460,
      title: 'Copy Persuasivo',
      description: 'Textos de alta conversão',
      icon: <FileText className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['10'],
      width: 180,
      height: 100
    },
    {
      id: '7',
      x: 500,
      y: 460,
      title: 'VSL Profissional',
      description: 'Video Sales Letter',
      icon: <Video className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['10'],
      width: 180,
      height: 100
    },
    {
      id: '8',
      x: 700,
      y: 460,
      title: 'Email Marketing',
      description: 'Sequências automatizadas',
      icon: <Mail className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['10'],
      width: 180,
      height: 100
    },
    {
      id: '9',
      x: 900,
      y: 460,
      title: 'Landing Pages',
      description: 'Páginas otimizadas',
      icon: <Download className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: ['10'],
      width: 180,
      height: 100
    },
    {
      id: '10',
      x: 500,
      y: 640,
      title: 'Produto Finalizado',
      description: 'Compilação e entrega',
      icon: <CheckCircle className="w-6 h-6" />,
      status: 'pending',
      type: 'action',
      connections: [],
      width: 200,
      height: 120
    }
  ]);

  const [connections] = useState<Connection[]>([
    { from: '1', to: '2', type: 'flow' },
    { from: '1', to: '3', type: 'flow' },
    { from: '1', to: '4', type: 'flow' },
    { from: '1', to: '5', type: 'flow' },
    { from: '2', to: '6', type: 'flow' },
    { from: '3', to: '6', type: 'flow' },
    { from: '3', to: '7', type: 'flow' },
    { from: '4', to: '8', type: 'flow' },
    { from: '4', to: '9', type: 'flow' },
    { from: '5', to: '8', type: 'flow' },
    { from: '5', to: '9', type: 'flow' },
    { from: '6', to: '10', type: 'flow' },
    { from: '7', to: '10', type: 'flow' },
    { from: '8', to: '10', type: 'flow' },
    { from: '9', to: '10', type: 'flow' }
  ]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY * -0.001;
      const newZoom = Math.min(Math.max(0.1, zoom + delta), 3);
      setZoom(newZoom);
    } else {
      setPanX(prev => prev - e.deltaX);
      setPanY(prev => prev - e.deltaY);
    }
  }, [zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const handleNodeEdit = (nodeId: string, updates: Partial<CanvasNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleNodeDuplicate = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const newNode: CanvasNode = {
        ...node,
        id: `${nodeId}_copy_${Date.now()}`,
        x: node.x + 50,
        y: node.y + 50,
        connections: []
      };
      setNodes(prev => [...prev, newNode]);
    }
  };

  const addNewNode = () => {
    const newNode: CanvasNode = {
      id: `node_${Date.now()}`,
      x: 500 + Math.random() * 200,
      y: 300 + Math.random() * 200,
      title: 'Nova Etapa',
      description: 'Descrição da etapa',
      icon: <Plus className="w-6 h-6" />,
      status: 'pending',
      type: 'step',
      connections: [],
      width: 180,
      height: 100
    };
    setNodes(prev => [...prev, newNode]);
  };

  const renderConnections = () => {
    return connections.map((conn, index) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return null;

      const fromX = fromNode.x + (fromNode.width || 180) / 2;
      const fromY = fromNode.y + (fromNode.height || 100);
      const toX = toNode.x + (toNode.width || 180) / 2;
      const toY = toNode.y;

      const controlY = fromY + (toY - fromY) / 2;

      return (
        <path
          key={`${conn.from}-${conn.to}-${index}`}
          d={`M ${fromX} ${fromY} Q ${fromX} ${controlY} ${toX} ${toY}`}
          stroke="#4f46e5"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          className="transition-all duration-300"
        />
      );
    });
  };

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: showSidebar ? 0 : -300 }}
        animate={{ x: showSidebar ? 0 : -300 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-30 border-r"
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Controles do Canvas</h2>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Canvas Controls */}
          <div className="space-y-2">
            <h3 className="font-semibold">Visualização</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Node Controls */}
          <div className="space-y-2">
            <h3 className="font-semibold">Elementos</h3>
            <Button
              onClick={addNewNode}
              className="w-full"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Etapa
            </Button>
          </div>

          {/* Selected Node Editor */}
          {selectedNodeData && (
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold">Editar Elemento</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={selectedNodeData.title}
                  onChange={(e) => handleNodeEdit(selectedNode!, { title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={selectedNodeData.description}
                  onChange={(e) => handleNodeEdit(selectedNode!, { description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={selectedNodeData.status}
                  onChange={(e) => handleNodeEdit(selectedNode!, { status: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="pending">Pendente</option>
                  <option value="active">Ativo</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleNodeDuplicate(selectedNode!)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleNodeDelete(selectedNode!)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Export Controls */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Exportar</h3>
            <Button
              onClick={() => onSave?.({ nodes, connections })}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Projeto
            </Button>
            <Button
              onClick={() => onExport?.({ nodes, connections })}
              size="sm"
              className="w-full"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Exportar Funil
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-20 border-b">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Canvas Infinito - Gerador de Funis IA</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {nodes.length} elementos • Zoom {Math.round(zoom * 100)}%
            </span>
            <Button
              onClick={() => {
                setZoom(1);
                setPanX(0);
                setPanY(0);
              }}
              variant="outline"
              size="sm"
            >
              Resetar Vista
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 overflow-hidden relative"
        style={{ marginTop: '64px', marginLeft: showSidebar ? '320px' : '0' }}
      >
        <motion.div
          className="w-full h-full relative cursor-grab active:cursor-grabbing"
          style={{
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            transformOrigin: '0 0'
          }}
          drag
          onDrag={(_, info: PanInfo) => {
            setPanX(prev => prev + info.delta.x / zoom);
            setPanY(prev => prev + info.delta.y / zoom);
          }}
        >
          {/* Grid Background */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}

          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
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
                  fill="#4f46e5"
                />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className={`absolute cursor-pointer select-none ${
                selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                left: node.x,
                top: node.y,
                width: node.width || 180,
                height: node.height || 100
              }}
              drag
              dragMomentum={false}
              onDrag={(_, info) => {
                handleNodeDrag(node.id, node.x + info.delta.x, node.y + info.delta.y);
              }}
              onClick={() => handleNodeClick(node.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`w-full h-full border-2 transition-all duration-200 ${
                node.status === 'completed' 
                  ? 'bg-green-50 border-green-500' 
                  : node.status === 'active'
                  ? 'bg-blue-50 border-blue-500 shadow-lg'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}>
                <CardContent className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${
                        node.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : node.status === 'active'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {node.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{node.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {node.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      node.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : node.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {node.status === 'completed' ? 'Concluído' : 
                       node.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                    
                    {selectedNode === node.id && (
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                          className="p-1 rounded hover:bg-gray-200"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}