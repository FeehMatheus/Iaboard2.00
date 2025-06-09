import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Download, 
  Loader2, 
  FileText, 
  Video, 
  Mail, 
  Search,
  Sparkles 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ContentGeneratorProps {
  productType?: string;
}

export default function ContentGenerator({ productType = '' }: ContentGeneratorProps) {
  const [activeTab, setActiveTab] = useState('copy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();

  const [inputs, setInputs] = useState({
    copy: { type: 'headline', context: productType },
    competitor: { url: '', productType },
    vsl: { productInfo: productType, duration: '10 minutos' },
    landing: { productInfo: productType },
    emails: { productInfo: productType, sequenceLength: 5 }
  });

  const handleInputChange = (tab: string, field: string, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value }
    }));
  };

  const generateContent = async (type: string) => {
    setIsGenerating(true);
    
    try {
      let response;
      
      switch (type) {
        case 'copy':
          response = await apiRequest('POST', '/api/ai/generate-copy', inputs.copy);
          break;
        case 'competitor':
          response = await apiRequest('POST', '/api/ai/analyze-competitor', inputs.competitor);
          break;
        case 'vsl':
          response = await apiRequest('POST', '/api/ai/generate-vsl', inputs.vsl);
          break;
        case 'landing':
          response = await apiRequest('POST', '/api/ai/generate-landing', inputs.landing);
          break;
        case 'emails':
          response = await apiRequest('POST', '/api/ai/generate-emails', inputs.emails);
          break;
        default:
          throw new Error('Tipo inválido');
      }

      const data = await response.json();
      setResults(prev => ({ ...prev, [type]: data }));
      
      toast({
        title: "Conteúdo gerado!",
        description: "Seu conteúdo está pronto para uso"
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Erro na geração",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência"
    });
  };

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Download concluído",
      description: `Arquivo ${filename} baixado`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Gerador de Conteúdo IA
        </h2>
        <p className="text-muted-foreground">
          Crie conteúdo profissional com inteligência artificial
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="copy" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Copy
          </TabsTrigger>
          <TabsTrigger value="competitor" className="flex items-center gap-1">
            <Search className="w-4 h-4" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="vsl" className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            VSL
          </TabsTrigger>
          <TabsTrigger value="landing" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Landing
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            E-mails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerador de Copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="copyType">Tipo de Copy</Label>
                <select 
                  id="copyType"
                  className="w-full p-2 border rounded"
                  value={inputs.copy.type}
                  onChange={(e) => handleInputChange('copy', 'type', e.target.value)}
                >
                  <option value="headline">Headline</option>
                  <option value="subheadline">Subheadline</option>
                  <option value="cta">Call-to-Action</option>
                  <option value="benefits">Lista de Benefícios</option>
                  <option value="social-proof">Prova Social</option>
                </select>
              </div>
              <div>
                <Label htmlFor="copyContext">Contexto do Produto</Label>
                <Textarea
                  id="copyContext"
                  placeholder="Descreva seu produto/serviço..."
                  value={inputs.copy.context}
                  onChange={(e) => handleInputChange('copy', 'context', e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={() => generateContent('copy')} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Gerar Copy
              </Button>
              
              {results.copy && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">Gerado com IA</Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(results.copy.content)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadContent(results.copy.content, 'copy.txt')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {results.copy.content}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Concorrentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="competitorUrl">URL ou Descrição do Concorrente</Label>
                <Input
                  id="competitorUrl"
                  placeholder="https://concorrente.com ou descrição"
                  value={inputs.competitor.url}
                  onChange={(e) => handleInputChange('competitor', 'url', e.target.value)}
                />
              </div>
              <Button 
                onClick={() => generateContent('competitor')} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Analisar Concorrente
              </Button>
              
              {results.competitor && (
                <Card className="mt-4">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Pontos Fortes</h4>
                        <ul className="space-y-1">
                          {results.competitor.strengths?.map((item: string, i: number) => (
                            <li key={i} className="text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Pontos Fracos</h4>
                        <ul className="space-y-1">
                          {results.competitor.weaknesses?.map((item: string, i: number) => (
                            <li key={i} className="text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Oportunidades</h4>
                      <ul className="space-y-1">
                        {results.competitor.opportunities?.map((item: string, i: number) => (
                          <li key={i} className="text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vsl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roteiro de VSL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vslProduct">Informações do Produto</Label>
                <Textarea
                  id="vslProduct"
                  placeholder="Descreva seu produto/serviço..."
                  value={inputs.vsl.productInfo}
                  onChange={(e) => handleInputChange('vsl', 'productInfo', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="vslDuration">Duração Desejada</Label>
                <Input
                  id="vslDuration"
                  placeholder="Ex: 10 minutos, 5 minutos..."
                  value={inputs.vsl.duration}
                  onChange={(e) => handleInputChange('vsl', 'duration', e.target.value)}
                />
              </div>
              <Button 
                onClick={() => generateContent('vsl')} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Video className="w-4 h-4 mr-2" />
                )}
                Gerar Roteiro VSL
              </Button>
              
              {results.vsl && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold">{results.vsl.title}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadContent(results.vsl.script, 'roteiro-vsl.txt')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Gancho:</strong> {results.vsl.hook}
                      </div>
                      <div>
                        <strong>Problema:</strong> {results.vsl.problem}
                      </div>
                      <div>
                        <strong>Solução:</strong> {results.vsl.solution}
                      </div>
                      <div>
                        <strong>CTA:</strong> {results.vsl.cta}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="landingProduct">Informações do Produto</Label>
                <Textarea
                  id="landingProduct"
                  placeholder="Descreva seu produto/serviço..."
                  value={inputs.landing.productInfo}
                  onChange={(e) => handleInputChange('landing', 'productInfo', e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={() => generateContent('landing')} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Gerar Landing Page
              </Button>
              
              {results.landing && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline">HTML Gerado</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadContent(results.landing.html, 'landing-page.html')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar HTML
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                      <code>{results.landing.html}</code>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sequência de E-mails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailProduct">Informações do Produto</Label>
                <Textarea
                  id="emailProduct"
                  placeholder="Descreva seu produto/serviço..."
                  value={inputs.emails.productInfo}
                  onChange={(e) => handleInputChange('emails', 'productInfo', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="emailCount">Quantidade de E-mails</Label>
                <Input
                  id="emailCount"
                  type="number"
                  min="3"
                  max="10"
                  value={inputs.emails.sequenceLength}
                  onChange={(e) => handleInputChange('emails', 'sequenceLength', parseInt(e.target.value))}
                />
              </div>
              <Button 
                onClick={() => generateContent('emails')} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Gerar Sequência
              </Button>
              
              {results.emails && (
                <div className="space-y-3">
                  {results.emails.emails?.map((email: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">Dia {email.day}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(email.content)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <h5 className="font-semibold mb-2">{email.subject}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{email.goal}</p>
                        <div className="text-sm bg-gray-50 p-2 rounded max-h-32 overflow-auto">
                          {email.content}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}