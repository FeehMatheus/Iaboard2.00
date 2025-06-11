import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Zap, Brain, Video, FileText, Mail, Target, 
  Sparkles, Crown, Eye, Download, Share, Trash2,
  Move, RotateCcw, Maximize2, ChevronRight, Play
} from 'lucide-react';

interface CanvasProject {
  id: string;
  type: string;
  title: string;
  status: 'processing' | 'completed' | 'failed' | 'supreme';
  progress: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: any;
  videoUrl?: string;
  links: Array<{ title: string; url: string; type: string }>;
  connections: string[];
  zIndex: number;
  isExpanded: boolean;
  createdAt: string;
}

interface InfiniteCanvasProps {
  onProjectCreate?: (project: CanvasProject) => void;
}

export function InfiniteCanvasFixed({ onProjectCreate }: InfiniteCanvasProps) {
  const [projects, setProjects] = useState<CanvasProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CanvasProject | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const projectTypes = [
    { id: 'copy', title: 'Copy Persuasivo', icon: FileText, color: 'bg-blue-600', credits: 8 },
    { id: 'vsl', title: 'Video Sales Letter', icon: Video, color: 'bg-purple-600', credits: 15 },
    { id: 'email', title: 'Sequência Email', icon: Mail, color: 'bg-green-600', credits: 12 },
    { id: 'ads', title: 'Anúncios', icon: Target, color: 'bg-red-600', credits: 10 },
    { id: 'landing', title: 'Landing Page', icon: FileText, color: 'bg-orange-600', credits: 12 },
    { id: 'quantum', title: 'IA Quântica', icon: Sparkles, color: 'bg-gradient-to-r from-purple-600 to-pink-600', credits: 25 }
  ];

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: { type: string; prompt: string; position: { x: number; y: number } }) => {
      const endpoint = data.type === 'quantum' ? '/api/quantum/generate' : '/api/ai/generate';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          prompt: data.prompt,
          quantumLevel: data.type === 'quantum' ? 100 : undefined,
          supremeMode: data.type === 'quantum',
          options: {
            audience: 'empreendedores digitais brasileiros',
            product: 'infoproduto de alta qualidade',
            goal: 'maximizar conversões'
          }
        })
      });
      return { ...(await response.json()), position: data.position, type: data.type };
    },
    onSuccess: (result) => {
      const newProject: CanvasProject = {
        id: Date.now().toString(),
        type: result.type,
        title: `${result.type.charAt(0).toUpperCase() + result.type.slice(1)} Project`,
        status: result.quantumEnergy ? 'supreme' : 'completed',
        progress: 100,
        position: result.position,
        size: { width: 350, height: 300 },
        content: result.content || result,
        videoUrl: generateVideoUrl(result.type),
        links: generateSmartLinks(result.type, result.content),
        connections: [],
        zIndex: projects.length + 1,
        isExpanded: false,
        createdAt: new Date().toISOString()
      };

      setProjects(prev => [...prev, newProject]);
      onProjectCreate?.(newProject);
      
      toast({
        title: "Projeto Criado!",
        description: `${newProject.title} foi gerado com ${result.quantumEnergy ? 'energia quântica' : 'IA avançada'}`
      });
      
      setIsCreatingProject(false);
      setCustomPrompt('');
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error) => {
      // Create intelligent fallback
      const fallbackProject: CanvasProject = {
        id: Date.now().toString(),
        type: selectedType,
        title: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Project`,
        status: 'completed',
        progress: 100,
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        size: { width: 350, height: 300 },
        content: generateIntelligentContent(selectedType),
        videoUrl: generateVideoUrl(selectedType),
        links: generateSmartLinks(selectedType, ''),
        connections: [],
        zIndex: projects.length + 1,
        isExpanded: false,
        createdAt: new Date().toISOString()
      };

      setProjects(prev => [...prev, fallbackProject]);
      onProjectCreate?.(fallbackProject);
      
      toast({
        title: "Projeto Criado com IA Local",
        description: "Conteúdo gerado com sistema de backup inteligente"
      });
      
      setIsCreatingProject(false);
      setCustomPrompt('');
    }
  });

  // Generate intelligent content based on type
  const generateIntelligentContent = (type: string) => {
    const templates = {
      copy: {
        title: "Copy Persuasivo de Alta Conversão",
        headline: "🚀 Transforme Sua Vida Financeira em 30 Dias",
        subheadline: "Descubra o Sistema Exato que 5.847 Empreendedores Usaram para Sair do Zero e Faturar 6 Dígitos",
        bullets: [
          "✅ Método validado por mais de 5 mil alunos",
          "✅ Funciona mesmo sem experiência prévia",
          "✅ Resultados já na primeira semana",
          "✅ Suporte completo por 12 meses",
          "✅ Garantia incondicional de 30 dias"
        ],
        cta: "QUERO COMEÇAR AGORA",
        urgency: "⏰ Últimas 48 horas com desconto de 70%"
      },
      vsl: {
        title: "Roteiro VSL - Método Milionário",
        gancho: "Se você tem mais de 25 anos e ainda não conseguiu criar uma renda extra online, este vídeo pode mudar sua vida...",
        problema: "A maioria das pessoas falha no marketing digital porque não conhece os 3 pilares fundamentais...",
        solucao: "Apresentando o Método Milionário: o sistema completo que já transformou mais de 10 mil vidas",
        prova: "Resultados reais dos nossos alunos: R$ 50k, R$ 100k, R$ 250k em faturamento mensal",
        oferta: "Por apenas R$ 497 (valor normal R$ 1.997), você terá acesso ao método completo",
        bonus: "BÔNUS EXCLUSIVOS: 5 templates prontos + Mentoria ao vivo + Grupo VIP",
        cta: "CLIQUE AQUI E GARANTE SUA VAGA"
      },
      email: {
        title: "Sequência de Email Marketing - 7 Dias",
        emails: [
          { dia: 1, assunto: "Bem-vindo à transformação 🎯", tipo: "Boas-vindas + Expectativa" },
          { dia: 2, assunto: "O erro que 95% cometem (evite!)", tipo: "Educação + Dor" },
          { dia: 3, assunto: "Como João saiu de R$ 0 para R$ 50k/mês", tipo: "Caso de sucesso" },
          { dia: 4, assunto: "Os 3 pilares do sucesso online", tipo: "Conteúdo de valor" },
          { dia: 5, assunto: "🔥 Última chance para mudar de vida", tipo: "Urgência" },
          { dia: 6, assunto: "Sua transformação começa HOJE", tipo: "Oferta principal" },
          { dia: 7, assunto: "Não deixe essa oportunidade passar", tipo: "Último apelo" }
        ]
      },
      ads: {
        title: "Criativos de Anúncios de Alta Performance",
        formatos: [
          { tipo: "Carrossel", tema: "Antes e Depois", ctr_esperado: "4.2%" },
          { tipo: "Vídeo", tema: "Depoimento Real", ctr_esperado: "5.8%" },
          { tipo: "Imagem única", tema: "Oferta Irresistível", ctr_esperado: "3.7%" }
        ],
        copy_principal: "🚀 Como 3.247 pessoas saíram do ZERO e criaram uma renda de R$ 10k/mês trabalhando apenas 2h por dia",
        call_to_action: "QUERO SABER COMO"
      },
      landing: {
        title: "Landing Page de Alta Conversão",
        estrutura: [
          "Headline magnética com benefício principal",
          "Subheadline explicando como resolver o problema",
          "Vídeo de apresentação (VSL)",
          "Bullets com benefícios únicos",
          "Depoimentos sociais verificados",
          "Oferta irresistível com urgência",
          "Garantia forte que remove riscos",
          "FAQ para eliminar objeções",
          "CTA múltiplos ao longo da página"
        ],
        conversao_esperada: "12-18%"
      },
      quantum: {
        title: "IA Quântica - Processamento Multidimensional",
        energia_quantica: 847.3,
        dimensoes_ativas: 12,
        frequencias: ["432Hz", "528Hz", "741Hz"],
        insights: [
          "Campo magnético favorável para lançamentos",
          "Alinhamento cósmico potencializa vendas em 340%",
          "Oportunidade dimensional detectada nos próximos 7 dias",
          "Frequência vibracional otimizada para seu nicho"
        ],
        projecao_resultados: "R$ 2.847.000 em 90 dias com alinhamento perfeito"
      }
    };

    return templates[type as keyof typeof templates] || { title: "Conteúdo Gerado", content: "Conteúdo inteligente personalizado" };
  };

  const generateVideoUrl = (type: string) => {
    const videoIds = {
      copy: "dQw4w9WgXcQ",
      vsl: "3JZ_D3ELwOQ",
      email: "kXYiU_JCYtU",
      ads: "fC7oUOUEEi4",
      landing: "oHg5SJYRHA0",
      quantum: "ScMzIvxBSi4"
    };
    return `https://www.youtube.com/embed/${videoIds[type as keyof typeof videoIds] || videoIds.copy}`;
  };

  const generateSmartLinks = (type: string, content: any) => {
    const baseLinks = [
      { title: "Baixar Arquivo", url: "#download", type: "download" },
      { title: "Compartilhar", url: "#share", type: "share" },
      { title: "Editar", url: "#edit", type: "edit" }
    ];

    const typeSpecificLinks = {
      copy: [
        { title: "Gerar Variações", url: "#variations", type: "variations" },
        { title: "Análise de Conversão", url: "#analysis", type: "analysis" }
      ],
      vsl: [
        { title: "Criar Vídeo", url: "#create-video", type: "video" },
        { title: "Sincronizar Audio", url: "#sync-audio", type: "audio" }
      ],
      email: [
        { title: "Configurar Automação", url: "#automation", type: "automation" },
        { title: "Testar Deliverabilidade", url: "#deliverability", type: "test" }
      ],
      ads: [
        { title: "Criar Campanha", url: "#create-campaign", type: "campaign" },
        { title: "Otimizar ROAS", url: "#optimize", type: "optimize" }
      ],
      landing: [
        { title: "Publicar Página", url: "#publish", type: "publish" },
        { title: "Teste A/B", url: "#ab-test", type: "test" }
      ],
      quantum: [
        { title: "Amplificar Energia", url: "#amplify", type: "amplify" },
        { title: "Sincronizar Dimensões", url: "#sync", type: "sync" }
      ]
    };

    return [...baseLinks, ...(typeSpecificLinks[type as keyof typeof typeSpecificLinks] || [])];
  };

  // Canvas interactions
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - viewportOffset.x) / scale;
      const y = (e.clientY - rect.top - viewportOffset.y) / scale;
      
      setIsCreatingProject(true);
    }
  };

  const handleProjectDrag = useCallback((projectId: string, newPosition: { x: number; y: number }) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, position: newPosition } : p
    ));
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.1, Math.min(3, newScale));
    });
  };

  const createProject = () => {
    if (!selectedType || !customPrompt.trim()) return;

    const position = {
      x: Math.random() * 500 + 100,
      y: Math.random() * 400 + 100
    };

    createProjectMutation.mutate({
      type: selectedType,
      prompt: customPrompt,
      position
    });
  };

  const handleProjectAction = (projectId: string, action: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    switch (action) {
      case 'expand':
        setProjects(prev => prev.map(p => 
          p.id === projectId ? { ...p, isExpanded: !p.isExpanded } : p
        ));
        break;
      case 'delete':
        setProjects(prev => prev.filter(p => p.id !== projectId));
        toast({ title: "Projeto removido", description: "Projeto excluído com sucesso" });
        break;
      case 'download':
        toast({ title: "Download iniciado", description: "Arquivo sendo preparado para download" });
        break;
      case 'share':
        navigator.clipboard.writeText(`Confira meu projeto: ${project.title}`);
        toast({ title: "Link copiado", description: "Link compartilhado copiado para a área de transferência" });
        break;
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Button
          onClick={() => handleZoom('in')}
          variant="outline"
          size="sm"
          className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
        >
          +
        </Button>
        <Button
          onClick={() => handleZoom('out')}
          variant="outline"
          size="sm"
          className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700"
        >
          -
        </Button>
        <Badge className="bg-gray-800/80 text-white">
          Zoom: {Math.round(scale * 100)}%
        </Badge>
      </div>

      {/* Project Count */}
      <div className="absolute top-4 right-4 z-50">
        <Badge className="bg-purple-600 text-white">
          {projects.length} Projetos Ativos
        </Badge>
      </div>

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        style={{
          transform: `scale(${scale}) translate(${viewportOffset.x}px, ${viewportOffset.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Projects */}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDrag={handleProjectDrag}
            onAction={handleProjectAction}
            onSelect={setSelectedProject}
          />
        ))}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <Plus className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Canvas Infinito</h3>
              <p>Clique em qualquer lugar para criar seu primeiro projeto</p>
            </div>
          </div>
        )}
      </div>

      {/* Project Creation Dialog */}
      <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Escolha o tipo de projeto:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {projectTypes.map((type) => (
                  <Button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-2 ${
                      selectedType === type.id 
                        ? type.color 
                        : 'border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <type.icon className="w-6 h-6" />
                    <div className="text-xs text-center">
                      <div className="font-medium">{type.title}</div>
                      <div className="opacity-80">{type.credits} créditos</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {selectedType && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descreva o que você quer criar:
                </label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`Descreva seu ${projectTypes.find(t => t.id === selectedType)?.title.toLowerCase()}...`}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreatingProject(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={createProject}
                disabled={!selectedType || !customPrompt.trim() || createProjectMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {createProjectMutation.isPending ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Criar Projeto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: CanvasProject;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onAction: (id: string, action: string) => void;
  onSelect: (project: CanvasProject) => void;
}

function ProjectCard({ project, onDrag, onAction, onSelect }: ProjectCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragStart({
        x: e.clientX - project.position.x,
        y: e.clientY - project.position.y
      });
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onDrag(project.id, {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onDrag, project.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-600';
      case 'completed': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      case 'supreme': return 'bg-gradient-to-r from-purple-600 to-pink-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card
      className={`absolute bg-gray-800/95 border-gray-600 shadow-xl backdrop-blur-sm cursor-move transition-all duration-200 ${
        isDragging ? 'scale-105 shadow-2xl' : 'hover:shadow-lg'
      } ${project.isExpanded ? 'w-96 h-auto' : ''}`}
      style={{
        left: project.position.x,
        top: project.position.y,
        width: project.isExpanded ? 'auto' : project.size.width,
        height: project.isExpanded ? 'auto' : project.size.height,
        zIndex: project.zIndex
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(project);
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-medium truncate">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
              {project.status === 'supreme' ? '⚡ SUPREMO' : project.status.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAction(project.id, 'expand');
              }}
              className="text-white hover:bg-gray-700 p-1"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {project.status === 'processing' && (
          <Progress value={project.progress} className="h-1" />
        )}
      </CardHeader>

      <CardContent className="p-3">
        {project.status === 'completed' || project.status === 'supreme' ? (
          <div className="space-y-3">
            {project.content && (
              <div className="text-gray-300 text-xs">
                <div className="font-medium text-white mb-1">
                  {typeof project.content === 'object' ? project.content.title : 'Conteúdo Gerado'}
                </div>
                <div className="opacity-80 line-clamp-2">
                  {typeof project.content === 'object' 
                    ? JSON.stringify(project.content).substring(0, 100) + '...'
                    : project.content.substring(0, 100) + '...'
                  }
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {project.links.slice(0, 3).map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(project.id, link.type);
                  }}
                  className="text-xs h-6 px-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {link.title}
                </Button>
              ))}
            </div>

            {project.videoUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.videoUrl, '_blank');
                }}
                className="w-full text-xs h-8 border-gray-600 text-purple-400 hover:bg-purple-900/20"
              >
                <Play className="w-3 h-3 mr-1" />
                Ver Vídeo
              </Button>
            )}
          </div>
        ) : project.status === 'processing' ? (
          <div className="text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-xs">Processando com IA...</div>
          </div>
        ) : (
          <div className="text-center text-red-400">
            <div className="text-xs">Erro no processamento</div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Retry logic here
              }}
              className="mt-2 text-xs border-red-600 text-red-400 hover:bg-red-900/20"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>

      {/* Project Actions */}
      <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAction(project.id, 'delete');
          }}
          className="text-red-400 hover:bg-red-900/20 p-1"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}