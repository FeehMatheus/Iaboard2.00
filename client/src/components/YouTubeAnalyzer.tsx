import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Clock, 
  Eye, 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Video, 
  MessageSquare,
  Star,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Youtube
} from "lucide-react";

interface AnalysisSegment {
  id: number;
  startTime: number;
  endTime: number;
  visualDescription: string;
  audioAnalysis: string;
  emotions: {
    dominant: string;
    confidence: number;
    secondary?: string;
  };
  keyTopics: string[];
  engagementScore: number;
  technicalQuality: {
    audioQuality: number;
    videoQuality: number;
    stability: number;
  };
}

interface ContentInsight {
  id: number;
  type: string;
  timestamp: number;
  description: string;
  confidence: number;
  actionable: string;
  category: string;
}

interface ProgramStructure {
  id: number;
  phase: string;
  startTime: number;
  endTime: number;
  effectiveness: number;
  keyElements: string[];
  improvements: string[];
}

interface Analysis {
  id: number;
  title: string;
  status: string;
  duration: number;
  metadata: {
    thumbnail?: string;
    channelTitle?: string;
    isLive?: boolean;
    overallMetrics?: {
      retentionPotential: number;
      engagementPotential: number;
      monetizationReadiness: number;
      productionQuality: number;
      contentValue: number;
    };
  };
  segments: AnalysisSegment[];
  insights: ContentInsight[];
  structure: ProgramStructure[];
}

