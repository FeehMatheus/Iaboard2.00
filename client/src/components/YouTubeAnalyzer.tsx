import React, { useState, useEffect } from "react";
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

import { 
  Zap,
  Crown,
  Rocket
} from 'lucide-react';

interface AnalysisResult {
  id: number;
  videoInfo: {
    title: string;
    duration: number;
    thumbnail: string;
    channelTitle: string;
    isLive: boolean;
  };
  overallMetrics: {
    engagementScore: number;
    persuasionLevel: number;
    contentQuality: number;
    marketingEffectiveness: number;
  };
  segments: Array<{
    startTime: number;
    endTime: number;
    transcript: string;
    visualDescription: string;
    audioAnalysis: string;
    emotions: any;
    keyTopics: string[];
    engagementScore: number;
  }>;
  insights: Array<{
    insightType: string;
    timestamp: number;
    description: string;
    confidence: number;
    actionable: string;
    category: string;
  }>;
  structure: Array<{
    sectionType: string;
    startTime: number;
    endTime: number;
    description: string;
    effectiveness: number;
    improvements: string;
  }>;
}

export const YouTubeAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const analyzeVideo = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep('Iniciando análise superior ao Furion...');

    try {
      const response = await fetch('/api/furion/superior-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        // Simular progresso com etapas avançadas
        const steps = [
          '🚀 Extraindo dados do vídeo...',
          '🧠 Análise de IA avançada do conteúdo...',
          '🎯 Identificando gatilhos psicológicos...',
          '💡 Analisando estratégias de copywriting...',
          '📊 Avaliando métricas de performance...',
          '🔍 Detectando oportunidades de melhoria...',
          '💰 Calculando potencial de monetização...',
          '✨ Gerando insights superiores...'
        ];

        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(steps[i]);
          setProgress((i + 1) * (100 / steps.length));
          await new Promise(resolve => setTimeout(resolve, 1200));
        }

        // Buscar resultado da análise
        const resultResponse = await fetch(`/api/youtube/analysis/${data.analysisId}`);
        const result = await resultResponse.json();

        setAnalysisResult(result);
        setCurrentStep('✅ Análise concluída com sucesso!');
      } else {
        console.error('Erro na análise:', data.error);
        setCurrentStep('❌ Erro na análise');
      }
    } catch (error) {
      console.error('Erro:', error);
      setCurrentStep('❌ Erro de conexão');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setProgress(0);
        setCurrentStep('');
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <CardTitle>Sistema Superior ao Furion - Análise Avançada</CardTitle>
          </div>
          <CardDescription>
            Análise completa com tecnologias superiores: transcrição em tempo real, gatilhos psicológicos, oportunidades de monetização e inteligência competitiva
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
              onClick={analyzeVideo} 
              disabled={isAnalyzing || !url.trim()}
              className="min-w-32"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {currentStep || 'Analisando...'}
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analisar Live
                </>
              )}
            </Button>
          </div>
          {isAnalyzing && (
            <Progress value={progress} className="mt-4" />
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                {analysisResult.videoInfo.title}
              </CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(analysisResult.videoInfo.duration)}
                </span>
                {analysisResult.videoInfo.isLive && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    LIVE
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {analysisResult.overallMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(analysisResult.overallMetrics.engagementScore * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Engajamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(analysisResult.overallMetrics.persuasionLevel * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Persuasão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(analysisResult.overallMetrics.contentQuality * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Qualidade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(analysisResult.overallMetrics.marketingEffectiveness * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Marketing</div>
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
                      {analysisResult.segments.map((segment, index) => (
                        <div key={segment.startTime} className="border rounded-lg p-4 hover:bg-muted/50">
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
                            {/* Badge para emoções aqui, se necessário */}
                          </div>

                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Transcrição:</strong> {segment.transcript}
                            </div>
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
                    {analysisResult.insights.map((insight) => (
                      <div key={insight.timestamp} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {getInsightIcon(insight.insightType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{insight.insightType}</span>
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
                    {analysisResult.structure.map((section) => (
                      <div key={section.startTime} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${getPhaseColor(section.sectionType)}`} />
                          <span className="font-medium capitalize">{section.sectionType}</span>
                          <Badge variant="outline">
                            {formatTime(section.startTime)} - {formatTime(section.endTime)}
                          </Badge>
                          <div className="ml-auto flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{Math.round(section.effectiveness * 100)}%</span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Descrição:</h4>
                            <p className="text-sm">{section.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Melhorias Sugeridas:</h4>
                            <ul className="text-xs space-y-1">
                              <li className="flex items-start gap-1">
                                <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {section.improvements}
                              </li>
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}