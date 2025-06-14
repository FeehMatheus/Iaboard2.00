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
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProgressVisualization } from './ProgressVisualization';
import { useProgressTracking } from '../hooks/useProgressTracking';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AIModuleData {
  moduleType: 'ia-total' | 'pensamento-poderoso' | 'ia-espia' | 'ia-produto' | 'ia-copy' | 'ia-trafego' | 'ia-video' | 'ia-analytics';
  prompt?: string;
  parameters?: any;
  result?: string;
  isExecuting?: boolean;
  files?: Array<{name: string, content: string, type: string}>;
  progressMode?: boolean;
  workflowTemplate?: 'complete-marketing' | 'video-suite' | 'copy-mastery' | 'custom';
}

const moduleConfigs = {
  'ia-total': {
    name: 'IA Total™',
    icon: Brain,
    color: 'from-purple-600 to-violet-600',
    description: 'Orquestra múltiplas IAs para solução completa'
  },
  'pensamento-poderoso': {
    name: 'Pensamento Poderoso™',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    description: 'Colaboração automática entre IAs'
  },
  'ia-espia': {
    name: 'IA Espiã',
    icon: Search,
    color: 'from-red-500 to-pink-500',
    description: 'Análise de concorrência e market intelligence'
  },
  'ia-produto': {
    name: 'IA Produto Rápido™',
    icon: Package,
    color: 'from-green-500 to-emerald-500',
    description: 'Criação automática de produto digital'
  },
  'ia-copy': {
    name: 'IA Copy',
    icon: PenTool,
    color: 'from-blue-500 to-cyan-500',
    description: 'Geração de textos persuasivos e CTAs'
  },
  'ia-trafego': {
    name: 'IA Tráfego Pago',
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
    description: 'Criativos e campanhas de tráfego pago'
  },
  'ia-video': {
    name: 'IA Vídeo Avançado',
    icon: Video,
    color: 'from-pink-500 to-rose-500',
    description: 'Roteiro + vídeo real com avatar'
  },
  'ia-analytics': {
    name: 'IA Analytics Plus',
    icon: Brain,
    color: 'from-teal-500 to-cyan-500',
    description: 'Análise de métricas e otimização'
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
  const [moduleType, setModuleType] = useState<AIModuleData['moduleType']>(data?.moduleType || 'ia-total');
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

  const config = moduleConfigs[moduleType];
  const IconComponent = config.icon;

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
      
      const endpoint = step.type === 'video' ? '/api/ai/generate' : 
                     step.type === 'copy' ? '/api/ia-copy/generate' :
                     '/api/llm/generate';

      const payload = step.type === 'video' ? {
        type: 'video',
        prompt: `${prompt} - ${step.description}`,
        parameters: { duration: 5, style: 'professional' }
      } : step.type === 'copy' ? {
        prompt: `${prompt} - ${step.description}`,
        copyType: 'professional',
        parameters
      } : {
        prompt: `${prompt} - ${step.description}. Responda em português detalhadamente.`,
        model: 'gpt-4o',
        maxTokens: 1000
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
    setResult('');

    try {
      const response = await fetch('/api/ai/module/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleType,
          prompt: prompt.trim(),
          parameters,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
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
      
      <Card className="w-full h-full bg-card border-border shadow-lg">
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{config.name}</h3>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteNode}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
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

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {progressMode ? "Prompt Principal:" : "Prompt / Parâmetros:"}
            </label>
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={progressMode 
                ? "Descreva o produto/serviço para gerar conteúdo completo..."
                : `Digite o que deseja executar com ${config.name}...`
              }
              className="min-h-[80px] text-sm"
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

          {moduleType === 'ia-espia' && (
            <Input
              placeholder="URL do concorrente"
              value={parameters.competitorUrl || ''}
              onChange={(e) => setParameters({...parameters, competitorUrl: e.target.value})}
              className="text-sm"
            />
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
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block">
                Resultado Executado:
              </label>
              <div className="bg-muted p-3 rounded-lg text-sm max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs">{result}</pre>
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

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={executeModule}
            disabled={!prompt.trim() || isExecuting}
            className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 transition-opacity`}
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {progressMode ? "Executando Workflow..." : `Executando ${config.name}...`}
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