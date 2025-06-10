import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Play, 
  Pause, 
  Square,
  Download,
  FileText,
  Video,
  Image,
  Target,
  Eye,
  Sparkles,
  Globe,
  BarChart3,
  Settings,
  Users,
  Zap,
  Crown,
  Cpu,
  Mic,
  Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AITicket {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  type: 'video' | 'copy' | 'design' | 'analysis' | 'campaign';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  result?: any;
  processingSteps: string[];
  currentStep: number;
}

interface ThiagoFinchAIProps {
  onBack?: () => void;
}

export default function ThiagoFinchAI({ onBack }: ThiagoFinchAIProps) {
  const [tickets, setTickets] = useState<AITicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<'idle' | 'processing' | 'overload'>('idle');
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<AITicket['type']>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const { toast } = useToast();
  const ticketRef = useRef<HTMLDivElement>(null);

  // Simular níveis de áudio para gravação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Processo de IA
  const processAIMutation = useMutation({
    mutationFn: async (data: { prompt: string; type: string }) => {
      const response = await apiRequest('POST', '/api/thiago-ai/process', data);
      return await response.json();
    },
    onSuccess: (result: any) => {
      const ticketId = result.ticketId || result.id;
      updateTicketStatus(ticketId, 'completed', result);
      toast({
        title: "IA Processada com Sucesso!",
        description: "Seu conteúdo está pronto para download.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no Processamento",
        description: "Falha na execução da IA. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const createTicket = (type: AITicket['type'], description: string) => {
    const newTicket: AITicket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: getTicketTitle(type),
      description,
      status: 'pending',
      type,
      progress: 0,
      processingSteps: getProcessingSteps(type),
      currentStep: 0,
      startTime: new Date()
    };

    setTickets(prev => [...prev, newTicket]);
    return newTicket.id;
  };

  const updateTicketStatus = (ticketId: string, status: AITicket['status'], result?: any) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status, 
            result,
            endTime: status === 'completed' ? new Date() : ticket.endTime,
            progress: status === 'completed' ? 100 : ticket.progress
          }
        : ticket
    ));
  };

  const simulateProcessing = (ticketId: string) => {
    const steps = getProcessingSteps(selectedType);
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps.length) * 100;
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status: 'processing',
              progress: Math.min(progress, 95),
              currentStep: Math.min(currentStep, steps.length - 1)
            }
          : ticket
      ));

      if (currentStep >= steps.length) {
        clearInterval(interval);
        processAIMutation.mutate({ prompt, type: selectedType });
      }
    }, 2000);

    setActiveTicket(ticketId);
    setSystemStatus('processing');
  };

  const handleCreateTicket = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Necessário",
        description: "Digite uma descrição para processar com a IA.",
        variant: "destructive",
      });
      return;
    }

    const ticketId = createTicket(selectedType, prompt);
    simulateProcessing(ticketId);
    setPrompt('');
  };

  const getTicketTitle = (type: AITicket['type']): string => {
    const titles = {
      video: 'Geração de Vídeo IA',
      copy: 'Copywriting Inteligente',
      design: 'Design Automático',
      analysis: 'Análise de Mercado',
      campaign: 'Campanha Publicitária'
    };
    return titles[type];
  };

  const getProcessingSteps = (type: AITicket['type']): string[] => {
    const steps = {
      video: [
        'Analisando prompt...',
        'Gerando roteiro...',
        'Criando cenas...',
        'Processando áudio...',
        'Renderizando vídeo...',
        'Finalizando...'
      ],
      copy: [
        'Analisando público-alvo...',
        'Pesquisando gatilhos mentais...',
        'Estruturando copy...',
        'Otimizando conversão...',
        'Finalizando texto...'
      ],
      design: [
        'Analisando briefing...',
        'Gerando conceitos...',
        'Criando layouts...',
        'Aplicando cores...',
        'Finalizando design...'
      ],
      analysis: [
        'Coletando dados...',
        'Analisando concorrência...',
        'Identificando oportunidades...',
        'Gerando insights...',
        'Compilando relatório...'
      ],
      campaign: [
        'Analisando público...',
        'Definindo estratégia...',
        'Criando anúncios...',
        'Configurando targeting...',
        'Otimizando budget...'
      ]
    };
    return steps[type];
  };

  const getTypeIcon = (type: AITicket['type']) => {
    const icons = {
      video: <Video className="w-4 h-4" />,
      copy: <FileText className="w-4 h-4" />,
      design: <Image className="w-4 h-4" />,
      analysis: <BarChart3 className="w-4 h-4" />,
      campaign: <Target className="w-4 h-4" />
    };
    return icons[type];
  };

  const getStatusColor = (status: AITicket['status']) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      completed: 'bg-green-500',
      error: 'bg-red-500'
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                ← Voltar
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">IA Board - Sistema Avançado</h1>
                <p className="text-gray-400">Inteligência Artificial Empresarial</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={`${
              systemStatus === 'idle' ? 'border-green-500 text-green-400' :
              systemStatus === 'processing' ? 'border-blue-500 text-blue-400' :
              'border-red-500 text-red-400'
            }`}>
              {systemStatus === 'idle' ? '🟢 Sistema Pronto' :
               systemStatus === 'processing' ? '🔵 Processando' :
               '🔴 Sobrecarga'}
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 grid lg:grid-cols-3 gap-6">
        {/* Painel de Controle */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Novo Processamento IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Seletor de Tipo */}
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de IA</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['video', 'copy', 'design', 'analysis', 'campaign'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className="flex items-center space-x-2"
                    >
                      {getTypeIcon(type)}
                      <span className="text-xs">{type.toUpperCase()}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Prompt / Descrição</label>
                <Textarea
                  placeholder="Descreva o que você precisa que a IA processe..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                />
              </div>

              {/* Gravação de Áudio */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className="flex items-center space-x-2"
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? 'Parar' : 'Gravar'}</span>
                </Button>
                {isRecording && (
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Botão Processar */}
              <Button 
                onClick={handleCreateTicket}
                disabled={!prompt.trim() || systemStatus === 'processing'}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Processar com IA
              </Button>
            </CardContent>
          </Card>

          {/* Status do Sistema */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <span>Status do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU IA</span>
                  <Badge variant="outline" className="text-green-400 border-green-500">85%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GPU Processamento</span>
                  <Badge variant="outline" className="text-blue-400 border-blue-500">92%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memória Neural</span>
                  <Badge variant="outline" className="text-purple-400 border-purple-500">78%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tickets Ativos</span>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-500">
                    {tickets.filter(t => t.status === 'processing').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets de Processamento */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Tickets de Processamento</h2>
              <Badge variant="outline" className="text-gray-400">
                {tickets.length} total
              </Badge>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {tickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    ref={activeTicket === ticket.id ? ticketRef : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`relative bg-gray-900/70 border rounded-lg p-4 ${
                      activeTicket === ticket.id ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700'
                    }`}
                  >
                    {/* Ticket Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)} animate-pulse`} />
                        {getTypeIcon(ticket.type)}
                        <div>
                          <h3 className="font-semibold">{ticket.title}</h3>
                          <p className="text-xs text-gray-400">ID: {ticket.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={
                          ticket.status === 'completed' ? 'border-green-500 text-green-400' :
                          ticket.status === 'processing' ? 'border-blue-500 text-blue-400' :
                          ticket.status === 'error' ? 'border-red-500 text-red-400' :
                          'border-yellow-500 text-yellow-400'
                        }>
                          {ticket.status.toUpperCase()}
                        </Badge>
                        
                        {ticket.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-3">{ticket.description}</p>

                    {/* Progress Bar */}
                    {ticket.status === 'processing' && (
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span>{ticket.processingSteps[ticket.currentStep]}</span>
                          <span>{Math.round(ticket.progress)}%</span>
                        </div>
                        <Progress value={ticket.progress} className="h-2" />
                      </div>
                    )}

                    {/* Processing Steps */}
                    {ticket.status === 'processing' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {ticket.processingSteps.map((step, index) => (
                          <div 
                            key={index}
                            className={`flex items-center space-x-2 ${
                              index <= ticket.currentStep ? 'text-blue-400' : 'text-gray-500'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              index < ticket.currentStep ? 'bg-green-500' :
                              index === ticket.currentStep ? 'bg-blue-500 animate-pulse' :
                              'bg-gray-600'
                            }`} />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Completed Result */}
                    {ticket.status === 'completed' && ticket.result && (
                      <div className="bg-gray-800/50 rounded p-3 mt-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-green-400">Resultado:</span>
                        </div>
                        <div className="text-xs text-gray-300">
                          {ticket.type === 'video' && (
                            <div className="space-y-1">
                              <p>✅ Vídeo gerado: {ticket.result.duration || '60s'}</p>
                              <p>✅ Qualidade: {ticket.result.quality || 'HD 1080p'}</p>
                              <p>✅ Formato: {ticket.result.format || 'MP4'}</p>
                            </div>
                          )}
                          {ticket.type === 'copy' && (
                            <div className="space-y-1">
                              <p>✅ Texto gerado: {ticket.result.wordCount || '500'} palavras</p>
                              <p>✅ Tom: {ticket.result.tone || 'Persuasivo'}</p>
                              <p>✅ CTA incluído: Sim</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="flex justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-gray-700">
                      <span>Iniciado: {ticket.startTime?.toLocaleTimeString()}</span>
                      {ticket.endTime && (
                        <span>Concluído: {ticket.endTime.toLocaleTimeString()}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {tickets.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum ticket criado ainda</p>
                  <p className="text-sm">Crie seu primeiro processamento IA</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}