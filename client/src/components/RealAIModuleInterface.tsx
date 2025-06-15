import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Package, 
  TrendingUp, 
  Video, 
  BarChart3, 
  Download, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileDownloadManager from './FileDownloadManager';

interface AIResult {
  content: string;
  model: string;
  tokensUsed: number;
  files: Array<{
    id: string;
    name: string;
    type: string;
    purpose: string;
    size: number;
  }>;
  executionTime: number;
}

const RealAIModuleInterface: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('ia-copy');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const { toast } = useToast();

  // Form states for different modules
  const [copyForm, setCopyForm] = useState({
    prompt: '',
    niche: '',
    targetAudience: '',
    objective: ''
  });

  const [productForm, setProductForm] = useState({
    idea: '',
    market: '',
    budget: '',
    timeline: ''
  });

  const [trafficForm, setTrafficForm] = useState({
    business: '',
    budget: '',
    goals: '',
    platforms: ''
  });

  const [videoForm, setVideoForm] = useState({
    concept: '',
    duration: '',
    style: '',
    objective: ''
  });

  const [analyticsForm, setAnalyticsForm] = useState({
    business: '',
    metrics: '',
    goals: '',
    platforms: ''
  });

  const executeAI = async (moduleType: string, formData: any) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/${moduleType}/generate`, {
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
          title: "IA Executada com Sucesso",
          description: `Conteúdo gerado usando ${data.data.model}. ${data.data.files.length} arquivo(s) criado(s).`,
        });
      } else {
        throw new Error(data.error || 'Erro na execução da IA');
      }
    } catch (error) {
      console.error('Erro na execução:', error);
      toast({
        title: "Erro na Execução",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      id: 'ia-copy',
      name: 'IA Copy',
      icon: Bot,
      description: 'Copywriting persuasivo',
      color: 'text-blue-600'
    },
    {
      id: 'ia-produto',
      name: 'IA Produto',
      icon: Package,
      description: 'Estratégia de produto',
      color: 'text-green-600'
    },
    {
      id: 'ia-trafego',
      name: 'IA Tráfego',
      icon: TrendingUp,
      description: 'Estratégias de tráfego',
      color: 'text-purple-600'
    },
    {
      id: 'ia-video',
      name: 'IA Vídeo',
      icon: Video,
      description: 'Criação de vídeos',
      color: 'text-red-600'
    },
    {
      id: 'ia-analytics',
      name: 'IA Analytics',
      icon: BarChart3,
      description: 'Análise de dados',
      color: 'text-orange-600'
    }
  ];

  const getCurrentForm = (): any => {
    switch (activeModule) {
      case 'ia-copy': return copyForm;
      case 'ia-produto': return productForm;
      case 'ia-trafego': return trafficForm;
      case 'ia-video': return videoForm;
      case 'ia-analytics': return analyticsForm;
      default: return {};
    }
  };

  const updateForm = (field: string, value: string) => {
    switch (activeModule) {
      case 'ia-copy':
        setCopyForm(prev => ({ ...prev, [field]: value }));
        break;
      case 'ia-produto':
        setProductForm(prev => ({ ...prev, [field]: value }));
        break;
      case 'ia-trafego':
        setTrafficForm(prev => ({ ...prev, [field]: value }));
        break;
      case 'ia-video':
        setVideoForm(prev => ({ ...prev, [field]: value }));
        break;
      case 'ia-analytics':
        setAnalyticsForm(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const renderModuleForm = () => {
    const currentForm = getCurrentForm();

    switch (activeModule) {
      case 'ia-copy':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Nicho (ex: fitness, marketing digital)"
              value={currentForm.niche || ''}
              onChange={(e) => updateForm('niche', e.target.value)}
            />
            <Input
              placeholder="Público-alvo (ex: empresários de 30-45 anos)"
              value={currentForm.targetAudience || ''}
              onChange={(e) => updateForm('targetAudience', e.target.value)}
            />
            <Input
              placeholder="Objetivo (ex: vender curso online)"
              value={currentForm.objective || ''}
              onChange={(e) => updateForm('objective', e.target.value)}
            />
            <Textarea
              placeholder="Prompt específico para o copy..."
              value={currentForm.prompt || ''}
              onChange={(e) => updateForm('prompt', e.target.value)}
              rows={4}
            />
          </div>
        );

      case 'ia-produto':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Ideia do produto (descreva detalhadamente)"
              value={currentForm.idea || ''}
              onChange={(e) => updateForm('idea', e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Mercado-alvo (ex: pequenas empresas)"
              value={currentForm.market || ''}
              onChange={(e) => updateForm('market', e.target.value)}
            />
            <Input
              placeholder="Orçamento disponível (ex: R$ 50.000)"
              value={currentForm.budget || ''}
              onChange={(e) => updateForm('budget', e.target.value)}
            />
            <Input
              placeholder="Timeline (ex: 6 meses)"
              value={currentForm.timeline || ''}
              onChange={(e) => updateForm('timeline', e.target.value)}
            />
          </div>
        );

      case 'ia-trafego':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Descrição do negócio"
              value={currentForm.business || ''}
              onChange={(e) => updateForm('business', e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Orçamento para tráfego (ex: R$ 10.000/mês)"
              value={currentForm.budget || ''}
              onChange={(e) => updateForm('budget', e.target.value)}
            />
            <Input
              placeholder="Objetivos (ex: gerar 100 leads/mês)"
              value={currentForm.goals || ''}
              onChange={(e) => updateForm('goals', e.target.value)}
            />
            <Input
              placeholder="Plataformas preferidas (ex: Google, Facebook, LinkedIn)"
              value={currentForm.platforms || ''}
              onChange={(e) => updateForm('platforms', e.target.value)}
            />
          </div>
        );

      case 'ia-video':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Conceito do vídeo"
              value={currentForm.concept || ''}
              onChange={(e) => updateForm('concept', e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Duração desejada (ex: 5 minutos)"
              value={currentForm.duration || ''}
              onChange={(e) => updateForm('duration', e.target.value)}
            />
            <Input
              placeholder="Estilo (ex: profissional, casual, dinâmico)"
              value={currentForm.style || ''}
              onChange={(e) => updateForm('style', e.target.value)}
            />
            <Input
              placeholder="Objetivo (ex: vendas, educação, branding)"
              value={currentForm.objective || ''}
              onChange={(e) => updateForm('objective', e.target.value)}
            />
          </div>
        );

      case 'ia-analytics':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Descrição do negócio"
              value={currentForm.business || ''}
              onChange={(e) => updateForm('business', e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Métricas importantes (ex: conversões, ROI, CAC)"
              value={currentForm.metrics || ''}
              onChange={(e) => updateForm('metrics', e.target.value)}
            />
            <Input
              placeholder="Objetivos de análise"
              value={currentForm.goals || ''}
              onChange={(e) => updateForm('goals', e.target.value)}
            />
            <Input
              placeholder="Plataformas a monitorar"
              value={currentForm.platforms || ''}
              onChange={(e) => updateForm('platforms', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isFormValid = () => {
    const form = getCurrentForm();
    return Object.values(form).some(value => value && typeof value === 'string' && value.trim() !== '');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {modules.map((module) => {
          const IconComponent = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Card 
              key={module.id}
              className={`cursor-pointer transition-all ${
                isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => setActiveModule(module.id)}
            >
              <CardContent className="p-4 text-center">
                <IconComponent className={`w-8 h-8 mx-auto mb-2 ${module.color}`} />
                <h3 className="font-medium text-sm">{module.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{module.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(modules.find(m => m.id === activeModule)?.icon || Bot, { 
                className: `w-5 h-5 ${modules.find(m => m.id === activeModule)?.color}` 
              })}
              {modules.find(m => m.id === activeModule)?.name} - Execução Real
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderModuleForm()}
            
            <Button
              onClick={() => executeAI(activeModule, getCurrentForm())}
              disabled={loading || !isFormValid()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Executando IA...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Executar com IA Real
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Resultado da Execução
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{result.model}</Badge>
                  <Badge variant="secondary">{result.tokensUsed} tokens</Badge>
                  <Badge variant="secondary">{result.files.length} arquivo(s)</Badge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{result.content}</pre>
                </div>
                
                {result.files.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Arquivos Gerados:</h4>
                    <div className="space-y-2">
                      {result.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                          <div>
                            <span className="font-medium">{file.name}</span>
                            <span className="text-gray-500 ml-2">({file.type.toUpperCase()})</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Execute um módulo para ver os resultados</p>
                <p className="text-sm">Conteúdo gerado por IA real aparecerá aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FileDownloadManager />
    </div>
  );
};

export default RealAIModuleInterface;