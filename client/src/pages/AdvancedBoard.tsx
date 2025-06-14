import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AINode, { AINodeData } from '@/components/AINode';
import ConnectionLine from '@/components/ConnectionLine';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, ZoomIn, ZoomOut, Save, Download, Home, Settings, 
  FileText, Share, Grid, Move, MousePointer, Trash2,
  Upload, Copy, Undo, Redo, Eye, EyeOff, Brain, Crown,
  Sparkles, Zap, Target, TrendingUp, Video, Mail,
  Maximize2, Play, Users, DollarSign
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

const predefinedTemplates = [
  {
    id: 'marketing-funnel',
    name: 'Funil de Marketing',
    icon: Target,
    description: 'Template completo para criação de funil de marketing',
    nodes: [
      { title: 'Pesquisa de Mercado', model: 'gpt-4o', prompt: 'Realize uma pesquisa de mercado completa para o nicho de [PRODUTO]. Inclua análise de concorrentes, público-alvo e oportunidades.' },
      { title: 'Criação de Copy', model: 'claude-3-sonnet-20240229', prompt: 'Crie uma copy persuasiva para [PRODUTO] focando em [PÚBLICO-ALVO]. Use técnicas de copywriting comprovadas.' },
      { title: 'Landing Page', model: 'gpt-4o', prompt: 'Desenvolva o HTML/CSS para uma landing page de alta conversão baseada na copy anterior.' }
    ]
  },
  {
    id: 'content-creation',
    name: 'Criação de Conteúdo',
    icon: FileText,
    description: 'Workflow para criação de conteúdo em massa',
    nodes: [
      { title: 'Brainstorm de Ideias', model: 'gemini-1.5-pro', prompt: 'Gere 10 ideias criativas de conteúdo para [NICHO] focando em engajamento e valor.' },
      { title: 'Desenvolvimento de Artigo', model: 'gpt-4o', prompt: 'Desenvolva um artigo completo e otimizado para SEO sobre [TÓPICO].' },
      { title: 'Adaptação para Redes Sociais', model: 'claude-3-sonnet-20240229', prompt: 'Adapte o conteúdo para diferentes redes sociais: Instagram, LinkedIn, Twitter.' }
    ]
  },
  {
    id: 'business-strategy',
    name: 'Estratégia de Negócio',
    icon: TrendingUp,
    description: 'Análise estratégica completa para negócios',
    nodes: [
      { title: 'Análise SWOT', model: 'gpt-4o', prompt: 'Realize uma análise SWOT detalhada para [EMPRESA/PROJETO].' },
      { title: 'Plano de Crescimento', model: 'claude-3-sonnet-20240229', prompt: 'Desenvolva um plano de crescimento de 90 dias baseado na análise SWOT.' },
      { title: 'Métricas e KPIs', model: 'gemini-1.5-pro', prompt: 'Defina métricas e KPIs específicos para acompanhar o progresso do plano.' }
    ]
  }
];

