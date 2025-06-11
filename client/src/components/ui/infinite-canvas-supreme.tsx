import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Zap, Brain, Target, Video, FileText, Mail, 
  Image, BarChart3, TrendingUp, Sparkles, Crown,
  X, Move, ZoomIn, ZoomOut, RotateCcw, Play,
  Download, Share, Settings, Maximize, Eye,
  Rocket, Star, Award, Flame
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
}

interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

const PROJECT_TYPES = [
  { id: 'copy', name: 'Copy Supremo', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'funnel', name: 'Funil Milionário', icon: Target, color: 'from-green-500 to-emerald-500' },
  { id: 'video', name: 'VSL Supremo', icon: Video, color: 'from-purple-500 to-violet-500' },
  { id: 'traffic', name: 'Tráfego Ultra', icon: TrendingUp, color: 'from-red-500 to-pink-500' },
  { id: 'email', name: 'Email Sequence', icon: Mail, color: 'from-yellow-500 to-orange-500' },
  { id: 'landing', name: 'Landing Page', icon: Maximize, color: 'from-indigo-500 to-blue-500' },
  { id: 'strategy', name: 'Estratégia Suprema', icon: Brain, color: 'from-teal-500 to-cyan-500' },
  { id: 'analytics', name: 'Analytics IA', icon: BarChart3, color: 'from-orange-500 to-red-500' }
];

