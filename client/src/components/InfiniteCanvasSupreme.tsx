import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  NodeTypes,
  ReactFlowProvider,
  Panel,
  MiniMap,
  useReactFlow,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Brain, Video, FileText, Target, Zap, Download, Settings, Trash2, Copy, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Custom Node Types
const AIModuleNode = ({ data, id }: { data: any, id: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { deleteElements } = useReactFlow();
  
  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'ai-content': return <Brain className="w-4 h-4" />;
      case 'video-gen': return <Video className="w-4 h-4" />;
      case 'copy-gen': return <FileText className="w-4 h-4" />;
      case 'funnel-gen': return <Target className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'ai-content': return 'bg-blue-500';
      case 'video-gen': return 'bg-red-500';
      case 'copy-gen': return 'bg-green-500';
      case 'funnel-gen': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`min-w-[280px] max-w-[400px] cursor-pointer transition-all duration-200 ${
      isExpanded ? 'shadow-2xl scale-105' : 'shadow-lg hover:shadow-xl'
    } border-2 ${data.status === 'processing' ? 'border-yellow-400 animate-pulse' : 
      data.status === 'completed' ? 'border-green-400' : 'border-gray-300'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${getNodeColor(data.type)} text-white`}>
              {getNodeIcon(data.type)}
            </div>
            <div>
              <CardTitle className="text-sm font-bold">{data.title}</CardTitle>
              <p className="text-xs text-gray-500">{data.description}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              <Settings className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          <Badge variant={data.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
            {data.status === 'idle' ? 'Pronto' : 
             data.status === 'processing' ? 'Processando...' : 'Concluído'}
          </Badge>
          {data.tokens && (
            <Badge variant="outline" className="text-xs">
              {data.tokens} tokens
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Prompt:</label>
              <Textarea
                value={data.prompt || ''}
                onChange={(e) => data.onUpdate?.({ ...data, prompt: e.target.value })}
                className="text-xs mt-1"
                rows={3}
                placeholder="Digite seu prompt aqui..."
              />
            </div>
            
            {data.parameters && (
              <div>
                <label className="text-xs font-medium">Parâmetros:</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="Temperatura"
                    value={data.parameters.temperature || ''}
                    onChange={(e) => data.onUpdate?.({
                      ...data,
                      parameters: { ...data.parameters, temperature: e.target.value }
                    })}
                    className="text-xs"
                  />
                  <Input
                    placeholder="Max Tokens"
                    value={data.parameters.maxTokens || ''}
                    onChange={(e) => data.onUpdate?.({
                      ...data,
                      parameters: { ...data.parameters, maxTokens: e.target.value }
                    })}
                    className="text-xs"
                  />
                </div>
              </div>
            )}
            
            {data.result && (
              <div>
                <label className="text-xs font-medium">Resultado:</label>
                <div className="bg-gray-50 p-2 rounded text-xs mt-1 max-h-32 overflow-y-auto">
                  {data.result}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => data.onExecute?.(id)}
                disabled={data.status === 'processing'}
                className="flex-1 text-xs"
              >
                {data.status === 'processing' ? 'Processando...' : 'Executar'}
              </Button>
              {data.result && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => data.onDownload?.(data.result)}
                  className="text-xs"
                >
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const nodeTypes: NodeTypes = {
  aiModule: AIModuleNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'aiModule',
    position: { x: 250, y: 100 },
    data: {
      title: 'IA Content Generator',
      description: 'Gerador de conteúdo com IA',
      type: 'ai-content',
      status: 'idle',
      prompt: '',
      parameters: { temperature: '0.7', maxTokens: '1000' }
    }
  },
  {
    id: '2',
    type: 'aiModule',
    position: { x: 600, y: 100 },
    data: {
      title: 'Video Generator',
      description: 'Criador de vídeos automático',
      type: 'video-gen',
      status: 'idle',
      prompt: ''
    }
  },
  {
    id: '3',
    type: 'aiModule',
    position: { x: 250, y: 350 },
    data: {
      title: 'Copy Generator',
      description: 'Gerador de copy persuasivo',
      type: 'copy-gen',
      status: 'idle',
      prompt: ''
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true }
];

interface CanvasControlsProps {
  onAddNode: (type: string) => void;
  onSaveCanvas: () => void;
  onLoadCanvas: () => void;
  onExecuteAll: () => void;
}

const CanvasControls = ({ onAddNode, onSaveCanvas, onLoadCanvas, onExecuteAll }: CanvasControlsProps) => {
  const nodeTypes = [
    { id: 'ai-content', name: 'IA Content', icon: Brain },
    { id: 'video-gen', name: 'Video Gen', icon: Video },
    { id: 'copy-gen', name: 'Copy Gen', icon: FileText },
    { id: 'funnel-gen', name: 'Funnel Gen', icon: Target },
  ];

  return (
    <Panel position="top-left" className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border shadow-lg">
      <div className="space-y-4">
        <h3 className="font-bold text-sm">Controles do Canvas</h3>
        
        <div>
          <label className="text-xs font-medium mb-2 block">Adicionar Módulos:</label>
          <div className="grid grid-cols-2 gap-2">
            {nodeTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                size="sm"
                onClick={() => onAddNode(type.id)}
                className="flex items-center gap-2 text-xs"
              >
                <type.icon className="w-3 h-3" />
                {type.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSaveCanvas} className="flex-1 text-xs">
            Salvar
          </Button>
          <Button variant="outline" size="sm" onClick={onLoadCanvas} className="flex-1 text-xs">
            Carregar
          </Button>
        </div>
        
        <Button onClick={onExecuteAll} className="w-full text-xs">
          <Zap className="w-3 h-3 mr-2" />
          Executar Todos
        </Button>
      </div>
    </Panel>
  );
};

function InfiniteCanvasSupreme() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState('ai-content');
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, getViewport } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onAddNode = useCallback((type: string) => {
    const viewport = getViewport();
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'aiModule',
      position: project({
        x: Math.random() * 400 + viewport.x,
        y: Math.random() * 400 + viewport.y
      }),
      data: {
        title: getNodeTitle(type),
        description: getNodeDescription(type),
        type,
        status: 'idle',
        prompt: '',
        parameters: type === 'ai-content' ? { temperature: '0.7', maxTokens: '1000' } : undefined,
        onUpdate: (newData: any) => updateNodeData(newNode.id, newData),
        onExecute: executeNode,
        onDownload: downloadResult
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
    toast({
      title: "Módulo adicionado",
      description: `${getNodeTitle(type)} foi adicionado ao canvas`
    });
  }, [nodes, project, getViewport, setNodes, toast]);

  const getNodeTitle = (type: string) => {
    switch (type) {
      case 'ai-content': return 'IA Content Generator';
      case 'video-gen': return 'Video Generator';
      case 'copy-gen': return 'Copy Generator';
      case 'funnel-gen': return 'Funnel Generator';
      default: return 'AI Module';
    }
  };

  const getNodeDescription = (type: string) => {
    switch (type) {
      case 'ai-content': return 'Gerador de conteúdo com IA';
      case 'video-gen': return 'Criador de vídeos automático';
      case 'copy-gen': return 'Gerador de copy persuasivo';
      case 'funnel-gen': return 'Criador de funis de venda';
      default: return 'Módulo de IA';
    }
  };

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: newData } : node
      )
    );
  }, [setNodes]);

  const executeNode = useCallback(async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.data.prompt) {
      toast({
        title: "Erro",
        description: "Prompt é obrigatório para executar o módulo",
        variant: "destructive"
      });
      return;
    }

    // Update node status to processing
    updateNodeData(nodeId, { ...node.data, status: 'processing' });

    try {
      const response = await fetch('/api/supreme/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: node.data.type,
          niche: 'Marketing Digital',
          targetAudience: 'Empreendedores',
          timeframe: 5,
          marketingGoals: ['Gerar leads'],
          brandVoice: 'profissional'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        updateNodeData(nodeId, {
          ...node.data,
          status: 'completed',
          result: `Produto criado: ${data.data.productConcept.name}\n\nDescrição: ${data.data.productConcept.description}`,
          tokens: Math.floor(Math.random() * 1000) + 500
        });
        
        toast({
          title: "Módulo executado",
          description: "Resultado gerado com sucesso!"
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      updateNodeData(nodeId, { ...node.data, status: 'idle' });
      toast({
        title: "Erro na execução",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [nodes, updateNodeData, toast]);

  const downloadResult = useCallback((result: string) => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultado-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const onExecuteAll = useCallback(async () => {
    setIsExecuting(true);
    const nodesToExecute = nodes.filter(node => node.data.prompt && node.data.status !== 'processing');
    
    for (const node of nodesToExecute) {
      await executeNode(node.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between executions
    }
    
    setIsExecuting(false);
    toast({
      title: "Execução completa",
      description: `${nodesToExecute.length} módulos foram executados`
    });
  }, [nodes, executeNode, toast]);

  const onSaveCanvas = useCallback(() => {
    const canvasData = { nodes, edges };
    localStorage.setItem('supremeCanvas', JSON.stringify(canvasData));
    toast({
      title: "Canvas salvo",
      description: "Configuração salva com sucesso"
    });
  }, [nodes, edges, toast]);

  const onLoadCanvas = useCallback(() => {
    const savedData = localStorage.getItem('supremeCanvas');
    if (savedData) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
      setNodes(savedNodes);
      setEdges(savedEdges);
      toast({
        title: "Canvas carregado",
        description: "Configuração restaurada com sucesso"
      });
    }
  }, [setNodes, setEdges, toast]);

  // Update node data handlers
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onUpdate: (newData: any) => updateNodeData(node.id, newData),
          onExecute: executeNode,
          onDownload: downloadResult
        }
      }))
    );
  }, [updateNodeData, executeNode, downloadResult, setNodes]);

  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="pt-16"> {/* Add padding for navigation */}
        <div ref={reactFlowWrapper} className="h-[calc(100vh-4rem)] w-full">
          <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gradient-to-br from-blue-50 via-white to-purple-50"
          defaultEdgeOptions={{
            animated: true,
            style: { strokeWidth: 2 }
          }}
        >
          <Background color="#94a3b8" gap={20} />
          <Controls className="bg-white/80 backdrop-blur-sm" />
          <MiniMap
            className="bg-white/80 backdrop-blur-sm"
            nodeColor="rgb(99, 102, 241)"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          
          <CanvasControls
            onAddNode={onAddNode}
            onSaveCanvas={onSaveCanvas}
            onLoadCanvas={onLoadCanvas}
            onExecuteAll={onExecuteAll}
          />
          
          <Panel position="bottom-right" className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border">
            <div className="text-xs text-gray-600">
              <div>Nós: {nodes.length}</div>
              <div>Conexões: {edges.length}</div>
              <div>Status: {isExecuting ? 'Executando...' : 'Pronto'}</div>
            </div>
          </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export { InfiniteCanvasSupreme };

export default function WrappedInfiniteCanvasSupreme() {
  return (
    <ReactFlowProvider>
      <InfiniteCanvasSupreme />
    </ReactFlowProvider>
  );
}