export default function AdvancedBoard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [canvasState, setCanvasState] = useState<CanvasState>(initialState);
  const [tool, setTool] = useState<'select' | 'move' | 'connect'>('select');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'md' | 'pdf'>('json');
  const [history, setHistory] = useState<CanvasState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [showInitialGuide, setShowInitialGuide] = useState(true);
  
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
  const addAINode = (x: number = 0, y: number = 0, template?: any) => {
    const newNode: AINodeData = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'ai-node',
      position: { x, y },
      title: template?.title || `Nó IA ${canvasState.nodes.length + 1}`,
      model: template?.model || 'gpt-4o',
      prompt: template?.prompt || '',
      response: '',
      isProcessing: false,
      connected: false,
      connections: [],
      settings: {
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: 'Você é um assistente especializado do IA Board by Filippe™. Forneça respostas profissionais e detalhadas.'
      }
    };

    const newState = {
      ...canvasState,
      nodes: [...canvasState.nodes, newNode]
    };
    saveToHistory(newState);
  };

  // Load template
  const loadTemplate = (template: any) => {
    const templateNodes = template.nodes.map((nodeTemplate: any, index: number) => ({
      id: `node-${Date.now()}-${index}`,
      type: 'ai-node',
      position: { x: 100 + (index * 400), y: 100 + (index * 50) },
      title: nodeTemplate.title,
      model: nodeTemplate.model,
      prompt: nodeTemplate.prompt,
      response: '',
      isProcessing: false,
      connected: false,
      connections: [],
      settings: {
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: 'Você é um assistente especializado do IA Board by Filippe™. Forneça respostas profissionais e detalhadas.'
      }
    }));

    const newState = {
      ...canvasState,
      nodes: templateNodes
    };
    saveToHistory(newState);
    setShowTemplateDialog(false);
    setShowInitialGuide(false);
    
    toast({
      title: "Template Carregado",
      description: `Template "${template.name}" foi aplicado com sucesso.`,
    });
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
      project: "IA Board by Filippe™",
      timestamp: new Date().toISOString(),
      nodes: canvasState.nodes,
      connections: canvasState.connections,
      viewport: canvasState.viewport,
      stats: {
        totalNodes: canvasState.nodes.length,
        completedNodes: canvasState.nodes.filter(n => n.response).length,
        activeConnections: canvasState.connections.filter(c => c.active).length
      }
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `ia-board-project-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      
      case 'md':
        content = generateMarkdown(data);
        filename = `ia-board-project-${Date.now()}.md`;
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
    
    toast({
      title: "Exportação Concluída",
      description: `Projeto exportado como ${exportFormat.toUpperCase()} com sucesso.`,
    });
  };

  const generateMarkdown = (data: any) => {
    let md = `# IA Board by Filippe™ - Projeto Avançado\n\n`;
    md += `**Data de Exportação:** ${new Date(data.timestamp).toLocaleString('pt-BR')}\n\n`;
    md += `## Estatísticas do Projeto\n\n`;
    md += `- **Total de Nós:** ${data.stats.totalNodes}\n`;
    md += `- **Nós Completados:** ${data.stats.completedNodes}\n`;
    md += `- **Conexões Ativas:** ${data.stats.activeConnections}\n\n`;
    md += `## Nós IA Detalhados\n\n`;
    
    data.nodes.forEach((node: AINodeData, index: number) => {
      md += `### ${index + 1}. ${node.title}\n\n`;
      md += `- **Modelo:** ${node.model}\n`;
      md += `- **Status:** ${node.connected ? '✅ Conectado' : '❌ Desconectado'}\n`;
      md += `- **Posição:** x: ${Math.round(node.position.x)}, y: ${Math.round(node.position.y)}\n`;
      md += `\n**Prompt:**\n\`\`\`\n${node.prompt}\n\`\`\`\n\n`;
      if (node.response) {
        md += `**Resposta:**\n\`\`\`\n${node.response}\n\`\`\`\n\n`;
      }
      md += `---\n\n`;
    });

    md += `\n*Gerado por IA Board by Filippe™ - Sistema Avançado de IA Canvas*`;
    return md;
  };

  const generatePDF = async (data: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>IA Board by Filippe™ - Relatório Avançado</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
              h1 { color: white; margin: 0; font-size: 28px; }
              .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
              .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
              .node { margin: 20px 0; padding: 20px; border: 2px solid #8b5cf6; border-radius: 10px; }
              .node h3 { color: #8b5cf6; margin-top: 0; }
              .prompt, .response { background: #f1f5f9; padding: 10px; border-radius: 5px; margin: 10px 0; }
              .footer { text-align: center; margin-top: 40px; color: #64748b; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>IA Board by Filippe™</h1>
              <p>Relatório Avançado do Sistema de IA Canvas</p>
              <p><strong>Data:</strong> ${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <h3>${data.stats.totalNodes}</h3>
                <p>Total de Nós</p>
              </div>
              <div class="stat-card">
                <h3>${data.stats.completedNodes}</h3>
                <p>Nós Completados</p>
              </div>
              <div class="stat-card">
                <h3>${data.stats.activeConnections}</h3>
                <p>Conexões Ativas</p>
              </div>
            </div>
            
            <h2>Detalhes dos Nós IA</h2>
            ${data.nodes.map((node: AINodeData, index: number) => `
              <div class="node">
                <h3>${index + 1}. ${node.title}</h3>
                <p><strong>Modelo:</strong> ${node.model}</p>
                <p><strong>Status:</strong> ${node.connected ? '✅ Conectado e Funcional' : '❌ Aguardando Execução'}</p>
                <div class="prompt">
                  <strong>Prompt:</strong><br>
                  ${node.prompt}
                </div>
                ${node.response ? `
                  <div class="response">
                    <strong>Resposta da IA:</strong><br>
                    ${node.response}
                  </div>
                ` : ''}
              </div>
            `).join('')}
            
            <div class="footer">
              <p>Gerado por IA Board by Filippe™ - Sistema Avançado de IA Canvas</p>
              <p>Tecnologia de ponta para criação de workflows inteligentes</p>
            </div>
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
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #8b5cf6 1px, transparent 1px),
            linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
          backgroundPosition: `${x % (gridSize * scale)}px ${y % (gridSize * scale)}px`
        }}
      />
    );
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-gray-900/95 to-purple-900/95 backdrop-blur-sm border-b border-purple-500/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/')}>
              <Home className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">IA Board by Filippe™</h1>
                <p className="text-xs text-gray-400">Sistema Avançado de Canvas Inteligente</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-300 border-violet-500/30">
              <Crown className="w-3 h-3 mr-1" />
              Versão Suprema
            </Badge>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute top-20 left-4 z-20 flex gap-2">
        <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={tool === 'select' ? 'default' : 'ghost'}
                onClick={() => setTool('select')}
                className="data-[state=selected]:bg-violet-600"
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
                onClick={() => addAINode(Math.random() * 400 + 100, Math.random() * 400 + 100)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                Nó IA
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowTemplateDialog(true)}
                className="border-violet-500/50 text-violet-300 hover:bg-violet-600/20"
              >
                <Sparkles className="w-4 h-4" />
                Templates
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
      <div className="absolute top-20 right-4 z-20 flex gap-2">
        <Card className="bg-gray-800/95 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={undo} disabled={historyIndex === 0}>
                <Undo className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={redo} disabled={historyIndex === history.length - 1}>
                <Redo className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowExportDialog(true)}
                className="text-green-400 hover:bg-green-600/20"
              >
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
        className="w-full h-full infinite-canvas relative cursor-grab active:cursor-grabbing mt-16"
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
            onConnect={() => {}}
            isSelected={canvasState.selectedNodes.includes(node.id)}
            onSelect={(id) => selectNode(id, false)}
            scale={canvasState.viewport.scale}
          />
        ))}

        {/* Initial guide */}
        {showInitialGuide && canvasState.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Card className="bg-gradient-to-r from-violet-900/90 to-purple-900/90 border-violet-500/50 backdrop-blur-sm max-w-md pointer-events-auto">
              <CardHeader>
                <CardTitle className="text-center text-white flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                  Bem-vindo ao IA Board Supremo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-300">
                  Crie workflows inteligentes conectando múltiplas IAs em um canvas infinito.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => addAINode(200, 200)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Nó
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateDialog(true)}
                    className="border-violet-500/50 text-violet-300 hover:bg-violet-600/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ver Templates
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInitialGuide(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Pular introdução
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-gray-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              Templates de Workflow IA
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-4">
            {predefinedTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card 
                  key={template.id} 
                  className="bg-gray-800 border-gray-700 hover:border-violet-500/50 transition-all cursor-pointer"
                  onClick={() => loadTemplate(template)}
                >
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-100 flex items-center gap-2">
                      <IconComponent className="w-5 h-5 text-violet-400" />
                      {template.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-400 mb-3">{template.description}</p>
                    <div className="space-y-1">
                      {template.nodes.map((node, index) => (
                        <div key={index} className="text-xs text-gray-500 flex items-center gap-1">
                          <div className="w-2 h-2 bg-violet-500 rounded-full" />
                          {node.title}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

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
              <span>Executados: {canvasState.nodes.filter(n => n.response).length}</span>
              <span>Conexões: {canvasState.connections.length}</span>
              <span>Zoom: {Math.round(canvasState.viewport.scale * 100)}%</span>
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-300 border-violet-500/30">
                <Crown className="w-3 h-3 mr-1" />
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
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-xl animate-pulse"
        >
          <Download className="w-5 h-5 mr-2" />
          Baixar IA Board Desktop (.exe)
        </Button>
      </div>
    </div>
  );
}