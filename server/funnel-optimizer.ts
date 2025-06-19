import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface FunnelData {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: number;
  updatedAt: number;
  description?: string;
}

interface OptimizationSuggestion {
  type: 'structure' | 'content' | 'flow' | 'performance' | 'conversion';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  impact: string;
  implementation: string;
  estimatedTime: string;
}

interface FunnelAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: OptimizationSuggestion[];
  keyMetrics: {
    nodeCount: number;
    connectionDensity: number;
    flowComplexity: number;
    contentQuality: number;
  };
}

export class FunnelOptimizer {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

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

  async analyzeFunnel(funnelData: FunnelData): Promise<FunnelAnalysis> {
    try {
      const analysis = await this.performStructuralAnalysis(funnelData);
      const aiSuggestions = await this.generateAISuggestions(funnelData, analysis);
      
      return {
        score: this.calculateOverallScore(analysis),
        strengths: this.identifyStrengths(analysis),
        weaknesses: this.identifyWeaknesses(analysis),
        suggestions: aiSuggestions,
        keyMetrics: analysis
      };
    } catch (error) {
      console.error('Error analyzing funnel:', error);
      return this.generateFallbackAnalysis(funnelData);
    }
  }

  private performStructuralAnalysis(funnelData: FunnelData) {
    const nodeCount = funnelData.nodes.length;
    const edgeCount = funnelData.edges.length;
    
    // Calculate connection density (edges per node)
    const connectionDensity = nodeCount > 0 ? edgeCount / nodeCount : 0;
    
    // Calculate flow complexity based on node types and connections
    const flowComplexity = this.calculateFlowComplexity(funnelData);
    
    // Estimate content quality based on node data
    const contentQuality = this.estimateContentQuality(funnelData);

    return {
      nodeCount,
      connectionDensity,
      flowComplexity,
      contentQuality
    };
  }

  private calculateFlowComplexity(funnelData: FunnelData): number {
    const nodes = funnelData.nodes;
    const edges = funnelData.edges;
    
    // Count different node types
    const nodeTypes = new Set(nodes.map(node => node.type));
    const typeVariety = nodeTypes.size;
    
    // Check for circular dependencies
    const hasCircularFlow = this.detectCircularFlow(edges);
    
    // Calculate branching factor
    const branchingPoints = nodes.filter(node => 
      edges.filter(edge => edge.source === node.id).length > 1
    ).length;
    
    let complexity = typeVariety * 10;
    complexity += branchingPoints * 15;
    if (hasCircularFlow) complexity += 20;
    
    return Math.min(complexity, 100);
  }

  private detectCircularFlow(edges: any[]): boolean {
    const visited = new Set();
    const recursionStack = new Set();
    
    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true;
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    const allNodes = new Set([
      ...edges.map(e => e.source),
      ...edges.map(e => e.target)
    ]);
    
    for (const nodeId of allNodes) {
      if (!visited.has(nodeId) && hasCycle(nodeId)) {
        return true;
      }
    }
    
    return false;
  }

  private estimateContentQuality(funnelData: FunnelData): number {
    let quality = 0;
    const nodes = funnelData.nodes;
    
    for (const node of nodes) {
      const nodeData = node.data || {};
      
      // Check if node has meaningful content
      if (nodeData.messages && nodeData.messages.length > 0) {
        quality += 15;
      }
      
      // Check for descriptions or configurations
      if (nodeData.description || nodeData.config) {
        quality += 10;
      }
      
      // Bonus for AI modules with specific configurations
      if (node.type === 'aiModule' && nodeData.moduleType) {
        quality += 20;
      }
    }
    
    return Math.min(quality, 100);
  }

  private async generateAISuggestions(funnelData: FunnelData, metrics: any): Promise<OptimizationSuggestion[]> {
    const prompt = this.buildAnalysisPrompt(funnelData, metrics);
    
    try {
      if (this.anthropic) {
        return await this.generateWithAnthropic(prompt);
      } else if (this.openai) {
        return await this.generateWithOpenAI(prompt);
      }
    } catch (error) {
      console.error('AI suggestion generation failed:', error);
    }
    
    return this.generateBasicSuggestions(funnelData, metrics);
  }

  private buildAnalysisPrompt(funnelData: FunnelData, metrics: any): string {
    return `Analyze this sales funnel and provide optimization suggestions:

Funnel: "${funnelData.name}"
Description: ${funnelData.description || 'No description'}
Nodes: ${metrics.nodeCount}
Connection Density: ${metrics.connectionDensity.toFixed(2)}
Flow Complexity: ${metrics.flowComplexity}
Content Quality: ${metrics.contentQuality}

Node Types: ${funnelData.nodes.map(n => n.type).join(', ')}

Provide 3-5 specific optimization suggestions in JSON format:
{
  "suggestions": [
    {
      "type": "structure|content|flow|performance|conversion",
      "priority": "high|medium|low",
      "title": "Brief title",
      "description": "What's the issue",
      "recommendation": "Specific action to take",
      "impact": "Expected improvement",
      "implementation": "How to implement",
      "estimatedTime": "Time estimate"
    }
  ]
}

Focus on actionable improvements for sales funnel optimization.`;
  }

