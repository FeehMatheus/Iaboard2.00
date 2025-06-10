import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Bot, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Brain, 
  Rocket,
  Download,
  Share,
  Settings,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Eye,
  Clock,
  Calendar,
  Globe,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  CreditCard,
  Headphones
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AITicket {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  tipo: 'video' | 'copy' | 'design' | 'analise' | 'campanha' | 'funil' | 'estrategia';
  progresso: number;
  tempoInicio?: Date;
  tempoFim?: Date;
  resultado?: any;
  etapasProcessamento: string[];
  etapaAtual: number;
  creditos: number;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  plano: 'basico' | 'pro' | 'premium';
  creditos: number;
  totalTickets: number;
  ticketsAtivos: number;
}

export default function MaquinaMilionaria() {
  const [usuario, setUsuario] = useState<Usuario>({
    id: '1',
    nome: 'Filippe',
    email: 'filippe@email.com',
    plano: 'premium',
    creditos: 150,
    totalTickets: 47,
    ticketsAtivos: 3
  });

  const [tickets, setTickets] = useState<AITicket[]>([
    {
      id: '1',
      titulo: 'Criação de VSL para Produto Digital',
      descricao: 'Criar um Video Sales Letter completo para lançamento de curso online',
      status: 'processando',
      tipo: 'video',
      progresso: 75,
      tempoInicio: new Date(Date.now() - 5 * 60000),
      creditos: 15,
      etapasProcessamento: [
        'Analisando produto e mercado',
        'Gerando roteiro persuasivo',
        'Criando elementos visuais',
        'Renderizando video final',
        'Otimizando para conversão'
      ],
      etapaAtual: 3
    },
    {
      id: '2',
      titulo: 'Copy para Campanha Facebook Ads',
      descricao: 'Desenvolver copy altamente convertido para anúncios no Facebook',
      status: 'concluido',
      tipo: 'copy',
      progresso: 100,
      tempoInicio: new Date(Date.now() - 15 * 60000),
      tempoFim: new Date(Date.now() - 2 * 60000),
      creditos: 8,
      etapasProcessamento: [
        'Análise do público-alvo',
        'Pesquisa de concorrentes',
        'Geração de headlines',
        'Desenvolvimento do copy',
        'Testes A/B sugeridos'
      ],
      etapaAtual: 5,
      resultado: {
        headlines: [
          "🔥 ÚLTIMO DIA: 70% OFF no Curso que Mudou a Vida de +10.000 Pessoas",
          "⚡ ATENÇÃO: Esta Oportunidade Expira em 24h (Não Perca!)",
          "💰 De R$ 997 por apenas R$ 297 - Oferta Histórica Termina HOJE"
        ],
        copy: "Você está cansado de ver outras pessoas conquistando a liberdade financeira enquanto você continua preso na mesma rotina?\n\nEu entendo sua frustração...\n\nPor anos, eu também estava nessa situação. Trabalhando duro, mas sem ver resultados reais.\n\nAté descobrir o método que mudou TUDO.\n\nHoje, mais de 10.000 pessoas já transformaram suas vidas com esse sistema...",
        cta: "QUERO TRANSFORMAR MINHA VIDA AGORA →"
      }
    },
    {
      id: '3',
      titulo: 'Estratégia de Funil Completa',
      descricao: 'Desenvolver funil de vendas completo com múltiplas etapas de conversão',
      status: 'pendente',
      tipo: 'funil',
      progresso: 0,
      creditos: 25,
      etapasProcessamento: [
        'Mapeamento da jornada do cliente',
        'Criação de lead magnets',
        'Desenvolvimento de sequência de emails',
        'Páginas de captura e vendas',
        'Automações e follow-ups'
      ],
      etapaAtual: 0
    }
  ]);

  const [novoTicket, setNovoTicket] = useState({
    titulo: '',
    descricao: '',
    tipo: 'copy' as AITicket['tipo']
  });

  const [paginaAtiva, setPaginaAtiva] = useState('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState({
    tocando: false,
    volume: 80,
    mutado: false,
    tempoAtual: 0,
    duracao: 143 // 2:23 como mostrado no video
  });

  const { toast } = useToast();

  useEffect(() => {
    // Simular processamento de tickets
    const interval = setInterval(() => {
      setTickets(prev => prev.map(ticket => {
        if (ticket.status === 'processando' && ticket.progresso < 100) {
          const novoProgresso = Math.min(ticket.progresso + Math.random() * 10, 100);
          const novaEtapa = Math.floor((novoProgresso / 100) * ticket.etapasProcessamento.length);
          
          if (novoProgresso >= 100) {
            return {
              ...ticket,
              progresso: 100,
              status: 'concluido' as const,
              etapaAtual: ticket.etapasProcessamento.length - 1,
              tempoFim: new Date()
            };
          }
          
          return {
            ...ticket,
            progresso: novoProgresso,
            etapaAtual: Math.min(novaEtapa, ticket.etapasProcessamento.length - 1)
          };
        }
        return ticket;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const criarTicket = async () => {
    if (!novoTicket.titulo || !novoTicket.descricao) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const creditsMap = {
      video: 15,
      copy: 8,
      design: 12,
      analise: 10,
      campanha: 20,
      funil: 25,
      estrategia: 30
    };

    const creditosNecessarios = creditsMap[novoTicket.tipo];

    if (usuario.creditos < creditosNecessarios) {
      toast({
        title: "Créditos Insuficientes",
        description: `Você precisa de ${creditosNecessarios} créditos para esta operação`,
        variant: "destructive"
      });
      return;
    }

    const ticket: AITicket = {
      id: Date.now().toString(),
      titulo: novoTicket.titulo,
      descricao: novoTicket.descricao,
      tipo: novoTicket.tipo,
      status: 'processando',
      progresso: 0,
      tempoInicio: new Date(),
      creditos: creditosNecessarios,
      etapasProcessamento: getEtapasProcessamento(novoTicket.tipo),
      etapaAtual: 0
    };

    setTickets(prev => [ticket, ...prev]);
    setUsuario(prev => ({
      ...prev,
      creditos: prev.creditos - creditosNecessarios,
      totalTickets: prev.totalTickets + 1,
      ticketsAtivos: prev.ticketsAtivos + 1
    }));

    setNovoTicket({ titulo: '', descricao: '', tipo: 'copy' });
    setPaginaAtiva('tickets');

    toast({
      title: "Ticket Criado!",
      description: "Sua solicitação está sendo processada pela IA",
    });
  };

  const getEtapasProcessamento = (tipo: AITicket['tipo']): string[] => {
    const etapas = {
      video: [
        'Analisando produto e mercado',
        'Gerando roteiro persuasivo',
        'Criando elementos visuais',
        'Renderizando video final',
        'Otimizando para conversão'
      ],
      copy: [
        'Análise do público-alvo',
        'Pesquisa de concorrentes',
        'Geração de headlines',
        'Desenvolvimento do copy',
        'Testes A/B sugeridos'
      ],
      funil: [
        'Mapeamento da jornada do cliente',
        'Criação de lead magnets',
        'Desenvolvimento de sequência de emails',
        'Páginas de captura e vendas',
        'Automações e follow-ups'
      ],
      estrategia: [
        'Análise de mercado completa',
        'Definição de personas',
        'Estratégias de posicionamento',
        'Plano de ação detalhado',
        'Métricas e KPIs'
      ],
      design: [
        'Análise de identidade visual',
        'Criação de conceitos',
        'Desenvolvimento de layouts',
        'Refinamento e ajustes',
        'Entrega final'
      ],
      analise: [
        'Coleta de dados',
        'Processamento de informações',
        'Análise de padrões',
        'Geração de insights',
        'Relatório final'
      ],
      campanha: [
        'Definição de objetivos',
        'Segmentação de público',
        'Criação de materiais',
        'Configuração de campanhas',
        'Otimização e monitoramento'
      ]
    };
    return etapas[tipo];
  };

  const toggleVideoPlayer = () => {
    setVideoPlayer(prev => ({ ...prev, tocando: !prev.tocando }));
  };

  const toggleMute = () => {
    setVideoPlayer(prev => ({ ...prev, mutado: !prev.mutado }));
  };

  const getStatusColor = (status: AITicket['status']) => {
    switch (status) {
      case 'pendente': return 'bg-gray-500';
      case 'processando': return 'bg-blue-500';
      case 'concluido': return 'bg-green-500';
      case 'erro': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: AITicket['status']) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'processando': return 'Processando';
      case 'concluido': return 'Concluído';
      case 'erro': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  const getTipoIcon = (tipo: AITicket['tipo']) => {
    switch (tipo) {
      case 'video': return <PlayCircle className="w-4 h-4" />;
      case 'copy': return <MessageSquare className="w-4 h-4" />;
      case 'design': return <Eye className="w-4 h-4" />;
      case 'analise': return <BarChart3 className="w-4 h-4" />;
      case 'campanha': return <Target className="w-4 h-4" />;
      case 'funil': return <TrendingUp className="w-4 h-4" />;
      case 'estrategia': return <Brain className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const formatarTempo = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">
                    Máquina <span className="text-orange-500">Milionária</span>
                  </span>
                </div>
              </div>
            </div>

            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['Dashboard', 'Tickets', 'Resultados', 'Configurações'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPaginaAtiva(item.toLowerCase())}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      paginaAtiva === item.toLowerCase()
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span>{usuario.creditos} créditos</span>
              </div>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                {usuario.nome}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMenuAberto(!menuAberto)}
              >
                {menuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {menuAberto && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-800 border-t border-gray-700"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['Dashboard', 'Tickets', 'Resultados', 'Configurações'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setPaginaAtiva(item.toLowerCase());
                      setMenuAberto(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                      paginaAtiva === item.toLowerCase()
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {paginaAtiva === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center py-12">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  Transforme seu
                  <br />
                  computador em uma
                  <br />
                  <span className="text-orange-500">Máquina Milionária</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
                >
                  Mesmo que você esteja começando do absoluto zero, nossa IA vai te ajudar a criar
                  tudo de tudo na internet!
                </motion.p>

                {/* Video Player */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative max-w-4xl mx-auto mb-8"
                >
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      {/* Video Preview */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Button
                          onClick={toggleVideoPlayer}
                          size="lg"
                          className="w-20 h-20 rounded-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center"
                        >
                          {videoPlayer.tocando ? (
                            <Pause className="w-8 h-8" />
                          ) : (
                            <Play className="w-8 h-8 ml-1" />
                          )}
                        </Button>
                      </div>

                      {/* Ativar Som Button */}
                      <div className="absolute top-4 left-4">
                        <Button
                          onClick={toggleMute}
                          variant="outline"
                          size="sm"
                          className="bg-black/70 border-gray-600 text-white hover:bg-black/90"
                        >
                          {videoPlayer.mutado ? (
                            <VolumeX className="w-4 h-4 mr-2" />
                          ) : (
                            <Volume2 className="w-4 h-4 mr-2" />
                          )}
                          ATIVAR SOM
                        </Button>
                      </div>

                      {/* Simulação de telas múltiplas */}
                      <div className="absolute inset-0 p-8 opacity-30">
                        <div className="grid grid-cols-3 gap-4 h-full">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-700 rounded transform rotate-3 opacity-80">
                              <div className="p-2 border-b border-gray-600">
                                <div className="w-full h-2 bg-gray-600 rounded"></div>
                              </div>
                              <div className="p-2 space-y-1">
                                {[1, 2, 3].map((j) => (
                                  <div key={j} className="w-full h-1 bg-gray-600 rounded"></div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={toggleVideoPlayer}
                          variant="ghost"
                          size="sm"
                        >
                          {videoPlayer.tocando ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <span className="text-sm text-gray-400">
                          {formatarTempo(videoPlayer.tempoAtual)} / {formatarTempo(videoPlayer.duracao)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={toggleMute}
                          variant="ghost"
                          size="sm"
                        >
                          {videoPlayer.mutado ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </Button>
                        <div className="w-20 h-1 bg-gray-600 rounded">
                          <div 
                            className="h-full bg-white rounded"
                            style={{ width: `${videoPlayer.volume}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setPaginaAtiva('tickets')}
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    COMEÇAR AGORA
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    VER DEMONSTRAÇÃO
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total de Tickets</p>
                        <p className="text-2xl font-bold text-white">{usuario.totalTickets}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Tickets Ativos</p>
                        <p className="text-2xl font-bold text-white">{usuario.ticketsAtivos}</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Créditos</p>
                        <p className="text-2xl font-bold text-white">{usuario.creditos}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Plano</p>
                        <p className="text-2xl font-bold text-white capitalize">{usuario.plano}</p>
                      </div>
                      <Star className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tickets Recentes */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Tickets Recentes</span>
                    <Button
                      onClick={() => setPaginaAtiva('tickets')}
                      variant="outline"
                      size="sm"
                    >
                      Ver Todos
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.slice(0, 3).map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getTipoIcon(ticket.tipo)}
                            <h3 className="font-semibold text-white">{ticket.titulo}</h3>
                          </div>
                          <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                            {getStatusText(ticket.status)}
                          </Badge>
                        </div>
                        
                        {ticket.status === 'processando' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                {ticket.etapasProcessamento[ticket.etapaAtual]}
                              </span>
                              <span className="text-gray-400">{Math.round(ticket.progresso)}%</span>
                            </div>
                            <Progress value={ticket.progresso} className="h-2" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {paginaAtiva === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Tickets IA</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span>{usuario.creditos} créditos disponíveis</span>
                </div>
              </div>

              {/* Criar Novo Ticket */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Criar Novo Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Serviço
                    </label>
                    <select
                      value={novoTicket.tipo}
                      onChange={(e) => setNovoTicket(prev => ({ ...prev, tipo: e.target.value as AITicket['tipo'] }))}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="copy">Copy para Anúncios (8 créditos)</option>
                      <option value="video">Criação de VSL (15 créditos)</option>
                      <option value="design">Design e Identidade (12 créditos)</option>
                      <option value="analise">Análise de Mercado (10 créditos)</option>
                      <option value="campanha">Campanha Completa (20 créditos)</option>
                      <option value="funil">Funil de Vendas (25 créditos)</option>
                      <option value="estrategia">Estratégia Completa (30 créditos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Título do Projeto
                    </label>
                    <Input
                      value={novoTicket.titulo}
                      onChange={(e) => setNovoTicket(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: Copy para lançamento de curso online"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição Detalhada
                    </label>
                    <Textarea
                      value={novoTicket.descricao}
                      onChange={(e) => setNovoTicket(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Descreva em detalhes o que você precisa. Quanto mais informações, melhor será o resultado da IA..."
                      rows={4}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <Button
                    onClick={criarTicket}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    size="lg"
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    Criar Ticket ({novoTicket.tipo ? (() => {
                      const creditsMap = { video: 15, copy: 8, design: 12, analise: 10, campanha: 20, funil: 25, estrategia: 30 };
                      return creditsMap[novoTicket.tipo];
                    })() : 0} créditos)
                  </Button>
                </CardContent>
              </Card>

              {/* Lista de Tickets */}
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getTipoIcon(ticket.tipo)}
                          <div>
                            <h3 className="font-semibold text-white text-lg">{ticket.titulo}</h3>
                            <p className="text-gray-400 text-sm">{ticket.descricao}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                            {getStatusText(ticket.status)}
                          </Badge>
                          <span className="text-sm text-gray-400">{ticket.creditos} créditos</span>
                        </div>
                      </div>

                      {ticket.status === 'processando' && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              {ticket.etapasProcessamento[ticket.etapaAtual]}
                            </span>
                            <span className="text-gray-400">{Math.round(ticket.progresso)}%</span>
                          </div>
                          <Progress value={ticket.progresso} className="h-2" />
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>
                              Iniciado há {Math.floor((Date.now() - (ticket.tempoInicio?.getTime() || Date.now())) / 60000)} min
                            </span>
                          </div>
                        </div>
                      )}

                      {ticket.status === 'concluido' && ticket.resultado && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Processamento concluído com sucesso!</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="w-4 h-4 mr-2" />
                              Compartilhar
                            </Button>
                          </div>
                        </div>
                      )}

                      {ticket.status === 'pendente' && (
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Aguardando processamento...</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {paginaAtiva === 'resultados' && (
            <motion.div
              key="resultados"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">Resultados</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tickets.filter(t => t.status === 'concluido' && t.resultado).map((ticket) => (
                  <Card key={ticket.id} className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        {getTipoIcon(ticket.tipo)}
                        <span>{ticket.titulo}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {ticket.tipo === 'copy' && ticket.resultado && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-white mb-2">Headlines Geradas:</h4>
                            <div className="space-y-2">
                              {ticket.resultado.headlines?.map((headline: string, index: number) => (
                                <div key={index} className="bg-gray-800 p-3 rounded border-l-4 border-orange-500">
                                  <p className="text-gray-300">{headline}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-white mb-2">Copy Completo:</h4>
                            <div className="bg-gray-800 p-4 rounded max-h-60 overflow-y-auto">
                              <p className="text-gray-300 whitespace-pre-line">{ticket.resultado.copy}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-white mb-2">Call to Action:</h4>
                            <div className="bg-orange-900/30 border border-orange-500 rounded p-3">
                              <p className="text-orange-300 font-semibold">{ticket.resultado.cta}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="w-4 h-4 mr-2" />
                              Compartilhar
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {paginaAtiva === 'configurações' && (
            <motion.div
              key="configuracoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">Configurações</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Perfil do Usuário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                      <Input value={usuario.nome} className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <Input value={usuario.email} className="bg-gray-800 border-gray-600 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Plano Atual</label>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-600 text-white capitalize">{usuario.plano}</Badge>
                        <Button size="sm" variant="outline">Upgrade</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Créditos e Uso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Créditos Disponíveis</span>
                      <span className="text-2xl font-bold text-green-400">{usuario.creditos}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Total de Tickets</span>
                      <span className="text-xl font-semibold text-white">{usuario.totalTickets}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Tickets Ativos</span>
                      <span className="text-xl font-semibold text-orange-400">{usuario.ticketsAtivos}</span>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Comprar Mais Créditos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}