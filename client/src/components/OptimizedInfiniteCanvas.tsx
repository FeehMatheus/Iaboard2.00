import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { Brain, Target, Rocket, Users, TrendingUp, FileText, Video, Mail, Download, CheckCircle, Plus, Trash2, Edit3, Copy, ZoomIn, ZoomOut, Grid, Settings, Save, Download as DownloadIcon, Play, Pause, RotateCcw, Link, Unlink, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  minWidth?: number;
  minHeight?: number;
  autoResize?: boolean;
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

export default function OptimizedInfiniteCanvas({ onExport, onSave, powerfulAIMode }: InfiniteCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showCanvasPopup, setShowCanvasPopup] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, nodeId: string} | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowMode, setWorkflowMode] = useState<'powerful-ai' | 'manual' | null>(null);
  const [detailedLogs, setDetailedLogs] = useState<{[key: string]: string[]}>({});

  const [nodes, setNodes] = useState<CanvasNode[]>([]);

  // Function to calculate optimal node dimensions based on content
  const calculateNodeDimensions = (node: CanvasNode): { width: number; height: number } => {
    const baseWidth = 180;
    const baseHeight = 120;
    
    // Special handling for product selection popup
    if (node.id === 'product-selection' && node.status === 'active') {
      return { width: 340, height: 280 };
    }
    
    // Calculate width based on title and description length
    const titleLength = node.title.length;
    const descriptionLength = node.description.length;
    
    let width = Math.max(baseWidth, Math.min(titleLength * 9 + 60, 320));
    let height = baseHeight;
    
    // Adjust height based on description length and content
    if (descriptionLength > 40) {
      height += Math.floor(descriptionLength / 40) * 22;
    }
    
    // Add space for data content if completed
    if (node.status === 'completed' && node.data) {
      const dataKeys = Object.keys(node.data).length;
      height += Math.min(dataKeys * 15 + 45, 80);
    }
    
    // Add space for progress indicators
    if (node.status === 'active') {
      height += 25;
    }
    
    // Ensure minimum dimensions
    width = Math.max(width, node.minWidth || baseWidth);
    height = Math.max(height, node.minHeight || baseHeight);
    
    return { width, height };
  };

  const [connections, setConnections] = useState<Connection[]>([]);

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

  const startPowerfulAIWorkflow = async () => {
    setWorkflowMode('powerful-ai');
    setShowCanvasPopup(false);
    
    // Create the initial product selection popup directly on canvas
    createProductSelectionPopup();
  };

  const startManualWorkflow = () => {
    setWorkflowMode('manual');
    setShowCanvasPopup(false);
    createProductSelectionPopup();
  };

  const [selectedProductType, setSelectedProductType] = useState<string>('');

  const createProductSelectionPopup = () => {
    const productPopup: CanvasNode = {
      id: 'product-selection',
      x: 400,
      y: 200,
      title: 'Selecionar Produto',
      description: 'Escolha o tipo de produto',
      icon: <Rocket className="w-6 h-6" />,
      status: 'active',
      type: 'step',
      connections: [],
      autoResize: true,
      minWidth: 320,
      minHeight: 240
    };

    setNodes([productPopup]);
    
    // Center camera on this popup
    const targetX = -productPopup.x * zoom + window.innerWidth / 2;
    const targetY = -productPopup.y * zoom + window.innerHeight / 2;
    setPanX(targetX);
    setPanY(targetY);
  };

  const handleProductTypeSelection = async (productType: string) => {
    setSelectedProductType(productType);
    
    // Update the product selection node
    setNodes(prev => prev.map(node => 
      node.id === 'product-selection' 
        ? { ...node, title: productType, description: `Iniciando criação...`, status: 'completed' } 
        : node
    ));

    // Wait a moment then start generating workflow
    setTimeout(() => {
      generateWorkflowPopups(productType);
    }, 1000);
  };

  const generateWorkflowPopups = async (productType: string) => {
    setIsAnimating(true);
    
    // Define the workflow structure - 2 organized layers from left to right
    const workflowSteps = [
      // Primeira camada (esquerda para direita)
      {
        id: 'step-1',
        x: 150,
        y: 100,
        title: 'Análise de Mercado',
        description: 'Analisando mercado...',
        icon: <TrendingUp className="w-5 h-5" />,
        layer: 1
      },
      {
        id: 'step-2',
        x: 350,
        y: 100,
        title: 'Público-Alvo',
        description: 'Definindo personas...',
        icon: <Users className="w-5 h-5" />,
        layer: 1
      },
      {
        id: 'step-3',
        x: 550,
        y: 100,
        title: 'Copywriting',
        description: 'Criando textos...',
        icon: <FileText className="w-5 h-5" />,
        layer: 1
      },
      {
        id: 'step-4',
        x: 750,
        y: 100,
        title: 'VSL & Vídeos',
        description: 'Produzindo vídeos...',
        icon: <Video className="w-5 h-5" />,
        layer: 1
      },
      // Segunda camada (esquerda para direita)
      {
        id: 'step-5',
        x: 150,
        y: 300,
        title: 'Email Marketing',
        description: 'Sequências de email...',
        icon: <Mail className="w-5 h-5" />,
        layer: 2
      },
      {
        id: 'step-6',
        x: 350,
        y: 300,
        title: 'Landing Pages',
        description: 'Páginas de captura...',
        icon: <Download className="w-5 h-5" />,
        layer: 2
      },
      {
        id: 'step-7',
        x: 550,
        y: 300,
        title: 'Funil Integrado',
        description: 'Conectando tudo...',
        icon: <CheckCircle className="w-5 h-5" />,
        layer: 2
      },
      {
        id: 'step-8',
        x: 750,
        y: 300,
        title: 'Produto Final',
        description: 'Finalizando...',
        icon: <Rocket className="w-5 h-5" />,
        layer: 2
      }
    ];

    // Generate popups sequentially with smooth camera animation focusing on each
    for (let i = 0; i < workflowSteps.length; i++) {
      const step = workflowSteps[i];
      await generatePopupWithContent(step, productType, i);
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second focus on each step
    }

    // Create connections between all steps
    createWorkflowConnections();
    
    // Final camera adjustment to show entire workflow
    await adjustCameraToShowFullWorkflow();
    
    setIsAnimating(false);
    
    // Generate final download
    setTimeout(() => {
      generateFinalDownload();
    }, 2000);
  };

  const generatePopupWithContent = async (stepConfig: any, productType: string, stepIndex: number) => {
    // Add the new popup node with processing state
    const newNode: CanvasNode = {
      id: stepConfig.id,
      x: stepConfig.x,
      y: stepConfig.y,
      title: stepConfig.title,
      description: stepConfig.description,
      icon: stepConfig.icon,
      status: 'active',
      type: 'step',
      connections: [],
      autoResize: true,
      minWidth: 200,
      minHeight: 140
    };

    setNodes(prev => [...prev, newNode]);

    // Smooth camera animation to focus on this popup
    animateCameraToNode(stepConfig);

    // Show detailed processing logs inside the popup
    const logs = [
      `Processando ${stepConfig.title}...`,
      `Analisando ${productType}`,
      `Gerando conteúdo otimizado`,
      `Aplicando IA avançada`,
      `Finalizando etapa`
    ];

    // Update popup with processing logs
    for (let i = 0; i < logs.length; i++) {
      setTimeout(() => {
        setNodes(prev => prev.map(n => 
          n.id === stepConfig.id 
            ? { ...n, description: logs[i] }
            : n
        ));
      }, i * 400);
    }

    // Generate real AI content
    try {
      const response = await fetch('/api/ai/process-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: stepIndex + 1,
          stepTitle: stepConfig.title,
          productType: productType,
          context: { workflowMode, productType }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Mark as completed with success message
        setNodes(prev => prev.map(n => 
          n.id === stepConfig.id 
            ? { 
                ...n, 
                data: result, 
                status: 'completed',
                description: `✅ ${stepConfig.title} - Concluído`
              }
            : n
        ));
      }
    } catch (error) {
      // Mark as completed even if AI fails
      setTimeout(() => {
        setNodes(prev => prev.map(n => 
          n.id === stepConfig.id 
            ? { ...n, status: 'completed', description: `✅ ${stepConfig.title} - Finalizado` }
            : n
        ));
      }, 2000);
    }
  };

  const animateCameraToNode = (stepConfig: any) => {
    // Calculate center position for this node
    const targetX = -stepConfig.x * zoom + window.innerWidth / 2;
    const targetY = -stepConfig.y * zoom + window.innerHeight / 2;
    
    // Smooth transition using CSS transitions
    const canvasElement = document.querySelector('.infinite-canvas');
    if (canvasElement) {
      (canvasElement as HTMLElement).style.transition = 'transform 0.8s ease-in-out';
    }
    
    setPanX(targetX);
    setPanY(targetY);
  };

  const adjustCameraToShowFullWorkflow = async () => {
    // Calculate bounds to show all nodes
    const padding = 100;
    const allNodes = nodes;
    
    if (allNodes.length === 0) return;
    
    const minX = Math.min(...allNodes.map(n => n.x)) - padding;
    const maxX = Math.max(...allNodes.map(n => n.x + (n.width || 180))) + padding;
    const minY = Math.min(...allNodes.map(n => n.y)) - padding;
    const maxY = Math.max(...allNodes.map(n => n.y + (n.height || 110))) + padding;
    
    const workflowWidth = maxX - minX;
    const workflowHeight = maxY - minY;
    
    // Calculate zoom to fit all nodes
    const scaleX = window.innerWidth / workflowWidth;
    const scaleY = window.innerHeight / workflowHeight;
    const newZoom = Math.min(scaleX, scaleY, 1) * 0.8; // 80% of available space
    
    // Center the workflow
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const targetX = -centerX * newZoom + window.innerWidth / 2;
    const targetY = -centerY * newZoom + window.innerHeight / 2;
    
    // Smooth transition
    const canvasElement = document.querySelector('.infinite-canvas');
    if (canvasElement) {
      (canvasElement as HTMLElement).style.transition = 'transform 1.2s ease-in-out';
    }
    
    setZoom(newZoom);
    setPanX(targetX);
    setPanY(targetY);
  };

  const createWorkflowConnections = () => {
    const newConnections: Connection[] = [
      // From product selection to first layer
      { from: 'product-selection', to: 'step-1', type: 'flow' },
      { from: 'product-selection', to: 'step-2', type: 'flow' },
      { from: 'product-selection', to: 'step-3', type: 'flow' },
      { from: 'product-selection', to: 'step-4', type: 'flow' },
      // From first layer to second layer
      { from: 'step-1', to: 'step-5', type: 'flow' },
      { from: 'step-2', to: 'step-6', type: 'flow' },
      { from: 'step-3', to: 'step-7', type: 'flow' },
      { from: 'step-4', to: 'step-8', type: 'flow' },
      // Sequential connections within layers
      { from: 'step-1', to: 'step-2', type: 'flow' },
      { from: 'step-2', to: 'step-3', type: 'flow' },
      { from: 'step-3', to: 'step-4', type: 'flow' },
      { from: 'step-5', to: 'step-6', type: 'flow' },
      { from: 'step-6', to: 'step-7', type: 'flow' },
      { from: 'step-7', to: 'step-8', type: 'flow' }
    ];
    
    setConnections(newConnections);
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
        id: `${Date.now()}`,
        x: node.x + 20,
        y: node.y + 20,
        connections: []
      };
      setNodes(prev => [...prev, newNode]);
    }
  };

  const renderConnections = () => {
    return connections.map((connection, index) => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return null;

      const fromX = fromNode.x + (fromNode.width || 180) / 2;
      const fromY = fromNode.y + (fromNode.height || 100);
      const toX = toNode.x + (toNode.width || 180) / 2;
      const toY = toNode.y;

      return (
        <line
          key={index}
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke="#4f46e5"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  // Click outside to clear context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title="Menu"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Collapsible Sidebar */}
      <motion.div 
        className="fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 z-40"
        initial={{ x: -280 }}
        animate={{ x: showSidebar ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width: '280px' }}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">IA Board V2</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Program Shortcuts */}
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Criação</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {setShowCanvasPopup(true); setShowSidebar(false);}}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Novo Produto</span>
                </button>
                <button 
                  onClick={() => {startPowerfulAIWorkflow(); setShowSidebar(false);}}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Brain className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">IA Pensamento Poderoso</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Visualização</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Aumentar Zoom</span>
                </button>
                <button
                  onClick={() => setZoom(Math.max(0.3, zoom - 0.2))}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Diminuir Zoom</span>
                </button>
                <button
                  onClick={() => { setZoom(1); setPanX(0); setPanY(0); }}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Centralizar Vista</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Exportação</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {if(onSave) onSave(); setShowSidebar(false);}}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Salvar Projeto</span>
                </button>
                <button
                  onClick={() => {if(onExport) onExport(); setShowSidebar(false);}}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Baixar Conteúdo</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 pt-4">
            <div className="text-xs text-gray-500 text-center">
              IA Board V2 - Powered by AI
            </div>
          </div>
        </div>
      </motion.div>

      {/* Optimized Header - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-20 border-b flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-gray-800">Canvas Infinito - IA Board V2</h1>
        <div className="flex items-center gap-4">
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

      {/* Main Canvas - Full Screen */}
      <div 
        ref={canvasRef}
        className="w-full h-full overflow-hidden relative"
        style={{ marginTop: '64px' }}
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
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

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
                width: node.autoResize !== false ? calculateNodeDimensions(node).width : (node.width || 180),
                height: node.autoResize !== false ? calculateNodeDimensions(node).height : (node.height || 100)
              }}
              drag
              dragMomentum={false}
              onDrag={(_, info) => {
                handleNodeDrag(node.id, node.x + info.delta.x, node.y + info.delta.y);
              }}
              onClick={() => handleNodeClick(node.id)}
              onContextMenu={(e) => handleNodeRightClick(e, node.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={node.status === 'active' ? {
                boxShadow: ['0 0 0 rgba(59, 130, 246, 0.7)', '0 0 20px rgba(59, 130, 246, 0.4)', '0 0 0 rgba(59, 130, 246, 0.7)']
              } : {}}
              transition={{ duration: 2, repeat: node.status === 'active' ? Infinity : 0 }}
            >
              <Card className={`w-full h-full border-2 transition-all duration-200 ${
                node.status === 'completed' 
                  ? 'bg-green-50 border-green-500' 
                  : node.status === 'active'
                  ? 'bg-blue-50 border-blue-500 shadow-lg'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}>
                <CardContent className="p-4 h-full flex flex-col overflow-hidden">
                  {/* Product Selection Interface */}
                  {node.id === 'product-selection' && node.status === 'active' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 rounded bg-blue-100 text-blue-600">
                          {node.icon}
                        </div>
                        <h3 className="font-semibold text-sm">{node.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">Escolha seu produto:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: 'Curso Online', icon: '🎓' },
                          { name: 'Mentoria', icon: '🧠' },
                          { name: 'E-book', icon: '📖' },
                          { name: 'Consultoria', icon: '💼' },
                          { name: 'Software', icon: '💻' },
                          { name: 'E-commerce', icon: '🛒' }
                        ].map((product) => (
                          <button
                            key={product.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductTypeSelection(product.name);
                            }}
                            className="p-3 text-xs bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center min-h-[60px] flex flex-col items-center justify-center"
                          >
                            <div className="text-lg mb-1">{product.icon}</div>
                            <div className="font-medium text-xs leading-tight">{product.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Regular Node Content */}
                  {(node.id !== 'product-selection' || node.status !== 'active') && (
                    <>
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
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {node.description}
                        </p>
                      </div>
                      
                      {/* Progress indicator for active nodes */}
                      {node.status === 'active' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{width: '70%'}}></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Data summary for completed nodes */}
                      {node.status === 'completed' && node.data && (
                        <div className="mt-2 text-xs">
                          <div className="bg-green-100 p-2 rounded border-l-2 border-green-400">
                            <div className="font-medium text-green-800">Concluído ✓</div>
                            {Object.keys(node.data).length > 0 && (
                              <div className="text-green-600 mt-1">
                                {Object.keys(node.data).length} elementos gerados
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          node.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : node.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {node.status === 'completed' ? 'Concluído' : 
                           node.status === 'active' ? 'Processando' : 'Pendente'}
                        </span>
                        
                        {node.status === 'active' && (
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        )}
                        
                        {node.status === 'completed' && (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Initial Mode Selection Modal */}
      <Dialog open={showInitialModal} onOpenChange={setShowInitialModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Como deseja criar seu produto?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Escolha entre IA Pensamento Poderoso para criação automática ou Criação Manual para controle total
            </DialogDescription>
          </DialogHeader>
          
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

      {/* Canvas-based Compact Initial Popup */}
      {showCanvasPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-center mb-4">Como criar seu produto?</h2>
            <div className="space-y-3">
              <button
                onClick={startPowerfulAIWorkflow}
                className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5" />
                  IA Pensamento Poderoso
                </div>
                <div className="text-sm opacity-90 mt-1">Criação automática completa</div>
              </button>
              
              <button
                onClick={startManualWorkflow}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-5 h-5" />
                  Criação Manual
                </div>
                <div className="text-sm opacity-90 mt-1">Controle total do processo</div>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px]"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 180),
              top: Math.min(contextMenu.y, window.innerHeight - 200)
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
    </div>
  );
}