import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Zap,
  Award,
  ArrowRight,
  RefreshCw,
  Eye,
  MousePointer,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvancedAnalyticsProps {
  currentBoard: any;
}

interface FunnelInsight {
  type: 'conversion' | 'engagement' | 'optimization' | 'bottleneck';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionable: boolean;
  priority: number;
}

interface PerformanceRecommendation {
  category: 'structure' | 'content' | 'flow' | 'timing' | 'targeting';
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  implementation: string;
  expectedImprovement: string;
  timeToImplement: string;
}

interface NodeHeatmap {
  nodeId: string;
  engagementScore: number;
  conversionContribution: number;
  timeSpent: number;
  exitRate: number;
  temperature: 'hot' | 'warm' | 'cool' | 'cold';
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ currentBoard }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const { toast } = useToast();

  const generateAnalytics = async () => {
    if (!currentBoard || currentBoard.nodes.length === 0) {
      toast({
        title: "Funil vazio",
        description: "Adicione módulos para gerar análises",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/funnel/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funnelData: currentBoard,
          timeRange
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAnalytics(result.data);
        toast({
          title: "Análise avançada concluída",
          description: "Insights e recomendações gerados",
        });
      } else {
        throw new Error(result.error || 'Erro na análise');
      }
    } catch (error) {
      console.error('Erro ao gerar analytics:', error);
      
      // Generate mock analytics for demonstration
      setAnalytics(generateMockAnalytics());
      
      toast({
        title: "Análise simulada",
        description: "Dados demonstrativos gerados",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    return {
      insights: [
        {
          type: 'conversion',
          severity: 'high',
          title: 'Taxa de conversão abaixo da média',
          description: 'Conversão atual de 2.1% vs média da indústria de 3.2%',
          impact: 'Perda de 34% do potencial de conversão',
          actionable: true,
          priority: 1
        },
        {
          type: 'bottleneck',
          severity: 'critical',
          title: 'Gargalo crítico identificado',
          description: '45% dos usuários abandonam no segundo módulo',
          impact: 'Principal ponto de perda no funil',
          actionable: true,
          priority: 2
        }
      ],
      recommendations: [
        {
          category: 'content',
          impact: 'high',
          effort: 'medium',
          title: 'Otimizar call-to-action',
          description: 'Melhorar CTAs com copy mais persuasivo',
          implementation: 'Testar diferentes variações de texto e posicionamento',
          expectedImprovement: '15-25% de aumento na conversão',
          timeToImplement: '2-3 horas'
        },
        {
          category: 'flow',
          impact: 'medium',
          effort: 'low',
          title: 'Simplificar jornada do usuário',
          description: 'Reduzir passos desnecessários no fluxo',
          implementation: 'Remover ou combinar etapas redundantes',
          expectedImprovement: '10-15% de redução no abandono',
          timeToImplement: '1 hora'
        }
      ],
      benchmarks: {
        industryAverage: { conversionRate: 3.2, averageTime: 180, dropOffRate: 78 },
        yourPerformance: { conversionRate: 2.1, averageTime: 245, dropOffRate: 85 },
        percentile: 25,
        competitivePosition: 'below_average'
      },
      trends: {
        conversionTrend: 'declining',
        engagementTrend: 'stable',
        velocityChange: -0.3,
        predictedPerformance: { nextWeek: 1.9, nextMonth: 1.7, confidence: 0.82 }
      },
      heatmap: currentBoard.nodes.map((node: any, index: number) => ({
        nodeId: node.id,
        engagementScore: Math.random() * 100,
        conversionContribution: Math.random() * 20,
        timeSpent: Math.random() * 120 + 30,
        exitRate: Math.random() * 40,
        temperature: index === 1 ? 'cold' : index === 0 ? 'hot' : 'warm'
      }))
    };
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Activity className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-orange-400';
      case 'cool': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <ArrowRight className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Analytics Avançados</h2>
                <p className="text-indigo-100">Performance inteligente do funil</p>
              </div>
            </div>
            <Button
              onClick={generateAnalytics}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 border-white/30"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Analisando...' : 'Gerar Análise'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {analytics && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversão</p>
                      <p className="text-xl font-bold">{analytics.benchmarks.yourPerformance.conversionRate.toFixed(1)}%</p>
                      <div className="flex items-center gap-1 text-xs">
                        {getTrendIcon(analytics.trends.conversionTrend)}
                        <span className={analytics.trends.conversionTrend === 'improving' ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(analytics.trends.velocityChange).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      <p className="text-xl font-bold">{Math.round(analytics.benchmarks.yourPerformance.averageTime)}s</p>
                      <div className="flex items-center gap-1 text-xs">
                        {getTrendIcon(analytics.trends.engagementTrend)}
                        <span className="text-gray-600">estável</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Saída</p>
                      <p className="text-xl font-bold">{analytics.benchmarks.yourPerformance.dropOffRate.toFixed(0)}%</p>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-orange-600" />
                        <span className="text-orange-600">alto</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Percentil</p>
                      <p className="text-xl font-bold">{analytics.benchmarks.percentile}º</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          analytics.benchmarks.competitivePosition === 'leading' ? 'border-green-500 text-green-700' :
                          analytics.benchmarks.competitivePosition === 'above_average' ? 'border-blue-500 text-blue-700' :
                          analytics.benchmarks.competitivePosition === 'average' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }`}
                      >
                        {analytics.benchmarks.competitivePosition.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Tendências e Previsões</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Previsão de Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Próxima Semana:</span>
                        <span className="font-medium">{analytics.trends.predictedPerformance.nextWeek.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Próximo Mês:</span>
                        <span className="font-medium">{analytics.trends.predictedPerformance.nextMonth.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Confiança:</span>
                        <Progress value={analytics.trends.predictedPerformance.confidence * 100} className="w-20" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Mudanças Recentes</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(analytics.trends.conversionTrend)}
                        <span className="text-sm">
                          Conversão: {analytics.trends.conversionTrend === 'improving' ? 'Melhorando' : 
                                     analytics.trends.conversionTrend === 'declining' ? 'Declinando' : 'Estável'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(analytics.trends.engagementTrend)}
                        <span className="text-sm">
                          Engajamento: {analytics.trends.engagementTrend === 'improving' ? 'Melhorando' : 
                                       analytics.trends.engagementTrend === 'declining' ? 'Declinando' : 'Estável'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Critical Insights */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Insights Críticos
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.insights.map((insight: FunnelInsight, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(insight.severity)}
                        <div className="flex-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                          <p className="text-sm text-blue-600 mt-2">{insight.impact}</p>
                          {insight.actionable && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Acionável
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Recomendações
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.recommendations.map((rec: PerformanceRecommendation, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <div className="flex gap-1">
                          <Badge 
                            className={`text-xs ${getImpactColor(rec.impact)}`}
                          >
                            {rec.impact} impacto
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.effort} esforço
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <p className="text-sm text-green-600 mb-2">{rec.expectedImprovement}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        {rec.timeToImplement}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Heatmap Tab */}
          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Mapa de Calor dos Módulos</h3>
                <p className="text-sm text-muted-foreground">
                  Visualização do engajamento e performance por módulo
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.heatmap.map((node: NodeHeatmap, index: number) => (
                    <div key={node.nodeId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Módulo {index + 1}</h4>
                        <div className={`w-4 h-4 rounded-full ${getTemperatureColor(node.temperature)}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Engajamento:</span>
                          <span className="font-medium">{node.engagementScore.toFixed(0)}%</span>
                        </div>
                        <Progress value={node.engagementScore} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Contribuição:</span>
                          <span className="font-medium">{node.conversionContribution.toFixed(1)}%</span>
                        </div>
                        <Progress value={node.conversionContribution * 5} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Taxa de Saída:</span>
                          <span className="font-medium">{node.exitRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={node.exitRate} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benchmarks Tab */}
          <TabsContent value="benchmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Comparação com Indústria</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Taxa de Conversão</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics.benchmarks.yourPerformance.conversionRate.toFixed(1)}% vs {analytics.benchmarks.industryAverage.conversionRate}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Sua Performance</div>
                        <Progress value={analytics.benchmarks.yourPerformance.conversionRate * 20} className="h-3" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Média da Indústria</div>
                        <Progress value={analytics.benchmarks.industryAverage.conversionRate * 20} className="h-3" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Tempo Médio no Funil</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics.benchmarks.yourPerformance.averageTime}s vs {analytics.benchmarks.industryAverage.averageTime}s
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Sua Performance</div>
                        <Progress value={(analytics.benchmarks.yourPerformance.averageTime / 300) * 100} className="h-3" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Média da Indústria</div>
                        <Progress value={(analytics.benchmarks.industryAverage.averageTime / 300) * 100} className="h-3" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">Posição Competitiva</h4>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">{analytics.benchmarks.percentile}º</div>
                      <div>
                        <p className="text-sm">Percentil da indústria</p>
                        <Badge 
                          className={
                            analytics.benchmarks.competitivePosition === 'leading' ? 'bg-green-100 text-green-700' :
                            analytics.benchmarks.competitivePosition === 'above_average' ? 'bg-blue-100 text-blue-700' :
                            analytics.benchmarks.competitivePosition === 'average' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }
                        >
                          {analytics.benchmarks.competitivePosition.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!analytics && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Analytics Avançados</h3>
            <p className="text-muted-foreground mb-4">
              Gere análises detalhadas de performance do seu funil
            </p>
            <Button onClick={generateAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Começar Análise
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};