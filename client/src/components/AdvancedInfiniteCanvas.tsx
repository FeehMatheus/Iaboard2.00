import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AINode, { AINodeData } from './AINode';
import ConnectionLine from './ConnectionLine';
import { 
  Plus, ZoomIn, ZoomOut, Save, Download, Home, Settings, 
  FileText, Share, Grid, Move, MousePointer, Trash2,
  Upload, Copy, Undo, Redo, Eye, EyeOff
} from 'lucide-react';

interface CanvasState {
  nodes: AINodeData[];
  connections: { from: string; to: string; active: boolean }[];
  viewport: { x: number; y: number; scale: number };
  selectedNodes: string[];
  gridVisible: boolean;
  snapToGrid: boolean;
}

const initialState: CanvasState = {
  nodes: [],
  connections: [],
  viewport: { x: 0, y: 0, scale: 1 },
  selectedNodes: [],
  gridVisible: true,
  snapToGrid: false
};

export default function AdvancedInfiniteCanvas() {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialState);
  const [tool, setTool] = useState<'select' | 'move' | 'connect'>('select');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'md' | 'pdf'>('json');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [history, setHistory] = useState<CanvasState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isGridVisible, setIsGridVisible] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [viewportStart, setViewportStart] = useState({ x: 0, y: 0 });

  // Save state to history
  const saveToHistory = useCallback((newState: CanvasState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCanvasState(newState);
  }, [history, historyIndex]);

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasState(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasState(history[historyIndex + 1]);
    }
  };

  // Add new AI node
  const addAINode = (x: number = 0, y: number = 0) => {
    const newNode: AINodeData = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'ai-node',
      position: { x, y },
      title: `Nó IA ${canvasState.nodes.length + 1}`,
      model: 'gpt-4o',
      prompt: '',
      response: '',
      isProcessing: false,
      connected: false,
      connections: [],
      settings: {
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: 'Você é um assistente útil e inteligente.'
      }
    };

    const newState = {
      ...canvasState,
      nodes: [...canvasState.nodes, newNode]
    };
    saveToHistory(newState);
  };

  // Update node
  const updateNode = (id: string, updates: Partial<AINodeData>) => {
    const newState = {
      ...canvasState,
      nodes: canvasState.nodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    };
    saveToHistory(newState);
  };

  // Delete node
  const deleteNode = (id: string) => {
    const newState = {
      ...canvasState,
      nodes: canvasState.nodes.filter(node => node.id !== id),
      connections: canvasState.connections.filter(conn => 
        conn.from !== id && conn.to !== id
      ),
      selectedNodes: canvasState.selectedNodes.filter(nodeId => nodeId !== id)
    };
    saveToHistory(newState);
  };

  // Select node
  const selectNode = (id: string, multiSelect: boolean = false) => {
    let newSelectedNodes: string[];
    
    if (multiSelect) {
      newSelectedNodes = canvasState.selectedNodes.includes(id)
        ? canvasState.selectedNodes.filter(nodeId => nodeId !== id)
        : [...canvasState.selectedNodes, id];
    } else {
      newSelectedNodes = [id];
    }

    setCanvasState({
      ...canvasState,
      selectedNodes: newSelectedNodes
    });
  };

  // Handle canvas panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setViewportStart(canvasState.viewport);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;

      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;

      setCanvasState(prev => ({
        ...prev,
        viewport: {
          ...prev.viewport,
          x: viewportStart.x + deltaX,
          y: viewportStart.y + deltaY
        }
      }));
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, panStart, viewportStart]);

  // Zoom functions
  const zoomIn = () => {
    setCanvasState(prev => ({
      ...prev,
      viewport: {
        ...prev.viewport,
        scale: Math.min(prev.viewport.scale * 1.2, 3)
      }
    }));
  };

  const zoomOut = () => {
    setCanvasState(prev => ({
      ...prev,
      viewport: {
        ...prev.viewport,
        scale: Math.max(prev.viewport.scale * 0.8, 0.1)
      }
    }));
  };

  // Export functions
  const exportCanvas = async () => {
    const data = {
      project: "IA Board by Filippe",
      timestamp: new Date().toISOString(),
      nodes: canvasState.nodes,
      connections: canvasState.connections,
      viewport: canvasState.viewport
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
        await generatePDF(data);
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
  };

  const generateMarkdown = (data: any) => {
    let md = `# IA Board by Filippe - Projeto\n\n`;
    md += `**Data de Exportação:** ${new Date(data.timestamp).toLocaleString('pt-BR')}\n\n`;
    md += `## Nós IA (${data.nodes.length})\n\n`;
    
    data.nodes.forEach((node: AINodeData, index: number) => {
      md += `### ${index + 1}. ${node.title}\n\n`;
      md += `- **Modelo:** ${node.model}\n`;
      md += `- **Status:** ${node.connected ? 'Conectado' : 'Desconectado'}\n`;
      md += `- **Prompt:** ${node.prompt}\n`;
      if (node.response) {
        md += `- **Resposta:** ${node.response}\n`;
      }
      md += `\n`;
    });

    return md;
  };

  const generatePDF = async (data: any) => {
    // This would integrate with a PDF generation library
    // For now, we'll create a simple HTML version and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>IA Board by Filippe - Relatório</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #8b5cf6; }
              .node { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <h1>IA Board by Filippe - Relatório</h1>
            <p><strong>Data:</strong> ${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
            <h2>Nós IA (${data.nodes.length})</h2>
            ${data.nodes.map((node: AINodeData) => `
              <div class="node">
                <h3>${node.title}</h3>
                <p><strong>Modelo:</strong> ${node.model}</p>
                <p><strong>Prompt:</strong> ${node.prompt}</p>
                ${node.response ? `<p><strong>Resposta:</strong> ${node.response}</p>` : ''}
              </div>
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Grid rendering
  const renderGrid = () => {
    if (!isGridVisible) return null;

    const gridSize = 50;
    const { x, y, scale } = canvasState.viewport;
    
    return (
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #374151 1px, transparent 1px),
            linear-gradient(to bottom, #374151 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
          backgroundPosition: `${x % (gridSize * scale)}px ${y % (gridSize * scale)}px`
        }}
      />
    );
  };

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={tool === 'select' ? 'default' : 'ghost'}
                onClick={() => setTool('select')}
              >
                <MousePointer className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={tool === 'move' ? 'default' : 'ghost'}
                onClick={() => setTool('move')}
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => addAINode(Math.random() * 400, Math.random() * 400)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                Nó IA
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsGridVisible(!isGridVisible)}
              >
                {isGridVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top right controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={undo} disabled={historyIndex === 0}>
                <Undo className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={redo} disabled={historyIndex === history.length - 1}>
                <Redo className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowExportDialog(true)}>
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full infinite-canvas relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        style={{
          transform: `translate(${canvasState.viewport.x}px, ${canvasState.viewport.y}px) scale(${canvasState.viewport.scale})`
        }}
      >
        {renderGrid()}
        
        {/* Render connections */}
        {canvasState.connections.map((connection, index) => {
          const fromNode = canvasState.nodes.find(n => n.id === connection.from);
          const toNode = canvasState.nodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <ConnectionLine
              key={`${connection.from}-${connection.to}-${index}`}
              from={{ 
                x: fromNode.position.x + 320, 
                y: fromNode.position.y + 96 
              }}
              to={{ 
                x: toNode.position.x, 
                y: toNode.position.y + 96 
              }}
              isActive={connection.active}
              scale={canvasState.viewport.scale}
            />
          );
        })}

        {/* Render nodes */}
        {canvasState.nodes.map(node => (
          <AINode
            key={node.id}
            data={node}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onConnect={() => {}} // TODO: Implement connection logic
            isSelected={canvasState.selectedNodes.includes(node.id)}
            onSelect={(id) => selectNode(id, false)}
            scale={canvasState.viewport.scale}
          />
        ))}
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Exportar Projeto</DialogTitle>
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
              <Button 
                onClick={exportCanvas}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Nós: {canvasState.nodes.length}</span>
              <span>Conexões: {canvasState.connections.length}</span>
              <span>Zoom: {Math.round(canvasState.viewport.scale * 100)}%</span>
              <Badge variant="secondary" className="text-xs">
                IA Board by Filippe™
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Button */}
      <div className="absolute bottom-4 right-4 z-20">
        <Button
          size="lg"
          onClick={() => window.open('https://github.com/FeehMatheus/ia-board/releases', '_blank')}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Baixar IA Board Desktop (.exe)
        </Button>
      </div>
    </div>
  );
}