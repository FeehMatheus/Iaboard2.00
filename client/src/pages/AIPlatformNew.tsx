import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Brain, 
  Plus, 
  Search, 
  Settings, 
  User, 
  LogOut,
  Zap,
  FileText,
  Video,
  Target,
  Mail,
  Layout,
  TrendingUp,
  BarChart3,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  RefreshCw,
  ChevronDown,
  Filter,
  Grid,
  List,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Share2,
  ExternalLink,
  Sparkles,
  Wand2,
  MousePointer2,
  Move3D,
  ZoomIn,
  ZoomOut,
  Home,
  Folder,
  Clock,
  Star,
  Eye,
  Edit3,
  Trash2,
  Link as LinkIcon,
  Youtube,
  PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

interface CanvasProject {
  id: string;
  type: 'copy' | 'vsl' | 'funnel' | 'ads' | 'email' | 'landing' | 'analysis' | 'strategy';
  title: string;
  status: 'processing' | 'completed' | 'failed' | 'draft';
  progress: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: any;
  createdAt: string;
  isExpanded: boolean;
  videoUrl?: string;
  links: Array<{ id: string; url: string; title: string; type: 'cta' | 'reference' | 'resource' }>;
  connections: string[];
  zIndex: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  avatar?: string;
}

export default function AIPlatformNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState<'select' | 'pan' | 'connect'>('select');
  
  const [user, setUser] = useState<User>({
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
    plan: 'Professional',
    credits: 2847
  });

  const [projects, setProjects] = useState<CanvasProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<CanvasProject | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    type: '',
    prompt: '',
    targetAudience: '',
    productType: '',
    budget: '',
    platform: '',
    videoUrl: ''
  });

  const projectTypes = [
    { 
      id: 'copy', 
      label: 'Copy de Vendas', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'bg-blue-500',
      credits: 15,
      description: 'Textos persuasivos de alta conversão'
    },
    { 
      id: 'vsl', 
      label: 'Video Sales Letter', 
      icon: <Video className="w-5 h-5" />, 
      color: 'bg-purple-500',
      credits: 25,
      description: 'Roteiros completos para VSLs'
    },
    { 
      id: 'funnel', 
      label: 'Funil Completo', 
      icon: <TrendingUp className="w-5 h-5" />, 
      color: 'bg-green-500',
      credits: 35,
      description: 'Estratégia completa de funil'
    },
    { 
      id: 'ads', 
      label: 'Anúncios Pagos', 
      icon: <Target className="w-5 h-5" />, 
      color: 'bg-red-500',
      credits: 20,
      description: 'Campanhas otimizadas para conversão'
    },
    { 
      id: 'email', 
      label: 'Sequência de Emails', 
      icon: <Mail className="w-5 h-5" />, 
      color: 'bg-yellow-500',
      credits: 18,
      description: 'Automações de email marketing'
    },
    { 
      id: 'landing', 
      label: 'Landing Page', 
      icon: <Layout className="w-5 h-5" />, 
      color: 'bg-indigo-500',
      credits: 22,
      description: 'Páginas de alta conversão'
    },
    { 
      id: 'analysis', 
      label: 'Análise de Vídeo', 
      icon: <BarChart3 className="w-5 h-5" />, 
      color: 'bg-pink-500',
      credits: 12,
      description: 'Análise profunda de vídeos'
    },
    { 
      id: 'strategy', 
      label: 'Estratégia Completa', 
      icon: <Brain className="w-5 h-5" />, 
      color: 'bg-orange-500',
      credits: 40,
      description: 'Estratégias completas de marketing'
    }
  ];

  useEffect(() => {
    loadUserData();
    loadProjects();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        headers: { 'Authorization': `Bearer demo-user` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer demo-user` }
      });
      if (response.ok) {
        const data = await response.json();
        const formattedProjects = data.projects.map((p: any, index: number) => ({
          ...p,
          position: { x: 200 + (index * 400), y: 200 + (index % 3) * 350 },
          size: { width: 350, height: 280 },
          isExpanded: false,
          links: [],
          connections: [],
          zIndex: index + 1
        }));
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectData.type || !newProjectData.prompt.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o tipo e descreva o projeto",
        variant: "destructive"
      });
      return;
    }

    const selectedType = projectTypes.find(t => t.id === newProjectData.type);
    if (!selectedType) return;

    if (user.credits < selectedType.credits) {
      toast({
        title: "Créditos insuficientes",
        description: `Este projeto requer ${selectedType.credits} créditos`,
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer demo-user`
        },
        body: JSON.stringify({
          type: newProjectData.type,
          title: newProjectData.prompt.substring(0, 50) + (newProjectData.prompt.length > 50 ? '...' : ''),
          prompt: newProjectData.prompt,
          options: {
            targetAudience: newProjectData.targetAudience,
            productType: newProjectData.productType,
            budget: newProjectData.budget,
            platform: newProjectData.platform,
            videoUrl: newProjectData.videoUrl
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const newProject: CanvasProject = {
          ...data.project,
          position: { 
            x: Math.random() * 800 + 200, 
            y: Math.random() * 600 + 200 
          },
          size: { width: 350, height: 280 },
          isExpanded: false,
          videoUrl: newProjectData.videoUrl,
          links: [],
          connections: [],
          zIndex: projects.length + 1
        };

        setProjects(prev => [...prev, newProject]);
        setUser(prev => ({ ...prev, credits: prev.credits - selectedType.credits }));
        setIsCreatingProject(false);
        setNewProjectData({
          type: '',
          prompt: '',
          targetAudience: '',
          productType: '',
          budget: '',
          platform: '',
          videoUrl: ''
        });

        toast({
          title: "Projeto criado!",
          description: "A IA está processando seu projeto..."
        });

        // Poll for updates
        pollProjectStatus(data.project.id);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
    }
  };

  const pollProjectStatus = async (projectId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer demo-user` }
        });
        
        if (response.ok) {
          const projectData = await response.json();
          setProjects(prev => prev.map(p => 
            p.id === projectId 
              ? { ...p, ...projectData.project }
              : p
          ));

          if (projectData.project.status === 'completed') {
            clearInterval(pollInterval);
            toast({
              title: "Projeto concluído!",
              description: "Seu conteúdo está pronto!"
            });
          } else if (projectData.project.status === 'failed') {
            clearInterval(pollInterval);
            toast({
              title: "Falha no processamento",
              description: "Tente novamente ou contate o suporte",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error polling project:', error);
        clearInterval(pollInterval);
      }
    }, 3000);
  };

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'pan') {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y
      });
    }
  }, [selectedTool, canvasPosition]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && selectedTool === 'pan') {
      setCanvasPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  }, [isDragging, selectedTool, dragOffset]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoom = (delta: number) => {
    setCanvasZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleProjectMove = (projectId: string, newPosition: { x: number; y: number }) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, position: newPosition } : p
    ));
  };

  const handleProjectResize = (projectId: string, newSize: { width: number; height: number }) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, size: newSize } : p
    ));
  };

  const handleAddLink = (projectId: string, linkData: { url: string; title: string; type: 'cta' | 'reference' | 'resource' }) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            links: [...p.links, { id: Date.now().toString(), ...linkData }]
          } 
        : p
    ));
  };

  const handleRemoveLink = (projectId: string, linkId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, links: p.links.filter(link => link.id !== linkId) }
        : p
    ));
  };

  const getTypeConfig = (type: string) => {
    return projectTypes.find(t => t.id === type) || projectTypes[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderProject = (project: CanvasProject) => {
    const typeConfig = getTypeConfig(project.type);
    const transform = `translate(${project.position.x}px, ${project.position.y}px)`;

    return (
      <div
        key={project.id}
        className="absolute border-2 border-gray-700 rounded-xl bg-gray-900/95 backdrop-blur-sm shadow-2xl transition-all duration-200 hover:border-blue-500/50"
        style={{
          transform,
          width: project.size.width,
          height: project.size.height,
          zIndex: project.zIndex
        }}
        onClick={() => setSelectedProject(project)}
      >
        {/* Project Header */}
        <div className={`flex items-center justify-between p-4 ${typeConfig.color} rounded-t-lg`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              {typeConfig.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{project.title}</h3>
              <p className="text-white/80 text-xs">{typeConfig.label}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(project.status)} text-white border-0`}>
            {project.status === 'processing' ? `${Math.round(project.progress)}%` : project.status}
          </Badge>
        </div>

        {/* Project Content */}
        <div className="p-4 h-full">
          {project.status === 'processing' && (
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          )}

          {/* Video Preview */}
          {project.videoUrl && (
            <div className="mb-3 relative">
              <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-300 truncate flex-1">{project.videoUrl}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.videoUrl, '_blank');
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Links Section */}
          {project.links.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-400 mb-2">Links:</h4>
              <div className="space-y-1">
                {project.links.map(link => (
                  <div key={link.id} className="flex items-center justify-between bg-gray-800 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-gray-300 truncate">{link.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {link.type}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(link.url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLink(project.id, link.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Actions */}
          <div className="absolute bottom-4 right-4 flex space-x-1">
            {project.status === 'completed' && (
              <>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="w-3 h-3" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleProjectResize(project.id, 
                  project.isExpanded 
                    ? { width: 350, height: 280 }
                    : { width: 500, height: 400 }
                );
                setProjects(prev => prev.map(p => 
                  p.id === project.id ? { ...p, isExpanded: !p.isExpanded } : p
                ));
              }}
            >
              {project.isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">IA Board</h1>
                <p className="text-xs text-gray-400">Infinite Canvas AI</p>
              </div>
            </div>

            {/* Canvas Tools */}
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <Button
                variant={selectedTool === 'select' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTool('select')}
              >
                <MousePointer2 className="w-4 h-4" />
              </Button>
              <Button
                variant={selectedTool === 'pan' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTool('pan')}
              >
                <Move3D className="w-4 h-4" />
              </Button>
              <Button
                variant={selectedTool === 'connect' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTool('connect')}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleZoom(-0.1)}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-mono">{Math.round(canvasZoom * 100)}%</span>
              <Button variant="ghost" size="sm" onClick={() => handleZoom(0.1)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsCreatingProject(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>

            <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-4 py-2">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-orange-400">{user.credits} créditos</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Canvas */}
      <div 
        ref={canvasRef}
        className="fixed inset-0 pt-20 cursor-crosshair"
        style={{ 
          transform: `scale(${canvasZoom}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
          transformOrigin: '0 0'
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Projects */}
        {projects.map(project => renderProject(project))}
      </div>

      {/* Create Project Modal */}
      {isCreatingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="w-6 h-6 text-blue-500" />
                  <span>Criar Projeto com IA</span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsCreatingProject(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Type Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-3 block">
                  Tipo de Projeto
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map(type => (
                    <div
                      key={type.id}
                      onClick={() => setNewProjectData(prev => ({ ...prev, type: type.id }))}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        newProjectData.type === type.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center`}>
                          {type.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{type.label}</h3>
                          <p className="text-xs text-gray-400">{type.credits} créditos</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Prompt */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                  Descreva seu projeto
                </Label>
                <Textarea
                  value={newProjectData.prompt}
                  onChange={(e) => setNewProjectData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Ex: Preciso de uma copy para um curso de marketing digital voltado para iniciantes que trabalham em casa..."
                  className="bg-gray-800 border-gray-700 min-h-[120px]"
                />
              </div>

              {/* Advanced Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Público-alvo
                  </Label>
                  <Input
                    value={newProjectData.targetAudience}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="Ex: Empreendedores iniciantes, 25-45 anos"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Tipo de produto/serviço
                  </Label>
                  <Input
                    value={newProjectData.productType}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, productType: e.target.value }))}
                    placeholder="Ex: Curso online, consultoria, infoproduto"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {newProjectData.type === 'ads' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">
                      Plataforma
                    </Label>
                    <Select 
                      value={newProjectData.platform}
                      onValueChange={(value) => setNewProjectData(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Selecione a plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook/Instagram</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2 block">
                      Orçamento mensal
                    </Label>
                    <Select 
                      value={newProjectData.budget}
                      onValueChange={(value) => setNewProjectData(prev => ({ ...prev, budget: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Selecione o orçamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                        <SelectItem value="1000-3000">R$ 1.000 - R$ 3.000</SelectItem>
                        <SelectItem value="3000-5000">R$ 3.000 - R$ 5.000</SelectItem>
                        <SelectItem value="5000+">R$ 5.000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Video URL for Analysis */}
              {newProjectData.type === 'analysis' && (
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    URL do vídeo para análise
                  </Label>
                  <Input
                    value={newProjectData.videoUrl}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              )}

              {/* Create Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  {newProjectData.type && (
                    <>
                      Custo: <span className="text-orange-500 font-medium">
                        {projectTypes.find(t => t.id === newProjectData.type)?.credits} créditos
                      </span>
                    </>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreatingProject(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={!newProjectData.type || !newProjectData.prompt.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Criar com IA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-gray-700 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${getTypeConfig(selectedProject.type).color} rounded-lg flex items-center justify-center`}>
                    {getTypeConfig(selectedProject.type).icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedProject.title}</CardTitle>
                    <p className="text-gray-400">{getTypeConfig(selectedProject.type).label}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = prompt('URL do link:');
                      const title = prompt('Título do link:');
                      const type = prompt('Tipo (cta/reference/resource):') as any;
                      if (url && title && type) {
                        handleAddLink(selectedProject.id, { url, title, type });
                      }
                    }}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Adicionar Link
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedProject(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProject.status === 'completed' && selectedProject.content ? (
                <div className="space-y-6">
                  {/* Render content based on project type */}
                  {selectedProject.content.headline && (
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3">Headline Principal</h4>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-lg font-medium">{selectedProject.content.headline}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedProject.content.subheadline && (
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3">Subheadline</h4>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p>{selectedProject.content.subheadline}</p>
                      </div>
                    </div>
                  )}

                  {selectedProject.content.cta && (
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3">Call-to-Action</h4>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="font-medium text-orange-400">{selectedProject.content.cta}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                    <Button 
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedProject.content, null, 2))}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Conteúdo
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar PDF
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerar
                    </Button>
                  </div>
                </div>
              ) : selectedProject.status === 'processing' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">IA Processando...</h3>
                  <p className="text-gray-400 mb-6">Criando conteúdo de alta qualidade para você</p>
                  <div className="w-full bg-gray-700 rounded-full h-4 max-w-md mx-auto">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{Math.round(selectedProject.progress)}% concluído</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Falha no Processamento</h3>
                  <p className="text-gray-400 mb-4">Ocorreu um erro durante a geração do conteúdo</p>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    onClick={() => {
                      // Retry logic
                      toast({
                        title: "Tentando novamente...",
                        description: "Reprocessando o projeto"
                      });
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}