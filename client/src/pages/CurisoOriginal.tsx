import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Panel,
  useNodesState,
  useEdgesState,
  Connection,
  applyEdgeChanges,
  EdgeChange,
  applyNodeChanges,
  NodeChange,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { useStore } from '@/lib/store';
import 'reactflow/dist/style.css';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings, MessageCirclePlus, Trash2, Brain, Zap, Video, Search, Package, PenTool, Target, BarChart, BarChart3, Sparkles, Menu, X } from 'lucide-react';
import { CurisoChatNodeOriginal } from '@/components/CurisoChatNodeOriginal';
import { AIModuleNode } from '@/components/AIModuleNode';
import { PikaVideoNode } from '@/components/PikaVideoNode';
import FurionCanvasNode from '@/components/FurionCanvasNode';
import { DownloadsModule } from '@/components/DownloadsModule';
import { VideoHybridModule } from '@/components/VideoHybridModule';
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from 'use-debounce';
import { useLocation } from 'wouter';

const nodeTypes = {
  chat: CurisoChatNodeOriginal,
  aiModule: AIModuleNode,
  video: PikaVideoNode,
  furion: FurionCanvasNode,
  downloads: DownloadsModule,
  videoHybrid: VideoHybridModule,
};

function Flow() {
  const { settings, setSettings } = useStore();
  const { getViewport, screenToFlowPosition } = useReactFlow();
  const [, setLocation] = useLocation();

  const currentBoard = settings.boards.find(b => b.id === settings.currentBoardId)!;

  const onNodesChange = (changes: NodeChange[]) => {
    // Filter out remove changes
    const filteredChanges = changes.filter(change => change.type !== 'remove');

    // Batch multiple position updates
    const positionChanges = filteredChanges.filter(change => change.type === 'position');
    if (positionChanges.length > 0) {
      requestAnimationFrame(() => {
        const newSettings = {
          ...settings,
          boards: settings.boards.map(board =>
            board.id === settings.currentBoardId
              ? {
                  ...board,
                  nodes: applyNodeChanges(filteredChanges, board.nodes),
                }
              : board
          ),
        };
        useStore.setState({ settings: newSettings });
      });
      return;
    }

    // Handle other changes immediately
    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: applyNodeChanges(filteredChanges, board.nodes) }
          : board
      ),
    };
    useStore.setState({ settings: newSettings });
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, edges: applyEdgeChanges(changes, board.edges) }
          : board
      ),
    };

    // Update UI immediately
    useStore.setState({ settings: newSettings });
  };

  const onConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) return;

    useStore.setState(state => {
      const currentBoard = state.settings.boards.find(b => b.id === state.settings.currentBoardId);
      if (!currentBoard) return state;

      const exists = currentBoard.edges.some(
        edge => edge.source === connection.source && edge.target === connection.target
      );
      if (exists) return state;

      const newEdge: Edge = {
        id: nanoid(),
        type: 'default',
        animated: true,
        style: { stroke: '#3b82f6' },
        source: connection.source || '',
        target: connection.target || '',
        sourceHandle: connection.sourceHandle || null,
        targetHandle: connection.targetHandle || null,
      };

      return {
        settings: {
          ...state.settings,
          boards: state.settings.boards.map(board =>
            board.id === state.settings.currentBoardId
              ? {
                  ...board,
                  edges: [...board.edges, newEdge],
                }
              : board
          ),
        },
      };
    });
  };

  const addNode = () => {
    const id = nanoid();

    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode = {
      id,
      type: 'chat',
      position,
      resizable: true,
      data: {
        messages: [],
        model: 'gpt-4o',
        provider: 'openai',
      },
    };

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  const addAIModule = (moduleType: string) => {
    const id = nanoid();

    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    const newNode = {
      id,
      type: 'aiModule',
      position,
      resizable: true,
      data: {
        moduleType,
        prompt: '',
        parameters: {},
        result: '',
        isExecuting: false,
        files: [],
      },
    };

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  const addVideoNode = () => {
    const id = nanoid();

    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    const newNode = {
      id,
      type: 'video',
      position,
      resizable: true,
      data: {
        prompt: '',
        aspectRatio: '16:9' as '16:9' | '9:16' | '1:1',
        style: 'cinematic',
        videoUrl: '',
        isGenerating: false,
      },
    };

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  const addFurionNode = () => {
    const id = nanoid();

    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    const newNode = {
      id,
      type: 'furion',
      position,
      resizable: true,
      data: {
        label: 'Furion AI',
        productIdea: '',
        status: 'idle',
        progress: 0,
        currentTask: '',
        results: null,
        showInterface: false,
      },
    };

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  const addDownloadsNode = () => {
    const id = nanoid();

    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    const newNode = {
      id,
      type: 'downloads',
      position,
      resizable: true,
      data: {
        title: 'Central de Downloads',
        files: [],
      },
    };

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  const addVideoHybridNode = () => {
    const id = nanoid();

    const position = screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    const newNode = {
      id,
      type: 'videoHybrid',
      position,
      resizable: true,
      data: {
        prompt: '',
        duration: 5,
        style: 'realistic',
      },
    };

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  // Enhanced node addition functions for context menu
  const addNodeAtPosition = (type: string, x?: number, y?: number) => {
    const id = nanoid();
    const position = x && y ? screenToFlowPosition({ x, y }) : screenToFlowPosition({
      x: window.innerWidth / 2 + Math.random() * 100 - 50,
      y: window.innerHeight / 2 + Math.random() * 100 - 50,
    });

    let newNode;
    switch (type) {
      case 'chat':
        newNode = {
          id, type: 'chat', position, resizable: true,
          data: { messages: [], model: 'gpt-4o', provider: 'openai' }
        };
        break;
      case 'video':
        newNode = {
          id, type: 'video', position, resizable: true,
          data: { prompt: '', aspectRatio: '16:9' as '16:9', style: 'cinematic', videoUrl: '', isGenerating: false }
        };
        break;
      case 'furion':
        newNode = {
          id, type: 'furion', position, resizable: true,
          data: { label: 'Furion AI', productIdea: '', status: 'idle', progress: 0, currentTask: '', results: null, showInterface: false }
        };
        break;
      case 'downloads':
        newNode = {
          id, type: 'downloads', position, resizable: true,
          data: { title: 'Central de Downloads', files: [] }
        };
        break;
      case 'videoHybrid':
        newNode = {
          id, type: 'videoHybrid', position, resizable: true,
          data: { prompt: '', duration: 5, style: 'realistic' }
        };
        break;
      case 'aiModule':
        newNode = {
          id, type: 'aiModule', position, resizable: true,
          data: { moduleType: 'text-generation', prompt: '', parameters: {}, result: '', isExecuting: false, files: [] }
        };
        break;
      default:
        return;
    }

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  const duplicateNode = (nodeId: string) => {
    const node = currentBoard.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const id = nanoid();
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50
    };

    const newNode = {
      ...node,
      id,
      position,
      selected: false
    };

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    });
  };

  const deleteNode = (nodeId: string) => {
    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? {
              ...board,
              nodes: board.nodes.filter(node => node.id !== nodeId),
              edges: board.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
            }
          : board
      ),
    });
  };

  const resetNode = (nodeId: string) => {
    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? {
              ...board,
              nodes: board.nodes.map(node => 
                node.id === nodeId 
                  ? { ...node, data: { ...node.data, result: '', isExecuting: false, messages: [] } }
                  : node
              ),
            }
          : board
      ),
    });
  };

  const exportCanvas = () => {
    const canvasData = {
      nodes: currentBoard.nodes,
      edges: currentBoard.edges,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(canvasData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ia-board-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importCanvas = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const canvasData = JSON.parse(e.target?.result as string);
            if (canvasData.nodes && canvasData.edges) {
              setSettings({
                ...settings,
                boards: settings.boards.map(board =>
                  board.id === settings.currentBoardId
                    ? { ...board, nodes: canvasData.nodes, edges: canvasData.edges }
                    : board
                ),
              });
            }
          } catch (error) {
            console.error('Error importing canvas:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const delNode = () => {
    const selectedNodes = currentBoard.nodes.filter(node => node.selected);
    if (selectedNodes.length === 0) return;

    setSettings({
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? {
              ...board,
              nodes: board.nodes.filter(
                node => !selectedNodes.some(selected => selected.id === node.id)
              ),
              edges: board.edges.filter(
                edge =>
                  !selectedNodes.some(node => node.id === edge.source || node.id === edge.target)
              ),
            }
          : board
      ),
    });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent handling if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.userAgent.includes('Mac');
      const cmdKey = isMac ? event.metaKey : event.ctrlKey;

      if (cmdKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        addNode();
      }

      if (cmdKey && event.key.toLowerCase() === 'backspace') {
        event.preventDefault();
        delNode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const [contextMenu, setContextMenu] = useState<{x: number, y: number, nodeId?: string} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }, []);

  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenu({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      nodeId: node.id,
    });
  }, []);

  const { fitView } = useReactFlow();
  
  const centerCanvas = useCallback(() => {
    fitView({ padding: 0.2 });
    setContextMenu(null);
  }, [fitView]);

  const selectedNodes = currentBoard.nodes.filter(node => node.selected);

  return (
    <div className="relative w-full h-full" onContextMenu={handleContextMenu}>
      <ReactFlow
        nodes={currentBoard.nodes}
        edges={currentBoard.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={5}
        snapToGrid={true}
        snapGrid={[30, 30]}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        className="dark bg-background"
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={() => setContextMenu(null)}
      >
      <Background 
        gap={20} 
        size={1}
        className="opacity-30"
        color="#6366f1"
      />
      <Controls 
        className="bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg"
        showZoom={true}
        showFitView={true}
        showInteractive={true}
      />
      {/* Hamburger Menu Button */}
      <Panel position="top-left" className="z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          size="sm"
          variant="secondary"
          className="bg-background/80 backdrop-blur-sm border"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </Panel>

      {/* Enhanced Collapsible Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-background/98 via-background/95 to-background/98 backdrop-blur-xl border-r border-border/50 transition-all duration-300 z-40 shadow-2xl ${
          sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">IA</span>
              </div>
              <div>
                <h2 className="text-base font-semibold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">IA Board</h2>
                <p className="text-xs text-muted-foreground">Infinite Canvas</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Add</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={addNode} 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xs shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <MessageCirclePlus className="h-3 w-3 mr-1" />
                Chat
              </Button>
              <Button 
                onClick={addVideoHybridNode} 
                size="sm" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Video className="h-3 w-3 mr-1" />
                Vídeo IA
              </Button>
              <Button 
                onClick={addDownloadsNode} 
                size="sm" 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-xs shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Package className="h-3 w-3 mr-1" />
                Downloads
              </Button>
              <Button 
                onClick={addVideoNode} 
                size="sm" 
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-xs shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Video className="h-3 w-3 mr-1" />
                Pika
              </Button>
            </div>
            <Button 
              onClick={addFurionNode} 
              size="sm" 
              className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-xs shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Sparkles className="h-3 w-3 mr-2" />
              Furion AI Pro
            </Button>
          </div>

          {/* AI Modules */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">AI Modules</div>
            <div className="space-y-2">
              <Button 
                onClick={() => addAIModule('ia-copy')} 
                size="sm" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs justify-start shadow-md hover:shadow-lg transition-all duration-200"
              >
                <PenTool className="h-3 w-3 mr-2" />
                Copy Writer AI
              </Button>
              <Button 
                onClick={() => addAIModule('ia-video')} 
                size="sm" 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs justify-start shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Video className="h-3 w-3 mr-2" />
                Video Creator AI
              </Button>
              <Button 
                onClick={() => addAIModule('ia-produto')} 
                size="sm" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xs justify-start shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Package className="h-3 w-3 mr-2" />
                Product Strategy AI
              </Button>
              <Button 
                onClick={() => addAIModule('ia-trafego')} 
                size="sm" 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-xs justify-start shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Target className="h-3 w-3 mr-2" />
                Traffic Generator AI
              </Button>
              <Button 
                onClick={() => addAIModule('ia-analytics')} 
                size="sm" 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xs justify-start shadow-md hover:shadow-lg transition-all duration-200"
              >
                <BarChart3 className="h-3 w-3 mr-2" />
                Analytics AI
              </Button>
            </div>
          </div>

          {/* Delete Section */}
          {selectedNodes.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <Button 
                onClick={delNode} 
                size="sm" 
                variant="destructive" 
                className="w-full text-xs bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete Selected ({selectedNodes.length})
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Context Menu */}
      {contextMenu && (
        <div 
          className="absolute bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl py-3 z-50 min-w-[220px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.nodeId ? (
            <>
              {/* Node Actions Header */}
              <div className="px-4 py-2 border-b border-border/30">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações do Módulo</h4>
              </div>
              
              {/* Node Manipulation */}
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  duplicateNode(contextMenu.nodeId!); 
                  setContextMenu(null); 
                }}
              >
                <Plus className="h-4 w-4 text-blue-500" />
                Duplicar Módulo
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  resetNode(contextMenu.nodeId!); 
                  setContextMenu(null); 
                }}
              >
                <Settings className="h-4 w-4 text-orange-500" />
                Resetar Estado
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => {
                  const node = currentBoard.nodes.find(n => n.id === contextMenu.nodeId);
                  if (node) {
                    setSettings({
                      ...settings,
                      boards: settings.boards.map(board =>
                        board.id === settings.currentBoardId
                          ? {
                              ...board,
                              nodes: board.nodes.map(n => 
                                n.id === contextMenu.nodeId 
                                  ? { ...n, selected: true }
                                  : { ...n, selected: false }
                              ),
                            }
                          : board
                      ),
                    });
                  }
                  setContextMenu(null);
                }}
              >
                <Target className="h-4 w-4 text-purple-500" />
                Focar Módulo
              </button>
              
              <div className="border-t border-border/30 my-2"></div>
              
              {/* Danger Zone */}
              <button 
                className="w-full px-4 py-2 text-left hover:bg-red-500/10 text-sm text-red-500 flex items-center gap-2 transition-colors"
                onClick={() => { 
                  deleteNode(contextMenu.nodeId!); 
                  setContextMenu(null); 
                }}
              >
                <Trash2 className="h-4 w-4" />
                Deletar Módulo
              </button>
            </>
          ) : (
            <>
              {/* Canvas Actions Header */}
              <div className="px-4 py-2 border-b border-border/30">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adicionar Módulos</h4>
              </div>
              
              {/* Add Modules Section */}
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  addNodeAtPosition('chat', contextMenu.x, contextMenu.y); 
                  setContextMenu(null); 
                }}
              >
                <MessageCirclePlus className="h-4 w-4 text-blue-500" />
                Chat IA
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  addNodeAtPosition('aiModule', contextMenu.x, contextMenu.y); 
                  setContextMenu(null); 
                }}
              >
                <Brain className="h-4 w-4 text-purple-500" />
                Módulo IA
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  addNodeAtPosition('video', contextMenu.x, contextMenu.y); 
                  setContextMenu(null); 
                }}
              >
                <Video className="h-4 w-4 text-pink-500" />
                Gerador de Vídeo
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  addNodeAtPosition('videoHybrid', contextMenu.x, contextMenu.y); 
                  setContextMenu(null); 
                }}
              >
                <Sparkles className="h-4 w-4 text-purple-400" />
                Vídeo IA Híbrido
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  addNodeAtPosition('furion', contextMenu.x, contextMenu.y); 
                  setContextMenu(null); 
                }}
              >
                <Zap className="h-4 w-4 text-orange-500" />
                Furion AI
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  addNodeAtPosition('downloads', contextMenu.x, contextMenu.y); 
                  setContextMenu(null); 
                }}
              >
                <Package className="h-4 w-4 text-green-500" />
                Central Downloads
              </button>
              
              <div className="border-t border-border/30 my-2"></div>
              
              {/* Canvas Management */}
              <div className="px-4 py-2 border-b border-border/30">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Canvas</h4>
              </div>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={centerCanvas}
              >
                <Target className="h-4 w-4 text-blue-400" />
                Centralizar Canvas
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  exportCanvas(); 
                  setContextMenu(null); 
                }}
              >
                <BarChart3 className="h-4 w-4 text-green-400" />
                Exportar Canvas
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  importCanvas(); 
                  setContextMenu(null); 
                }}
              >
                <Search className="h-4 w-4 text-indigo-400" />
                Importar Canvas
              </button>
              
              <div className="border-t border-border/30 my-2"></div>
              
              {/* Quick Actions */}
              <button 
                className="w-full px-4 py-2 text-left hover:bg-accent/50 text-sm flex items-center gap-2 transition-colors"
                onClick={() => { 
                  setSettings({
                    ...settings,
                    boards: settings.boards.map(board =>
                      board.id === settings.currentBoardId
                        ? { ...board, nodes: [], edges: [] }
                        : board
                    ),
                  }); 
                  setContextMenu(null); 
                }}
              >
                <X className="h-4 w-4 text-red-400" />
                Limpar Canvas
              </button>
            </>
          )}
        </div>
      )}
      </ReactFlow>
    </div>
  );
}

export default function IABoard() {
  return (
    <div className="w-screen h-screen bg-background">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}