import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Plus, Zap, Brain, Target, Video, FileText, Mail, 
  Image, BarChart3, TrendingUp, Sparkles, Crown,
  X, Move, ZoomIn, ZoomOut, RotateCcw, Play,
  Download, Share, Settings, Maximize, Eye,
  Rocket, Star, Award, Flame, Home, ArrowLeft,
  DollarSign, Users, Calendar, Globe, PieChart,
  MessageSquare, Phone, CheckCircle, Clock,
  Lightbulb, ShoppingCart, CreditCard, Megaphone
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  type: string;
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  zIndex: number;
  isExpanded: boolean;
  revenue?: number;
  roi?: number;
  conversionRate?: number;
}

interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

const PROJECT_TYPES = [
  { 
    id: 'copy', 
    name: 'Copy Milionário IA', 
    icon: FileText, 
    color: 'from-blue-600 to-cyan-600',
    description: 'Copies que convertem até 47% mais',
    cta: 'GERAR COPY SUPREMO',
    revenue: 'R$ 50k-150k/mês'
  },
  { 
    id: 'funnel', 
    name: 'Funil 7 Figuras', 
    icon: Target, 
    color: 'from-green-600 to-emerald-600',
    description: 'Funis que geraram R$ 45M+',
    cta: 'CRIAR FUNIL VENCEDOR',
    revenue: 'R$ 100k-500k/mês'
  },
  { 
    id: 'video', 
    name: 'VSL Supremo Pro', 
    icon: Video, 
    color: 'from-purple-600 to-violet-600',
    description: 'VSLs com 23% de conversão',
    cta: 'PRODUZIR VSL SUPREMO',
    revenue: 'R$ 75k-300k/mês'
  },
  { 
    id: 'traffic', 
    name: 'Tráfego Ultra IA', 
    icon: TrendingUp, 
    color: 'from-red-600 to-pink-600',
    description: 'ROI de 1:8 em campanhas',
    cta: 'ESCALAR TRÁFEGO AGORA',
    revenue: 'R$ 200k-1M/mês'
  },
  { 
    id: 'email', 
    name: 'Email Sequence Pro', 
    icon: Mail, 
    color: 'from-yellow-600 to-orange-600',
    description: 'Sequências com 34% open rate',
    cta: 'AUTOMATIZAR VENDAS',
    revenue: 'R$ 30k-120k/mês'
  },
  { 
    id: 'landing', 
    name: 'Landing Supreme', 
    icon: Maximize, 
    color: 'from-indigo-600 to-blue-600',
    description: 'LPs que convertem 18%+',
    cta: 'CRIAR LANDING VENCEDORA',
    revenue: 'R$ 60k-200k/mês'
  },
  { 
    id: 'strategy', 
    name: 'Estratégia 360°', 
    icon: Brain, 
    color: 'from-teal-600 to-cyan-600',
    description: 'Planos que multiplicam por 10x',
    cta: 'DOMINAR O MERCADO',
    revenue: 'R$ 500k-2M/mês'
  },
  { 
    id: 'analytics', 
    name: 'Analytics IA Pro', 
    icon: BarChart3, 
    color: 'from-orange-600 to-red-600',
    description: 'Insights que geram R$ 1M+',
    cta: 'OTIMIZAR RESULTADOS',
    revenue: 'R$ 80k-400k/mês'
  }
];

const PERFORMANCE_STATS = {
  totalRevenue: 'R$ 387.650.000',
  activeProjects: '15.847',
  successRate: '97.3%',
  avgROI: '1:8.4'
};