  private async generateWithAnthropic(prompt: string): Promise<OptimizationSuggestion[]> {
    const response = await this.anthropic!.messages.create({
      model: 'claude-sonnet-4-20250514', // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.suggestions || [];
    }
    
    return [];
  }

  private async generateWithOpenAI(prompt: string): Promise<OptimizationSuggestion[]> {
    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1500
    });

    const content = response.choices[0].message.content;
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.suggestions || [];
    }
    
    return [];
  }

  private generateBasicSuggestions(funnelData: FunnelData, metrics: any): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Structure suggestions
    if (metrics.nodeCount < 3) {
      suggestions.push({
        type: 'structure',
        priority: 'high',
        title: 'Adicionar mais etapas ao funil',
        description: 'Funil muito simples com poucas etapas',
        recommendation: 'Adicione módulos de qualificação, nurturing e follow-up',
        impact: 'Melhora a conversão e qualificação de leads',
        implementation: 'Use o menu lateral para adicionar novos módulos',
        estimatedTime: '15-30 minutos'
      });
    }
    
    if (metrics.connectionDensity < 0.5) {
      suggestions.push({
        type: 'flow',
        priority: 'medium',
        title: 'Melhorar conexões entre etapas',
        description: 'Fluxo com poucas conexões entre módulos',
        recommendation: 'Conecte os módulos para criar um fluxo lógico',
        impact: 'Melhora a experiência do usuário no funil',
        implementation: 'Arraste para conectar os módulos relacionados',
        estimatedTime: '10-15 minutos'
      });
    }
    
    if (metrics.contentQuality < 30) {
      suggestions.push({
        type: 'content',
        priority: 'high',
        title: 'Desenvolver conteúdo dos módulos',
        description: 'Módulos sem conteúdo ou configuração adequada',
        recommendation: 'Configure cada módulo com conteúdo relevante',
        impact: 'Aumenta a efetividade do funil de vendas',
        implementation: 'Clique em cada módulo e adicione configurações',
        estimatedTime: '30-60 minutos'
      });
    }
    
    return suggestions;
  }

  private calculateOverallScore(metrics: any): number {
    const nodeScore = Math.min(metrics.nodeCount * 10, 40);
    const densityScore = Math.min(metrics.connectionDensity * 30, 30);
    const contentScore = Math.min(metrics.contentQuality * 0.3, 30);
    
    return Math.round(nodeScore + densityScore + contentScore);
  }

  private identifyStrengths(metrics: any): string[] {
    const strengths: string[] = [];
    
    if (metrics.nodeCount >= 5) {
      strengths.push('Funil bem estruturado com múltiplas etapas');
    }
    
    if (metrics.connectionDensity >= 1) {
      strengths.push('Bom fluxo de conexões entre módulos');
    }
    
    if (metrics.contentQuality >= 60) {
      strengths.push('Conteúdo bem desenvolvido nos módulos');
    }
    
    if (strengths.length === 0) {
      strengths.push('Funil com potencial de crescimento');
    }
    
    return strengths;
  }

  private identifyWeaknesses(metrics: any): string[] {
    const weaknesses: string[] = [];
    
    if (metrics.nodeCount < 3) {
      weaknesses.push('Poucos módulos no funil');
    }
    
    if (metrics.connectionDensity < 0.5) {
      weaknesses.push('Fluxo desconectado entre etapas');
    }
    
    if (metrics.contentQuality < 40) {
      weaknesses.push('Conteúdo insuficiente nos módulos');
    }
    
    return weaknesses;
  }

  private generateFallbackAnalysis(funnelData: FunnelData): FunnelAnalysis {
    const nodeCount = funnelData.nodes.length;
    
    return {
      score: Math.min(nodeCount * 15, 100),
      strengths: ['Funil criado e ativo'],
      weaknesses: ['Necessita análise mais detalhada'],
      suggestions: this.generateBasicSuggestions(funnelData, {
        nodeCount,
        connectionDensity: 0.5,
        flowComplexity: 20,
        contentQuality: 30
      }),
      keyMetrics: {
        nodeCount,
        connectionDensity: 0.5,
        flowComplexity: 20,
        contentQuality: 30
      }
    };
  }
}

export const funnelOptimizer = new FunnelOptimizer();