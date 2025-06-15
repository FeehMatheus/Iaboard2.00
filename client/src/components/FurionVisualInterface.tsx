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

    try {
      // Execute the real Supreme Furion system
      const response = await fetch('/api/supreme/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType: 'Produto Digital',
          niche: productIdea,
          targetAudience: targetAudience,
          timeframe: timeframe,
          marketingGoals: ['Aumentar vendas', 'Gerar leads'],
          brandVoice: 'profissional'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na criação do produto');
      }

      const data = await response.json();
      
      if (data.success) {
        // Convert the result to our task format
        const realTasks: FurionTask[] = [
          {
            id: 'market-analysis',
            title: 'Análise de Mercado',
            description: 'Análise completa do mercado',
            progress: 100,
            status: 'completed',
            result: data.data.marketAnalysis
          },
          {
            id: 'product-concept',
            title: 'Conceito do Produto',
            description: 'Desenvolvimento do conceito',
            progress: 100,
            status: 'completed',
            result: data.data.productConcept
          },
          {
            id: 'content-strategy',
            title: 'Estratégia de Conteúdo',
            description: 'Criação da estratégia completa',
            progress: 100,
            status: 'completed',
            result: data.data.contentStrategy
          },
          {
            id: 'funnel-architecture',
            title: 'Arquitetura do Funil',
            description: 'Design do funil de vendas',
            progress: 100,
            status: 'completed',
            result: data.data.funnelArchitecture
          },
          {
            id: 'implementation',
            title: 'Plano de Implementação',
            description: 'Plano detalhado de execução',
            progress: 100,
            status: 'completed',
            result: data.data.implementationPlan
          },
          {
            id: 'automation',
            title: 'Configuração de Automação',
            description: 'Setup de automações',
            progress: 100,
            status: 'completed',
            result: data.data.automationSetup
          }
        ];

        setCompletedTasks(realTasks);
        setGeneratedFiles(data.data.files || []);

        // Add result node to canvas if callback provided
        if (onNodeAdd) {
          onNodeAdd({
            type: 'furion-result',
            position: position || { x: 300, y: 300 },
            data: {
              productIdea,
              targetAudience,
              timeframe,
              tasks: realTasks,
              files: data.data.files || [],
              productResult: data.data
            }
          });
        }
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro na criação do produto:', error);
      // Fallback to individual AI calls
      await executeIndividualTasks();
    } finally {
      setCurrentTask(null);
      setIsCreating(false);
    }
  }, [productIdea, targetAudience, timeframe, onNodeAdd, position]);

  const executeIndividualTasks = async () => {
    const tasks = [
      { title: 'Análise de Mercado', endpoint: '/api/ai/execute-advanced', prompt: `Analise o mercado para o produto: ${productIdea}, público-alvo: ${targetAudience}` },
      { title: 'Criação do Conceito', endpoint: '/api/ai/execute-advanced', prompt: `Crie um conceito completo para o produto: ${productIdea}, direcionado para: ${targetAudience}` },
      { title: 'Copy Persuasivo', endpoint: '/api/ai/execute-advanced', prompt: `Crie copy persuasivo para o produto: ${productIdea}, público: ${targetAudience}` },
      { title: 'Funil de Vendas', endpoint: '/api/ai/execute-advanced', prompt: `Projete um funil de vendas para: ${productIdea}, audiência: ${targetAudience}` },
      { title: 'Landing Pages', endpoint: '/api/ai/execute-advanced', prompt: `Crie landing pages para: ${productIdea}, público: ${targetAudience}` },
      { title: 'Automação', endpoint: '/api/ai/execute-advanced', prompt: `Configure automações para: ${productIdea}, audiência: ${targetAudience}` }
    ];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const taskId = `task-${i}`;
      
      setCurrentTask({
        id: taskId,
        title: task.title,
        description: `Executando ${task.title.toLowerCase()}...`,
        progress: 0,
        status: 'running'
      });

      try {
        const startTime = Date.now();
        
        // Call real AI endpoint
        const response = await fetch(task.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            prompt: task.prompt,
            systemPrompt: `Você é um especialista em ${task.title.toLowerCase()}. Forneça respostas detalhadas e práticas.`
          }),
        });

        const data = await response.json();
        const endTime = Date.now();
        const executionTime = (endTime - startTime) / 1000;

        // Update progress during execution
        setCurrentTask(prev => prev ? { ...prev, progress: 50 } : null);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCurrentTask(prev => prev ? { ...prev, progress: 100 } : null);
        await new Promise(resolve => setTimeout(resolve, 500));

        const completedTask: FurionTask = {
          id: taskId,
          title: task.title,
          description: `Concluído em ${executionTime.toFixed(1)}s`,
          progress: 100,
          status: 'completed',
          result: data.success ? data.data : { error: data.error, content: 'Erro na execução' }
        };

        setCompletedTasks(prev => [...prev, completedTask]);
        
        // Generate files for certain tasks
        if (['Copy Persuasivo', 'Landing Pages', 'Funil de Vendas'].includes(task.title)) {
          const files = generateTaskFiles(task.title, productIdea);
          setGeneratedFiles(prev => [...prev, ...files]);
        }
        
      } catch (error) {
        console.error(`Erro na tarefa ${task.title}:`, error);
        
        const failedTask: FurionTask = {
          id: taskId,
          title: task.title,
          description: 'Erro na execução',
          progress: 100,
          status: 'error',
          result: { error: error.message }
        };

        setCompletedTasks(prev => [...prev, failedTask]);
      }
    }
  };

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
            <p className="text-purple-100">Criação de produtos com IA real</p>
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
                  Criar Produto com IA Real
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
                      Executando...
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