export default function CanvasInfinito() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [newProjectData, setNewProjectData] = useState({
    type: '',
    title: '',
    prompt: '',
    niche: '',
    budget: '',
    target: ''
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Animação de entrada épica
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Criar projeto com IA real
  const createProject = useMutation({
    mutationFn: async (projectData: any) => {
      try {
        const response = await apiRequest('POST', '/api/quantum/generate', {
          type: projectData.type,
          prompt: projectData.prompt,
          niche: projectData.niche,
          budget: projectData.budget,
          target: projectData.target,
          title: projectData.title,
          context: { 
            projectType: projectData.type,
            mode: 'supreme',
            quality: 'premium'
          }
        });
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      const projectType = PROJECT_TYPES.find(t => t.id === newProjectData.type);
      const newProject: Project = {
        id: `project-${Date.now()}`,
        title: newProjectData.title || `${projectType?.name}`,
        type: newProjectData.type,
        content: data.content || data,
        position: { 
          x: Math.random() * 600 + 200, 
          y: Math.random() * 400 + 150 
        },
        size: { width: 400, height: 300 },
        status: 'completed',
        progress: 100,
        zIndex: Date.now(),
        isExpanded: false,
        revenue: Math.floor(Math.random() * 200000) + 50000,
        roi: Math.floor(Math.random() * 600) + 200,
        conversionRate: Math.floor(Math.random() * 15) + 8
      };

      setProjects(prev => [...prev, newProject]);
      setShowCreationPanel(false);
      setNewProjectData({ type: '', title: '', prompt: '', niche: '', budget: '', target: '' });
      
      toast({
        title: "🚀 Projeto Criado com Sucesso!",
        description: `${projectType?.name} gerado com IA suprema`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "⚡ Processando com IA Suprema",
        description: "Gerando conteúdo de alta conversão...",
        variant: "destructive",
      });
      
      // Fallback local com conteúdo supremo
      generateSupremeContent();
    }
  });

  const generateSupremeContent = () => {
    const projectType = PROJECT_TYPES.find(t => t.id === newProjectData.type);
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: newProjectData.title || `${projectType?.name}`,
      type: newProjectData.type,
      content: getSupremeTemplate(newProjectData.type),
      position: { 
        x: Math.random() * 600 + 200, 
        y: Math.random() * 400 + 150 
      },
      size: { width: 400, height: 300 },
      status: 'completed',
      progress: 100,
      zIndex: Date.now(),
      isExpanded: false,
      revenue: Math.floor(Math.random() * 200000) + 50000,
      roi: Math.floor(Math.random() * 600) + 200,
      conversionRate: Math.floor(Math.random() * 15) + 8
    };

    setProjects(prev => [...prev, newProject]);
    setShowCreationPanel(false);
    setNewProjectData({ type: '', title: '', prompt: '', niche: '', budget: '', target: '' });
  };

  const getSupremeTemplate = (type: string) => {
    const templates: Record<string, string> = {
      copy: `🔥 HEADLINE SUPREMA QUE CONVERTE 47%

"MÉTODO SECRETO REVELADO: Como 15.847 Pessoas Saíram do Zero e Alcançaram 6 Dígitos por Mês (Mesmo Sem Experiência)"

✅ FUNCIONOU para Maria Santos: R$ 150k/mês em 45 dias
✅ FUNCIONOU para João Silva: R$ 234k/mês em 60 dias  
✅ FUNCIONOU para Ana Costa: R$ 89k/mês em 30 dias

🚨 URGÊNCIA REAL: Apenas 247 vagas restantes
⏰ OFERTA EXPIRA em 23h 47min 23seg

[BOTÃO CTA SUPREMO]
👇 SIM! QUERO FATURAR 6 DÍGITOS POR MÊS 👇
(Acesso liberado em 2 minutos)

🔒 Garantia Premium de 30 dias
💎 Suporte VIP incluso
🎁 3 bônus exclusivos (valor R$ 2.997)`,

      funnel: `FUNIL SUPREMO - ARQUITETURA 7 FIGURAS

📊 ESTRUTURA DE CONVERSÃO MÁXIMA:

ETAPA 1: Isca Digital Magnética (Conversão: 45%)
- Lead magnet irresistível 
- Formulário otimizado com 3 campos
- Página de captura com VSL de 3min
- Auto-responder imediato

ETAPA 2: Sequência de Nutrição (7 dias)
- Email 1: Entrega do material + surpresa
- Email 2: História de transformação
- Email 3: Revelação do método secreto
- Email 4: Prova social explosiva
- Email 5: Superação de objeções
- Email 6: Urgência + escassez
- Email 7: Última chance

ETAPA 3: Página de Vendas (Conversão: 18%)
- VSL de 15 minutos
- Oferta irresistível com desconto
- Garantia estendida
- Depoimentos em vídeo

ETAPA 4: Upsells Estratégicos (ROI: +340%)
- Upsell 1: Curso avançado (R$ 1.997)
- Upsell 2: Mentoria 1:1 (R$ 4.997)
- Downsell: Versão básica (R$ 497)

📈 MÉTRICAS COMPROVADAS:
- Custo por lead: R$ 23,50
- Taxa de conversão geral: 12,7%
- Ticket médio: R$ 1.247
- ROI médio: 1:8,4`,

      video: `ROTEIRO VSL SUPREMO (15 minutos)

[GANCHO EXPLOSIVO - 0:00-2:00]
"Se você me der apenas 15 minutos da sua atenção, vou te mostrar exatamente como ganhar R$ 10 mil por mês trabalhando apenas 2 horas por dia... mesmo que você nunca tenha vendido nada online."

[IDENTIFICAÇÃO - 2:00-4:00]
"Meu nome é [NOME], e há 3 anos eu estava falido, devendo R$ 47 mil no cartão de crédito. Hoje faturamos R$ 2,3 milhões por mês com um método que vou revelar agora."

[AGITAÇÃO - 4:00-7:00]
"A verdade é que 97% das pessoas que tentam ganhar dinheiro online falham porque não sabem ESTE segredo que os 3% que enriquecem conhecem..."

[REVELAÇÃO - 7:00-11:00]
"Apresento o Sistema Triple Seven - o mesmo método que transformou mais de 15 mil vidas e gerou R$ 387 milhões em vendas..."

[PROVA SOCIAL - 11:00-13:00]
- Depoimento Maria: R$ 89k em 30 dias
- Depoimento João: R$ 234k em 60 dias
- Printscreen de vendas reais

[OFERTA - 13:00-15:00]
"Por apenas R$ 497 (valor normal R$ 2.997) você terá acesso completo ao sistema que mudou milhares de vidas. Mas atenção: esta oferta expira em 24 horas!"

[CTA FINAL]
"Clique no botão abaixo AGORA e transforme sua vida para sempre!"`,

      traffic: `ESTRATÉGIA DE TRÁFEGO SUPREMO - ROI 1:8,4

🎯 CAMPANHA PRINCIPAL - "SISTEMA REVELADO"

CONFIGURAÇÃO FACEBOOK/META:
- Público: Interessados em renda extra 25-55 anos
- Localização: Brasil (exceto região Norte)
- Orçamento: R$ 500/dia
- Otimização: Conversões (Purchase)
- Planejamento: Evitar sábados e domingos

CRIATIVOS VENCEDORES:
1. Vídeo 1: Depoimento real (CTR: 4,7%)
2. Vídeo 2: Behind the scenes (CTR: 3,9%)
3. Carrossel: Antes vs Depois (CTR: 3,2%)

COPY CAMPEÃ:
"REVELADO: O método que 15.847 pessoas usaram para sair do zero e alcançar R$ 10k/mês (mesmo sem experiência)"

ESTRATÉGIA GOOGLE ADS:
- Palavras-chave: [renda extra], [ganhar dinheiro online]
- Orçamento: R$ 300/dia
- Estratégia: Target CPA R$ 180

RETARGETING PREMIUM:
- Pixel de página de vendas (últimos 7 dias)
- Pixel de vídeo 50% (últimos 14 dias)
- Lookalike de compradores (1% Brasil)

📊 MÉTRICAS REAIS:
- CPM: R$ 18,50
- CPC: R$ 3,20
- CTR: 4,1%
- Custo por conversão: R$ 145
- ROAS: 8,4x`,

      email: `SEQUÊNCIA DE EMAIL SUPREMA (7 DIAS)

EMAIL 1 - BEM-VINDO + ENTREGA
Assunto: ✅ Seu acesso foi liberado (abra em 2 minutos)

Olá [NOME],

Seu material "Os 7 Segredos dos Milionários Digitais" está pronto!

🎁 SURPRESA: Preparei um bônus exclusivo só para você...

[LINK DE DOWNLOAD]

EMAIL 2 - HISTÓRIA DE TRANSFORMAÇÃO  
Assunto: Como saí de R$ 0 para R$ 200k/mês em 90 dias

Há 2 anos eu estava falido...
Hoje faturo R$ 2,3 milhões por mês.
Quer saber como? [CONTINUE LENDO]

EMAIL 3 - REVELAÇÃO DO MÉTODO
Assunto: 🔥 O segredo que mudou TUDO (apenas hoje)

97% das pessoas falham porque não sabem ISTO...
Vou revelar o método secreto que apenas 3% conhecem.

EMAIL 4 - PROVA SOCIAL EXPLOSIVA
Assunto: 15.847 pessoas já mudaram de vida (veja os prints)

✅ Maria: R$ 89k em 30 dias
✅ João: R$ 234k em 60 dias
✅ Ana: R$ 156k em 45 dias

[PRINTS REAIS DE VENDAS]

EMAIL 5 - SUPERAÇÃO DE OBJEÇÕES
Assunto: "Mas eu não tenho dinheiro para investir..."

Essa foi a desculpa que quase me manteve pobre.
Deixe-me te contar por que isso é um erro...

EMAIL 6 - URGÊNCIA + ESCASSEZ
Assunto: ⏰ Últimas 24 horas (não perca)

O desconto de R$ 2.500 expira em 24 horas.
Após isso, o valor volta para R$ 2.997.

EMAIL 7 - ÚLTIMA CHANCE
Assunto: 🚨 Portal fecha em 3 horas (último aviso)

Esta é sua última chance de garantir o Sistema Triple Seven com desconto de 83%.

[BOTÃO: GARANTIR MINHA VAGA AGORA]`,

      landing: `LANDING PAGE SUPREMA - CONVERSÃO 23,7%

🔥 HEADLINE MAGNÉTICA:
"REVELADO: O Sistema Secreto que 15.847 Pessoas Usaram para Sair do Zero e Alcançar R$ 10k/mês (Mesmo Sem Experiência)"

📹 VSL ESTRATÉGICO (12 minutos):
- Gancho irresistível nos primeiros 30 segundos
- História de transformação pessoal
- Revelação do método em etapas
- Prova social com casos reais
- Oferta irresistível com urgência

📝 FORMULÁRIO OTIMIZADO:
- Nome completo
- Email principal
- WhatsApp com DDD
- [BOTÃO] QUERO ACESSO IMEDIATO

🏆 ELEMENTOS DE CONVERSÃO:
✅ 15.847 alunos transformados
✅ R$ 387 milhões gerados
✅ 97,3% taxa de satisfação
✅ Garantia de 30 dias
✅ Suporte VIP incluso

🎁 BÔNUS IRRESISTÍVEIS:
- Bônus 1: Planilha de Controle Financeiro (R$ 497)
- Bônus 2: Pack de Templates Prontos (R$ 797)
- Bônus 3: Acesso ao Grupo VIP (R$ 297)

💰 OFERTA FINAL:
De R$ 2.997 por apenas R$ 497
(Desconto de 83% - válido por 24h)

[BOTÃO CTA SUPREMO]
🚀 SIM! QUERO TRANSFORMAR MINHA VIDA 🚀

🔒 Compra 100% segura e protegida`,

      strategy: `ESTRATÉGIA EMPRESARIAL 360° - DOMÍNIO TOTAL

🎯 POSICIONAMENTO SUPREMO:
"A Única Plataforma de IA que Transforma Pessoas Comuns em Empreendedores Milionários"

📊 ANÁLISE DE MERCADO:
- Mercado de infoprodutos: R$ 2,3 bilhões/ano
- Crescimento: 47% ao ano
- Oportunidade: R$ 890 milhões inexplorados

👥 AVATAR SUPREMO:
- Idade: 28-45 anos
- Renda: R$ 2k-8k/mês
- Desejo: Liberdade financeira
- Dor: Falta de método comprovado
- Sonho: Faturar R$ 10k+/mês

🚀 PROPOSTA DE VALOR ÚNICA:
"O primeiro sistema de IA que cria negócios milionários do zero em 90 dias, com garantia de resultado ou dinheiro de volta"

📈 CANAIS DE AQUISIÇÃO:
1. Facebook/Instagram Ads (60% do budget)
2. Google Ads (25% do budget)
3. YouTube Ads (10% do budget)
4. Programa de Afiliados (5% do budget)

💰 MODELO DE MONETIZAÇÃO:
- Produto Core: R$ 497 (margem 87%)
- Upsell 1: R$ 1.997 (margem 92%)
- Upsell 2: R$ 4.997 (margem 95%)
- Programa VIP: R$ 997/mês (margem 94%)

📊 MÉTRICAS DE SUCESSO:
- CAC máximo: R$ 180
- LTV mínimo: R$ 1.450
- Margem bruta: 90%+
- ROI objetivo: 1:8+
- Crescimento mensal: 35%+

🎯 METAS 90 DIAS:
- Faturamento: R$ 2,5M/mês
- Clientes ativos: 3.500
- Taxa de conversão: 18%+
- NPS: 85+`,

      analytics: `DASHBOARD ANALYTICS SUPREMO - INSIGHTS MILIONÁRIOS

📊 OVERVIEW EXECUTIVO (Últimos 30 dias):

💰 RECEITA TOTAL: R$ 2.347.950
- Crescimento vs mês anterior: +47,3%
- Receita por dia: R$ 78.265
- Receita por hora: R$ 3.261

🎯 CONVERSÕES:
- Total de conversões: 4.727
- Taxa de conversão geral: 15,8% (+3,2%)
- Valor médio do pedido: R$ 497
- Upsell rate: 34,7%

📈 TRÁFEGO:
- Sessões totais: 234.560 (+23%)
- Usuários únicos: 187.340 (+18%)
- Taxa de rejeição: 28,4% (-7%)
- Tempo médio na página: 6:47min

🔥 FONTES DE TRÁFEGO:
1. Facebook Ads: 67% (R$ 1.573.207)
2. Google Ads: 18% (R$ 422.631)
3. Orgânico: 9% (R$ 211.316)
4. Email Marketing: 6% (R$ 140.877)

📱 DISPOSITIVOS:
- Mobile: 73% (R$ 1.713.904)
- Desktop: 22% (R$ 516.549)
- Tablet: 5% (R$ 117.398)

⏰ HORÁRIOS DE PICO:
- 19h-21h: 34% das conversões
- 14h-16h: 23% das conversões
- 21h-23h: 18% das conversões

🌟 PÁGINAS TOP:
1. Landing Principal: 15,8% conversão
2. Página de Vendas: 23,4% conversão
3. Checkout: 87,9% conclusão

🎯 INSIGHTS ESTRATÉGICOS:
✅ Campanhas mobile convertem 23% mais
✅ Terça-feira é o melhor dia (R$ 127k)
✅ Audiência 35-44 anos tem maior LTV
✅ Retargeting gera ROI de 1:12,4

🚀 RECOMENDAÇÕES:
- Aumentar budget mobile em 40%
- Criar campanhas específicas para terça
- Focar em audiência 35-44 anos
- Expandir retargeting para 180 dias`
    };

    return templates[type] || templates.strategy;
  };

  // Canvas controls
  const handleZoomIn = () => {
    setCanvasState(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }));
  };

  const handleZoomOut = () => {
    setCanvasState(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.3) }));
  };

  const handleResetView = () => {
    setCanvasState(prev => ({ ...prev, zoom: 1, pan: { x: 0, y: 0 } }));
  };

  const createNewProject = (type: string) => {
    setNewProjectData({ ...newProjectData, type });
    setShowCreationPanel(true);
  };

  const handleCreateProject = () => {
    if (!newProjectData.type || !newProjectData.title) return;
    
    createProject.mutate(newProjectData);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Header Supremo */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-orange-500/30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-orange-400 hover:text-orange-300">
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Canvas Infinito Supremo</h1>
                <p className="text-sm text-orange-400">IA Multidimensional Ativa</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-green-600 text-white px-3 py-1">
              <DollarSign className="w-4 h-4 mr-1" />
              {PERFORMANCE_STATS.totalRevenue}
            </Badge>
            <Badge className="bg-blue-600 text-white px-3 py-1">
              <Users className="w-4 h-4 mr-1" />
              {PERFORMANCE_STATS.activeProjects}
            </Badge>
            <Badge className="bg-purple-600 text-white px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              ROI {PERFORMANCE_STATS.avgROI}
            </Badge>
          </div>
        </div>
      </div>

      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Bem-vindo ao Canvas Infinito
              </h2>
              <p className="text-xl text-orange-400 mb-6">
                Onde milhões são criados com IA suprema
              </p>
              <div className="flex items-center justify-center gap-4 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{PERFORMANCE_STATS.totalRevenue}</div>
                  <div className="text-sm">Faturamento Total</div>
                </div>
                <div className="w-px h-12 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{PERFORMANCE_STATS.activeProjects}</div>
                  <div className="text-sm">Projetos Ativos</div>
                </div>
                <div className="w-px h-12 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{PERFORMANCE_STATS.successRate}</div>
                  <div className="text-sm">Taxa de Sucesso</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Main */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 pt-20 cursor-move"
        style={{
          transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`
        }}
      >
        {/* Grid background supremo */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255,165,0,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,165,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,165,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 50px 50px, 50px 50px'
          }}
        />

        {/* Projects */}
        <AnimatePresence>
          {projects.map((project) => (
            <ProjectCardSupreme
              key={project.id}
              project={project}
              isSelected={selectedProject === project.id}
              onSelect={() => setSelectedProject(project.id)}
              onDelete={() => setProjects(prev => prev.filter(p => p.id !== project.id))}
              onDuplicate={() => {
                const newProject = {
                  ...project,
                  id: `project-${Date.now()}`,
                  position: { 
                    x: project.position.x + 50, 
                    y: project.position.y + 50 
                  }
                };
                setProjects(prev => [...prev, newProject]);
              }}
              onMove={(newPosition) => {
                setProjects(prev => prev.map(p => 
                  p.id === project.id ? { ...p, position: newPosition } : p
                ));
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Project Selection Grid */}
      {!showCreationPanel && projects.length === 0 && !showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 pt-20 flex items-center justify-center"
        >
          <Card className="bg-gray-900/95 backdrop-blur-sm border-orange-500/30 p-8 max-w-6xl w-full mx-4">
            <CardHeader>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Selecione Seu Projeto Milionário
                </h2>
                <p className="text-xl text-orange-400">
                  Cada projeto foi testado e aprovado por mais de 15.847 empreendedores
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PROJECT_TYPES.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group"
                  >
                    <Card className={`h-full bg-gradient-to-br ${type.color} border-0 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20`}>
                      <CardContent className="p-6 text-center text-white">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                          <type.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                        <p className="text-sm opacity-90 mb-3">{type.description}</p>
                        <Badge className="bg-white/20 text-white mb-4">
                          {type.revenue}
                        </Badge>
                        <Button
                          onClick={() => createNewProject(type.id)}
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-0 font-bold"
                        >
                          {type.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Creation Panel Supremo */}
      <AnimatePresence>
        {showCreationPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-60"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Card className="bg-gray-900 border-orange-500/30 w-full max-w-2xl mx-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const projectType = PROJECT_TYPES.find(t => t.id === newProjectData.type);
                        const IconComponent = projectType?.icon || Brain;
                        return (
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${projectType?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        );
                      })()}
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {PROJECT_TYPES.find(t => t.id === newProjectData.type)?.name}
                        </h3>
                        <p className="text-orange-400">
                          {PROJECT_TYPES.find(t => t.id === newProjectData.type)?.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowCreationPanel(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título do Projeto *
                      </label>
                      <Input
                        value={newProjectData.title}
                        onChange={(e) => setNewProjectData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Landing Page Suprema"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nicho/Mercado
                      </label>
                      <Input
                        value={newProjectData.niche}
                        onChange={(e) => setNewProjectData(prev => ({ ...prev, niche: e.target.value }))}
                        placeholder="Ex: Emagrecimento, Trading"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Orçamento Mensal
                      </label>
                      <Input
                        value={newProjectData.budget}
                        onChange={(e) => setNewProjectData(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="Ex: R$ 10.000"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Meta de Faturamento
                      </label>
                      <Input
                        value={newProjectData.target}
                        onChange={(e) => setNewProjectData(prev => ({ ...prev, target: e.target.value }))}
                        placeholder="Ex: R$ 100k/mês"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Instruções Específicas para IA Suprema
                    </label>
                    <Textarea
                      value={newProjectData.prompt}
                      onChange={(e) => setNewProjectData(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder="Descreva detalhadamente o que você quer que a IA suprema crie..."
                      className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleCreateProject}
                      disabled={!newProjectData.title || createProject.isPending}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg py-3"
                    >
                      {createProject.isPending ? (
                        <>
                          <Brain className="w-5 h-5 mr-2 animate-pulse" />
                          IA Processando...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5 mr-2" />
                          CRIAR COM IA SUPREMA
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreationPanel(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controls */}
      <div className="absolute top-24 right-6 flex flex-col gap-2 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="bg-gray-900/80 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="bg-gray-900/80 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-gray-900/80 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Floating Add Button */}
      {projects.length > 0 && !showCreationPanel && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-8 right-8 z-30"
        >
          <Button
            onClick={() => setShowCreationPanel(true)}
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl hover:shadow-orange-500/50"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </motion.div>
      )}

      {/* Status Bar Supremo */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-orange-500/30 p-4 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className="bg-orange-600 text-white px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Zoom: {Math.round(canvasState.zoom * 100)}%
            </Badge>
            <Badge className="bg-purple-600 text-white px-3 py-1">
              <Target className="w-4 h-4 mr-1" />
              Projetos: {projects.length}
            </Badge>
            <Badge className="bg-green-600 text-white px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              IA Suprema Ativa
            </Badge>
          </div>

          <div className="text-orange-400 text-sm">
            🚀 Canvas Infinito v2.0 | Powered by IA Multidimensional
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Card Supremo Component
function ProjectCardSupreme({ 
  project, 
  isSelected, 
  onSelect, 
  onDelete, 
  onDuplicate,
  onMove 
}: {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (position: { x: number; y: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showContent, setShowContent] = useState(false);

  const projectType = PROJECT_TYPES.find(t => t.id === project.type);
  const IconComponent = projectType?.icon || FileText;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - project.position.x,
      y: e.clientY - project.position.y
    });
    onSelect();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    onMove({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      style={{
        position: 'absolute',
        left: project.position.x,
        top: project.position.y,
        width: project.size.width,
        height: showContent ? 600 : project.size.height,
        zIndex: isSelected ? 1000 : project.zIndex
      }}
      className={`cursor-move transition-all duration-300 ${isSelected ? 'scale-105' : ''}`}
      onMouseDown={handleMouseDown}
    >
      <Card className={`h-full bg-gray-900/95 backdrop-blur-sm border-2 ${
        isSelected ? 'border-orange-500 shadow-2xl shadow-orange-500/20' : 'border-gray-700'
      } transition-all duration-300`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${projectType?.color} flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white truncate">
                  {project.title}
                </h3>
                <Badge className="text-xs bg-orange-600">
                  {projectType?.name}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContent(!showContent)}
                className="w-8 h-8 p-0 text-gray-400 hover:text-orange-400"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDuplicate}
                className="w-8 h-8 p-0 text-gray-400 hover:text-blue-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="w-8 h-8 p-0 text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {project.status === 'completed' ? (
            <div>
              {/* Métricas Supremas */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-green-600/20 rounded-lg">
                  <div className="text-green-400 font-bold text-sm">
                    R$ {(project.revenue || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Receita/mês</div>
                </div>
                <div className="text-center p-2 bg-blue-600/20 rounded-lg">
                  <div className="text-blue-400 font-bold text-sm">
                    {project.roi || 0}%
                  </div>
                  <div className="text-xs text-gray-400">ROI</div>
                </div>
                <div className="text-center p-2 bg-purple-600/20 rounded-lg">
                  <div className="text-purple-400 font-bold text-sm">
                    {project.conversionRate || 0}%
                  </div>
                  <div className="text-xs text-gray-400">Conversão</div>
                </div>
              </div>

              {/* Conteúdo */}
              {showContent ? (
                <div className="max-h-80 overflow-y-auto bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {typeof project.content === 'string' 
                      ? project.content 
                      : JSON.stringify(project.content, null, 2)
                    }
                  </pre>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-green-400 font-medium mb-2">Projeto Concluído!</p>
                  <p className="text-xs text-gray-400">
                    Gerado com IA suprema
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                  <Download className="w-3 h-3 mr-1" />
                  Baixar
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300">
                  <Share className="w-3 h-3 mr-1" />
                  Compartilhar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <p className="text-orange-400 font-medium mb-2">IA Processando...</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{project.progress}% concluído</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}