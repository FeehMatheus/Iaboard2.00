import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Brain, Zap, Target, TrendingUp, Download, Play, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCreationRequest {
  productType: string;
  niche: string;
  targetAudience: string;
  timeframe: number;
  marketingGoals: string[];
  brandVoice: string;
  budget?: number;
  competitorUrls?: string[];
}

interface ProductCreationResult {
  id: string;
  productConcept: {
    name: string;
    description: string;
    valueProposition: string;
    pricing: {
      tier1: number;
      tier2: number;
      tier3: number;
    };
  };
  marketAnalysis: any;
  contentStrategy: any;
  funnelArchitecture: any;
  implementationPlan: any;
  automationSetup: any;
  files: Array<{
    name: string;
    type: string;
    content: string;
    purpose: string;
  }>;
}

export function SupremeFurionInterface() {
  const [activeTab, setActiveTab] = useState('create-product');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<ProductCreationResult | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeAnalysis, setYoutubeAnalysis] = useState<any>(null);
  const { toast } = useToast();

  // Product creation form state
  const [formData, setFormData] = useState<ProductCreationRequest>({
    productType: '',
    niche: '',
    targetAudience: '',
    timeframe: 30,
    marketingGoals: [],
    brandVoice: 'profissional',
    budget: undefined,
    competitorUrls: []
  });

  const productTypes = [
    'Curso Online',
    'E-book',
    'Software/App',
    'Consultoria',
    'Membership',
    'Template/Planilha',
    'Webinar',
    'Coaching Program'
  ];

  const niches = [
    'Marketing Digital',
    'Empreendedorismo',
    'Desenvolvimento Pessoal',
    'Fitness e Saúde',
    'Finanças Pessoais',
    'Tecnologia',
    'Design',
    'Educação'
  ];

  const audiences = [
    'Empreendedores Iniciantes',
    'Profissionais de Marketing',
    'Freelancers',
    'Pequenos Empresários',
    'Estudantes',
    'Executivos',
    'Criadores de Conteúdo',
    'Consultores'
  ];

  const marketingGoals = [
    'Aumentar vendas',
    'Gerar leads',
    'Build autoridade',
    'Expansão de mercado',
    'Fidelização',
    'Reduzir CAC',
    'Aumentar LTV'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      marketingGoals: prev.marketingGoals.includes(goal)
        ? prev.marketingGoals.filter(g => g !== goal)
        : [...prev.marketingGoals, goal]
    }));
  };

  const simulateProgress = (steps: string[]) => {
    let currentStepIndex = 0;
    const stepDuration = (formData.timeframe * 60 * 1000) / steps.length; // Convert to milliseconds

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex]);
        setProgress(((currentStepIndex + 1) / steps.length) * 100);
        currentStepIndex++;
      } else {
        clearInterval(interval);
      }
    }, stepDuration);

    return interval;
  };

  const handleCreateProduct = async () => {
    if (!formData.productType || !formData.niche || !formData.targetAudience) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha tipo de produto, nicho e público-alvo",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResult(null);

    const steps = [
      'Analisando mercado...',
      'Criando conceito do produto...',
      'Desenvolvendo estratégia de conteúdo...',
      'Projetando funil de vendas...',
      'Criando plano de implementação...',
      'Configurando automações...',
      'Gerando arquivos...',
      'Finalizando produto...'
    ];

    const progressInterval = simulateProgress(steps);

    try {
      const response = await fetch('/api/supreme/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        toast({
          title: "Produto criado com sucesso!",
          description: `${data.data.productConcept.name} foi criado em ${formData.timeframe} minutos`,
        });
      } else {
        throw new Error(data.error || 'Erro na criação do produto');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro na criação",
        description: error.message || "Erro interno do servidor",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(100);
      setCurrentStep('Concluído!');
    }
  };

  const handleYouTubeAnalysis = async () => {
    if (!youtubeUrl) {
      toast({
        title: "URL obrigatória",
        description: "Insira a URL do vídeo do YouTube",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/youtube/analyze-live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: youtubeUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setYoutubeAnalysis(data.data);
        toast({
          title: "Análise concluída!",
          description: "Vídeo analisado com sucesso",
        });
      } else {
        throw new Error(data.error || 'Erro na análise');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      toast({
        title: "Erro na análise",
        description: error.message || "Erro interno do servidor",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (file: any) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    if (result?.files) {
      result.files.forEach(file => {
        setTimeout(() => downloadFile(file), 100);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema Supreme Furion AI
          </h1>
          <p className="text-xl text-purple-200">
            Criação de produtos em 30 minutos com IA suprema
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-4">
            <Button
              onClick={() => window.location.href = '/canvas'}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              🎨 Quadro Infinito
            </Button>
            <Button
              onClick={() => window.location.href = '/board'}
              variant="outline"
            >
              📋 Board Original
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="create-product" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Criar Produto
            </TabsTrigger>
            <TabsTrigger value="youtube-analysis" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Análise YouTube
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create-product" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Configuração do Produto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Produto</label>
                    <Select value={formData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nicho</label>
                    <Select value={formData.niche} onValueChange={(value) => handleInputChange('niche', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nicho" />
                      </SelectTrigger>
                      <SelectContent>
                        {niches.map(niche => (
                          <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Público-alvo</label>
                    <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o público" />
                      </SelectTrigger>
                      <SelectContent>
                        {audiences.map(audience => (
                          <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tempo (minutos)</label>
                    <Input
                      type="number"
                      value={formData.timeframe}
                      onChange={(e) => handleInputChange('timeframe', parseInt(e.target.value))}
                      min="15"
                      max="60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Voz da Marca</label>
                    <Select value={formData.brandVoice} onValueChange={(value) => handleInputChange('brandVoice', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profissional">Profissional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="autoritativo">Autoritativo</SelectItem>
                        <SelectItem value="amigável">Amigável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Orçamento (R$)</label>
                    <Input
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => handleInputChange('budget', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Objetivos de Marketing</label>
                  <div className="flex flex-wrap gap-2">
                    {marketingGoals.map(goal => (
                      <Badge
                        key={goal}
                        variant={formData.marketingGoals.includes(goal) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleGoalToggle(goal)}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URLs dos Concorrentes (uma por linha)</label>
                  <Textarea
                    value={formData.competitorUrls?.join('\n') || ''}
                    onChange={(e) => handleInputChange('competitorUrls', e.target.value.split('\n').filter(Boolean))}
                    placeholder="https://concorrente1.com&#10;https://concorrente2.com"
                    rows={3}
                  />
                </div>

                {isLoading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{currentStep}</span>
                      <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={handleCreateProduct}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando Produto...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Criar Produto em {formData.timeframe} Minutos
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="youtube-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-red-500" />
                  Análise de Vídeo YouTube
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL do Vídeo</label>
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <Button
                  onClick={handleYouTubeAnalysis}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Analisar Vídeo
                    </>
                  )}
                </Button>

                {youtubeAnalysis && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">Resultados da Análise</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Informações do Vídeo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p><strong>Título:</strong> {youtubeAnalysis.title}</p>
                          <p><strong>Canal:</strong> {youtubeAnalysis.channelName}</p>
                          <p><strong>ID:</strong> {youtubeAnalysis.videoId}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Insights de Conteúdo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{youtubeAnalysis.contentInsights?.length || 0} insights identificados</p>
                          <p>{youtubeAnalysis.businessStrategies?.length || 0} estratégias de negócio</p>
                          <p>{youtubeAnalysis.marketingTechniques?.length || 0} técnicas de marketing</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {result ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        {result.productConcept.name}
                      </span>
                      <Button onClick={downloadAllFiles} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Todos
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{result.productConcept.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          R$ {result.productConcept.pricing.tier1}
                        </div>
                        <div className="text-sm text-gray-600">Básico</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          R$ {result.productConcept.pricing.tier2}
                        </div>
                        <div className="text-sm text-gray-600">Avançado</div>
                      </div>
                      <div className="text-center p-4 bg-gold-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          R$ {result.productConcept.pricing.tier3}
                        </div>
                        <div className="text-sm text-gray-600">Premium</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Arquivos Gerados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-gray-500">{file.purpose}</div>
                          </div>
                          <Button
                            onClick={() => downloadFile(file)}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum produto foi criado ainda.</p>
                  <p className="text-sm text-gray-400">Vá para a aba "Criar Produto" para começar.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-600">Produtos Criados</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">8.5min</p>
                      <p className="text-sm text-gray-600">Tempo Médio</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">94%</p>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">R$ 2.8M</p>
                      <p className="text-sm text-gray-600">Receita Gerada</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Velocidade de Criação</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Qualidade do Conteúdo</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Satisfação do Cliente</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}