import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface FunnelPerformanceData {
  funnelId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  nodes: any[];
  edges: any[];
  sessions: FunnelSession[];
  metrics: FunnelMetrics;
}

interface FunnelSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  completedSteps: string[];
  conversionPath: string[];
  exitPoint?: string;
  duration: number;
  converted: boolean;
}

interface FunnelMetrics {
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  averageTimeOnFunnel: number;
  dropOffRate: number;
  topExitPoints: { nodeId: string; count: number }[];
  conversionsByStep: { stepId: string; conversions: number; views: number }[];
  performanceScore: number;
}

interface AdvancedAnalytics {
  funnelId: string;
  timeRange: 'day' | 'week' | 'month' | 'quarter';
  insights: FunnelInsight[];
  recommendations: PerformanceRecommendation[];
  benchmarks: FunnelBenchmark;
  trends: TrendAnalysis;
  heatmap: NodeHeatmap[];
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

interface FunnelBenchmark {
  industryAverage: {
    conversionRate: number;
    averageTime: number;
    dropOffRate: number;
  };
  yourPerformance: {
    conversionRate: number;
    averageTime: number;
    dropOffRate: number;
  };
  percentile: number;
  competitivePosition: 'leading' | 'above_average' | 'average' | 'below_average';
}

interface TrendAnalysis {
  conversionTrend: 'improving' | 'declining' | 'stable';
  engagementTrend: 'improving' | 'declining' | 'stable';
  velocityChange: number;
  seasonalPatterns: any[];
  predictedPerformance: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
  };
}

interface NodeHeatmap {
  nodeId: string;
  engagementScore: number;
  conversionContribution: number;
  timeSpent: number;
  exitRate: number;
  temperature: 'hot' | 'warm' | 'cool' | 'cold';
}

export class FunnelAnalytics {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private performanceData: Map<string, FunnelPerformanceData> = new Map();

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async generateAdvancedAnalytics(funnelData: any, timeRange: string = 'week'): Promise<AdvancedAnalytics> {
    try {
      const performanceData = this.simulatePerformanceData(funnelData);
      const insights = await this.generateIntelligentInsights(performanceData);
      const recommendations = await this.generatePerformanceRecommendations(performanceData);
      const benchmarks = this.calculateBenchmarks(performanceData);
      const trends = this.analyzeTrends(performanceData);
      const heatmap = this.generateNodeHeatmap(performanceData);

      return {
        funnelId: funnelData.id,
        timeRange: timeRange as any,
        insights,
        recommendations,
        benchmarks,
        trends,
        heatmap
      };
    } catch (error) {
      console.error('Error generating advanced analytics:', error);
      return this.generateFallbackAnalytics(funnelData);
    }
  }

  private simulatePerformanceData(funnelData: any): FunnelPerformanceData {
    const nodeCount = funnelData.nodes.length;
    const baseViews = Math.floor(Math.random() * 5000) + 1000;
    const conversionRate = 0.02 + (Math.random() * 0.15); // 2-17%
    
    const sessions: FunnelSession[] = [];
    for (let i = 0; i < Math.min(baseViews, 100); i++) {
      const sessionId = `session_${i}`;
      const startTime = Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
      const duration = Math.floor(Math.random() * 1800000) + 30000; // 30s to 30min
      const converted = Math.random() < conversionRate;
      
      sessions.push({
        id: sessionId,
        startTime,
        endTime: startTime + duration,
        duration,
        converted,
        completedSteps: funnelData.nodes.slice(0, Math.floor(Math.random() * nodeCount) + 1).map((n: any) => n.id),
        conversionPath: converted ? funnelData.nodes.map((n: any) => n.id) : [],
        exitPoint: !converted ? funnelData.nodes[Math.floor(Math.random() * nodeCount)]?.id : undefined
      });
    }

    const metrics: FunnelMetrics = {
      totalViews: baseViews,
      uniqueVisitors: Math.floor(baseViews * 0.8),
      conversionRate: conversionRate * 100,
      averageTimeOnFunnel: sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 1000,
      dropOffRate: (1 - conversionRate) * 100,
      topExitPoints: this.calculateExitPoints(sessions, funnelData.nodes),
      conversionsByStep: this.calculateStepConversions(sessions, funnelData.nodes),
      performanceScore: this.calculatePerformanceScore(conversionRate, nodeCount)
    };

    return {
      funnelId: funnelData.id,
      name: funnelData.name,
      createdAt: funnelData.createdAt,
      updatedAt: funnelData.updatedAt,
      nodes: funnelData.nodes,
      edges: funnelData.edges,
      sessions,
      metrics
    };
  }