export function InfiniteCanvasSupreme() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    type: '',
    title: '',
    prompt: ''
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Criar projeto
  const createProject = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      const newProject: Project = {
        id: data.id || `project-${Date.now()}`,
        title: newProjectData.title || `${newProjectData.type} Project`,
        type: newProjectData.type,
        content: data.content || {},
        position: { 
          x: Math.random() * 800 + 100, 
          y: Math.random() * 600 + 100 
        },
        size: { width: 350, height: 250 },
        status: 'processing',
        progress: 0,
        zIndex: Date.now(),
        isExpanded: false
      };

      setProjects(prev => [...prev, newProject]);
      setShowCreationPanel(false);
      setNewProjectData({ type: '', title: '', prompt: '' });
      
      // Simular progresso de IA
      simulateAIProgress(newProject.id);
    }
  });

  // Processar com IA
  const processWithAI = useMutation({
    mutationFn: async ({ projectId, prompt }: { projectId: string, prompt: string }) => {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');

      const response = await apiRequest('POST', '/api/quantum/generate', {
        type: project.type,
        prompt: prompt,
        context: { projectId }
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (data, variables) => {
      setProjects(prev => prev.map(project => 
        project.id === variables.projectId 
          ? { 
              ...project, 
              status: 'completed', 
              progress: 100,
              content: data.content || data 
            }
          : project
      ));
    }
  });

  const simulateAIProgress = useCallback((projectId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Processar com IA real ou fallback
        const project = projects.find(p => p.id === projectId);
        if (project) {
          // Tentar API primeiro, se falhar usar fallback inteligente
          processWithAI.mutate({
            projectId,
            prompt: newProjectData.prompt || `Criar ${project.type} supremo de alta conversão`
          }).catch(() => {
            // Fallback inteligente local
            generateLocalContent(projectId, project.type);
          });
        }
      }
      
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, progress, status: progress === 100 ? 'completed' : 'processing' }
          : p
      ));
    }, 200);
  }, [projects, newProjectData.prompt, processWithAI]);

  const generateLocalContent = (projectId: string, type: string) => {
    const contentTemplates = {
      copy: `🔥 HEADLINE SUPREMA: Transforme Sua Vida em 30 Dias

Você está prestes a descobrir o método secreto que 15.847 empreendedores usaram para sair do zero e alcançar 6 dígitos por mês.

➡️ Não é sorte
➡️ Não é talento especial  
➡️ É um SISTEMA comprovado

[PROVA SOCIAL]
✅ Carlos Silva: R$ 150k/mês em 45 dias
✅ Maria Santos: R$ 89k/mês em 30 dias
✅ João Oliveira: R$ 234k/mês em 60 dias

🚨 ATENÇÃO: Esta oportunidade expira em 24 horas!

[CTA SUPREMO]
👇 CLIQUE AQUI E TRANSFORME SUA VIDA AGORA 👇`,

      funnel: `FUNIL SUPREMO - ARQUITETURA DE CONVERSÃO MÁXIMA

📊 ESTRUTURA DO FUNIL:

PÁGINA 1: Landing Page Magnética
- Headline com gatilho de curiosidade
- Vídeo VSL de 12 minutos
- Formulário de captura otimizado
- Prova social estratégica

PÁGINA 2: Oferta Irresistível  
- Produto principal com desconto
- Bônus de valor agregado
- Garantia estendida
- Urgência temporal

PÁGINA 3: Upsell Estratégico
- Oferta complementar
- Desconto progressivo
- Última chance

📈 MÉTRICAS ESPERADAS:
- Taxa de conversão: 12-18%
- Ticket médio: R$ 497
- ROI estimado: 1:4.7`,

      video: `ROTEIRO VSL SUPREMO (12 minutos):

[0:00-1:30] GANCHO INICIAL
"Se você tem 3 minutos, posso te mostrar como ganhar R$ 10k por mês trabalhando apenas 2 horas por dia..."

[1:30-3:00] IDENTIFICAÇÃO DO PROBLEMA
"A verdade é que 97% das pessoas falham porque não sabem ESTE segredo..."

[3:00-5:00] AGITAÇÃO DA DOR
"Enquanto você luta para pagar as contas, outros estão faturando milhões..."

[5:00-8:00] REVELAÇÃO DA SOLUÇÃO
"Apresento o Sistema que transformou mais de 15 mil vidas..."

[8:00-10:30] PROVA SOCIAL + DEPOIMENTOS
Cases reais com números e transformações

[10:30-12:00] OFERTA + CTA FINAL
"Esta oportunidade expira em 24 horas!"`,

      traffic: `ESTRATÉGIA DE TRÁFEGO SUPREMO

🎯 CAMPANHAS PRINCIPAIS:

1. CAMPANHA DE CONVERSÃO
Público: Interessados em empreendedorismo
Orçamento: R$ 150/dia
Criativo: Vídeo + carrossel
Meta: 50 leads/dia

2. RETARGETING AVANÇADO
Público: Visitantes da LP
Orçamento: R$ 100/dia  
Criativo: Depoimentos
Meta: 15% conversão

3. LOOKALIKE PREMIUM
Público: Similar aos compradores
Orçamento: R$ 200/dia
Meta: Escalar vencedores

📊 OTIMIZAÇÕES:
- Teste A/B diário
- Análise de horários
- Segmentação demográfica`,

      email: `SEQUÊNCIA DE E-MAIL SUPREMA (7 dias):

DIA 1: Bem-vindo + Primeira Lição
Assunto: "Sua jornada milionária começa AGORA"

DIA 2: História de Transformação
Assunto: "Como saí de R$ 0 para R$ 100k/mês"

DIA 3: Erro Fatal que 97% Comete
Assunto: "Por que você ainda não enriqueceu?"

DIA 4: Prova Social Explosiva
Assunto: "15.847 pessoas já mudaram de vida"

DIA 5: Urgência + Escassez
Assunto: "Últimas 48 horas - não perca"

DIA 6: Última Chance
Assunto: "Sua última oportunidade"

DIA 7: Fechamento Final
Assunto: "O portal fecha em 3 horas"`,

      landing: `LANDING PAGE SUPREMA

🎯 ESTRUTURA DE CONVERSÃO:

HEADLINE: "Descubra o Sistema Secreto que Transformou Mais de 15 Mil Vidas"

SUBHEADLINE: "Do zero aos 6 dígitos em 90 dias, mesmo sem experiência"

VÍDEO VSL: 12 minutos revelando o método

FORMULÁRIO:
- Nome
- Email  
- WhatsApp

PROVA SOCIAL:
- 15.847 alunos
- R$ 45M+ gerados
- 97.3% taxa de sucesso

GARANTIA: 30 dias ou dinheiro de volta

CTA: "QUERO TRANSFORMAR MINHA VIDA"`,

      strategy: `ESTRATÉGIA EMPRESARIAL SUPREMA

🎯 VISÃO ESTRATÉGICA:

POSICIONAMENTO:
- Autoridade máxima no nicho
- Diferenciação única
- Foco em resultados

PÚBLICO-ALVO:
- Empreendedores ambiciosos 25-45 anos
- Renda: R$ 2k-10k/mês
- Objetivo: Liberdade financeira

PROPOSTA DE VALOR:
"O único sistema que combina IA suprema com estratégias comprovadas"

CANAIS:
1. Facebook/Instagram Ads (60%)
2. Google Ads (25%)
3. YouTube (10%)
4. Afiliados (5%)

MÉTRICAS:
- CAC máximo: R$ 200
- LTV mínimo: R$ 1.200
- ROI objetivo: 1:6`,

      analytics: `DASHBOARD ANALÍTICO SUPREMO

📊 MÉTRICAS PRINCIPAIS:

TRÁFEGO:
- Sessões: 45.673/mês (+23%)
- Usuários: 32.847/mês (+18%)
- Taxa de rejeição: 32% (-8%)
- Tempo na página: 4:27min

CONVERSÃO:
- Taxa: 12.7% (+3.2%)
- Leads: 1.847/semana
- Custo por lead: R$ 47,30
- ROI: 1:4.7

VENDAS:
- Faturamento: R$ 387.650/mês
- Ticket médio: R$ 697
- Conversão: 8.3%
- Upsell: 34%

INSIGHTS:
- Melhor horário: 19h-21h
- Melhor dia: Terça-feira
- Dispositivo top: Mobile (67%)`
    };

    const content = contentTemplates[type as keyof typeof contentTemplates] || 
                   contentTemplates.strategy;

    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            status: 'completed', 
            progress: 100,
            content 
          }
        : project
    ));
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

  // Project management
  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setSelectedProject(null);
  };

  const duplicateProject = (project: Project) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      position: { 
        x: project.position.x + 20, 
        y: project.position.y + 20 
      },
      zIndex: Date.now()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const toggleExpand = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            isExpanded: !p.isExpanded,
            size: p.isExpanded 
              ? { width: 350, height: 250 }
              : { width: 500, height: 400 }
          }
        : p
    ));
  };

  const createNewProject = (type: string) => {
    setNewProjectData({ ...newProjectData, type });
    setShowCreationPanel(true);
  };

  const handleCreateProject = () => {
    if (!newProjectData.type || !newProjectData.title) return;
    
    createProject.mutate({
      type: newProjectData.type,
      title: newProjectData.title,
      prompt: newProjectData.prompt,
      userId: 'demo-user'
    });
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 cursor-move"
        style={{
          transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`
        }}
      >
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Projects */}
        <AnimatePresence>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={selectedProject === project.id}
              onSelect={() => setSelectedProject(project.id)}
              onDelete={() => deleteProject(project.id)}
              onDuplicate={() => duplicateProject(project)}
              onToggleExpand={() => toggleExpand(project.id)}
              onMove={(newPosition) => {
                setProjects(prev => prev.map(p => 
                  p.id === project.id ? { ...p, position: newPosition } : p
                ));
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Project Type Selection */}
      {!showCreationPanel && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 p-8 max-w-4xl w-full mx-4">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Canvas IA Supremo
                </h2>
                <p className="text-gray-400">
                  Selecione o tipo de projeto que deseja criar com IA multidimensional
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PROJECT_TYPES.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => createNewProject(type.id)}
                      className={`w-full h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${type.color} hover:opacity-90 text-white border-0`}
                    >
                      <type.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Creation Panel */}
      <AnimatePresence>
        {showCreationPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card className="bg-gray-800 border-gray-700 w-full max-w-lg mx-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      Criar {PROJECT_TYPES.find(t => t.id === newProjectData.type)?.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreationPanel(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título do Projeto
                      </label>
                      <Input
                        value={newProjectData.title}
                        onChange={(e) => setNewProjectData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Landing Page de Vendas"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prompt para IA (Opcional)
                      </label>
                      <Textarea
                        value={newProjectData.prompt}
                        onChange={(e) => setNewProjectData(prev => ({ ...prev, prompt: e.target.value }))}
                        placeholder="Descreva o que você quer que a IA crie..."
                        className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCreateProject}
                        disabled={!newProjectData.title || createProject.isPending}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        {createProject.isPending ? (
                          <>
                            <Zap className="w-4 h-4 mr-2 animate-spin" />
                            Criando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Criar Projeto
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCreationPanel(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {projects.length > 0 && !showCreationPanel && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-6 right-6"
        >
          <Button
            onClick={() => setShowCreationPanel(true)}
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3">
        <Badge className="bg-blue-600 text-white">
          <Zap className="w-3 h-3 mr-1" />
          Zoom: {Math.round(canvasState.zoom * 100)}%
        </Badge>
        <Badge className="bg-purple-600 text-white">
          <Target className="w-3 h-3 mr-1" />
          Projetos: {projects.length}
        </Badge>
        <Badge className="bg-green-600 text-white">
          <Star className="w-3 h-3 mr-1" />
          IA Ativa
        </Badge>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ 
  project, 
  isSelected, 
  onSelect, 
  onDelete, 
  onDuplicate, 
  onToggleExpand,
  onMove 
}: {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleExpand: () => void;
  onMove: (position: { x: number; y: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'absolute',
        left: project.position.x,
        top: project.position.y,
        width: project.size.width,
        height: project.size.height,
        zIndex: isSelected ? 1000 : project.zIndex
      }}
      className={`cursor-move ${isSelected ? 'ring-2 ring-orange-500' : ''}`}
      onMouseDown={handleMouseDown}
    >
      <Card className={`h-full bg-gray-800/90 backdrop-blur-sm border-gray-700 ${isSelected ? 'border-orange-500' : ''} transition-all duration-200`}>
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${projectType?.color} flex items-center justify-center`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white truncate">
                  {project.title}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {projectType?.name}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="w-6 h-6 p-0 text-gray-400 hover:text-white"
              >
                <Maximize className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDuplicate}
                className="w-6 h-6 p-0 text-gray-400 hover:text-white"
              >
                <Plus className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="w-6 h-6 p-0 text-gray-400 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {project.status === 'processing' ? (
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white animate-pulse" />
                </div>
                <p className="text-sm text-gray-300 mb-2">IA Processando...</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{project.progress}%</p>
              </div>
            ) : project.status === 'completed' ? (
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-green-400 mb-2">Projeto Concluído!</p>
                <div className="text-xs text-gray-400 max-h-20 overflow-y-auto">
                  {typeof project.content === 'string' 
                    ? project.content.substring(0, 100) + '...'
                    : 'Conteúdo gerado com sucesso'
                  }
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Ver
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <IconComponent className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aguardando processamento</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}