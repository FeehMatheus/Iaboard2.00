import { useState, useEffect, useRef } from 'react';
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
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AIProject {
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
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  avatar?: string;
}

export default function AIPlatform() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    plan: 'Professional',
    credits: 2847,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  });

  const [projects, setProjects] = useState<AIProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<AIProject | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectType, setNewProjectType] = useState('');
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('canvas');

  const projectTypes = [
    { 
      id: 'copy', 
      label: 'Copy de Vendas', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'bg-blue-500',
      credits: 15,
      description: 'Textos persuasivos que convertem'
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
      label: 'Funil de Vendas', 
      icon: <TrendingUp className="w-5 h-5" />, 
      color: 'bg-green-500',
      credits: 30,
      description: 'Funis completos e otimizados'
    },
    { 
      id: 'ads', 
      label: 'Anúncios', 
      icon: <Target className="w-5 h-5" />, 
      color: 'bg-red-500',
      credits: 20,
      description: 'Campanhas para Meta e Google Ads'
    },
    { 
      id: 'email', 
      label: 'E-mail Marketing', 
      icon: <Mail className="w-5 h-5" />, 
      color: 'bg-orange-500',
      credits: 18,
      description: 'Sequências de e-mail que engajam'
    },
    { 
      id: 'landing', 
      label: 'Landing Page', 
      icon: <Layout className="w-5 h-5" />, 
      color: 'bg-cyan-500',
      credits: 22,
      description: 'Páginas de alta conversão'
    },
    { 
      id: 'analysis', 
      label: 'Análise de Mercado', 
      icon: <BarChart3 className="w-5 h-5" />, 
      color: 'bg-indigo-500',
      credits: 12,
      description: 'Insights profundos do mercado'
    },
    { 
      id: 'strategy', 
      label: 'Estratégia', 
      icon: <Brain className="w-5 h-5" />, 
      color: 'bg-pink-500',
      credits: 35,
      description: 'Estratégias completas de marketing'
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      setLocation('/login');
      return;
    }

    // Load sample projects
    const sampleProjects: AIProject[] = [
      {
        id: '1',
        type: 'copy',
        title: 'Copy para Curso de Marketing Digital',
        status: 'completed',
        progress: 100,
        position: { x: 100, y: 100 },
        size: { width: 320, height: 240 },
        isExpanded: false,
        createdAt: new Date().toISOString(),
        content: {
          headline: 'Transforme-se no Expert em Marketing Digital que Todas as Empresas Querem Contratar',
          subheadline: 'Descubra os segredos que apenas 3% dos profissionais conhecem e multiplique sua renda em até 5x nos próximos 90 dias',
          body: 'Se você está cansado de...'
        }
      },
      {
        id: '2',
        type: 'vsl',
        title: 'VSL para Infoproduto',
        status: 'processing',
        progress: 67,
        position: { x: 450, y: 150 },
        size: { width: 320, height: 240 },
        isExpanded: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        type: 'funnel',
        title: 'Funil Consultoria Business',
        status: 'completed',
        progress: 100,
        position: { x: 200, y: 400 },
        size: { width: 320, height: 240 },
        isExpanded: false,
        createdAt: new Date().toISOString()
      }
    ];
    
    setProjects(sampleProjects);
  }, [setLocation]);

  const handleCreateProject = async () => {
    if (!newProjectType || !newProjectPrompt.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o tipo e descreva o projeto",
        variant: "destructive"
      });
      return;
    }

    const selectedType = projectTypes.find(t => t.id === newProjectType);
    if (!selectedType) return;

    if (user.credits < selectedType.credits) {
      toast({
        title: "Créditos insuficientes",
        description: `Este projeto requer ${selectedType.credits} créditos`,
        variant: "destructive"
      });
      return;
    }

    const newProject: AIProject = {
      id: Date.now().toString(),
      type: newProjectType as any,
      title: newProjectPrompt.substring(0, 50) + (newProjectPrompt.length > 50 ? '...' : ''),
      status: 'processing',
      progress: 0,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      size: { width: 320, height: 240 },
      isExpanded: false,
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, newProject]);
    setUser(prev => ({ ...prev, credits: prev.credits - selectedType.credits }));
    setIsCreatingProject(false);
    setNewProjectType('');
    setNewProjectPrompt('');

    toast({
      title: "Projeto criado!",
      description: "A IA está processando seu projeto..."
    });

    // Simulate AI processing
    const progressInterval = setInterval(() => {
      setProjects(prev => prev.map(p => {
        if (p.id === newProject.id && p.status === 'processing') {
          const newProgress = Math.min(p.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return { ...p, progress: 100, status: 'completed' };
          }
          return { ...p, progress: newProgress };
        }
        return p;
      }));
    }, 1000);
  };

  const handleProjectClick = (project: AIProject) => {
    setSelectedProject(project);
  };

  const handleProjectResize = (projectId: string, newSize: { width: number; height: number }) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, size: newSize } : p
    ));
  };

  const handleProjectMove = (projectId: string, newPosition: { x: number; y: number }) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, position: newPosition } : p
    ));
  };

  const toggleProjectExpand = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { 
        ...p, 
        isExpanded: !p.isExpanded,
        size: p.isExpanded 
          ? { width: 320, height: 240 }
          : { width: 600, height: 400 }
      } : p
    ));
  };

  const getTypeConfig = (type: string) => {
    return projectTypes.find(t => t.id === type) || projectTypes[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-orange-500 animate-pulse';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter || project.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">AI Marketing Pro</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar projetos..."
                className="bg-gray-800 border-gray-700 pl-10 w-64"
              />
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="copy">Copy</SelectItem>
                <SelectItem value="vsl">VSL</SelectItem>
                <SelectItem value="funnel">Funil</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'canvas' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('canvas')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{user.credits.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">créditos</span>
          </div>

          <Button
            onClick={() => setIsCreatingProject(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>

          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-blue-400 text-xs">{user.plan}</div>
            </div>
            <Button variant="ghost" size="sm">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'canvas' ? (
          /* Infinite Canvas View */
          <div 
            ref={canvasRef}
            className="w-full h-full bg-gray-950 relative overflow-auto"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          >
            {filteredProjects.map(project => {
              const typeConfig = getTypeConfig(project.type);
              return (
                <Card
                  key={project.id}
                  className="absolute bg-gray-900/90 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all cursor-move group"
                  style={{
                    left: project.position.x,
                    top: project.position.y,
                    width: project.size.width,
                    height: project.size.height
                  }}
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 ${typeConfig.color} rounded-lg flex items-center justify-center`}>
                          {typeConfig.icon}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{project.title}</CardTitle>
                          <p className="text-xs text-gray-400">{typeConfig.label}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProjectExpand(project.id);
                          }}
                        >
                          {project.isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(project.status)} text-white text-xs`}
                      >
                        {project.status === 'completed' ? 'Concluído' :
                         project.status === 'processing' ? 'Processando' :
                         project.status === 'failed' ? 'Falhou' : 'Rascunho'}
                      </Badge>
                      
                      {project.status === 'processing' && (
                        <span className="text-xs text-gray-400">{Math.round(project.progress)}%</span>
                      )}
                    </div>

                    {project.status === 'processing' && (
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    )}

                    {project.isExpanded && project.content && (
                      <div className="space-y-3 text-xs">
                        {project.content.headline && (
                          <div>
                            <h4 className="font-medium text-blue-400 mb-1">Headline:</h4>
                            <p className="text-gray-300">{project.content.headline}</p>
                          </div>
                        )}
                        {project.content.subheadline && (
                          <div>
                            <h4 className="font-medium text-blue-400 mb-1">Subheadline:</h4>
                            <p className="text-gray-300">{project.content.subheadline}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      {project.status === 'completed' && (
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="p-6 overflow-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map(project => {
                const typeConfig = getTypeConfig(project.type);
                return (
                  <Card
                    key={project.id}
                    className="bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 ${typeConfig.color} rounded-lg flex items-center justify-center`}>
                            {typeConfig.icon}
                          </div>
                          <div>
                            <CardTitle className="text-sm">{project.title}</CardTitle>
                            <p className="text-xs text-gray-400">{typeConfig.label}</p>
                          </div>
                        </div>
                        
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(project.status)} text-white text-xs`}
                        >
                          {project.status === 'completed' ? 'Concluído' :
                           project.status === 'processing' ? 'Processando' :
                           project.status === 'failed' ? 'Falhou' : 'Rascunho'}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {project.status === 'processing' && (
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        {project.status === 'completed' && (
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isCreatingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  <span>Criar Novo Projeto</span>
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
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-3 block">
                  Tipo de Projeto
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map(type => (
                    <div
                      key={type.id}
                      onClick={() => setNewProjectType(type.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        newProjectType === type.id
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

              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                  Descreva seu projeto
                </Label>
                <Textarea
                  value={newProjectPrompt}
                  onChange={(e) => setNewProjectPrompt(e.target.value)}
                  placeholder="Ex: Preciso de uma copy para um curso de marketing digital voltado para iniciantes que trabalham em casa..."
                  className="bg-gray-800 border-gray-700 min-h-[120px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {newProjectType && (
                    <>
                      Custo: <span className="text-orange-500 font-medium">
                        {projectTypes.find(t => t.id === newProjectType)?.credits} créditos
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
                    disabled={!newProjectType || !newProjectPrompt.trim()}
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
          <Card className="bg-gray-900 border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getTypeConfig(selectedProject.type).color} rounded-lg flex items-center justify-center`}>
                    {getTypeConfig(selectedProject.type).icon}
                  </div>
                  <div>
                    <CardTitle>{selectedProject.title}</CardTitle>
                    <p className="text-gray-400">{getTypeConfig(selectedProject.type).label}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProject.status === 'completed' && selectedProject.content ? (
                <div className="space-y-6">
                  {selectedProject.content.headline && (
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Headline Principal</h4>
                      <p className="text-lg font-medium bg-gray-800 p-4 rounded-lg">
                        {selectedProject.content.headline}
                      </p>
                    </div>
                  )}
                  
                  {selectedProject.content.subheadline && (
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Subheadline</h4>
                      <p className="bg-gray-800 p-4 rounded-lg">
                        {selectedProject.content.subheadline}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerar
                    </Button>
                  </div>
                </div>
              ) : selectedProject.status === 'processing' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">IA Processando...</h3>
                  <p className="text-gray-400 mb-4">Criando conteúdo incrível para você</p>
                  <div className="w-full bg-gray-700 rounded-full h-3 max-w-md mx-auto">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{Math.round(selectedProject.progress)}% concluído</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Erro no Processamento</h3>
                  <p className="text-gray-400 mb-4">Algo deu errado durante o processamento</p>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
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