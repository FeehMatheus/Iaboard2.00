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
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings, MessageCirclePlus, Trash2, Brain, Zap, Video, Search, Package, PenTool, Target, BarChart, Sparkles } from 'lucide-react';
import { CurisoChatNodeOriginal } from '@/components/CurisoChatNodeOriginal';
import { AIModuleNode } from '@/components/AIModuleNode';
import { PikaVideoNode } from '@/components/PikaVideoNode';
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from 'use-debounce';
import { useLocation } from 'wouter';

const nodeTypes = {
  chat: CurisoChatNodeOriginal,
  aiModule: AIModuleNode,
  video: PikaVideoNode,
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

  const selectedNodes = currentBoard.nodes.filter(node => node.selected);

  return (
    <ReactFlow
      nodes={currentBoard.nodes}
      edges={currentBoard.edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      maxZoom={6}
      snapToGrid={true}
      snapGrid={[30, 30]}
      panOnDrag={true}
      panOnScroll={true}
      zoomOnScroll={true}
      zoomOnDoubleClick={true}
      className="dark bg-background"
    >
      <Background className="bg-background" />
      <Controls />
      <Panel position="top-left" className="space-x-2">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-sm font-medium">Curiso.ai</span>
        </div>
      </Panel>
      <Panel position="top-right" className="space-x-2">
        <div className="grid grid-cols-1 gap-1 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg max-w-xs">
          <div className="text-xs font-semibold text-muted-foreground mb-2 text-center">CURISO AI MODULES</div>
          
          <div className="grid grid-cols-2 gap-1">
            <Button onClick={addNode} size="sm" className="bg-primary hover:bg-primary/90 text-xs">
              <MessageCirclePlus className="h-3 w-3 mr-1" />
              Chat
            </Button>
            <Button onClick={addVideoNode} size="sm" className="bg-pink-600 hover:bg-pink-700 text-xs">
              <Video className="h-3 w-3 mr-1" />
              Vídeo
            </Button>
          </div>

          <div className="text-xs font-medium text-muted-foreground mt-2 mb-1">ADVANCED AI:</div>
          <div className="grid grid-cols-1 gap-1">
            <Button onClick={() => addAIModule('ia-total')} size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs justify-start">
              <Brain className="h-3 w-3 mr-1" />
              IA Total™
            </Button>
            <Button onClick={() => addAIModule('pensamento-poderoso')} size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-xs justify-start">
              <Zap className="h-3 w-3 mr-1" />
              Pensamento Poderoso™
            </Button>
            <Button onClick={() => addAIModule('ia-espia')} size="sm" className="bg-red-600 hover:bg-red-700 text-xs justify-start">
              <Search className="h-3 w-3 mr-1" />
              IA Espiã
            </Button>
            <Button onClick={() => addAIModule('ia-produto')} size="sm" className="bg-green-600 hover:bg-green-700 text-xs justify-start">
              <Package className="h-3 w-3 mr-1" />
              IA Produto Rápido™
            </Button>
            <Button onClick={() => addAIModule('ia-copy')} size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs justify-start">
              <PenTool className="h-3 w-3 mr-1" />
              IA Copy
            </Button>
            <Button onClick={() => addAIModule('ia-trafego')} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs justify-start">
              <Target className="h-3 w-3 mr-1" />
              IA Tráfego Pago
            </Button>
            <Button onClick={() => addAIModule('ia-video')} size="sm" className="bg-rose-600 hover:bg-rose-700 text-xs justify-start">
              <Video className="h-3 w-3 mr-1" />
              IA Vídeo Avançado
            </Button>
            <Button onClick={() => addAIModule('ia-analytics')} size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs justify-start">
              <BarChart className="h-3 w-3 mr-1" />
              IA Analytics Plus
            </Button>
          </div>

          {selectedNodes.length > 0 && (
            <Button onClick={delNode} size="sm" variant="destructive" className="mt-2 text-xs">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete ({selectedNodes.length})
            </Button>
          )}
        </div>
      </Panel>
    </ReactFlow>
  );
}

export default function CurisoOriginal() {
  return (
    <div className="w-screen h-screen bg-background">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}