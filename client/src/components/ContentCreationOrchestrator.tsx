import React, { useState, useCallback } from 'react';
import { ProgressVisualization } from './ProgressVisualization';
import { useProgressTracking, ProgressStep } from '../hooks/useProgressTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, Download, Eye, Share2, Sparkles } from 'lucide-react';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'comprehensive' | 'video-focused' | 'copy-focused' | 'analysis';
  steps: Omit<ProgressStep, 'status' | 'progress' | 'id'>[];
  estimatedDuration: number;
}

const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'complete-marketing-package',
    name: 'Pacote Completo de Marketing',
    description: 'Análise de mercado, copy persuasivo, vídeos promocionais e landing page',
    type: 'comprehensive',
    estimatedDuration: 180,
    steps: [
      {
        title: 'Análise de Mercado',
        description: 'Pesquisando público-alvo, concorrentes e tendências do mercado',
        type: 'analysis',
        estimatedTime: '30s'
      },
      {
        title: 'Estratégia de Copy',
        description: 'Criando headlines, descrições e CTAs persuasivos',
        type: 'copy',
        estimatedTime: '45s'
      },
      {
        title: 'Geração de Vídeo Promocional',
        description: 'Produzindo vídeo de alta qualidade com IA',
        type: 'video',
        estimatedTime: '60s'
      },
      {
        title: 'Landing Page Otimizada',
        description: 'Desenvolvendo página de conversão responsiva',
        type: 'text',
        estimatedTime: '40s'
      },
      {
        title: 'Materiais de Apoio',
        description: 'Criando banners, thumbnails e conteúdo adicional',
        type: 'image',
        estimatedTime: '25s'
      }
    ]
  },
  {
    id: 'video-content-suite',
    name: 'Suíte de Conteúdo em Vídeo',
    description: 'Múltiplos vídeos para diferentes plataformas e públicos',
    type: 'video-focused',
    estimatedDuration: 240,
    steps: [
      {
        title: 'Roteiro Principal',
        description: 'Desenvolvendo narrativa e estrutura dos vídeos',
        type: 'text',
        estimatedTime: '20s'
      },
      {
        title: 'Vídeo Longo (YouTube)',
        description: 'Criando vídeo detalhado para YouTube',
        type: 'video',
        estimatedTime: '90s'
      },
      {
        title: 'Vídeo Curto (TikTok/Reels)',
        description: 'Adaptando conteúdo para formato vertical',
        type: 'video',
        estimatedTime: '60s'
      },
      {
        title: 'Thumbnails Personalizados',
        description: 'Gerando miniaturas atrativas para cada vídeo',
        type: 'image',
        estimatedTime: '30s'
      },
      {
        title: 'Legendas e Transcrições',
        description: 'Criando texto de apoio e acessibilidade',
        type: 'text',
        estimatedTime: '25s'
      }
    ]
  },
  {
    id: 'copy-mastery-package',
    name: 'Pacote Master de Copy',
    description: 'Copy completo para funis de vendas e campanhas',
    type: 'copy-focused',
    estimatedDuration: 120,
    steps: [
      {
        title: 'Pesquisa de Avatar',
        description: 'Definindo perfil detalhado do cliente ideal',
        type: 'analysis',
        estimatedTime: '25s'
      },
      {
        title: 'Headlines Magnéticas',
        description: 'Criando títulos que geram curiosidade e desejo',
        type: 'copy',
        estimatedTime: '30s'
      },
      {
        title: 'Copy de Vendas',
        description: 'Desenvolvendo texto persuasivo para conversão',
        type: 'copy',
        estimatedTime: '45s'
      },
      {
        title: 'E-mail Marketing',
        description: 'Sequência de e-mails para nutrição e vendas',
        type: 'copy',
        estimatedTime: '35s'
      },
      {
        title: 'Copy para Anúncios',
        description: 'Textos otimizados para Facebook e Google Ads',
        type: 'copy',
        estimatedTime: '20s'
      }
    ]
  }
];

interface GeneratedContent {
  stepId: string;
  type: string;
  content: string;
  url?: string;
  metadata?: any;
}

