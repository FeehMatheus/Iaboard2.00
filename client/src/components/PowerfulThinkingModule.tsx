import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  Search, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Download,
  Eye,
  GitBranch,
  Layers,
  TrendingUp,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PowerfulThinkingModuleProps {
  data: {
    problema?: string;
    profundidade?: string;
  };
  isConnectable: boolean;
}

interface ThinkingRequest {
  problema: string;
  contexto?: string;
  objetivo?: string;
  restricoes?: string[];
  profundidade?: 'superficial' | 'moderada' | 'profunda' | 'expert';
  perspectivas?: string[];
}

interface ThinkingLayer {
  camada: number;
  nome: string;
  tipo: 'analise' | 'sintese' | 'critica' | 'criativa' | 'estrategica';
  pensamento: string;
  insights: string[];
  conexoes: string[];
  tempo_processamento: number;
}

interface ThinkingResult {
  problema_original: string;
  camadas_pensamento: ThinkingLayer[];
  sintese_final: {
    solucao_principal: string;
    alternativas: string[];
    riscos_identificados: string[];
    oportunidades: string[];
    proximos_passos: string[];
    grau_confianca: number;
  };
  mapa_mental: {
    conceito_central: string;
    ramificacoes: Array<{
      categoria: string;
      subcategorias: string[];
      conexoes: string[];
    }>;
  };
  metadata: {
    tempo_total_processamento: number;
    camadas_processadas: number;
    complexidade_detectada: string;
    recomendacao_implementacao: string;
  };
}

