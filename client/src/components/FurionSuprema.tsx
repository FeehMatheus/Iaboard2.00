import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  X, 
  Sparkles, 
  Target,
  FileText,
  Megaphone,
  TrendingUp,
  Layout,
  Copy,
  Download,
  Eye,
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Save,
  Share2,
  Zap,
  Globe,
  Users,
  BarChart3,
  DollarSign,
  Clock,
  Lightbulb,
  Rocket,
  Crown,
  Star,
  Settings,
  Maximize2,
  Minimize2,
  Move,
  RotateCcw,
  Camera,
  Video,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  Grid,
  List,
  Bookmark,
  Tag,
  Folder,
  Archive,
  RefreshCw,
  History,
  Layers,
  PenTool,
  Type,
  Image,
  Music,
  Film,
  Database,
  Code,
  Palette,
  Wand2,
  Scissors,
  Paperclip,
  Link,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface FurionSupremaProps {
  onClose: () => void;
}

interface QuadroItem {
  id: string;
  type: 'texto' | 'imagem' | 'video' | 'link' | 'nota' | 'resultado';
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

interface FurionResponse {
  success: boolean;
  conteudo: string;
  estrutura?: any;
  arquivos?: Array<{
    nome: string;
    tipo: string;
    conteudo: string;
  }>;
  proximosPassos?: string[];
  estimativaROI?: string;
  metadata?: any;
}

export default function FurionSuprema({ onClose }: FurionSupremaProps) {
  // Estados principais
  const [activeModule, setActiveModule] = useState('dashboard');
  const [quadros, setQuadros] = useState<QuadroItem[]>([]);
  const [selectedQuadro, setSelectedQuadro] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'infinite' | 'grid' | 'list'>('infinite');
  
  // Estados do Furion AI
  const [furionPrompt, setFurionPrompt] = useState('');
  const [furionConfig, setFurionConfig] = useState({
    tipo: 'produto',
    nicho: '',
    avatarCliente: '',
    orcamento: '',
    objetivo: '',
    tonalidade: 'profissional',
    complexidade: 'intermediario'
  });

  // Referências
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Módulos disponíveis no Furion Suprema
  const modulos = [
    {
      id: 'dashboard',
      nome: 'Dashboard Supremo',
      icone: <BarChart3 className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-blue-500 to-blue-700',
      descricao: 'Visão geral completa do seu império digital'
    },
    {
      id: 'ia-espia',
      nome: 'IA Espiã Suprema',
      icone: <Eye className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-purple-500 to-purple-700',
      descricao: 'Análise profunda da concorrência e mercado'
    },
    {
      id: 'branding-master',
      nome: 'Branding Master',
      icone: <Crown className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      descricao: 'Criação de marcas multimilionárias'
    },
    {
      id: 'copywriter-pro',
      nome: 'Copywriter Pro',
      icone: <PenTool className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-green-500 to-green-700',
      descricao: 'Textos que convertem em vendas reais'
    },
    {
      id: 'video-mestre',
      nome: 'Vídeo Mestre',
      icone: <Video className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-red-500 to-red-700',
      descricao: 'Criação de vídeos virais e VSLs'
    },
    {
      id: 'landing-genius',
      nome: 'Landing Genius',
      icone: <Layout className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-indigo-500 to-indigo-700',
      descricao: 'Páginas que capturam e convertem'
    },
    {
      id: 'trafego-ultra',
      nome: 'Tráfego Ultra',
      icone: <Rocket className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-pink-500 to-pink-700',
      descricao: 'Campanhas que geram milhões em vendas'
    },
    {
      id: 'analytics-plus',
      nome: 'Analytics Plus',
      icone: <TrendingUp className="w-6 h-6" />,
      cor: 'bg-gradient-to-r from-teal-500 to-teal-700',
      descricao: 'Métricas que revelam oportunidades de ouro'
    }
  ];

  // Tipos de quadros
  const tiposQuadro = [
    { id: 'texto', nome: 'Texto/Nota', icone: <Type className="w-5 h-5" />, cor: 'bg-blue-500' },
    { id: 'imagem', nome: 'Imagem', icone: <Image className="w-5 h-5" />, cor: 'bg-green-500' },
    { id: 'video', nome: 'Vídeo', icone: <Video className="w-5 h-5" />, cor: 'bg-red-500' },
    { id: 'link', nome: 'Link', icone: <Link className="w-5 h-5" />, cor: 'bg-purple-500' },
    { id: 'nota', nome: 'Nota Rápida', icone: <Lightbulb className="w-5 h-5" />, cor: 'bg-yellow-500' },
    { id: 'resultado', nome: 'Resultado IA', icone: <Brain className="w-5 h-5" />, cor: 'bg-indigo-500' }
  ];

  // Mutation para processar Furion
  const furionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/furion/processar-supremo', data);
      return response.json();
    },
    onSuccess: (resultado: FurionResponse) => {
      // Criar quadro com resultado
      criarQuadroResultado(resultado);
    }
  });

  // Query para buscar quadros salvos
  const { data: quadrosSalvos = [] } = useQuery({
    queryKey: ['/api/furion/quadros'],
    retry: false,
  });

  // Funções do Sistema de Quadros Infinitos
  const criarNovoQuadro = useCallback((tipo: string) => {
    const novoQuadro: QuadroItem = {
      id: `quadro-${Date.now()}`,
      type: tipo as any,
      title: `Novo ${tiposQuadro.find(t => t.id === tipo)?.nome}`,
      content: '',
      position: {
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100
      },
      size: { width: 300, height: 200 },
      color: tiposQuadro.find(t => t.id === tipo)?.cor || 'bg-gray-500',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setQuadros(prev => [...prev, novoQuadro]);
    setSelectedQuadro(novoQuadro.id);
  }, []);

  const criarQuadroResultado = useCallback((resultado: FurionResponse) => {
    const quadroResultado: QuadroItem = {
      id: `resultado-${Date.now()}`,
      type: 'resultado',
      title: `Resultado Furion.AI - ${furionConfig.tipo}`,
      content: resultado.conteudo,
      position: {
        x: Math.random() * 600 + 200,
        y: Math.random() * 400 + 150
      },
      size: { width: 400, height: 300 },
      color: 'bg-gradient-to-br from-purple-500 to-blue-600',
      tags: [furionConfig.tipo, furionConfig.nicho].filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        furionConfig,
        estrutura: resultado.estrutura,
        arquivos: resultado.arquivos,
        proximosPassos: resultado.proximosPassos,
        estimativaROI: resultado.estimativaROI
      }
    };

    setQuadros(prev => [...prev, quadroResultado]);
    setSelectedQuadro(quadroResultado.id);
  }, [furionConfig]);

  const atualizarQuadro = useCallback((id: string, updates: Partial<QuadroItem>) => {
    setQuadros(prev => prev.map(quadro => 
      quadro.id === id 
        ? { ...quadro, ...updates, updatedAt: new Date() }
        : quadro
    ));
  }, []);

  const removerQuadro = useCallback((id: string) => {
    setQuadros(prev => prev.filter(quadro => quadro.id !== id));
    if (selectedQuadro === id) {
      setSelectedQuadro(null);
    }
  }, [selectedQuadro]);

  // Funções de navegação e zoom
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.3, Math.min(3, newZoom));
    });
  }, []);

  const resetView = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Funções de processamento Furion
  const processarComFurion = useCallback(() => {
    if (!furionPrompt.trim()) return;

    furionMutation.mutate({
      ...furionConfig,
      prompt: furionPrompt,
      sistemInfiniteBoard: true,
      configuracaoAvancada: {
        gerarQuadros: true,
        incluirRecursos: true,
        formatoSaida: 'supremo'
      }
    });
  }, [furionPrompt, furionConfig, furionMutation]);

  // Renderização dos quadros
  const renderQuadro = useCallback((quadro: QuadroItem) => {
    const isSelected = selectedQuadro === quadro.id;
    
    return (
      <motion.div
        key={quadro.id}
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.05, zIndex: 1000 }}
        style={{
          position: 'absolute',
          left: quadro.position.x,
          top: quadro.position.y,
          width: quadro.size.width,
          height: quadro.size.height,
          zIndex: isSelected ? 100 : 1
        }}
        onClick={() => setSelectedQuadro(quadro.id)}
        onDragEnd={(event, info) => {
          atualizarQuadro(quadro.id, {
            position: {
              x: quadro.position.x + info.offset.x,
              y: quadro.position.y + info.offset.y
            }
          });
        }}
        className={`cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        <Card className={`h-full ${quadro.color} text-white shadow-xl hover:shadow-2xl transition-all`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold truncate">
                {quadro.title}
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Editar quadro
                  }}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white hover:bg-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removerQuadro(quadro.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {quadro.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {quadro.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-3">
            <div className="h-full overflow-hidden">
              {quadro.type === 'texto' || quadro.type === 'nota' ? (
                <Textarea
                  value={quadro.content}
                  onChange={(e) => atualizarQuadro(quadro.id, { content: e.target.value })}
                  className="h-full bg-transparent border-none text-white placeholder-white/70 resize-none"
                  placeholder="Digite aqui..."
                />
              ) : quadro.type === 'resultado' ? (
                <div className="h-full overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap text-white/90">
                    {quadro.content.substring(0, 200)}...
                  </pre>
                  {quadro.metadata?.arquivos && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold">Arquivos:</p>
                      {quadro.metadata.arquivos.slice(0, 2).map((arquivo: any, index: number) => (
                        <div key={index} className="text-xs opacity-80">
                          📄 {arquivo.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-white/70">
                  {tiposQuadro.find(t => t.id === quadro.type)?.icone}
                  <span className="ml-2 text-sm">
                    {tiposQuadro.find(t => t.id === quadro.type)?.nome}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }, [selectedQuadro, atualizarQuadro, removerQuadro]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/95 backdrop-blur-sm z-50 ${isFullscreen ? '' : 'p-4'}`}
    >
      <div className={`bg-gray-900 text-white ${isFullscreen ? 'h-full' : 'h-full rounded-2xl'} overflow-hidden flex flex-col`}>
        {/* Header Supremo */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wand2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  FURION.AI SUPREMA
                  <Crown className="w-6 h-6 ml-2 text-yellow-400" />
                </h1>
                <p className="text-purple-100 text-sm">
                  Sistema de Quadros Infinitos + IA Multimilionária
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-white border-white/30">
                <Users className="w-4 h-4 mr-1" />
                {quadros.length} Quadros
              </Badge>
              
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Sidebar Módulos */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Módulos do Furion */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Módulos IA Suprema
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {modulos.map((modulo) => (
                  <motion.div
                    key={modulo.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      activeModule === modulo.id
                        ? modulo.cor + ' text-white shadow-lg'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveModule(modulo.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activeModule === modulo.id ? 'bg-white/20' : 'bg-gray-600'
                      }`}>
                        {modulo.icone}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{modulo.nome}</p>
                        <p className="text-xs opacity-80 truncate">{modulo.descricao}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Interface Furion */}
            <div className="flex-1 p-4 border-t border-gray-700">
              <h4 className="font-semibold mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Prompt Supremo
              </h4>
              
              <Textarea
                value={furionPrompt}
                onChange={(e) => setFurionPrompt(e.target.value)}
                placeholder="Descreva o que você quer criar... O Furion Suprema entenderá e criará quadros inteligentes para você!"
                className="min-h-[120px] bg-gray-700 border-gray-600 text-white mb-4"
              />

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Input
                  value={furionConfig.nicho}
                  onChange={(e) => setFurionConfig(prev => ({ ...prev, nicho: e.target.value }))}
                  placeholder="Nicho"
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
                <select
                  value={furionConfig.tipo}
                  onChange={(e) => setFurionConfig(prev => ({ ...prev, tipo: e.target.value }))}
                  className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="produto">Produto</option>
                  <option value="copy">Copy</option>
                  <option value="anuncio">Anúncio</option>
                  <option value="funil">Funil</option>
                  <option value="estrategia">Estratégia</option>
                  <option value="landing">Landing Page</option>
                  <option value="vsl">VSL</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <Button
                onClick={processarComFurion}
                disabled={!furionPrompt.trim() || furionMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {furionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Furion Criando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Criar com Furion Suprema
                  </>
                )}
              </Button>
            </div>

            {/* Criação de Quadros */}
            <div className="p-4 border-t border-gray-700">
              <h4 className="font-semibold mb-3 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Novo Quadro
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {tiposQuadro.map((tipo) => (
                  <Button
                    key={tipo.id}
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => criarNovoQuadro(tipo.id)}
                  >
                    {tipo.icone}
                    <span className="ml-1 text-xs">{tipo.nome}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Infinito */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Controles de Visualização */}
            <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-black/50 rounded-lg p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setViewMode('infinite')}
                >
                  <Move className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-1 bg-black/50 rounded-lg p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => handleZoom('out')}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => handleZoom('in')}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={resetView}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Canvas Principal */}
            <div
              ref={canvasRef}
              className="w-full h-full relative"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center'
              }}
            >
              {/* Grid de fundo */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    radial-gradient(circle, #4F46E5 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                  backgroundPosition: `${panOffset.x % 50}px ${panOffset.y % 50}px`
                }}
              />

              {/* Quadros */}
              <AnimatePresence>
                {quadros.map(renderQuadro)}
              </AnimatePresence>

              {/* Estado vazio */}
              {quadros.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Wand2 className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Canvas Infinito Supremo
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Crie quadros infinitos, use o Furion.AI e construa seu império digital de forma visual e inteligente.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={() => criarNovoQuadro('nota')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Quadro
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Usar Furion.AI
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Barra de Status */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Quadros: {quadros.length}</span>
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
              <span>Modo: {viewMode}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Módulo: {modulos.find(m => m.id === activeModule)?.nome}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Furion.AI Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}