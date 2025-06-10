import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Play, 
  Pause, 
  Download, 
  Zap, 
  Brain, 
  Eye, 
  Video, 
  Target, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  result?: any;
  estimatedTime: string;
}

interface AutomatedWorkflowProps {
  onComplete?: (results: any) => void;
  initialProject?: any;
}

export default function AutomatedWorkflow({ onComplete, initialProject }: AutomatedWorkflowProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [productType, setProductType] = useState('');
  const [aiMode, setAiMode] = useState<'auto' | 'learning' | 'powerful'>('powerful');
  const [includeVideo, setIncludeVideo] = useState(true);
  const [includeTraffic, setIncludeTraffic] = useState(true);
  const [results, setResults] = useState<any>({});
  
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'ia-espia',
      name: 'IA Espiã Suprema',
      description: 'Analisando concorrentes e estratégias do mercado',
      icon: <Eye className="w-5 h-5" />,
      status: 'pending',
      progress: 0,
      estimatedTime: '2-3 min'
    },
    {
      id: 'ia-branding',
      name: 'IA Branding Master',
      description: 'Criando identidade visual e posicionamento',
      icon: <Sparkles className="w-5 h-5" />,
      status: 'pending',
      progress: 0,
      estimatedTime: '3-4 min'
    },
    {
      id: 'ia-copywriting',
      name: 'IA Copywriter Pro',
      description: 'Gerando copy persuasivo e headlines',
      icon: <FileText className="w-5 h-5" />,
      status: 'pending',
      progress: 0,
      estimatedTime: '2-3 min'
    },
    {
      id: 'ia-landing',
      name: 'IA Landing Page',
      description: 'Criando páginas de vendas otimizadas',
      icon: <FileText className="w-5 h-5" />,
      status: 'pending',
      progress: 0,
      estimatedTime: '3-5 min'
    }
  ]);

  const executeWorkflow = async () => {
    if (!projectName || !productType) {
      alert('Preencha nome do projeto e tipo de produto');
      return;
    }

    setIsRunning(true);
    setCurrentStep(0);
    setOverallProgress(0);

    const projectData = {
      projectName,
      produto: productType,
      avatar: 'empreendedores digitais',
      nicho: 'desenvolvimento pessoal',
      oferta: 'transformação completa garantida',
      ...initialProject
    };

    const moduleResults: any[] = [];
    const updatedSteps = [...steps];

    // Execute core AI modules
    for (let i = 0; i < updatedSteps.length; i++) {
      const step = updatedSteps[i];
      setCurrentStep(i);
      
      // Update step status to running
      updatedSteps[i].status = 'running';
      updatedSteps[i].progress = 0;
      setSteps([...updatedSteps]);

      try {
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          updatedSteps[i].progress = progress;
          setSteps([...updatedSteps]);
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Execute AI module
        const response = await fetch('/api/ai/suprema/execute-module', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId: step.id,
            projectData,
            learningMode: aiMode === 'learning'
          })
        });

        const result = await response.json();
        
        if (result.success) {
          updatedSteps[i].status = 'completed';
          updatedSteps[i].result = result.data;
          moduleResults.push(result);
          
          // Update project data with new results
          if (result.data) {
            projectData[step.id] = result.data;
          }
        } else {
          updatedSteps[i].status = 'error';
        }

      } catch (error) {
        console.error(`Erro no módulo ${step.id}:`, error);
        updatedSteps[i].status = 'error';
      }

      setSteps([...updatedSteps]);
      setOverallProgress(((i + 1) / updatedSteps.length) * (includeVideo || includeTraffic ? 70 : 100));
    }

    // Execute Video AI if requested
    if (includeVideo) {
      try {
        setOverallProgress(75);
        const videoResponse = await fetch('/api/ai/video/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            produto: projectData.produto,
            avatar: projectData.avatar,
            oferta: projectData.oferta,
            nicho: projectData.nicho,
            objetivo: 'venda_direta',
            formato: 'reels',
            duracao: '30s'
          })
        });

        const videoResult = await videoResponse.json();
        if (videoResult.success) {
          projectData.videoContent = videoResult.video;
        }
      } catch (error) {
        console.error('Erro no Video AI:', error);
      }
    }

    // Execute Traffic AI if requested
    if (includeTraffic) {
      try {
        setOverallProgress(85);
        const trafficResponse = await fetch('/api/ai/traffic/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            produto: projectData.produto,
            avatar: projectData.avatar,
            oferta: projectData.oferta,
            nicho: projectData.nicho,
            orcamento: 5000,
            objetivo: 'vendas',
            plataforma: 'todas',
            publico: {
              idade: '25-45',
              genero: 'todos',
              interesses: ['empreendedorismo', 'marketing digital'],
              comportamentos: ['compradores online'],
              localizacao: 'Brasil'
            }
          })
        });

        const trafficResult = await trafficResponse.json();
        if (trafficResult.success) {
          projectData.trafficCampaigns = trafficResult.campaigns;
        }
      } catch (error) {
        console.error('Erro no Traffic AI:', error);
      }
    }

    setOverallProgress(100);
    setIsRunning(false);
    
    const finalResults = {
      projectData,
      moduleResults,
      completedAt: new Date(),
      includeVideo,
      includeTraffic
    };

    setResults(finalResults);
    onComplete?.(finalResults);
  };

  const generateCompleteExport = async () => {
    if (!results.projectData) {
      alert('Execute o workflow primeiro');
      return;
    }

    try {
      const response = await fetch('/api/export/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          projectData: results.projectData,
          includeVideo,
          includeTraffic
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}_export.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erro ao gerar export');
      }
    } catch (error) {
      console.error('Erro no export:', error);
      alert('Erro ao gerar export');
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'running':
        return 'border-blue-500 bg-blue-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            IA Board Suprema - Workflow Automático
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome do Projeto</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Curso Marketing Digital"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Produto</label>
              <Input
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="Ex: Curso online, Consultoria, E-book"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Modo de IA</label>
              <Select value={aiMode} onValueChange={(value: any) => setAiMode(value)} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automático</SelectItem>
                  <SelectItem value="learning">Aprendizado</SelectItem>
                  <SelectItem value="powerful">Poderoso (GPT-4 + Claude)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeVideo}
                  onChange={(e) => setIncludeVideo(e.target.checked)}
                  disabled={isRunning}
                  className="rounded"
                />
                <span className="text-sm">Incluir Video AI</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeTraffic}
                  onChange={(e) => setIncludeTraffic(e.target.checked)}
                  disabled={isRunning}
                  className="rounded"
                />
                <span className="text-sm">Incluir Traffic AI</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={executeWorkflow}
              disabled={isRunning || !projectName || !productType}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Executando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Executar Workflow Completo
                </>
              )}
            </Button>
            
            <Button
              onClick={generateCompleteExport}
              disabled={!results.projectData}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Tudo
            </Button>
          </div>

          {(isRunning || results.projectData) && (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progresso Geral</span>
                  <span className="text-sm text-gray-600">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-2 rounded-lg p-4 ${getStepBorderColor(step.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStepIcon(step.status)}
                        <div>
                          <h4 className="font-semibold">{step.name}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {step.estimatedTime}
                        </Badge>
                        
                        {step.status === 'running' && (
                          <div className="w-24">
                            <Progress value={step.progress} className="h-1" />
                          </div>
                        )}
                        
                        <Badge 
                          variant={
                            step.status === 'completed' ? 'default' :
                            step.status === 'running' ? 'secondary' :
                            step.status === 'error' ? 'destructive' :
                            'outline'
                          }
                        >
                          {step.status === 'completed' ? 'Concluído' :
                           step.status === 'running' ? 'Executando' :
                           step.status === 'error' ? 'Erro' :
                           'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {results.projectData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Workflow Concluído!</h3>
              </div>
              
              <p className="text-green-700 mb-4">
                Todos os módulos foram executados com sucesso. Seu projeto está pronto para implementação.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-800">Módulos IA</div>
                  <div className="text-green-600">{steps.filter(s => s.status === 'completed').length}/{steps.length}</div>
                </div>
                
                <div className="text-center">
                  <div className="font-semibold text-green-800">Video AI</div>
                  <div className="text-green-600">{results.projectData.videoContent ? 'Incluído' : 'Não incluído'}</div>
                </div>
                
                <div className="text-center">
                  <div className="font-semibold text-green-800">Traffic AI</div>
                  <div className="text-green-600">{results.projectData.trafficCampaigns ? 'Incluído' : 'Não incluído'}</div>
                </div>
                
                <div className="text-center">
                  <div className="font-semibold text-green-800">Export</div>
                  <div className="text-green-600">Pronto</div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}