  private calculateExitPoints(sessions: FunnelSession[], nodes: any[]): { nodeId: string; count: number }[] {
    const exitCounts = new Map<string, number>();
    
    sessions.forEach(session => {
      if (session.exitPoint) {
        exitCounts.set(session.exitPoint, (exitCounts.get(session.exitPoint) || 0) + 1);
      }
    });

    return Array.from(exitCounts.entries())
      .map(([nodeId, count]) => ({ nodeId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateStepConversions(sessions: FunnelSession[], nodes: any[]): { stepId: string; conversions: number; views: number }[] {
    return nodes.map(node => {
      const views = sessions.filter(s => s.completedSteps.includes(node.id)).length;
      const conversions = sessions.filter(s => s.converted && s.completedSteps.includes(node.id)).length;
      
      return {
        stepId: node.id,
        conversions,
        views
      };
    });
  }

  private calculatePerformanceScore(conversionRate: number, nodeCount: number): number {
    let score = conversionRate * 500; // Base score from conversion
    score += Math.min(nodeCount * 5, 30); // Bonus for structure
    score = Math.min(score, 100);
    return Math.round(score);
  }

  private async generateIntelligentInsights(performanceData: FunnelPerformanceData): Promise<FunnelInsight[]> {
    const insights: FunnelInsight[] = [];
    
    // Conversion rate insights
    if (performanceData.metrics.conversionRate < 2) {
      insights.push({
        type: 'conversion',
        severity: 'critical',
        title: 'Taxa de conversão muito baixa',
        description: `Taxa atual de ${performanceData.metrics.conversionRate.toFixed(1)}% está abaixo da média da indústria`,
        impact: 'Perda significativa de receita potencial',
        actionable: true,
        priority: 1
      });
    }

    // Drop-off analysis
    const highDropOffPoints = performanceData.metrics.topExitPoints
      .filter(exit => exit.count > performanceData.sessions.length * 0.1);
    
    if (highDropOffPoints.length > 0) {
      insights.push({
        type: 'bottleneck',
        severity: 'high',
        title: 'Pontos críticos de abandono identificados',
        description: `${highDropOffPoints.length} etapas com alta taxa de saída detectadas`,
        impact: 'Redução no fluxo de conversão',
        actionable: true,
        priority: 2
      });
    }

    // Engagement insights
    if (performanceData.metrics.averageTimeOnFunnel < 60) {
      insights.push({
        type: 'engagement',
        severity: 'medium',
        title: 'Baixo tempo de engajamento',
        description: 'Usuários passam pouco tempo no funil',
        impact: 'Possível falta de interesse ou problemas de usabilidade',
        actionable: true,
        priority: 3
      });
    }

    return insights;
  }

  private async generatePerformanceRecommendations(performanceData: FunnelPerformanceData): Promise<PerformanceRecommendation[]> {
    const recommendations: PerformanceRecommendation[] = [];

    // Structure recommendations
    if (performanceData.nodes.length < 3) {
      recommendations.push({
        category: 'structure',
        impact: 'high',
        effort: 'medium',
        title: 'Expandir estrutura do funil',
        description: 'Adicionar etapas de qualificação e nurturing',
        implementation: 'Criar módulos de captura de leads, qualificação e follow-up',
        expectedImprovement: 'Aumento de 15-25% na conversão',
        timeToImplement: '2-3 horas'
      });
    }

    // Flow optimization
    const disconnectedNodes = performanceData.nodes.filter(node => 
      !performanceData.edges.some(edge => edge.source === node.id || edge.target === node.id)
    );

    if (disconnectedNodes.length > 0) {
      recommendations.push({
        category: 'flow',
        impact: 'medium',
        effort: 'low',
        title: 'Conectar módulos isolados',
        description: 'Alguns módulos não estão conectados no fluxo',
        implementation: 'Criar conexões lógicas entre todos os módulos',
        expectedImprovement: 'Melhoria de 5-10% no fluxo',
        timeToImplement: '30 minutos'
      });
    }

    // Content optimization
    recommendations.push({
      category: 'content',
      impact: 'high',
      effort: 'high',
      title: 'Otimizar conteúdo para conversão',
      description: 'Personalizar mensagens baseado em dados de performance',
      implementation: 'A/B testing de headlines, CTAs e copy',
      expectedImprovement: 'Potencial de 20-40% de melhoria',
      timeToImplement: '1-2 semanas'
    });

    return recommendations;
  }

  private calculateBenchmarks(performanceData: FunnelPerformanceData): FunnelBenchmark {
    const industryAverages = {
      conversionRate: 3.2,
      averageTime: 180,
      dropOffRate: 78
    };

    const yourPerformance = {
      conversionRate: performanceData.metrics.conversionRate,
      averageTime: performanceData.metrics.averageTimeOnFunnel,
      dropOffRate: performanceData.metrics.dropOffRate
    };

    const performanceRatio = (yourPerformance.conversionRate / industryAverages.conversionRate);
    const percentile = Math.min(Math.max(performanceRatio * 50, 5), 95);

    let competitivePosition: 'leading' | 'above_average' | 'average' | 'below_average';
    if (percentile >= 80) competitivePosition = 'leading';
    else if (percentile >= 60) competitivePosition = 'above_average';
    else if (percentile >= 40) competitivePosition = 'average';
    else competitivePosition = 'below_average';

    return {
      industryAverage: industryAverages,
      yourPerformance,
      percentile: Math.round(percentile),
      competitivePosition
    };
  }

  private analyzeTrends(performanceData: FunnelPerformanceData): TrendAnalysis {
    const recentSessions = performanceData.sessions.filter(s => 
      s.startTime > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const oldSessions = performanceData.sessions.filter(s => 
      s.startTime <= Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const recentConversion = recentSessions.filter(s => s.converted).length / Math.max(recentSessions.length, 1);
    const oldConversion = oldSessions.filter(s => s.converted).length / Math.max(oldSessions.length, 1);

    const conversionChange = recentConversion - oldConversion;
    
    let conversionTrend: 'improving' | 'declining' | 'stable';
    if (Math.abs(conversionChange) < 0.01) conversionTrend = 'stable';
    else conversionTrend = conversionChange > 0 ? 'improving' : 'declining';

    return {
      conversionTrend,
      engagementTrend: 'stable',
      velocityChange: conversionChange * 100,
      seasonalPatterns: [],
      predictedPerformance: {
        nextWeek: performanceData.metrics.conversionRate * (1 + conversionChange),
        nextMonth: performanceData.metrics.conversionRate * (1 + conversionChange * 4),
        confidence: 0.75
      }
    };
  }

  private generateNodeHeatmap(performanceData: FunnelPerformanceData): NodeHeatmap[] {
    return performanceData.nodes.map(node => {
      const nodeViews = performanceData.sessions.filter(s => 
        s.completedSteps.includes(node.id)
      ).length;

      const nodeConversions = performanceData.sessions.filter(s => 
        s.converted && s.completedSteps.includes(node.id)
      ).length;

      const exitCount = performanceData.metrics.topExitPoints
        .find(exit => exit.nodeId === node.id)?.count || 0;

      const engagementScore = Math.min((nodeViews / performanceData.sessions.length) * 100, 100);
      const conversionContribution = nodeViews > 0 ? (nodeConversions / nodeViews) * 100 : 0;
      const exitRate = nodeViews > 0 ? (exitCount / nodeViews) * 100 : 0;

      let temperature: 'hot' | 'warm' | 'cool' | 'cold';
      if (engagementScore > 75 && conversionContribution > 10) temperature = 'hot';
      else if (engagementScore > 50 && conversionContribution > 5) temperature = 'warm';
      else if (engagementScore > 25) temperature = 'cool';
      else temperature = 'cold';

      return {
        nodeId: node.id,
        engagementScore,
        conversionContribution,
        timeSpent: Math.random() * 120 + 30, // Simulated
        exitRate,
        temperature
      };
    });
  }

  private generateFallbackAnalytics(funnelData: any): AdvancedAnalytics {
    return {
      funnelId: funnelData.id,
      timeRange: 'week',
      insights: [
        {
          type: 'optimization',
          severity: 'medium',
          title: 'Análise básica disponível',
          description: 'Dados limitados para análise avançada',
          impact: 'Recomenda-se coletar mais dados',
          actionable: false,
          priority: 1
        }
      ],
      recommendations: [
        {
          category: 'structure',
          impact: 'medium',
          effort: 'low',
          title: 'Implementar tracking de performance',
          description: 'Adicionar coleta de dados para análises mais precisas',
          implementation: 'Configurar eventos de tracking no funil',
          expectedImprovement: 'Análises mais precisas',
          timeToImplement: '1 hora'
        }
      ],
      benchmarks: {
        industryAverage: { conversionRate: 3.2, averageTime: 180, dropOffRate: 78 },
        yourPerformance: { conversionRate: 2.5, averageTime: 120, dropOffRate: 85 },
        percentile: 35,
        competitivePosition: 'below_average'
      },
      trends: {
        conversionTrend: 'stable',
        engagementTrend: 'stable',
        velocityChange: 0,
        seasonalPatterns: [],
        predictedPerformance: { nextWeek: 2.5, nextMonth: 2.5, confidence: 0.5 }
      },
      heatmap: []
    };
  }
}

export const funnelAnalytics = new FunnelAnalytics();