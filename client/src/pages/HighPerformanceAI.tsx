import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Search, Brain, Package, Download, Clock, Users, Target } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function HighPerformanceAI() {
  const [prompt, setPrompt] = useState('');
  const [query, setQuery] = useState('');
  const [productType, setProductType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const { toast } = useToast();

  const groqMutation = useMutation({
    mutationFn: async (data: { prompt: string; format: string }) => {
      const response = await fetch('/api/groq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro na geração');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Conteúdo gerado com GROQ!",
        description: `${data.tokens} tokens em ${data.processingTime}ms`,
      });
    },
  });

  const perplexityMutation = useMutation({
    mutationFn: async (data: { query: string; format: string }) => {
      const response = await fetch('/api/perplexity/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro na pesquisa');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Pesquisa concluída!",
        description: `${data.tokens} tokens em ${data.processingTime}ms`,
      });
    },
  });

  const businessMutation = useMutation({
    mutationFn: async (data: { productType: string; targetAudience: string }) => {
      const response = await fetch('/api/smart-business/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro na geração do pacote');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Pacote completo gerado!",
        description: `${data.totalTokens} tokens em ${data.processingTime}ms`,
      });
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          IA de Alta Performance
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Utilize as melhores APIs de IA com limites elevados para gerar conteúdo profissional em segundos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-blue-200">
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-bold text-lg mb-2">GROQ</h3>
            <Badge variant="outline" className="mb-2">14,400 tokens/min</Badge>
            <p className="text-sm text-gray-600">Geração ultrarrápida com Llama</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-bold text-lg mb-2">Perplexity</h3>
            <Badge variant="outline" className="mb-2">Pesquisa em tempo real</Badge>
            <p className="text-sm text-gray-600">Dados atualizados da internet</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-bold text-lg mb-2">HuggingFace</h3>
            <Badge variant="outline" className="mb-2">Centenas de modelos</Badge>
            <p className="text-sm text-gray-600">Acesso gratuito a todos os modelos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="groq" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="groq" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            GROQ
          </TabsTrigger>
          <TabsTrigger value="perplexity" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Perplexity
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Pacote Completo
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Geração Ultrarrápida com GROQ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="groq-prompt">Prompt para Geração</Label>
                <Textarea
                  id="groq-prompt"
                  placeholder="Ex: Crie um copy de vendas para um curso de marketing digital..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => groqMutation.mutate({ prompt, format: 'text' })}
                  disabled={!prompt || groqMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {groqMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Gerar Conteúdo
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => groqMutation.mutate({ prompt, format: 'file' })}
                  disabled={!prompt || groqMutation.isPending}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Gerar e Baixar
                </Button>
              </div>

              {groqMutation.data && (
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">
                        {groqMutation.data.model} - {groqMutation.data.tokens} tokens
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {groqMutation.data.processingTime}ms
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
                      {groqMutation.data.content}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perplexity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-green-500" />
                Pesquisa em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="perplexity-query">Pesquisa de Mercado</Label>
                <Textarea
                  id="perplexity-query"
                  placeholder="Ex: Tendências do mercado de cursos online em 2025..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => perplexityMutation.mutate({ query, format: 'text' })}
                  disabled={!query || perplexityMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {perplexityMutation.isPending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Pesquisando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Pesquisar
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => perplexityMutation.mutate({ query, format: 'file' })}
                  disabled={!query || perplexityMutation.isPending}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Pesquisar e Baixar
                </Button>
              </div>

              {perplexityMutation.data && (
                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">
                        {perplexityMutation.data.model} - {perplexityMutation.data.tokens} tokens
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {perplexityMutation.data.processingTime}ms
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
                      {perplexityMutation.data.content}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                Gerador Completo de Negócio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-type">Tipo de Produto</Label>
                  <Input
                    id="product-type"
                    placeholder="Ex: Curso de marketing digital"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="target-audience">Público-Alvo</Label>
                  <Input
                    id="target-audience"
                    placeholder="Ex: Empreendedores iniciantes"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </div>
              
              <Button
                onClick={() => businessMutation.mutate({ productType, targetAudience })}
                disabled={!productType || !targetAudience || businessMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {businessMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Gerando Pacote Completo...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Gerar Pacote Completo
                  </>
                )}
              </Button>

              {businessMutation.data && (
                <div className="space-y-4">
                  <Card className="bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Pesquisa de Mercado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm max-h-40 overflow-y-auto">
                        {businessMutation.data.marketResearch}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Copy de Vendas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm max-h-40 overflow-y-auto">
                        {businessMutation.data.salesCopy}
                      </pre>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center">
                    <Badge variant="outline" className="text-sm">
                      Arquivo completo salvo nos downloads - {businessMutation.data.totalTokens} tokens
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance das APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {groqMutation.data && (
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold">GROQ</h3>
                    <p className="text-sm text-gray-600">{groqMutation.data.processingTime}ms</p>
                    <p className="text-xs">{groqMutation.data.tokens} tokens</p>
                  </div>
                )}
                
                {perplexityMutation.data && (
                  <div className="text-center p-4 border rounded-lg">
                    <Search className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-semibold">Perplexity</h3>
                    <p className="text-sm text-gray-600">{perplexityMutation.data.processingTime}ms</p>
                    <p className="text-xs">{perplexityMutation.data.tokens} tokens</p>
                  </div>
                )}
                
                {businessMutation.data && (
                  <div className="text-center p-4 border rounded-lg">
                    <Package className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-semibold">Pacote Completo</h3>
                    <p className="text-sm text-gray-600">{businessMutation.data.processingTime}ms</p>
                    <p className="text-xs">{businessMutation.data.totalTokens} tokens</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}