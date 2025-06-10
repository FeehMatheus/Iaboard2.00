import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, PanInfo, useAnimationControls } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Zap, 
  Target, 
  Users, 
  FileText, 
  Video, 
  Mail, 
  Globe, 
  Package,
  Download,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Settings,
  Sparkles,
  Brain,
  Rocket,
  Star,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';

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
  gridPos: { row: number; col: number };
}

interface Connection {
  from: string;
  to: string;
  type: 'flow' | 'condition' | 'dependency';
}

interface SuperiorInfiniteCanvasProps {
  onExport?: (data: any) => void;
  onSave?: (data: any) => void;
  powerfulAIMode?: boolean;
}

export default function SuperiorInfiniteCanvas({ onExport, onSave, powerfulAIMode }: SuperiorInfiniteCanvasProps) {
  // Core state management
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs and controls
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationControls = useAnimationControls();
  
  // Canvas dimensions and grid configuration
  const GRID_COLS = 4;
  const GRID_ROWS = 3;
  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 200;
  const GRID_SPACING_X = 350;
  const GRID_SPACING_Y = 280;
  
  // Calculate grid positions for perfect symmetry
  const getGridPosition = useCallback((row: number, col: number) => {
    const startX = window.innerWidth * 0.6; // Start from center-right
    const startY = window.innerHeight * 0.3; // Start from upper area
    
    return {
      x: startX + (col * GRID_SPACING_X),
      y: startY + (row * GRID_SPACING_Y)
    };
  }, []);
  
  // Optimized wheel handler with proper event handling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor));
    
    if (newZoom !== zoom) {
      const worldMouseX = (mouseX - panX) / zoom;
      const worldMouseY = (mouseY - panY) / zoom;
      
      setPanX(mouseX - worldMouseX * newZoom);
      setPanY(mouseY - worldMouseY * newZoom);
      setZoom(newZoom);
    }
  }, [zoom, panX, panY]);
  
  // Enhanced camera animation system
  const animateCamera = useCallback(async (targetX: number, targetY: number, targetZoom = zoom, duration = 1000) => {
    const startX = panX;
    const startY = panY;
    const startZoom = zoom;
    
    return new Promise<void>((resolve) => {
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startX + (targetX - startX) * easeProgress;
        const currentY = startY + (targetY - startY) * easeProgress;
        const currentZoom = startZoom + (targetZoom - startZoom) * easeProgress;
        
        setPanX(currentX);
        setPanY(currentY);
        setZoom(currentZoom);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }, [panX, panY, zoom]);
  
  // Auto-fit all content within viewport
  const autoFitContent = useCallback(async () => {
    if (nodes.length === 0) return;
    
    const padding = 100;
    const bounds = nodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      maxX: Math.max(acc.maxX, node.x + NODE_WIDTH),
      minY: Math.min(acc.minY, node.y),
      maxY: Math.max(acc.maxY, node.y + NODE_HEIGHT)
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    
    const contentWidth = bounds.maxX - bounds.minX + padding * 2;
    const contentHeight = bounds.maxY - bounds.minY + padding * 2;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 80;
    
    const scaleX = viewportWidth / contentWidth;
    const scaleY = viewportHeight / contentHeight;
    const targetZoom = Math.min(scaleX, scaleY, 1);
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    const targetPanX = viewportWidth / 2 - centerX * targetZoom;
    const targetPanY = viewportHeight / 2 - centerY * targetZoom;
    
    await animateCamera(targetPanX, targetPanY, targetZoom, 1500);
  }, [nodes, animateCamera]);
  
  // Generate workflow with perfect positioning and animations
  const generateWorkflow = useCallback(async (productType: string) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep(0);
    setNodes([]);
    
    const workflowSteps = [
      {
        id: 'market-research',
        title: 'Pesquisa de Mercado',
        description: 'Análise completa do mercado e concorrência',
        icon: <Target className="w-6 h-6" />,
        gridPos: { row: 0, col: 0 }
      },
      {
        id: 'audience-analysis',
        title: 'Análise de Audiência',
        description: 'Identificação e segmentação do público-alvo',
        icon: <Users className="w-6 h-6" />,
        gridPos: { row: 0, col: 1 }
      },
      {
        id: 'copywriting',
        title: 'Copywriting Profissional',
        description: 'Criação de textos persuasivos e headlines',
        icon: <FileText className="w-6 h-6" />,
        gridPos: { row: 0, col: 2 }
      },
      {
        id: 'vsl-creation',
        title: 'Criação de VSL',
        description: 'Video Sales Letter profissional',
        icon: <Video className="w-6 h-6" />,
        gridPos: { row: 0, col: 3 }
      },
      {
        id: 'email-sequences',
        title: 'Sequências de Email',
        description: 'Automação completa de email marketing',
        icon: <Mail className="w-6 h-6" />,
        gridPos: { row: 1, col: 0 }
      },
      {
        id: 'landing-pages',
        title: 'Landing Pages',
        description: 'Páginas otimizadas para conversão',
        icon: <Globe className="w-6 h-6" />,
        gridPos: { row: 1, col: 1 }
      },
      {
        id: 'complete-package',
        title: 'Pacote Completo',
        description: 'Entrega final com todos os materiais',
        icon: <Package className="w-6 h-6" />,
        gridPos: { row: 1, col: 2 }
      }
    ];
    
    // Generate nodes sequentially with smooth animations
    for (let i = 0; i < workflowSteps.length; i++) {
      if (isPaused) break;
      
      const step = workflowSteps[i];
      const position = getGridPosition(step.gridPos.row, step.gridPos.col);
      
      const newNode: CanvasNode = {
        ...step,
        x: position.x,
        y: position.y,
        status: 'active',
        type: 'step',
        connections: i < workflowSteps.length - 1 ? [workflowSteps[i + 1].id] : [],
        data: { productType, step: i + 1 }
      };
      
      // Add node with animation
      setNodes(prev => [...prev, newNode]);
      setCurrentStep(i + 1);
      setGenerationProgress((i + 1) / workflowSteps.length * 100);
      
      // Animate camera to follow the new node
      const targetPanX = window.innerWidth / 2 - (position.x + NODE_WIDTH / 2) * zoom;
      const targetPanY = window.innerHeight / 2 - (position.y + NODE_HEIGHT / 2) * zoom;
      await animateCamera(targetPanX, targetPanY, zoom, 800);
      
      // Process step with AI
      await processStepWithAI(step, productType);
      
      // Mark as completed
      setNodes(prev => prev.map(node => 
        node.id === step.id ? { ...node, status: 'completed' } : node
      ));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Final auto-fit
    await autoFitContent();
    
    setIsGenerating(false);
    setGenerationProgress(100);
  }, [isGenerating, isPaused, getGridPosition, animateCamera, autoFitContent, zoom]);
  
  // AI processing simulation
  const processStepWithAI = async (step: any, productType: string) => {
    try {
      const response = await fetch('/api/ai/process-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: step.id,
          productType,
          stepData: step
        })
      });
      
      const result = await response.json();
      
      // Update node with AI results
      setNodes(prev => prev.map(node => 
        node.id === step.id 
          ? { ...node, data: { ...node.data, aiResult: result } }
          : node
      ));
    } catch (error) {
      console.error('AI processing error:', error);
    }
  };
  
  // Enhanced connection rendering without arrows
  const renderConnections = useMemo(() => {
    const connections: Connection[] = [];
    
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        if (nodes.find(n => n.id === targetId)) {
          connections.push({ from: node.id, to: targetId, type: 'flow' });
        }
      });
    });
    
    return connections.map((connection, index) => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return null;
      
      const fromX = fromNode.x + NODE_WIDTH / 2;
      const fromY = fromNode.y + NODE_HEIGHT;
      const toX = toNode.x + NODE_WIDTH / 2;
      const toY = toNode.y;
      
      const midX = (fromX + toX) / 2;
      const curvature = Math.abs(toY - fromY) * 0.3;
      
      return (
        <g key={`${connection.from}-${connection.to}`}>
          <defs>
            <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ffa3" stopOpacity="1" />
            </linearGradient>
            <filter id={`glow-${index}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <motion.path
            d={`M ${fromX} ${fromY} Q ${midX} ${fromY + curvature} ${toX} ${toY}`}
            stroke={`url(#gradient-${index})`}
            strokeWidth="3"
            fill="none"
            filter={`url(#glow-${index})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          />
          
          {/* Flowing particle */}
          <motion.circle
            r="4"
            fill="#00d4ff"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.5
            }}
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={`M ${fromX} ${fromY} Q ${midX} ${fromY + curvature} ${toX} ${toY}`}
              begin={`${index * 0.5}s`}
            />
          </motion.circle>
        </g>
      );
    });
  }, [nodes]);
  
  // Product selection handler
  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
    generateWorkflow(product);
  };
  
  // Control handlers
  const handlePause = () => setIsPaused(!isPaused);
  const handleReset = () => {
    setNodes([]);
    setIsGenerating(false);
    setGenerationProgress(0);
    setCurrentStep(0);
    setSelectedProduct('');
  };
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      {/* Enhanced Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                IA Board Superior
              </span>
            </div>
            
            {isGenerating && (
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                  <Brain className="w-4 h-4 mr-1" />
                  IA Gerando: Etapa {currentStep}
                </Badge>
                <Progress value={generationProgress} className="w-32 h-2" />
                <span className="text-sm text-cyan-400">{generationProgress.toFixed(0)}%</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePause}
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="border-red-400 text-red-400 hover:bg-red-400/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={autoFitContent}
              className="border-green-400 text-green-400 hover:bg-green-400/10"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25px 25px, rgba(0, 212, 255, 0.3) 2px, transparent 2px),
                  linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px, 25px 25px, 25px 25px'
              }}
            />
          </div>
          
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Canvas Content */}
        <motion.div
          className="relative w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            transformOrigin: '0 0'
          }}
          drag
          dragMomentum={false}
          onDrag={(_, info: PanInfo) => {
            setPanX(prev => prev + info.delta.x / zoom);
            setPanY(prev => prev + info.delta.y / zoom);
          }}
        >
          {/* SVG Layer for Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            {renderConnections}
          </svg>
          
          {/* Product Selection Node */}
          {!selectedProduct && (
            <motion.div
              className="absolute"
              style={{
                left: window.innerWidth * 0.5 - NODE_WIDTH / 2,
                top: window.innerHeight * 0.4 - NODE_HEIGHT / 2
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <Card className="w-80 h-56 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border-2 border-cyan-400/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Rocket className="w-8 h-8 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Selecione seu Produto</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Curso Online',
                      'Infoproduto',
                      'Consultoria',
                      'Software'
                    ].map(product => (
                      <Button
                        key={product}
                        onClick={() => handleProductSelect(product)}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold"
                      >
                        {product}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Workflow Nodes */}
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              className="absolute"
              style={{ left: node.x, top: node.y }}
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <Card className={`w-72 h-48 border-2 transition-all duration-500 ${
                node.status === 'completed' 
                  ? 'bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-emerald-400 shadow-2xl shadow-emerald-500/30' 
                  : node.status === 'active'
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400 shadow-2xl shadow-cyan-500/30'
                  : 'bg-gradient-to-br from-slate-500/20 to-purple-600/20 border-purple-400 shadow-2xl shadow-purple-500/20'
              } backdrop-blur-xl`}>
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        node.status === 'completed' ? 'bg-emerald-500/20' :
                        node.status === 'active' ? 'bg-cyan-500/20' : 'bg-purple-500/20'
                      }`}>
                        {node.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{node.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            node.status === 'completed' ? 'border-emerald-400 text-emerald-400' :
                            node.status === 'active' ? 'border-cyan-400 text-cyan-400' : 'border-purple-400 text-purple-400'
                          }`}
                        >
                          {node.status === 'completed' ? 'Concluído' :
                           node.status === 'active' ? 'Processando' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                    
                    {node.status === 'completed' && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    )}
                    {node.status === 'active' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings className="w-6 h-6 text-cyan-400" />
                      </motion.div>
                    )}
                    {node.status === 'pending' && (
                      <Clock className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 flex-1">{node.description}</p>
                  
                  {node.data?.aiResult && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400">IA Processada</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Resultado
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Download Button */}
      {nodes.length > 0 && !isGenerating && (
        <motion.div
          className="absolute bottom-6 right-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold shadow-2xl"
            onClick={() => onExport?.(nodes)}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Completo
          </Button>
        </motion.div>
      )}
    </div>
  );
}