export function PowerfulThinkingModule({ data, isConnectable }: PowerfulThinkingModuleProps) {
  const { toast } = useToast();
  const [thinkingRequest, setThinkingRequest] = useState<ThinkingRequest>({
    problema: data.problema || '',
    contexto: '',
    objetivo: '',
    restricoes: [],
    profundidade: (data.profundidade as any) || 'moderada',
    perspectivas: []
  });
  
  const [thinkingResult, setThinkingResult] = useState<ThinkingResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set());

  // Análise rápida mutation
  const quickAnalysisMutation = useMutation({
    mutationFn: async (problema: string) => {
      const response = await fetch('/api/ia-pensamento-poderoso/analise-rapida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problema }),
      });
      if (!response.ok) throw new Error('Falha na análise rápida');
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Análise Rápida Completa",
        description: `Complexidade: ${result.analise.complexidade} | Categoria: ${result.analise.categoria}`,
      });
    }
  });

  // Processamento principal mutation
  const processThinkingMutation = useMutation({
    mutationFn: async (request: ThinkingRequest) => {
      const response = await fetch('/api/ia-pensamento-poderoso/processar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Falha no processamento de pensamento');
      return response.json();
    },
    onSuccess: (result) => {
      setThinkingResult(result.resultado);
      setActiveTab('analysis');
      toast({
        title: "Pensamento Poderoso Completo!",
        description: `${result.metadata.camadasProcessadas} camadas processadas | Confiança: ${result.resultado.sintese_final.grau_confianca}%`,
      });
    }
  });

  const handleQuickAnalysis = () => {
    if (!thinkingRequest.problema.trim()) {
      toast({
        title: "Problema Obrigatório",
        description: "Digite um problema para análise",
        variant: "destructive"
      });
      return;
    }
    
    quickAnalysisMutation.mutate(thinkingRequest.problema);
  };

  const handleProcessThinking = () => {
    if (!thinkingRequest.problema.trim()) {
      toast({
        title: "Problema Obrigatório",
        description: "Digite um problema para análise completa",
        variant: "destructive"
      });
      return;
    }
    
    processThinkingMutation.mutate(thinkingRequest);
  };

  const toggleLayerExpansion = (layerNumber: number) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerNumber)) {
      newExpanded.delete(layerNumber);
    } else {
      newExpanded.add(layerNumber);
    }
    setExpandedLayers(newExpanded);
  };

  const getLayerIcon = (tipo: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'analise': <Search className="w-4 h-4" />,
      'sintese': <GitBranch className="w-4 h-4" />,
      'critica': <Eye className="w-4 h-4" />,
      'criativa': <Lightbulb className="w-4 h-4" />,
      'estrategica': <Target className="w-4 h-4" />
    };
    return iconMap[tipo] || <Brain className="w-4 h-4" />;
  };

  const getLayerColor = (tipo: string) => {
    const colorMap: { [key: string]: string } = {
      'analise': 'bg-blue-100 text-blue-800',
      'sintese': 'bg-green-100 text-green-800',
      'critica': 'bg-orange-100 text-orange-800',
      'criativa': 'bg-purple-100 text-purple-800',
      'estrategica': 'bg-red-100 text-red-800'
    };
    return colorMap[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Alta': return 'text-red-600';
      case 'Média': return 'text-yellow-600';
      case 'Baixa': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6" />
          IA de Pensamento Poderoso
        </CardTitle>
        <p className="text-indigo-100">
          Sistema avançado de análise cognitiva multi-camadas para resolução de problemas complexos
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="input">Configuração</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
            <TabsTrigger value="synthesis">Síntese</TabsTrigger>
            <TabsTrigger value="mindmap">Mapa Mental</TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="problema" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Problema ou Desafio *
                  </Label>
                  <Textarea
                    id="problema"
                    placeholder="Descreva detalhadamente o problema que precisa resolver..."
                    value={thinkingRequest.problema}
                    onChange={(e) => setThinkingRequest(prev => ({ 
                      ...prev, 
                      problema: e.target.value 
                    }))}
                    className="mt-2"
                    rows={4}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleQuickAnalysis}
                    disabled={!thinkingRequest.problema.trim() || quickAnalysisMutation.isPending}
                  >
                    {quickAnalysisMutation.isPending ? (
                      "Analisando..."
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        Análise Rápida
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="contexto">Contexto Adicional</Label>
                  <Textarea
                    id="contexto"
                    placeholder="Informações de contexto relevantes..."
                    value={thinkingRequest.contexto}
                    onChange={(e) => setThinkingRequest(prev => ({ 
                      ...prev, 
                      contexto: e.target.value 
                    }))}
                    className="mt-2"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="objetivo">Objetivo Desejado</Label>
                  <Textarea
                    id="objetivo"
                    placeholder="O que você espera alcançar com a solução..."
                    value={thinkingRequest.objetivo}
                    onChange={(e) => setThinkingRequest(prev => ({ 
                      ...prev, 
                      objetivo: e.target.value 
                    }))}
                    className="mt-2"
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Profundidade da Análise</Label>
                  <Select 
                    value={thinkingRequest.profundidade} 
                    onValueChange={(value: 'superficial' | 'moderada' | 'profunda' | 'expert') => 
                      setThinkingRequest(prev => ({ 
                        ...prev, 
                        profundidade: value 
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superficial">Superficial (2-3 camadas)</SelectItem>
                      <SelectItem value="moderada">Moderada (4 camadas)</SelectItem>
                      <SelectItem value="profunda">Profunda (5 camadas)</SelectItem>
                      <SelectItem value="expert">Expert (6 camadas + meta-análise)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {quickAnalysisMutation.data && (
                  <Card className="border-l-4 border-blue-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Análise Rápida</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Complexidade:</span>
                          <Badge className={getComplexityColor(quickAnalysisMutation.data.analise.complexidade)}>
                            {quickAnalysisMutation.data.analise.complexidade}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Categoria:</span>
                          <span className="font-medium">{quickAnalysisMutation.data.analise.categoria}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impacto:</span>
                          <span className="font-medium">{quickAnalysisMutation.data.analise.impacto_estimado}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Urgência:</span>
                          <span className="font-medium">{quickAnalysisMutation.data.analise.urgencia}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          <strong>Recomendação:</strong> Análise {quickAnalysisMutation.data.analise.recomendacao_profundidade}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="pt-4">
                  <Button 
                    onClick={handleProcessThinking}
                    disabled={!thinkingRequest.problema.trim() || processThinkingMutation.isPending}
                    size="lg"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    {processThinkingMutation.isPending ? (
                      <>
                        <Brain className="w-5 h-5 mr-2 animate-pulse" />
                        Processando Pensamento...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Iniciar Análise Poderosa
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6 mt-6">
            {thinkingResult ? (
              <>
                {/* Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {thinkingResult.camadas_pensamento.length}
                      </div>
                      <div className="text-sm text-gray-600">Camadas</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {thinkingResult.sintese_final.grau_confianca}%
                      </div>
                      <div className="text-sm text-gray-600">Confiança</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(thinkingResult.metadata.tempo_total_processamento / 1000)}s
                      </div>
                      <div className="text-sm text-gray-600">Processamento</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getComplexityColor(thinkingResult.metadata.complexidade_detectada)}`}>
                        {thinkingResult.metadata.complexidade_detectada}
                      </div>
                      <div className="text-sm text-gray-600">Complexidade</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Thinking Layers */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Camadas de Pensamento
                  </h3>
                  <div className="space-y-4">
                    {thinkingResult.camadas_pensamento.map((layer) => (
                      <Card key={layer.camada} className="border-l-4 border-indigo-500">
                        <Collapsible>
                          <CollapsibleTrigger 
                            className="w-full"
                            onClick={() => toggleLayerExpansion(layer.camada)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {expandedLayers.has(layer.camada) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                  <Badge className={getLayerColor(layer.tipo)}>
                                    {getLayerIcon(layer.tipo)}
                                    <span className="ml-1">Camada {layer.camada}</span>
                                  </Badge>
                                  <span className="font-medium">{layer.nome}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  {layer.tempo_processamento}ms
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="px-4 pb-4">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-medium mb-2">Análise:</h5>
                                  <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded">
                                    {layer.pensamento}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="font-medium mb-2">Insights:</h5>
                                    <ul className="space-y-1">
                                      {layer.insights.map((insight, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                          <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                          <span>{insight}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-medium mb-2">Conexões:</h5>
                                    <ul className="space-y-1">
                                      {layer.conexoes.map((conexao, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                          <GitBranch className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                          <span>{conexao}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Execute uma análise na aba Configuração para ver as camadas de pensamento
                </p>
              </div>
            )}
          </TabsContent>

          {/* Synthesis Tab */}
          <TabsContent value="synthesis" className="space-y-6 mt-6">
            {thinkingResult ? (
              <div className="space-y-6">
                {/* Main Solution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Solução Principal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{thinkingResult.sintese_final.solucao_principal}</p>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Grau de Confiança</span>
                      </div>
                      <Progress value={thinkingResult.sintese_final.grau_confianca} className="h-2" />
                      <span className="text-sm text-gray-600 mt-1 block">
                        {thinkingResult.sintese_final.grau_confianca}% de confiança na solução
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid of sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alternatives */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Alternativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {thinkingResult.sintese_final.alternativas.map((alt, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{alt}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Risks */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Riscos Identificados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {thinkingResult.sintese_final.riscos_identificados.map((risco, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span>{risco}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Opportunities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Oportunidades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {thinkingResult.sintese_final.oportunidades.map((oportunidade, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{oportunidade}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        Próximos Passos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {thinkingResult.sintese_final.proximos_passos.map((passo, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-xs">
                              {idx + 1}
                            </Badge>
                            <span>{passo}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                {/* Implementation Recommendation */}
                <Card className="border-l-4 border-green-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Recomendação de Implementação</h4>
                    <p className="text-sm text-gray-700">{thinkingResult.metadata.recomendacao_implementacao}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Execute uma análise para ver a síntese e soluções
                </p>
              </div>
            )}
          </TabsContent>

          {/* Mind Map Tab */}
          <TabsContent value="mindmap" className="space-y-6 mt-6">
            {thinkingResult ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      Mapa Mental Cognitivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
                        {thinkingResult.mapa_mental.conceito_central}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {thinkingResult.mapa_mental.ramificacoes.map((ramificacao, idx) => (
                        <Card key={idx} className="border-t-4 border-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-3 text-center">{ramificacao.categoria}</h4>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 mb-2">Subcategorias:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {ramificacao.subcategorias.map((sub, subIdx) => (
                                    <Badge key={subIdx} variant="secondary" className="text-xs">
                                      {sub}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 mb-2">Conexões:</h5>
                                <ul className="space-y-1">
                                  {ramificacao.conexoes.map((conexao, conIdx) => (
                                    <li key={conIdx} className="flex items-center gap-2 text-xs">
                                      <ArrowRight className="w-3 h-3 text-gray-400" />
                                      <span>{conexao}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Execute uma análise para visualizar o mapa mental cognitivo
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}