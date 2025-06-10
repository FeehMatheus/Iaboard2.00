import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  FileText, 
  Video, 
  MessageSquare, 
  DollarSign,
  Rocket,
  BarChart3,
  User,
  Settings,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Project {
  id: string;
  name: string;
  type: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  results?: any;
}

export default function FurionAI() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [credits, setCredits] = useState(2847);
  const [user] = useState({
    name: 'Usuário Premium',
    plan: 'Premium',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  });

  const projectTypes = [
    { value: 'copy', label: '📝 Copy de Vendas', credits: 15 },
    { value: 'vsl', label: '🎬 VSL (Video Sales Letter)', credits: 25 },
    { value: 'funil', label: '🔄 Funil de Vendas Completo', credits: 30 },
    { value: 'anuncio', label: '📢 Anúncios para Meta Ads', credits: 20 },
    { value: 'email', label: '📧 Sequência de E-mails', credits: 18 },
    { value: 'landing', label: '🚀 Landing Page', credits: 22 },
    { value: 'produto', label: '💡 Criação de Produto Digital', credits: 35 },
    { value: 'estrategia', label: '🎯 Estratégia de Marketing', credits: 28 }
  ];

  useEffect(() => {
    // Simular projetos existentes
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Copy para Curso de Marketing Digital',
        type: 'copy',
        status: 'completed',
        progress: 100,
        createdAt: '2025-01-10T10:00:00Z',
        results: {
          headline: 'Transforme-se no Expert em Marketing Digital que Todas as Empresas Querem Contratar',
          copy: 'Descubra os segredos que apenas 3% dos profissionais conhecem...'
        }
      },
      {
        id: '2', 
        name: 'VSL para Infoproduto de Vendas',
        type: 'vsl',
        status: 'processing',
        progress: 67,
        createdAt: '2025-01-10T14:30:00Z'
      },
      {
        id: '3',
        name: 'Funil Completo - Consultoria Business',
        type: 'funil',
        status: 'completed',
        progress: 100,
        createdAt: '2025-01-09T16:45:00Z'
      }
    ];
    setProjects(mockProjects);
  }, []);

  const handleCreateProject = async () => {
    if (!prompt.trim() || !selectedType) return;

    const selectedTypeData = projectTypes.find(t => t.value === selectedType);
    if (!selectedTypeData) return;

    if (credits < selectedTypeData.credits) {
      alert('Créditos insuficientes para este tipo de projeto');
      return;
    }

    setIsProcessing(true);

    const newProject: Project = {
      id: Date.now().toString(),
      name: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
      type: selectedType,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProject(newProject);
    setCredits(prev => prev - selectedTypeData.credits);

    try {
      const response = await fetch('/api/furion/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: selectedType,
          prompt,
          titulo: newProject.name
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Simular progresso
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            setProjects(prev => prev.map(p => 
              p.id === newProject.id 
                ? { ...p, status: 'completed', progress: 100, results: result.resultado }
                : p
            ));
          } else {
            setProjects(prev => prev.map(p => 
              p.id === newProject.id 
                ? { ...p, progress: Math.floor(progress) }
                : p
            ));
          }
        }, 1000);
      }
    } catch (error) {
      setProjects(prev => prev.map(p => 
        p.id === newProject.id 
          ? { ...p, status: 'failed', progress: 0 }
          : p
      ));
    }

    setIsProcessing(false);
    setPrompt('');
    setSelectedType('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-orange-500 animate-spin" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      copy: FileText,
      vsl: Video,
      funil: TrendingUp,
      anuncio: Target,
      email: MessageSquare,
      landing: Rocket,
      produto: DollarSign,
      estrategia: BarChart3
    };
    const Icon = icons[type as keyof typeof icons] || Brain;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">FURION.AI</h1>
                    <p className="text-xs text-gray-400">Inteligência Artificial de Marketing</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="font-bold">{credits.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">créditos</span>
              </div>

              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-orange-500 text-xs">{user.plan}</div>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Criação de Projeto */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-orange-500" />
                  <span>Novo Projeto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Tipo de Projeto
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {projectTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{type.label}</span>
                            <Badge variant="secondary" className="ml-2">
                              {type.credits} créditos
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Descreva seu projeto
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Preciso de uma copy para um curso de marketing digital voltado para iniciantes..."
                    className="bg-gray-800 border-gray-700 min-h-[120px]"
                  />
                </div>

                <Button 
                  onClick={handleCreateProject}
                  disabled={!prompt.trim() || !selectedType || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Criar com FURION
                    </>
                  )}
                </Button>

                {selectedType && (
                  <div className="text-xs text-gray-400 mt-2">
                    Este projeto consumirá {projectTypes.find(t => t.value === selectedType)?.credits} créditos
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Projetos Criados</span>
                    <span className="font-bold">{projects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Concluídos</span>
                    <span className="font-bold text-green-500">
                      {projects.filter(p => p.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Em Andamento</span>
                    <span className="font-bold text-orange-500">
                      {projects.filter(p => p.status === 'processing').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Créditos Restantes</span>
                    <span className="font-bold text-orange-500">{credits.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Lista de Projetos */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Meus Projetos</h2>
              <Badge variant="secondary">
                {projects.length} projeto{projects.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="py-12 text-center">
                    <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum projeto ainda</h3>
                    <p className="text-gray-400 mb-4">
                      Crie seu primeiro projeto com FURION.AI e veja a magia acontecer!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                projects.map(project => (
                  <Card 
                    key={project.id} 
                    className="bg-gray-900 border-gray-800 hover:border-orange-500/50 transition-colors cursor-pointer"
                    onClick={() => setActiveProject(project)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            {getTypeIcon(project.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{project.name}</h3>
                              {getStatusIcon(project.status)}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>
                                {projectTypes.find(t => t.value === project.type)?.label || project.type}
                              </span>
                              <span>•</span>
                              <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>

                            {project.status === 'processing' && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-400">Progresso</span>
                                  <span className="text-orange-500">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 'secondary'}
                          className={
                            project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            project.status === 'processing' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }
                        >
                          {project.status === 'completed' ? 'Concluído' :
                           project.status === 'processing' ? 'Processando' : 'Falhou'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Project Details Modal/Panel */}
        {activeProject && activeProject.status === 'completed' && activeProject.results && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-900 border-gray-800 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getTypeIcon(activeProject.type)}
                    <span>{activeProject.name}</span>
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveProject(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeProject.results.headline && (
                    <div>
                      <h4 className="font-semibold text-orange-500 mb-2">Headline Principal</h4>
                      <p className="text-lg font-medium">{activeProject.results.headline}</p>
                    </div>
                  )}
                  
                  {activeProject.results.copy && (
                    <div>
                      <h4 className="font-semibold text-orange-500 mb-2">Copy Completa</h4>
                      <div className="bg-gray-800 rounded-lg p-4 whitespace-pre-wrap">
                        {activeProject.results.copy}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      Exportar
                    </Button>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600">
                      Usar Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}