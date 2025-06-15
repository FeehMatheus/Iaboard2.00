import { useCallback, useState, useEffect, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Search, 
  Package, 
  PenTool, 
  Target, 
  Video, 
  Download, 
  Play, 
  Loader2, 
  Settings, 
  X,
  Zap,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProgressVisualization } from './ProgressVisualization';
import { DynamicProgressVisualization } from './DynamicProgressVisualization';
import { AdvancedProgressDashboard } from './AdvancedProgressDashboard';
import { useProgressTracking } from '../hooks/useProgressTracking';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AIModuleData {
  moduleType: 'ia-copy' | 'ia-video' | 'ia-produto' | 'ia-trafego' | 'ia-analytics' | 'workflow-choreography' | 'ia-pensamento-poderoso';
  prompt?: string;
  parameters?: any;
  result?: string;
  isExecuting?: boolean;
  files?: Array<{name: string, content: string, type: string}>;
  progressMode?: boolean;
  workflowTemplate?: 'complete-marketing' | 'video-suite' | 'copy-mastery' | 'custom';
  choreographyData?: {
    goal?: string;
    preferences?: any;
  };
  thinkingData?: {
    problema?: string;
    profundidade?: string;
  };
}

const moduleConfigs = {
  'ia-copy': {
    name: 'IA Copy',
    icon: PenTool,
    color: 'from-red-500 to-red-600',
    description: 'Geração exclusiva de headlines e textos persuasivos'
  },
  'ia-video': {
    name: 'IA Vídeo',
    icon: Video,
    color: 'from-red-500 to-red-600',
    description: 'Geração de vídeos reais com IA'
  },
  'ia-produto': {
    name: 'IA Produto',
    icon: Package,
    color: 'from-red-500 to-red-600',
    description: 'Criação de fichas técnicas de produtos'
  },
  'ia-trafego': {
    name: 'IA Tráfego',
    icon: Target,
    color: 'from-red-500 to-red-600',
    description: 'Criativos para campanhas de tráfego pago'
  },
  'ia-analytics': {
    name: 'IA Analytics',
    icon: BarChart3,
    color: 'from-red-500 to-red-600',
    description: 'Análise de dados e métricas'
  },
  'workflow-choreography': {
    name: 'Workflow Choreography',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-600',
    description: 'Intelligent workflow orchestration and optimization'
  },
  'ia-pensamento-poderoso': {
    name: 'IA Pensamento Poderoso',
    icon: Brain,
    color: 'from-indigo-500 to-purple-600',
    description: 'Análise cognitiva multi-camadas para resolução de problemas complexos'
  }
};

const workflowTemplates = {
  'complete-marketing': {
    name: 'Pacote Completo de Marketing',
    description: 'Análise de mercado, copy persuasivo, vídeos promocionais e landing page',
    steps: [
      { title: 'Análise de Mercado', type: 'analysis' as const, estimatedTime: '30s' },
      { title: 'Estratégia de Copy', type: 'copy' as const, estimatedTime: '45s' },
      { title: 'Geração de Vídeo Promocional', type: 'video' as const, estimatedTime: '60s' },
      { title: 'Landing Page Otimizada', type: 'text' as const, estimatedTime: '40s' },
      { title: 'Materiais de Apoio', type: 'image' as const, estimatedTime: '25s' }
    ]
  },
  'video-suite': {
    name: 'Suíte de Conteúdo em Vídeo',
    description: 'Múltiplos vídeos para diferentes plataformas e públicos',
    steps: [
      { title: 'Roteiro Principal', type: 'text' as const, estimatedTime: '20s' },
      { title: 'Vídeo Longo (YouTube)', type: 'video' as const, estimatedTime: '90s' },
      { title: 'Vídeo Curto (TikTok/Reels)', type: 'video' as const, estimatedTime: '60s' },
      { title: 'Thumbnails Personalizados', type: 'image' as const, estimatedTime: '30s' }
    ]
  },
  'copy-mastery': {
    name: 'Pacote Master de Copy',
    description: 'Copy completo para funis de vendas e campanhas',
    steps: [
      { title: 'Pesquisa de Avatar', type: 'analysis' as const, estimatedTime: '25s' },
      { title: 'Headlines Magnéticas', type: 'copy' as const, estimatedTime: '30s' },
      { title: 'Copy de Vendas', type: 'copy' as const, estimatedTime: '45s' },
      { title: 'E-mail Marketing', type: 'copy' as const, estimatedTime: '35s' }
    ]
  }
};

