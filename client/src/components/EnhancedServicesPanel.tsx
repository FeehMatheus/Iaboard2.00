import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Image, 
  Video, 
  FileText, 
  BarChart3, 
  Zap, 
  Download,
  Play,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceResult {
  success: boolean;
  url?: string;
  content?: string;
  error?: string;
  metadata?: any;
}

export function EnhancedServicesPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, ServiceResult>>({});
  const { toast } = useToast();

  // Text-to-Speech State
  const [ttsText, setTtsText] = useState('');
  const [ttsLanguage, setTtsLanguage] = useState('pt-BR');
  const [ttsGender, setTtsGender] = useState('female');
  const [ttsStyle, setTtsStyle] = useState('professional');

  // Mistral AI State  
  const [mistralPrompt, setMistralPrompt] = useState('');
  const [mistralType, setMistralType] = useState('copywriting');
  const [mistralOptions, setMistralOptions] = useState({
    style: 'professional',
    tone: 'friendly',
    length: 'medium'
  });

  // Stability AI State
  const [stabilityPrompt, setStabilityPrompt] = useState('');
  const [stabilityType, setStabilityType] = useState('image');
  const [stabilityOptions, setStabilityOptions] = useState({
    width: 1024,
    height: 1024,
    aspectRatio: '16:9'
  });

  // Typeform State
  const [typeformTitle, setTypeformTitle] = useState('');
  const [typeformType, setTypeformType] = useState('market-research');
  const [typeformProduct, setTypeformProduct] = useState('');

  const handleTTSGeneration = async () => {
    if (!ttsText.trim()) {
      toast({
        title: "Texto necessário",
        description: "Digite o texto para converter em áudio",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsText,
          language: ttsLanguage,
          gender: ttsGender,
          style: ttsStyle,
          speed: 'normal'
        })
      });

      const result = await response.json();
      setResults(prev => ({ ...prev, tts: result }));

      if (result.success) {
        toast({
          title: "Áudio Gerado!",
          description: "Conversão de texto para áudio concluída com sucesso"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erro na Geração de Áudio",
        description: error instanceof Error ? error.message : "Falha na conversão",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMistralGeneration = async () => {
    if (!mistralPrompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Digite o prompt para gerar conteúdo",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = `/api/mistral/${mistralType}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: mistralPrompt,
          ...mistralOptions
        })
      });

      const result = await response.json();
      setResults(prev => ({ ...prev, mistral: result }));

      if (result.success) {
        toast({
          title: "Conteúdo Gerado!",
          description: "Geração com Mistral AI concluída com sucesso"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erro na Geração Mistral",
        description: error instanceof Error ? error.message : "Falha na geração",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStabilityGeneration = async () => {
    if (!stabilityPrompt.trim()) {
      toast({
        title: "Prompt necessário",
        description: "Digite o prompt para gerar conteúdo visual",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = `/api/stability/generate-${stabilityType}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: stabilityPrompt,
          ...stabilityOptions
        })
      });

      const result = await response.json();
      setResults(prev => ({ ...prev, stability: result }));

      if (result.success) {
        toast({
          title: "Conteúdo Visual Gerado!",
          description: "Geração com Stability AI concluída com sucesso"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erro na Geração Visual",
        description: error instanceof Error ? error.message : "Falha na geração",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeformCreation = async () => {
    if (!typeformTitle.trim()) {
      toast({
        title: "Título necessário",
        description: "Digite o título do formulário",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = `/api/typeform/${typeformType}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: typeformProduct || typeformTitle,
          service: typeformTitle,
          company: 'IA Board',
          offer: typeformTitle,
          incentive: '20% de desconto'
        })
      });

      const result = await response.json();
      setResults(prev => ({ ...prev, typeform: result }));

      if (result.success) {
        toast({
          title: "Formulário Criado!",
          description: "Typeform criado com sucesso"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erro na Criação do Formulário",
        description: error instanceof Error ? error.message : "Falha na criação",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = (result?: ServiceResult) => {
    if (!result) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    if (result.success) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          IA Board - Serviços Avançados
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Plataforma integrada com Google TTS, Mistral AI, Stability AI e Typeform
        </p>
      </div>

      <Tabs defaultValue="tts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tts" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Text-to-Speech
          </TabsTrigger>
          <TabsTrigger value="mistral" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Mistral AI
          </TabsTrigger>
          <TabsTrigger value="stability" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Stability AI
          </TabsTrigger>
          <TabsTrigger value="typeform" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Typeform
          </TabsTrigger>
        </TabsList>

        {/* Google Text-to-Speech Tab */}
        <TabsContent value="tts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Google Text-to-Speech
                {getResultIcon(results.tts)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={ttsLanguage} onValueChange={setTtsLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                    <SelectItem value="fr-FR">Français</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ttsGender} onValueChange={setTtsGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Voz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Feminina</SelectItem>
                    <SelectItem value="male">Masculina</SelectItem>
                    <SelectItem value="neutral">Neutra</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ttsStyle} onValueChange={setTtsStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="conversational">Conversacional</SelectItem>
                    <SelectItem value="dramatic">Dramático</SelectItem>
                    <SelectItem value="calm">Calmo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Digite o texto para converter em áudio..."
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                className="min-h-[100px]"
              />

              <div className="flex gap-2">
                <Button 
                  onClick={handleTTSGeneration} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  Gerar Áudio
                </Button>
                
                {results.tts?.audioUrl && (
                  <Button variant="outline" asChild>
                    <a href={results.tts.audioUrl} download>
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              {results.tts?.audioUrl && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <audio controls className="w-full">
                    <source src={results.tts.audioUrl} type="audio/mpeg" />
                  </audio>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>Duração: {results.tts.metadata?.estimatedDuration}s</p>
                    <p>Voz: {results.tts.voiceInfo?.name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mistral AI Tab */}
        <TabsContent value="mistral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Mistral AI
                {getResultIcon(results.mistral)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={mistralType} onValueChange={setMistralType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Geração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copywriting">Copywriting</SelectItem>
                    <SelectItem value="product-strategy">Estratégia de Produto</SelectItem>
                    <SelectItem value="traffic-strategy">Estratégia de Tráfego</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={mistralOptions.style} 
                  onValueChange={(value) => setMistralOptions(prev => ({...prev, style: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="persuasive">Persuasivo</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={mistralOptions.length} 
                  onValueChange={(value) => setMistralOptions(prev => ({...prev, length: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Curto</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="long">Longo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Digite seu prompt para geração de conteúdo..."
                value={mistralPrompt}
                onChange={(e) => setMistralPrompt(e.target.value)}
                className="min-h-[100px]"
              />

              <Button 
                onClick={handleMistralGeneration} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                Gerar Conteúdo
              </Button>

              {results.mistral?.content && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Conteúdo Gerado:</h4>
                  <div className="whitespace-pre-wrap text-sm">{results.mistral.content}</div>
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    Tokens: {results.mistral.metadata?.totalTokens} | Modelo: {results.mistral.model}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stability AI Tab */}
        <TabsContent value="stability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Stability AI
                {getResultIcon(results.stability)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={stabilityType} onValueChange={setStabilityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Largura"
                  value={stabilityOptions.width}
                  onChange={(e) => setStabilityOptions(prev => ({...prev, width: parseInt(e.target.value) || 1024}))}
                />

                <Input
                  type="number"
                  placeholder="Altura"
                  value={stabilityOptions.height}
                  onChange={(e) => setStabilityOptions(prev => ({...prev, height: parseInt(e.target.value) || 1024}))}
                />
              </div>

              <Textarea
                placeholder="Descreva a imagem ou vídeo que deseja gerar..."
                value={stabilityPrompt}
                onChange={(e) => setStabilityPrompt(e.target.value)}
                className="min-h-[100px]"
              />

              <Button 
                onClick={handleStabilityGeneration} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Image className="w-4 h-4 mr-2" />}
                Gerar {stabilityType === 'image' ? 'Imagem' : 'Vídeo'}
              </Button>

              {results.stability?.imageUrl && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Resultado:</h4>
                  <img 
                    src={results.stability.imageUrl} 
                    alt="Generated content" 
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                  <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                    Resolução: {results.stability.metadata?.resolution} | Seed: {results.stability.metadata?.seed}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typeform Tab */}
        <TabsContent value="typeform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Typeform
                {getResultIcon(results.typeform)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={typeformType} onValueChange={setTypeformType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Formulário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market-research">Pesquisa de Mercado</SelectItem>
                    <SelectItem value="customer-feedback">Feedback de Cliente</SelectItem>
                    <SelectItem value="lead-capture">Captura de Leads</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Produto/Serviço (opcional)"
                  value={typeformProduct}
                  onChange={(e) => setTypeformProduct(e.target.value)}
                />
              </div>

              <Input
                placeholder="Título do formulário..."
                value={typeformTitle}
                onChange={(e) => setTypeformTitle(e.target.value)}
              />

              <Button 
                onClick={handleTypeformCreation} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                Criar Formulário
              </Button>

              {results.typeform?.formUrl && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Formulário Criado!</h4>
                  <div className="space-y-2">
                    <Button variant="outline" asChild className="w-full">
                      <a href={results.typeform.formUrl} target="_blank" rel="noopener noreferrer">
                        Ver Formulário
                      </a>
                    </Button>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      ID: {results.typeform.formId} | Campos: {results.typeform.metadata?.fieldsCount}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Status dos Serviços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Google TTS', key: 'tts', icon: Mic },
              { name: 'Mistral AI', key: 'mistral', icon: Zap },
              { name: 'Stability AI', key: 'stability', icon: Image },
              { name: 'Typeform', key: 'typeform', icon: FileText }
            ].map(service => {
              const ServiceIcon = service.icon;
              const result = results[service.key];
              const status = result?.success ? 'success' : result?.error ? 'error' : 'idle';
              
              return (
                <div 
                  key={service.key}
                  className={`p-3 rounded-lg border-2 ${
                    status === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                    status === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    'border-gray-300 bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ServiceIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <Badge 
                    variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}
                    className="mt-1"
                  >
                    {status === 'success' ? 'Funcionando' : status === 'error' ? 'Erro' : 'Aguardando'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}