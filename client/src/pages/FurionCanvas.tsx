import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Brain, Zap, Target, Download, Save, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface QuadroData {
  id: string;
  tipo: 'produto' | 'copy' | 'anuncio' | 'funil' | 'estrategia' | 'landing' | 'vsl' | 'email';
  titulo: string;
  conteudo: string;
  posicao: { x: number; y: number };
  tamanho: { width: number; height: number };
  cor: string;
  tags: string[];
  metadata: any;
  conectado?: boolean;
}

interface FurionCanvasProps {
  onBack: () => void;
}

export default function FurionCanvas({ onBack }: FurionCanvasProps) {
  const [quadros, setQuadros] = useState<QuadroData[]>([]);
  const [selectedQuadro, setSelectedQuadro] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState<QuadroData['tipo']>('produto');
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const cores = {
    produto: '#10b981',
    copy: '#3b82f6', 
    anuncio: '#f59e0b',
    funil: '#8b5cf6',
    estrategia: '#ef4444',
    landing: '#06b6d4',
    vsl: '#f97316',
    email: '#ec4899'
  };

  const gerarQuadro = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Digite um prompt para gerar conteúdo com Furion AI",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/furion/processar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: tipoSelecionado,
          prompt: prompt.trim(),
          nicho: 'Marketing Digital',
          avatarCliente: 'Empreendedores digitais',
          configuracaoAvancada: {
            gerarQuadros: true,
            incluirRecursos: true,
            formatoSaida: 'supremo',
            modulosAtivos: ['ia-espia', 'branding-master', 'copywriter-pro']
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar conteúdo');
      }

      const resultado = await response.json();
      
      // Criar quadro principal
      const novoQuadro: QuadroData = {
        id: `quadro-${Date.now()}`,
        tipo: tipoSelecionado,
        titulo: `${tipoSelecionado.toUpperCase()}: ${prompt.slice(0, 30)}...`,
        conteudo: resultado.conteudo || 'Conteúdo gerado com sucesso',
        posicao: { 
          x: Math.random() * 800 + 100, 
          y: Math.random() * 600 + 100 
        },
        tamanho: { width: 350, height: 250 },
        cor: cores[tipoSelecionado],
        tags: resultado.modulosRecomendados || [tipoSelecionado],
        metadata: resultado.estrutura || {},
        conectado: false
      };

      // Adicionar quadros extras se gerados pelo AI
      const novosQuadros = [novoQuadro];
      
      if (resultado.quadrosGerados) {
        resultado.quadrosGerados.forEach((quadroAI: any, index: number) => {
          novosQuadros.push({
            id: `quadro-ai-${Date.now()}-${index}`,
            tipo: quadroAI.tipo || 'estrategia',
            titulo: quadroAI.titulo,
            conteudo: quadroAI.conteudo,
            posicao: {
              x: novoQuadro.posicao.x + (index + 1) * 200,
              y: novoQuadro.posicao.y + (index % 2) * 150
            },
            tamanho: quadroAI.tamanho || { width: 300, height: 200 },
            cor: quadroAI.cor || cores[quadroAI.tipo] || '#6b7280',
            tags: quadroAI.tags || [],
            metadata: quadroAI.metadata || {},
            conectado: true
          });
        });
      }

      setQuadros(prev => [...prev, ...novosQuadros]);
      setPrompt('');
      
      toast({
        title: "Quadro gerado!",
        description: `${novosQuadros.length} quadro(s) criado(s) com Furion AI`,
      });

    } catch (error) {
      console.error('Erro ao gerar quadro:', error);
      toast({
        title: "Erro na geração",
        description: "Ocorreu um erro ao gerar o conteúdo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const moverQuadro = useCallback((id: string, novaPosicao: { x: number; y: number }) => {
    setQuadros(prev => prev.map(quadro => 
      quadro.id === id 
        ? { ...quadro, posicao: novaPosicao }
        : quadro
    ));
  }, []);

  const excluirQuadro = useCallback((id: string) => {
    setQuadros(prev => prev.filter(quadro => quadro.id !== id));
    setSelectedQuadro(null);
  }, []);

  const exportarProjeto = async () => {
    try {
      const response = await fetch('/api/export/projeto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: 'Projeto Furion Canvas',
          quadros: quadros,
          moduleResults: quadros.map(q => ({ tipo: q.tipo, resultado: q.conteudo })),
          createdAt: new Date()
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar projeto');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `projeto-furion-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Projeto exportado!",
        description: "Download iniciado com todos os arquivos",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o projeto",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold">Furion AI - Canvas Infinito</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            {quadros.length} Quadros
          </Badge>
          <Button onClick={exportarProjeto} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Painel Lateral */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-r border-gray-700 p-4 overflow-y-auto">
          <Tabs defaultValue="gerar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="gerar">Gerar</TabsTrigger>
              <TabsTrigger value="quadros">Quadros</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gerar" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    Gerador Furion AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Conteúdo</label>
                    <select 
                      value={tipoSelecionado}
                      onChange={(e) => setTipoSelecionado(e.target.value as QuadroData['tipo'])}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="produto">🚀 Produto Digital</option>
                      <option value="copy">✍️ Copy Persuasiva</option>
                      <option value="anuncio">📢 Anúncio Paid</option>
                      <option value="funil">🎯 Funil Completo</option>
                      <option value="estrategia">📈 Estratégia</option>
                      <option value="landing">🌐 Landing Page</option>
                      <option value="vsl">🎬 Video Sales Letter</option>
                      <option value="email">📧 Email Marketing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prompt Furion AI</label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Descreva o que você quer criar... Ex: Crie um produto digital sobre finanças pessoais para pessoas de 25-35 anos"
                      className="bg-gray-700 border-gray-600 text-white min-h-20"
                    />
                  </div>
                  
                  <Button 
                    onClick={gerarQuadro}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Gerar com Furion AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quadros">
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {quadros.map((quadro) => (
                    <Card 
                      key={quadro.id}
                      className={`bg-gray-800/50 border-gray-700 cursor-pointer transition-all ${
                        selectedQuadro === quadro.id ? 'ring-2 ring-orange-500' : ''
                      }`}
                      onClick={() => setSelectedQuadro(quadro.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: quadro.cor }}
                          />
                          <span className="text-sm font-medium">{quadro.titulo}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {quadro.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {selectedQuadro === quadro.id && (
                          <Button
                            onClick={() => excluirQuadro(quadro.id)}
                            variant="destructive"
                            size="sm"
                            className="w-full mt-2"
                          >
                            Excluir
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas Infinito */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-900/20 to-gray-800/20"
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: `${viewportOffset.x}px ${viewportOffset.y}px`
          }}
        >
          <AnimatePresence>
            {quadros.map((quadro) => (
              <motion.div
                key={quadro.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  moverQuadro(quadro.id, {
                    x: quadro.posicao.x + info.offset.x,
                    y: quadro.posicao.y + info.offset.y
                  });
                }}
                className="absolute cursor-move"
                style={{
                  left: quadro.posicao.x + viewportOffset.x,
                  top: quadro.posicao.y + viewportOffset.y,
                  width: quadro.tamanho.width,
                  height: quadro.tamanho.height,
                }}
              >
                <Card className="h-full bg-gray-800/90 backdrop-blur-sm border-2 hover:border-orange-500/50 transition-all shadow-xl">
                  <CardHeader className="pb-2" style={{ borderTopColor: quadro.cor, borderTopWidth: '3px' }}>
                    <CardTitle className="text-sm font-bold truncate">
                      {quadro.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ScrollArea className="h-32">
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {quadro.conteudo}
                      </p>
                    </ScrollArea>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {quadro.tags.slice(0, 3).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: `${quadro.cor}20`, color: quadro.cor }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Instruções quando vazio */}
          {quadros.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Brain className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-bold mb-2">Canvas Infinito Furion AI</h3>
                <p className="text-sm">
                  Use o painel lateral para gerar seus primeiros quadros<br />
                  com a inteligência artificial Furion
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}