export function YouTubeAnalyzer() {
  const [url, setUrl] = useState("https://www.youtube.com/live/PL4rWZ0vg14?si=N2G-iWvqP0-a7Q5Y");
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisId, setAnalysisId] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startAnalysis = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const response = await fetch('/api/youtube/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysisId(result.analysisId);
        // Start polling for results
        pollAnalysis(result.analysisId);
      } else {
        console.error('Analysis failed:', result.error);
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Failed to start analysis:', error);
      setIsAnalyzing(false);
    }
  };

  const pollAnalysis = async (id: number) => {
    try {
      const response = await fetch(`/api/youtube/analysis/${id}`);
      const analysis = await response.json();

      if (analysis.status === 'completed') {
        setCurrentAnalysis(analysis);
        setIsAnalyzing(false);
      } else if (analysis.status === 'failed') {
        console.error('Analysis failed');
        setIsAnalyzing(false);
      } else {
        // Continue polling
        setTimeout(() => pollAnalysis(id), 2000);
      }
    } catch (error) {
      console.error('Failed to poll analysis:', error);
      setIsAnalyzing(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'opening': return 'bg-blue-500';
      case 'hook': return 'bg-green-500';
      case 'content': return 'bg-purple-500';
      case 'interaction': return 'bg-orange-500';
      case 'closing': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'hook': return <Play className="w-4 h-4" />;
      case 'retention': return <Eye className="w-4 h-4" />;
      case 'engagement': return <MessageSquare className="w-4 h-4" />;
      case 'production': return <Video className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-500" />
            <CardTitle>Análise Detalhada do YouTube - Segundo por Segundo</CardTitle>
          </div>
          <CardDescription>
            Análise completa da sua live usando APIs reais de IA para insights profundos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Cole a URL da sua live do YouTube aqui..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={startAnalysis} 
              disabled={isAnalyzing || !url.trim()}
              className="min-w-32"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analisar Live
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                {currentAnalysis.title}
              </CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(currentAnalysis.duration)}
                </span>
                {currentAnalysis.metadata.isLive && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    LIVE
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentAnalysis.metadata.overallMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(currentAnalysis.metadata.overallMetrics.retentionPotential * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Potencial de Retenção</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(currentAnalysis.metadata.overallMetrics.engagementPotential * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Potencial de Engajamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(currentAnalysis.metadata.overallMetrics.monetizationReadiness * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Pronto para Monetização</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(currentAnalysis.metadata.overallMetrics.productionQuality * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Qualidade de Produção</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {Math.round(currentAnalysis.metadata.overallMetrics.contentValue * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Valor do Conteúdo</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline">Timeline Detalhada</TabsTrigger>
              <TabsTrigger value="insights">Insights de Conteúdo</TabsTrigger>
              <TabsTrigger value="structure">Estrutura do Programa</TabsTrigger>
              <TabsTrigger value="segments">Análise por Segmentos</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Segundo por Segundo</CardTitle>
                  <CardDescription>
                    Análise detalhada de cada momento da sua live
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentAnalysis.segments.map((segment, index) => (
                        <div key={segment.id} className="border rounded-lg p-4 hover:bg-muted/50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs">{Math.round(segment.engagementScore * 100)}%</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="capitalize">
                              {segment.emotions.dominant}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Visual:</strong> {segment.visualDescription}
                            </div>
                            <div>
                              <strong>Áudio:</strong> {segment.audioAnalysis}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {segment.keyTopics.map((topic, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <div className="text-muted-foreground">Áudio</div>
                              <Progress value={segment.technicalQuality.audioQuality * 100} className="h-1" />
                            </div>
                            <div>
                              <div className="text-muted-foreground">Vídeo</div>
                              <Progress value={segment.technicalQuality.videoQuality * 100} className="h-1" />
                            </div>
                            <div>
                              <div className="text-muted-foreground">Estabilidade</div>
                              <Progress value={segment.technicalQuality.stability * 100} className="h-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Insights de Conteúdo</CardTitle>
                  <CardDescription>
                    Recomendações baseadas na análise da sua performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentAnalysis.insights.map((insight) => (
                      <div key={insight.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{insight.type}</span>
                              <Badge variant="outline" className="text-xs">
                                {formatTime(insight.timestamp)}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs">{Math.round(insight.confidence * 100)}%</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.description}
                            </p>
                            <div className="bg-blue-50 p-2 rounded text-xs">
                              <strong>Ação Recomendada:</strong> {insight.actionable}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estrutura do Programa</CardTitle>
                  <CardDescription>
                    Análise das fases do seu conteúdo e efetividade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentAnalysis.structure.map((phase) => (
                      <div key={phase.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${getPhaseColor(phase.phase)}`} />
                          <span className="font-medium capitalize">{phase.phase}</span>
                          <Badge variant="outline">
                            {formatTime(phase.startTime)} - {formatTime(phase.endTime)}
                          </Badge>
                          <div className="ml-auto flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{Math.round(phase.effectiveness * 100)}%</span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Elementos Principais:</h4>
                            <div className="flex flex-wrap gap-1">
                              {phase.keyElements.map((element, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {element}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Melhorias Sugeridas:</h4>
                            <ul className="text-xs space-y-1">
                              {phase.improvements.map((improvement, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="segments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visualização dos Segmentos</CardTitle>
                  <CardDescription>
                    Gráfico temporal do engajamento e qualidade técnica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Gráfico de análise temporal</p>
                      <p className="text-xs">Mostrando engajamento por segmento</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {currentAnalysis.segments.length}
                      </div>
                      <div className="text-muted-foreground">Segmentos Analisados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(
                          currentAnalysis.segments.reduce((acc, s) => acc + s.engagementScore, 0) / 
                          currentAnalysis.segments.length * 100
                        )}%
                      </div>
                      <div className="text-muted-foreground">Engajamento Médio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round(
                          currentAnalysis.segments.reduce((acc, s) => acc + s.technicalQuality.audioQuality, 0) / 
                          currentAnalysis.segments.length * 100
                        )}%
                      </div>
                      <div className="text-muted-foreground">Qualidade Média</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500" />
              <div>
                <h3 className="text-lg font-medium">Analisando sua live...</h3>
                <p className="text-muted-foreground">
                  Processamento em andamento usando APIs reais de IA. Aguarde alguns momentos.
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={33} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  Análise segundo por segundo em progresso...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}