export const AIModuleNode = memo(({ id, data }: NodeProps<AIModuleData>) => {
  const [moduleType, setModuleType] = useState<AIModuleData['moduleType']>(data?.moduleType || 'ia-copy');
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [parameters, setParameters] = useState(data?.parameters || {});
  const [result, setResult] = useState(data?.result || '');
  const [isExecuting, setIsExecuting] = useState(data?.isExecuting || false);
  const [files, setFiles] = useState(data?.files || []);
  const [isResizing, setIsResizing] = useState(false);
  const [progressMode, setProgressMode] = useState(data?.progressMode || false);
  const [workflowTemplate, setWorkflowTemplate] = useState<keyof typeof workflowTemplates | 'custom'>(data?.workflowTemplate || 'complete-marketing');
  const [generatedContent, setGeneratedContent] = useState<Array<{stepId: string, content: string, url?: string}>>([]);

  const { setNodes } = useReactFlow();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    steps,
    currentStep,
    isActive,
    startProgress,
    updateStepProgress,
    completeStep,
    failStep,
    nextStep,
    retryStep,
    cancelProgress,
    resetProgress
  } = useProgressTracking();

  const config = moduleConfigs[moduleType] || moduleConfigs['ia-copy']; // Default fallback
  const IconComponent = config?.icon || Brain;

  // Update node data when state changes
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                moduleType,
                prompt,
                parameters,
                result,
                isExecuting,
                files,
                progressMode,
                workflowTemplate,
              },
            }
          : node
      )
    );
  }, [moduleType, prompt, parameters, result, isExecuting, files, progressMode, workflowTemplate, id, setNodes]);

  const executeStep = useCallback(async (step: any, prompt: string) => {
    try {
      updateStepProgress(step.id, 10);
      
      // Use the correct real API endpoints
      const endpoint = step.type === 'video' ? '/api/ia-video/generate' : 
                     step.type === 'copy' ? '/api/ia-copy/generate' :
                     step.type === 'product' ? '/api/ia-produto/generate' :
                     step.type === 'traffic' ? '/api/ia-trafego/generate' :
                     step.type === 'analytics' ? '/api/ia-analytics/generate' :
                     '/api/ia-copy/generate'; // Default fallback

      const payload = step.type === 'video' ? {
        concept: `${prompt} - ${step.description}`,
        duration: '5 minutos',
        style: 'profissional',
        objective: 'vendas'
      } : step.type === 'copy' ? {
        prompt: `${prompt} - ${step.description}`,
        niche: 'marketing digital',
        targetAudience: 'empreendedores',
        objective: 'conversão'
      } : step.type === 'product' ? {
        idea: `${prompt} - ${step.description}`,
        market: 'digital',
        budget: 'R$ 50.000',
        timeline: '3 meses'
      } : step.type === 'traffic' ? {
        business: `${prompt} - ${step.description}`,
        budget: 'R$ 10.000/mês',
        goals: 'gerar leads qualificados',
        platforms: 'Google, Facebook, LinkedIn'
      } : step.type === 'analytics' ? {
        business: `${prompt} - ${step.description}`,
        metrics: 'conversões, ROI, CAC',
        goals: 'otimizar performance',
        platforms: 'Google Analytics, Facebook Pixel'
      } : {
        prompt: `${prompt} - ${step.description}`,
        niche: 'marketing digital',
        targetAudience: 'empreendedores',
        objective: 'conversão'
      };

      updateStepProgress(step.id, 30);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      updateStepProgress(step.id, 60);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      updateStepProgress(step.id, 90);

      if (result.success) {
        const content = {
          stepId: step.id,
          content: result.content || result.copy || result.result || 'Conteúdo gerado com sucesso',
          url: result.url || result.videoUrl
        };

        setGeneratedContent(prev => [...prev, content]);
        
        completeStep(step.id, {
          tokensUsed: result.tokensUsed,
          provider: result.provider,
          fileSize: result.metadata?.fileSize
        });
      } else {
        throw new Error(result.error || 'Falha na geração');
      }
    } catch (error) {
      console.error(`Error in step ${step.id}:`, error);
      failStep(step.id, error instanceof Error ? error.message : 'Erro desconhecido');
    }
  }, [updateStepProgress, completeStep, failStep, parameters]);

  const startProgressWorkflow = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Entrada Obrigatória",
        description: "Digite o prompt para iniciar o workflow.",
        variant: "destructive",
      });
      return;
    }

    const template = workflowTemplates[workflowTemplate as keyof typeof workflowTemplates];
    if (!template) return;

    setIsExecuting(true);
    setGeneratedContent([]);
    
    const stepsWithIds = template.steps.map((step, index) => ({
      ...step,
      id: `step-${index}`,
      description: step.title
    }));

    startProgress(
      {
        totalSteps: stepsWithIds.length,
        estimatedDuration: stepsWithIds.length * 45,
        enableRealTimeUpdates: true
      },
      stepsWithIds as any
    );

    // Execute steps sequentially
    for (let i = 0; i < stepsWithIds.length; i++) {
      const step = stepsWithIds[i];
      await executeStep(step, prompt);
      
      if (i < stepsWithIds.length - 1) {
        nextStep();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Combine all generated content into result
    const combinedResult = generatedContent.map((content, index) => 
      `### ${template.steps[index]?.title}\n${content.content}\n${content.url ? `\nArquivo: ${content.url}` : ''}`
    ).join('\n\n');
    
    setResult(combinedResult);
    setIsExecuting(false);

    toast({
      title: "Workflow Concluído!",
      description: `${template.name} executado com sucesso.`,
    });
  }, [prompt, workflowTemplate, startProgress, executeStep, nextStep, generatedContent, toast]);

  const [showProgressVisualization, setShowProgressVisualization] = useState(false);
  const [progressVisualizationMode, setProgressVisualizationMode] = useState<'simple' | 'advanced' | 'minimal'>('simple');

  const executeModule = async () => {
    if (progressMode) {
      await startProgressWorkflow();
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Entrada Obrigatória",
        description: "Digite o prompt ou parâmetros para execução do módulo.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    setShowProgressVisualization(true);
    setResult('');

    try {
      // Use specific endpoints for each module type
      const endpoints = {
        'ia-copy': '/api/ia-copy/generate',
        'ia-video': '/api/ia-video/generate',
        'ia-produto': '/api/ia-produto/generate',
        'ia-trafego': '/api/ia-trafego/generate',
        'ia-analytics': '/api/ia-analytics/generate',
        'workflow-choreography': '/api/workflow-choreography/generate',
        'ia-pensamento-poderoso': '/api/ia-pensamento-poderoso/processar'
      };

      const endpoint = endpoints[moduleType];
      
      // Create specific payload for each module type
      const payloads = {
        'ia-copy': {
          prompt: prompt.trim(),
          niche: parameters.niche || 'marketing digital',
          targetAudience: parameters.targetAudience || 'empreendedores',
          objective: parameters.objective || 'conversão'
        },
        'ia-video': {
          concept: prompt.trim(),
          duration: parameters.duration || '5 minutos',
          style: parameters.style || 'profissional',
          objective: parameters.objective || 'vendas'
        },
        'ia-produto': {
          idea: prompt.trim(),
          market: parameters.market || 'digital',
          budget: parameters.budget || 'R$ 50.000',
          timeline: parameters.timeline || '3 meses'
        },
        'ia-trafego': {
          business: prompt.trim(),
          budget: parameters.budget || 'R$ 10.000/mês',
          goals: parameters.goals || 'gerar leads qualificados',
          platforms: parameters.platforms || 'Google, Facebook, LinkedIn'
        },
        'ia-analytics': {
          business: prompt.trim(),
          metrics: parameters.metrics || 'conversões, ROI, CAC',
          goals: parameters.goals || 'otimizar performance',
          platforms: parameters.platforms || 'Google Analytics, Facebook Pixel'
        },
        'workflow-choreography': {
          goal: prompt.trim(),
          industry: parameters.industry || '',
          targetAudience: parameters.targetAudience || '',
          budget: parameters.budget || 'medium',
          timeline: parameters.timeline || 'normal',
          preferences: {
            complexity: parameters.complexity || 'intermediate',
            automation: parameters.automation || 'moderate',
            outputs: parameters.outputs || []
          }
        }
      };

      const payload = payloads[moduleType];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success || data.content || data.result) {
        const resultContent = data.content || data.result || data.analysis || 'Conteúdo gerado com sucesso';
        setResult(resultContent);
        
        if (data.files) {
          setFiles(data.files);
        }
        
        toast({
          title: "Módulo Executado!",
          description: `${config.name} processado com sucesso.`,
        });
      } else {
        throw new Error(data.error || 'Falha na execução do módulo');
      }
    } catch (error) {
      console.error('Module execution error:', error);
      toast({
        title: "Erro na Execução",
        description: error instanceof Error ? error.message : "Falha ao executar módulo IA",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
      setTimeout(() => setShowProgressVisualization(false), 2000);
    }
  };

  const deleteNode = () => {
    setNodes(nodes => nodes.filter(node => node.id !== id));
  };

  const downloadFiles = () => {
    files.forEach(file => {
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className={`relative ${isResizing ? 'select-none' : ''}`}>
      <NodeResizer
        color="#8b5cf6"
        isVisible={true}
        minWidth={320}
        minHeight={400}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
      
      <Card className="w-full h-full bg-gradient-to-br from-background/95 via-background/98 to-background/95 backdrop-blur-xl border-2 border-violet-500/30 shadow-2xl transition-all duration-300 hover:shadow-violet-500/25 hover:shadow-2xl hover:-translate-y-1 hover:border-violet-400/50 animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="pb-3 space-y-3 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-t-lg border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/10`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">{config.name}</h3>
                <p className="text-xs text-muted-foreground/80">{config.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteNode}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Select value={moduleType} onValueChange={(value: AIModuleData['moduleType']) => setModuleType(value)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(moduleConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-1 p-4 space-y-3">
          {/* Progress Mode Toggle */}
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium">Modo Progress Studio</span>
            </div>
            <Button
              size="sm"
              variant={progressMode ? "default" : "outline"}
              onClick={() => setProgressMode(!progressMode)}
              className="h-6 text-xs"
            >
              {progressMode ? "Ativo" : "Inativo"}
            </Button>
          </div>

          {/* Workflow Template Selection (when in progress mode) */}
          {progressMode && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Template de Workflow:
              </label>
              <Select value={workflowTemplate} onValueChange={(value: any) => setWorkflowTemplate(value)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(workflowTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
              {workflowTemplate !== 'custom' && (
                <p className="text-xs text-muted-foreground mt-1">
                  {workflowTemplates[workflowTemplate as keyof typeof workflowTemplates]?.description}
                </p>
              )}
            </div>
          )}

          {/* Progress Visualization Mode (when not in progress mode) */}
          {!progressMode && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Visualização de Progresso:
              </label>
              <Select value={progressVisualizationMode} onValueChange={(value: any) => setProgressVisualizationMode(value)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simples</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                  <SelectItem value="minimal">Mínimo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              {progressMode ? "💡 Ideia Principal:" : "🚀 Prompt/Instrução:"}
            </label>
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={progressMode 
                ? "Descreva detalhadamente o produto/serviço para gerar conteúdo completo..."
                : `Digite sua instrução para ${config.name} processar com IA...`
              }
              className="min-h-[90px] text-sm bg-gradient-to-br from-background/50 to-muted/30 border-border/50 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-200 rounded-lg"
              disabled={isExecuting}
            />
          </div>

          {/* Module-specific parameters */}
          {moduleType === 'ia-produto' && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Nicho"
                value={parameters.niche || ''}
                onChange={(e) => setParameters({...parameters, niche: e.target.value})}
                className="text-sm"
              />
              <Input
                placeholder="Avatar"
                value={parameters.avatar || ''}
                onChange={(e) => setParameters({...parameters, avatar: e.target.value})}
                className="text-sm"
              />
            </div>
          )}



          {moduleType === 'ia-trafego' && (
            <div className="grid grid-cols-2 gap-2">
              <Select value={parameters.platform || ''} onValueChange={(value) => setParameters({...parameters, platform: value})}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook Ads</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="instagram">Instagram Ads</SelectItem>
                  <SelectItem value="tiktok">TikTok Ads</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Orçamento"
                value={parameters.budget || ''}
                onChange={(e) => setParameters({...parameters, budget: e.target.value})}
                className="text-sm"
              />
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                ✨ Resultado Gerado:
              </label>
              <div className="bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 border border-emerald-500/20 p-4 rounded-xl text-sm max-h-48 overflow-y-auto backdrop-blur-sm">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">{result}</pre>
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block">
                Arquivos Gerados ({files.length}):
              </label>
              <div className="flex flex-wrap gap-1">
                {files.map((file, index) => (
                  <div key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    {file.name}
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                onClick={downloadFiles}
                className="h-7 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Baixar Todos
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 bg-gradient-to-r from-background/50 to-muted/30 rounded-b-lg border-t border-border/30">
          <Button
            onClick={executeModule}
            disabled={!prompt.trim() || isExecuting}
            className={`w-full bg-gradient-to-r ${config.color} hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200 text-white font-medium`}
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {progressMode ? "🚀 Executando Workflow..." : `⚡ Executando ${config.name}...`}
              </>
            ) : (
              <>
                {progressMode ? <Sparkles className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {progressMode ? "Iniciar Workflow" : `Executar ${config.name}`}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Progress Visualization for workflows */}
      {progressMode && (
        <ProgressVisualization
          steps={steps}
          currentStep={currentStep}
          isActive={isActive}
          onCancel={cancelProgress}
          onRetry={(stepId) => retryStep(stepId)}
        />
      )}

      {/* Dynamic Progress Visualization (Standard Mode) */}
      {!progressMode && showProgressVisualization && (
        <div className="absolute top-full left-0 mt-2 z-50">
          {progressVisualizationMode === 'advanced' ? (
            <AdvancedProgressDashboard
              moduleType={moduleType}
              isActive={isExecuting}
              onComplete={() => setShowProgressVisualization(false)}
              showDetailedMetrics={true}
            />
          ) : progressVisualizationMode === 'simple' ? (
            <DynamicProgressVisualization
              moduleType={moduleType}
              isActive={isExecuting}
              onComplete={() => setShowProgressVisualization(false)}
            />
          ) : (
            <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Processando {moduleType.replace('-', ' ').toUpperCase()}...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 border-2 border-background"
      />
    </div>
  );
});

AIModuleNode.displayName = 'AIModuleNode';