export function ContentCreationOrchestrator() {
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customParameters, setCustomParameters] = useState({
    targetAudience: '',
    productType: '',
    tone: 'professional',
    language: 'pt-BR'
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    steps,
    currentStep,
    isActive,
    overallProgress,
    elapsedTime,
    estimatedTimeRemaining,
    startProgress,
    updateStepProgress,
    completeStep,
    failStep,
    nextStep,
    retryStep,
    cancelProgress,
    resetProgress
  } = useProgressTracking();

  const executeStep = useCallback(async (step: ProgressStep, prompt: string) => {
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
        parameters: customParameters
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
        const content: GeneratedContent = {
          stepId: step.id,
          type: step.type,
          content: result.content || result.copy || result.result || 'Conteúdo gerado com sucesso',
          url: result.url || result.videoUrl,
          metadata: {
            provider: result.provider,
            tokensUsed: result.tokensUsed,
            fileSize: result.metadata?.fileSize,
            ...(result.metadata || {})
          }
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
  }, [updateStepProgress, completeStep, failStep, customParameters]);

  const startGeneration = useCallback(async () => {
    if (!selectedTemplate || !customPrompt.trim()) return;

    setIsGenerating(true);
    setGeneratedContent([]);
    
    const stepsWithIds = selectedTemplate.steps.map((step, index) => ({
      ...step,
      id: `step-${index}`,
    }));

    startProgress(
      {
        totalSteps: stepsWithIds.length,
        estimatedDuration: selectedTemplate.estimatedDuration,
        enableRealTimeUpdates: true
      },
      stepsWithIds
    );

    // Execute steps sequentially
    for (let i = 0; i < stepsWithIds.length; i++) {
      const step = stepsWithIds[i];
      await executeStep(step as ProgressStep, customPrompt);
      
      if (i < stepsWithIds.length - 1) {
        nextStep();
        // Small delay between steps for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsGenerating(false);
  }, [selectedTemplate, customPrompt, startProgress, executeStep, nextStep]);

  const handleRetry = useCallback(async (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step) {
      retryStep(stepId);
      await executeStep(step, customPrompt);
    }
  }, [steps, retryStep, executeStep, customPrompt]);

  const downloadContent = useCallback((content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.type}-content.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Orquestrador de Criação de Conteúdo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-select">Selecione um Template</Label>
                <Select 
                  value={selectedTemplate?.id || ''} 
                  onValueChange={(value) => setSelectedTemplate(CONTENT_TEMPLATES.find(t => t.id === value) || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um template de conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TEMPLATES.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedTemplate.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {selectedTemplate.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{selectedTemplate.steps.length} etapas</Badge>
                    <Badge variant="outline">~{Math.round(selectedTemplate.estimatedDuration / 60)} min</Badge>
                  </div>
                  <div className="space-y-2">
                    {selectedTemplate.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span>{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Prompt Principal</Label>
                <Textarea
                  id="prompt"
                  placeholder="Descreva o produto, serviço ou conteúdo que deseja criar..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="audience">Público-Alvo</Label>
                  <Input
                    id="audience"
                    placeholder="Ex: Empreendedores, 25-45 anos"
                    value={customParameters.targetAudience}
                    onChange={(e) => setCustomParameters(prev => ({ ...prev, targetAudience: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="product">Tipo de Produto</Label>
                  <Input
                    id="product"
                    placeholder="Ex: Curso online, SaaS, E-book"
                    value={customParameters.productType}
                    onChange={(e) => setCustomParameters(prev => ({ ...prev, productType: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tone">Tom de Voz</Label>
                <Select 
                  value={customParameters.tone} 
                  onValueChange={(value) => setCustomParameters(prev => ({ ...prev, tone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Entusiástico</SelectItem>
                    <SelectItem value="authoritative">Autoritativo</SelectItem>
                    <SelectItem value="friendly">Amigável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={startGeneration}
              disabled={!selectedTemplate || !customPrompt.trim() || isActive}
              size="lg"
              className="px-8"
            >
              <Play className="w-4 h-4 mr-2" />
              {isActive ? 'Gerando Conteúdo...' : 'Iniciar Geração'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Gerado</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList>
                <TabsTrigger value="preview">Visualização</TabsTrigger>
                <TabsTrigger value="files">Arquivos</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                {generatedContent.map((content, index) => (
                  <Card key={content.stepId} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Etapa {index + 1}: {steps.find(s => s.id === content.stepId)?.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => downloadContent(content)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          {content.url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={content.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {content.content.substring(0, 500)}
                          {content.content.length > 500 && '...'}
                        </pre>
                      </div>
                      {content.metadata && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {content.metadata.provider && (
                            <Badge variant="secondary">{content.metadata.provider}</Badge>
                          )}
                          {content.metadata.tokensUsed && (
                            <Badge variant="outline">{content.metadata.tokensUsed} tokens</Badge>
                          )}
                          {content.metadata.fileSize && (
                            <Badge variant="outline">{content.metadata.fileSize}</Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="files">
                <div className="text-center py-8 text-gray-500">
                  Sistema de arquivos em desenvolvimento
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="text-center py-8 text-gray-500">
                  Analytics em desenvolvimento
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <ProgressVisualization
        steps={steps}
        currentStep={currentStep}
        isActive={isActive}
        onCancel={cancelProgress}
        onRetry={handleRetry}
      />
    </div>
  );
}

export default ContentCreationOrchestrator;