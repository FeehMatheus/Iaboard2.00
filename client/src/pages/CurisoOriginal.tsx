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
import { Plus, Settings, MessageCirclePlus, Trash2, Brain, Zap, Video, Search, Package, PenTool, Target, BarChart } from 'lucide-react';
import { CurisoChatNodeOriginal } from '@/components/CurisoChatNodeOriginal';
import { AIModuleNode } from '@/components/AIModuleNode';
import { VideoNode } from '@/components/VideoNode';
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from 'use-debounce';

const nodeTypes = {
  chat: CurisoChatNodeOriginal,
  aiModule: AIModuleNode,
  video: VideoNode,
};

function Flow() {
  const { settings, setSettings } = useStore();
  const { getViewport, screenToFlowPosition } = useReactFlow();

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
        text: '',
        voice: 'pt-BR-FranciscaNeural',
        avatar: 'amy-jcwCkr1grs',
        type: 'did',
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
        <div className="flex gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2 border">
          <Button onClick={addNode} size="sm" className="bg-primary hover:bg-primary/90">
            <MessageCirclePlus className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button onClick={() => addAIModule('ia-total')} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Brain className="h-4 w-4 mr-1" />
            IA Total™
          </Button>
          <Button onClick={() => addAIModule('pensamento-poderoso')} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
            <Zap className="h-4 w-4 mr-1" />
            Pensamento Poderoso™
          </Button>
          <Button onClick={addVideoNode} size="sm" className="bg-pink-600 hover:bg-pink-700">
            <Video className="h-4 w-4 mr-1" />
            Vídeo IA
          </Button>
          {selectedNodes.length > 0 && (
            <Button onClick={delNode} size="sm" variant="destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
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