import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Target, 
  Play, 
  Download, 
  Settings, 
  BarChart3, 
  FileText, 
  Clock,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

interface FurionTask {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  timeRemaining?: number;
  result?: any;
}

interface FurionVisualInterfaceProps {
  onNodeAdd?: (nodeData: any) => void;
  position?: { x: number; y: number };
}

export function FurionVisualInterface({ onNodeAdd, position }: FurionVisualInterfaceProps) {
  const [activeTab, setActiveTab] = useState('create');
  const [productIdea, setProductIdea] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [timeframe, setTimeframe] = useState(30);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTask, setCurrentTask] = useState<FurionTask | null>(null);
  const [completedTasks, setCompletedTasks] = useState<FurionTask[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);

  const furionTasks = [
    { title: 'Análise de Mercado', description: 'Analisando concorrência e oportunidades', duration: 3 },
    { title: 'Criação do Conceito', description: 'Desenvolvendo conceito do produto', duration: 5 },
    { title: 'Copy Persuasivo', description: 'Gerando textos de vendas', duration: 7 },
    { title: 'Funil de Vendas', description: 'Construindo arquitetura do funil', duration: 5 },
    { title: 'Landing Pages', description: 'Criando páginas de captura e vendas', duration: 6 },
    { title: 'Automação', description: 'Configurando automações', duration: 4 }
  ];

  const handleCreateProduct = useCallback(async () => {
    if (!productIdea || !targetAudience) return;

    setIsCreating(true);
    setCompletedTasks([]);
    setGeneratedFiles([]);

    for (let i = 0; i < furionTasks.length; i++) {
      const task = furionTasks[i];
      const taskId = `task-${i}`;
      
      setCurrentTask({
        id: taskId,
        title: task.title,
        description: task.description,
        progress: 0,
        status: 'running',
        timeRemaining: task.duration * 60
      });

      // Simulate task execution with real progress
      for (let progress = 0; progress <= 100; progress += 5) {
        await new Promise(resolve => setTimeout(resolve, (task.duration * 600) / 20)); // 20 steps total
        
        setCurrentTask(prev => prev ? {
          ...prev,
          progress,
          timeRemaining: prev.timeRemaining ? prev.timeRemaining - (task.duration * 60) / 20 : 0
        } : null);
      }

      // Complete task
      const completedTask: FurionTask = {
        id: taskId,
        title: task.title,
        description: task.description,
        progress: 100,
        status: 'completed',
        result: await simulateTaskResult(task.title)
      };

      setCompletedTasks(prev => [...prev, completedTask]);
      
      // Generate files for certain tasks
      if (['Copy Persuasivo', 'Landing Pages', 'Funil de Vendas'].includes(task.title)) {
        const files = generateTaskFiles(task.title, productIdea);
        setGeneratedFiles(prev => [...prev, ...files]);
      }
    }

    setCurrentTask(null);
    setIsCreating(false);

    // Add result node to canvas if callback provided
    if (onNodeAdd) {
      onNodeAdd({
        type: 'furion-result',
        position: position || { x: 300, y: 300 },
        data: {
          productIdea,
          targetAudience,
          timeframe,
          tasks: completedTasks,
          files: generatedFiles
        }
      });
    }
  }, [productIdea, targetAudience, timeframe, onNodeAdd, position, completedTasks, generatedFiles]);

  const simulateTaskResult = async (taskTitle: string) => {
    const results = {
      'Análise de Mercado': {
        marketSize: 'R$ 2.5 bilhões',
        competitors: 3,
        opportunity: 'Alto potencial em nicho inexplorado'
      },
      'Criação do Conceito': {
        productName: `${productIdea} Pro`,
        valueProposition: 'Solução completa para transformar ideias em resultados',
        pricing: { basic: 97, premium: 197, vip: 397 }
      },
      'Copy Persuasivo': {
        headline: `Transforme ${productIdea} em Resultados Reais`,
        cta: 'QUERO COMEÇAR AGORA',
        bullets: ['✅ Método comprovado', '✅ Resultados em 30 dias', '✅ Suporte completo']
      },
      'Funil de Vendas': {
        stages: ['Consciência', 'Interesse', 'Desejo', 'Ação'],
        conversionRate: '15.7%',
        leadMagnet: 'Guia Gratuito Completo'
      },
      'Landing Pages': {
        pages: ['Página de Captura', 'Página de Vendas', 'Página de Obrigado'],
        conversionOptimized: true,
        mobileResponsive: true
      },
      'Automação': {
        emailSequence: '7 emails de nutrição',
        triggers: 'Comportamentais',
        integration: 'CRM + Payment'
      }
    };

    return results[taskTitle] || { status: 'completed' };
  };

  const generateTaskFiles = (taskTitle: string, idea: string) => {
    const files = [];
    
    switch (taskTitle) {
      case 'Copy Persuasivo':
        files.push(
          { name: 'headlines.txt', type: 'text', purpose: 'Headlines persuasivos' },
          { name: 'bullets.txt', type: 'text', purpose: 'Bullets de benefícios' },
          { name: 'cta-buttons.txt', type: 'text', purpose: 'Botões de ação' }
        );
        break;
      case 'Landing Pages':
        files.push(
          { name: 'landing-page.html', type: 'html', purpose: 'Página de captura' },
          { name: 'sales-page.html', type: 'html', purpose: 'Página de vendas' },
          { name: 'styles.css', type: 'css', purpose: 'Estilos personalizados' }
        );
        break;
      case 'Funil de Vendas':
        files.push(
          { name: 'funnel-strategy.pdf', type: 'pdf', purpose: 'Estratégia do funil' },
          { name: 'automation-setup.json', type: 'json', purpose: 'Configuração de automação' }
        );
        break;
    }
    
    return files;
  };

  const downloadFile = (file: any) => {
    // Simulate file download
    console.log(`Downloading ${file.name}`);
  };

  const getTaskIcon = (title: string) => {
    const icons = {
      'Análise de Mercado': BarChart3,
      'Criação do Conceito': Brain,
      'Copy Persuasivo': FileText,
      'Funil de Vendas': Target,
      'Landing Pages': Settings,
      'Automação': Zap
    };
    return icons[title] || Sparkles;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl border">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Furion AI</h2>
            <p className="text-purple-100">Criação de produtos em 30 minutos</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Criar Produto</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Ideia do Produto</label>
                <Textarea
                  value={productIdea}
                  onChange={(e) => setProductIdea(e.target.value)}
                  placeholder="Descreva sua ideia de produto..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Público-Alvo</label>
                <Textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Quem é seu público ideal?"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tempo de Criação: {timeframe} minutos
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={timeframe}
                onChange={(e) => setTimeframe(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15min (Rápido)</span>
                <span>30min (Padrão)</span>
                <span>60min (Completo)</span>
              </div>
            </div>

            <Button
              onClick={handleCreateProduct}
              disabled={!productIdea || !targetAudience || isCreating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando Produto...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Criar Produto em {timeframe} Minutos
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 mt-6">
            {currentTask && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {React.createElement(getTaskIcon(currentTask.title), { className: "w-5 h-5 text-blue-600" })}
                      {currentTask.title}
                    </div>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.ceil(currentTask.timeRemaining / 60)}min
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{currentTask.description}</p>
                  <Progress value={currentTask.progress} className="w-full" />
                  <p className="text-xs text-gray-500 mt-2">{currentTask.progress}% completo</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {completedTasks.map((task, index) => (
                <Card key={task.id} className="border-green-200 bg-green-50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Concluído
                    </Badge>
                  </CardContent>
                </Card>
              ))}

              {furionTasks.slice(completedTasks.length + (currentTask ? 1 : 0)).map((task, index) => (
                <Card key={`pending-${index}`} className="border-gray-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {React.createElement(getTaskIcon(task.title), { className: "w-5 h-5 text-gray-400" })}
                      <div>
                        <h4 className="font-medium text-gray-600">{task.title}</h4>
                        <p className="text-sm text-gray-400">{task.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Pendente</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            {completedTasks.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTasks.map((task) => (
                    <Card key={task.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          {React.createElement(getTaskIcon(task.title), { className: "w-4 h-4" })}
                          {task.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {task.result && (
                          <div className="text-xs space-y-1">
                            {Object.entries(task.result).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span>{' '}
                                <span className="text-gray-600">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {generatedFiles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Arquivos Gerados</span>
                        <Badge variant="secondary">{generatedFiles.length} arquivos</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {generatedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-gray-500">{file.purpose}</div>
                            </div>
                            <Button
                              onClick={() => downloadFile(file)}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum produto foi criado ainda</p>
                  <p className="text-sm text-gray-400">Vá para "Criar Produto" para começar</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}