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
  addEdge,
} from 'reactflow';
import { useStore } from '@/lib/store';
import 'reactflow/dist/style.css';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Download, FileText, Share2, Trash2, Grid3X3, Eye, EyeOff } from 'lucide-react';
import { CurisoChatNode } from '@/components/CurisoChatNode';
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from 'use-debounce';
import { useToast } from '@/hooks/use-toast';
import { BRAND_CONFIG } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const nodeTypes = {
  chat: CurisoChatNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: '#8b5cf6',
  },
};

function Flow() {
  const { settings, setSettings } = useStore();
  const { getViewport, screenToFlowPosition } = useReactFlow();
  const { toast } = useToast();
  
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'md' | 'pdf'>('json');
  const [showGrid, setShowGrid] = useState(true);

  const currentBoard = settings.boards.find(b => b.id === settings.currentBoardId)!;

  const debouncedSetSettings = useDebouncedCallback((newSettings) => {
    setSettings(newSettings);
  }, 500);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const filteredChanges = changes.filter(change => change.type !== 'remove');
    
    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: applyNodeChanges(filteredChanges, board.nodes) }
          : board
      ),
    };
    debouncedSetSettings(newSettings);
  }, [settings, debouncedSetSettings]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, edges: applyEdgeChanges(changes, board.edges) }
          : board
      ),
    };
    setSettings(newSettings);
  }, [settings, setSettings]);

  const onConnect = useCallback((params: Edge | Connection) => {
    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, edges: addEdge(params, board.edges) }
          : board
      ),
    };
    setSettings(newSettings);
  }, [settings, setSettings]);

  const addChatNode = useCallback(() => {
    const viewport = getViewport();
    const position = screenToFlowPosition({
      x: window.innerWidth / 2 - 160,
      y: window.innerHeight / 2 - 100,
    });

    const newNode: Node = {
      id: nanoid(),
      type: 'chat',
      position,
      data: {
        messages: [],
        model: 'gpt-4o',
      },
    };

    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [...board.nodes, newNode] }
          : board
      ),
    };
    setSettings(newSettings);
    
    toast({
      title: "Nó Criado",
      description: "Novo nó de chat adicionado ao canvas.",
    });
  }, [getViewport, screenToFlowPosition, settings, setSettings, toast]);

  const clearCanvas = useCallback(() => {
    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? { ...board, nodes: [], edges: [] }
          : board
      ),
    };
    setSettings(newSettings);
    
    toast({
      title: "Canvas Limpo",
      description: "Todos os nós foram removidos.",
    });
  }, [settings, setSettings, toast]);

  const exportCanvas = async () => {
    const data = {
      project: BRAND_CONFIG.name,
      version: BRAND_CONFIG.version,
      timestamp: new Date().toISOString(),
      board: currentBoard,
      totalNodes: currentBoard.nodes.length,
      totalEdges: currentBoard.edges.length,
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `ia-board-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      
      case 'md':
        content = generateMarkdown(data);
        filename = `ia-board-${Date.now()}.md`;
        mimeType = 'text/markdown';
        break;
      
      case 'pdf':
        generatePDF(data);
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
    
    toast({
      title: "Exportado!",
      description: `Canvas exportado como ${exportFormat.toUpperCase()}`,
    });
  };

  const generateMarkdown = (data: any) => {
    let md = `# ${BRAND_CONFIG.name} - Projeto Canvas\n\n`;
    md += `**Versão:** ${BRAND_CONFIG.version}\n`;
    md += `**Exportado em:** ${new Date(data.timestamp).toLocaleString('pt-BR')}\n\n`;
    md += `## Estatísticas\n\n`;
    md += `- **Nós:** ${data.totalNodes}\n`;
    md += `- **Conexões:** ${data.totalEdges}\n\n`;
    md += `## Nós do Canvas\n\n`;
    
    data.board.nodes.forEach((node: any, index: number) => {
      md += `### Nó ${index + 1}: ${node.data.model}\n\n`;
      if (node.data.messages && node.data.messages.length > 0) {
        md += `**Mensagens:** ${node.data.messages.length}\n\n`;
        node.data.messages.forEach((msg: any, msgIndex: number) => {
          md += `${msgIndex + 1}. **${msg.role}:** ${msg.content}\n\n`;
        });
      }
      md += `---\n\n`;
    });
    
    md += `\n*Gerado por ${BRAND_CONFIG.name}*`;
    return md;
  };

  const generatePDF = (data: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${BRAND_CONFIG.name} - Relatório Canvas</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; }
              .header { background: linear-gradient(135deg, #8b5cf6, ${BRAND_CONFIG.color}); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
              h1 { color: white; margin: 0; }
              .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
              .stat { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
              .node { margin: 20px 0; padding: 15px; border: 2px solid #8b5cf6; border-radius: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${BRAND_CONFIG.name}</h1>
              <p>${BRAND_CONFIG.tagline}</p>
              <p>Relatório gerado em: ${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
            </div>
            
            <div class="stats">
              <div class="stat">
                <h3>${data.totalNodes}</h3>
                <p>Nós de IA</p>
              </div>
              <div class="stat">
                <h3>${data.totalEdges}</h3>
                <p>Conexões</p>
              </div>
            </div>
            
            <h2>Detalhes dos Nós</h2>
            ${data.board.nodes.map((node: any, index: number) => `
              <div class="node">
                <h3>Nó ${index + 1}: ${node.data.model}</h3>
                <p><strong>Posição:</strong> x: ${Math.round(node.position.x)}, y: ${Math.round(node.position.y)}</p>
                ${node.data.messages ? `<p><strong>Mensagens:</strong> ${node.data.messages.length}</p>` : ''}
              </div>
            `).join('')}
            
            <div style="text-align: center; margin-top: 40px; color: #64748b;">
              <p>Powered by ${BRAND_CONFIG.name} ${BRAND_CONFIG.version}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        addChatNode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addChatNode]);

  return (
    <div className="w-full h-screen bg-gray-900">
      <ReactFlow
        nodes={currentBoard.nodes}
        edges={currentBoard.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-gray-900"
      >
        <Background 
          color={showGrid ? "#374151" : "transparent"} 
          gap={20} 
          size={1}
          style={{ opacity: showGrid ? 0.3 : 0 }}
        />
        <Controls 
          className="bg-gray-800 border-gray-700"
        />
        
        {/* Header Panel */}
        <Panel position="top-left" className="m-4">
          <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IA</span>
                </div>
                {BRAND_CONFIG.name}
              </CardTitle>
              <p className="text-sm text-gray-400">{BRAND_CONFIG.tagline}</p>
            </CardHeader>
          </Card>
        </Panel>

        {/* Toolbar Panel */}
        <Panel position="top-center" className="m-4">
          <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Button
                  onClick={addChatNode}
                  size="sm"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Nó
                </Button>
                
                <Button
                  onClick={() => setShowGrid(!showGrid)}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={() => setShowExportDialog(true)}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>

                <Button
                  onClick={clearCanvas}
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </Panel>

        {/* Stats Panel */}
        <Panel position="bottom-left" className="m-4">
          <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Nós: {currentBoard.nodes.length}</span>
                <span>Conexões: {currentBoard.edges.length}</span>
                <div className="text-xs px-2 py-1 bg-violet-600/20 text-violet-300 rounded">
                  {BRAND_CONFIG.version}
                </div>
              </div>
            </CardContent>
          </Card>
        </Panel>

        {/* CTA Panel */}
        <Panel position="bottom-right" className="m-4">
          <Button
            onClick={() => window.open(BRAND_CONFIG.downloadUrl, '_blank')}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar IA Board Desktop (.exe)
          </Button>
        </Panel>
      </ReactFlow>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Exportar Canvas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Formato de Exportação
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={exportFormat === 'json' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('json')}
                  className="w-full"
                >
                  JSON
                </Button>
                <Button
                  variant={exportFormat === 'md' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('md')}
                  className="w-full"
                >
                  Markdown
                </Button>
                <Button
                  variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('pdf')}
                  className="w-full"
                >
                  PDF
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={exportCanvas} className="bg-gradient-to-r from-violet-600 to-purple-600">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CurisoDashboard() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}