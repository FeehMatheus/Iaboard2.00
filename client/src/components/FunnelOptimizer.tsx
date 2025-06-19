import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Clock, 
  Lightbulb,
  Zap,
  BarChart3,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface FunnelOptimizerProps {
  currentBoard: any;
  onSuggestionApply?: (suggestion: OptimizationSuggestion) => void;
}

export const FunnelOptimizer: React.FC<FunnelOptimizerProps> = ({ 
  currentBoard, 
  onSuggestionApply 
}) => {
  const [analysis, setAnalysis] = useState<FunnelAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null);
  const { toast } = useToast();

  const analyzeCurrentFunnel = async () => {
    if (!currentBoard || currentBoard.nodes.length === 0) {
      toast({
        title: "Funil vazio",
        description: "Adicione alguns módulos antes de analisar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/funnel/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          funnelData: currentBoard
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.data);
        toast({
          title: "Análise concluída",
          description: `Score do funil: ${result.data.score}/100`,
        });
      } else {
        throw new Error(result.error || 'Erro na análise');
      }
    } catch (error) {
      console.error('Erro ao analisar funil:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar o funil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'structure': return <BarChart3 className="h-4 w-4" />;
      case 'content': return <Sparkles className="h-4 w-4" />;
      case 'flow': return <ArrowRight className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'conversion': return <Target className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa melhorar';
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                Otimizador IA
              </h3>
              <p className="text-sm text-slate-400">Análise inteligente do funil</p>
            </div>
          </div>
          <Button
            onClick={analyzeCurrentFunnel}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Analisando...' : 'Analisar Funil'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {analysis && (
          <>
            {/* Score Overview */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-200">Score Geral</h4>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}/100
                </span>
              </div>
              <Progress value={analysis.score} className="h-3 mb-2" />
              <p className="text-sm text-slate-400">
                {getScoreDescription(analysis.score)} - {currentBoard.name}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-slate-400">Módulos</span>
                </div>
                <span className="text-lg font-semibold text-slate-200">
                  {analysis.keyMetrics.nodeCount}
                </span>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-slate-400">Conexões</span>
                </div>
                <span className="text-lg font-semibold text-slate-200">
                  {analysis.keyMetrics.connectionDensity.toFixed(1)}
                </span>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-slate-400">Complexidade</span>
                </div>
                <span className="text-lg font-semibold text-slate-200">
                  {analysis.keyMetrics.flowComplexity}%
                </span>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-slate-400">Conteúdo</span>
                </div>
                <span className="text-lg font-semibold text-slate-200">
                  {analysis.keyMetrics.contentQuality}%
                </span>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="flex items-center gap-2 font-medium text-green-400 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-300">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="flex items-center gap-2 font-medium text-red-400 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Pontos de Melhoria
                </h4>
                <ul className="space-y-1">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm text-red-300">
                      • {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Optimization Suggestions */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-medium text-slate-200">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                Sugestões de Otimização ({analysis.suggestions.length})
              </h4>
              
              {analysis.suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/40 border border-slate-600/50 rounded-lg p-4 transition-all duration-200 hover:border-slate-500/70"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <h5 className="font-medium text-slate-200">{suggestion.title}</h5>
                      <Badge 
                        variant={suggestion.priority === 'high' ? 'destructive' : 
                                suggestion.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {getPriorityIcon(suggestion.priority)}
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSuggestion(
                        expandedSuggestion === index ? null : index
                      )}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      {expandedSuggestion === index ? 'Ocultar' : 'Ver mais'}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-2">{suggestion.description}</p>
                  
                  {expandedSuggestion === index && (
                    <div className="space-y-3 mt-4 pt-3 border-t border-slate-600/50">
                      <div>
                        <h6 className="text-sm font-medium text-slate-300 mb-1">Recomendação:</h6>
                        <p className="text-sm text-slate-400">{suggestion.recommendation}</p>
                      </div>
                      
                      <div>
                        <h6 className="text-sm font-medium text-slate-300 mb-1">Impacto Esperado:</h6>
                        <p className="text-sm text-green-400">{suggestion.impact}</p>
                      </div>
                      
                      <div>
                        <h6 className="text-sm font-medium text-slate-300 mb-1">Como Implementar:</h6>
                        <p className="text-sm text-slate-400">{suggestion.implementation}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          Tempo estimado: {suggestion.estimatedTime}
                        </div>
                        
                        {onSuggestionApply && (
                          <Button
                            size="sm"
                            onClick={() => onSuggestionApply(suggestion)}
                            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                          >
                            Aplicar Sugestão
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!analysis && !loading && (
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-300 mb-2">
              Análise Inteligente de Funil
            </h4>
            <p className="text-slate-400 mb-4">
              Clique em "Analisar Funil" para receber sugestões personalizadas de otimização
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};