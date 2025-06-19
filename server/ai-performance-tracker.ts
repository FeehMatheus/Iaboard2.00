interface PerformanceMetric {
  modelId: string;
  responseTime: number;
  tokensUsed: number;
  timestamp: number;
  success: boolean;
  error?: string;
}

interface ModelStats {
  modelId: string;
  totalCalls: number;
  successRate: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  lastUsed: number;
}

export class AIPerformanceTracker {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getModelStats(modelId?: string): ModelStats[] {
    const models = modelId ? [modelId] : [...new Set(this.metrics.map(m => m.modelId))];
    
    return models.map(id => {
      const modelMetrics = this.metrics.filter(m => m.modelId === id);
      const successfulMetrics = modelMetrics.filter(m => m.success);
      
      return {
        modelId: id,
        totalCalls: modelMetrics.length,
        successRate: modelMetrics.length > 0 ? (successfulMetrics.length / modelMetrics.length) * 100 : 0,
        averageResponseTime: successfulMetrics.length > 0 
          ? successfulMetrics.reduce((sum, m) => sum + m.responseTime, 0) / successfulMetrics.length 
          : 0,
        totalTokensUsed: successfulMetrics.reduce((sum, m) => sum + m.tokensUsed, 0),
        lastUsed: modelMetrics.length > 0 ? Math.max(...modelMetrics.map(m => m.timestamp)) : 0
      };
    });
  }

  getRecentMetrics(limit = 10): PerformanceMetric[] {
    return this.metrics.slice(-limit);
  }

  getBestPerformingModel(): string | null {
    const stats = this.getModelStats();
    if (stats.length === 0) return null;

    // Score based on success rate (70%) and speed (30%)
    const scored = stats.map(stat => ({
      modelId: stat.modelId,
      score: (stat.successRate * 0.7) + ((5000 - Math.min(stat.averageResponseTime, 5000)) / 5000 * 100 * 0.3)
    }));

    return scored.reduce((best, current) => 
      current.score > best.score ? current : best
    ).modelId;
  }

  clearMetrics() {
    this.metrics = [];
  }
}

export const aiPerformanceTracker = new AIPerformanceTracker();