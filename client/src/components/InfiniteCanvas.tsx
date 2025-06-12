import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { Brain, Target, Rocket, Users, TrendingUp, FileText, Video, Mail, Download, CheckCircle, Plus, Trash2, Edit3, Copy, Play, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, nodeId: string} | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowMode, setWorkflowMode] = useState<'powerful-ai' | 'manual' | null>(null);
  const [detailedLogs, setDetailedLogs] = useState<{[key: string]: string[]}>({});

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
      // Zoom with mouse position precision
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const delta = e.deltaY > 0 ? 0.92 : 1.08;
        const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
        
        // Zoom towards mouse position
        const zoomChange = newZoom / zoom;
        setPanX(prev => mouseX - (mouseX - prev) * zoomChange);
        setPanY(prev => mouseY - (mouseY - prev) * zoomChange);
        setZoom(newZoom);
      }
    } else {
      // Ultra-smooth panning
      const sensitivity = 1.5;
      setPanX(prev => prev - e.deltaX * sensitivity);
      setPanY(prev => prev - e.deltaY * sensitivity);
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

  const handleNodeRightClick = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const startPowerfulAIWorkflow = () => {
    setWorkflowMode('powerful-ai');
    setShowInitialModal(false);
    setIsAnimating(true);
    setCurrentStep(1);
    
    // Start animated sequence
    animateToStep(1);
  };

  const startManualWorkflow = () => {
    setWorkflowMode('manual');
    setShowInitialModal(false);
  };

  const animateToStep = async (step: number) => {
    const node = nodes.find(n => n.id === step.toString());
    if (node) {
      // Smooth camera movement to node
      const targetX = -node.x * zoom + window.innerWidth / 2;
      const targetY = -node.y * zoom + window.innerHeight / 2;
      
      setPanX(targetX);
      setPanY(targetY);
      
      // Update node status with animation
      setNodes(prev => prev.map(n => 
        n.id === step.toString() 
          ? { ...n, status: 'active' as const }
          : n.id === (step - 1).toString()
          ? { ...n, status: 'completed' as const }
          : { ...n, status: 'pending' as const }
      ));

      // Add detailed logs with real processing
      const stepTitles: {[key: string]: string} = {
        '1': 'Análise de Mercado',
        '2': 'Definição de Público',
        '3': 'Criação de Copy',
        '4': 'Desenvolvimento VSL',
        '5': 'Automação Email',
        '6': 'Landing Pages',
        '7': 'Funil Completo',
        '8': 'Otimização',
        '9': 'Finalização',
        '10': 'Entrega'
      };

      const logs = [
        `🧠 IA Pensamento Poderoso - ${stepTitles[step.toString()]}`,
        `🔍 Analisando ${node.title.toLowerCase()}...`,
        `⚡ Combinando Claude + GPT-4o + Análise própria`,
        `📊 Processando dados de mercado em tempo real`,
        `🎯 Gerando conteúdo otimizado para conversão`
      ];

      addDetailedLog(step.toString(), logs);

      // Real AI processing call
      try {
        const response = await fetch('/api/ai/process-step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stepId: step,
            stepTitle: node.title,
            context: { workflowMode, currentStep }
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          // Update node with real data
          setNodes(prev => prev.map(n => 
            n.id === step.toString() 
              ? { ...n, data: result, status: 'completed' as const }
              : n
          ));
        }
      } catch (error) {
        console.log('AI processing step:', step);
      }

      setTimeout(() => {
        if (step < 10) {
          setCurrentStep(step + 1);
          animateToStep(step + 1);
        } else {
          setIsAnimating(false);
          // Trigger final download
          generateFinalDownload();
        }
      }, 4000);
    }
  };

  const generateFinalDownload = async () => {
    try {
      const response = await fetch('/api/ai/generate-complete-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowData: nodes.filter(n => n.data).map(n => ({
            id: n.id,
            title: n.title,
            data: n.data
          })),
          mode: workflowMode
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'produto-completo.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.log('Generating package...');
    }
  };

  const addDetailedLog = (nodeId: string, logs: string[]) => {
    setDetailedLogs(prev => ({
      ...prev,
      [nodeId]: logs
    }));
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

  

  return (
    <div className="h-screen bg-gray-100">
      {/* Main Canvas */}
      <div 
        ref={canvasRef}
        className="w-full h-full overflow-hidden relative"
      >
        {/* Mouse Controls Tooltip */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm">
          <div className="font-semibold mb-2">Mouse Controls:</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div>• <strong>Left Click:</strong> Select/Drag nodes</div>
            <div>• <strong>Double Click:</strong> Activate node</div>
            <div>• <strong>Right Click:</strong> Context menu</div>
            <div>• <strong>Scroll:</strong> Pan canvas</div>
            <div>• <strong>Ctrl+Scroll:</strong> Zoom</div>
            <div>• <strong>Drag:</strong> Pan canvas</div>
          </div>
        </div>

        <motion.div
          className="infinite-canvas w-full h-full relative cursor-grab active:cursor-grabbing"
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
              onDoubleClick={() => {
                if (node.status === 'pending') {
                  handleNodeEdit(node.id, { status: 'active' });
                }
              }}
              onContextMenu={(e) => handleNodeRightClick(e, node.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={node.status === 'active' ? {
                boxShadow: ['0 0 0 rgba(59, 130, 246, 0.7)', '0 0 20px rgba(59, 130, 246, 0.4)', '0 0 0 rgba(59, 130, 246, 0.7)']
              } : {}}
              transition={{ duration: 2, repeat: node.status === 'active' ? Infinity : 0 }}
            >
              <Card className={`ai-module-card w-full h-full border-2 transition-all duration-200 ${
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
                    
                    {/* Detailed logs for active nodes */}
                    {node.status === 'active' && detailedLogs[node.id] && (
                      <div className="absolute top-full left-0 w-80 mt-2 p-3 bg-white border border-blue-200 rounded-lg shadow-lg z-50">
                        <h4 className="font-semibold text-sm mb-2 text-blue-800">IA Pensamento Poderoso - Logs</h4>
                        <div className="space-y-1">
                          {detailedLogs[node.id].map((log, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.5 }}
                              className="text-xs text-gray-700 flex items-center gap-2"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                              {log}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Initial Mode Selection Modal */}
      <Dialog open={showInitialModal} onOpenChange={setShowInitialModal}>
        <DialogContent className="max-w-2xl" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Como deseja criar seu produto?
            </DialogTitle>
          </DialogHeader>
          <div id="dialog-description" className="sr-only">
            Escolha entre IA Pensamento Poderoso para criação automática ou Criação Manual para controle total
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startPowerfulAIWorkflow}
              className="p-6 border-2 border-emerald-200 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 cursor-pointer hover:border-emerald-400 transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Brain className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2 text-emerald-800">
                IA Pensamento Poderoso
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Sistema inteligente que combina as melhores IAs do mundo para criar automaticamente seu produto completo
              </p>
              <ul className="text-xs space-y-1 text-gray-500">
                <li>• Análise automática de mercado</li>
                <li>• Geração de conteúdo otimizado</li>
                <li>• Workflow visual animado</li>
                <li>• Resultados em minutos</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startManualWorkflow}
              className="p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer hover:border-blue-400 transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2 text-blue-800">
                Criação Manual
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Defina seu tipo de produto e ideia específica para ter controle total sobre o processo
              </p>
              <ul className="text-xs space-y-1 text-gray-500">
                <li>• Controle total do processo</li>
                <li>• Personalização completa</li>
                <li>• Edição em tempo real</li>
                <li>• Flexibilidade máxima</li>
              </ul>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px]"
            style={{
              left: contextMenu.x,
              top: contextMenu.y
            }}
            onMouseLeave={closeContextMenu}
          >
            <button
              onClick={() => {
                handleNodeEdit(contextMenu.nodeId, { status: 'active' });
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Ativar Nó
            </button>
            
            <button
              onClick={() => {
                handleNodeEdit(contextMenu.nodeId, { status: 'completed' });
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Marcar Concluído
            </button>
            
            <button
              onClick={() => {
                handleNodeEdit(contextMenu.nodeId, { status: 'pending' });
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </button>
            
            <hr className="my-1" />
            
            <button
              onClick={() => {
                handleNodeDuplicate(contextMenu.nodeId);
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Duplicar
            </button>
            
            <button
              onClick={() => {
                handleNodeDelete(contextMenu.nodeId);
                closeContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-100 text-red-600 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Click away to close context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
        />
      )}
    </div>
  );
}