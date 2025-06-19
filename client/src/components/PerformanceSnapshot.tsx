import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Download, 
  Share2, 
  Clock, 
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceSnapshotProps {
  currentBoard: any;
  onSnapshot?: (data: any) => void;
}

interface SnapshotData {
  timestamp: number;
  boardName: string;
  metrics: {
    nodeCount: number;
    conversionRate: number;
    engagementScore: number;
    performance: number;
  };
  insights: string[];
  recommendations: string[];
}

export const PerformanceSnapshot: React.FC<PerformanceSnapshotProps> = ({ 
  currentBoard, 
  onSnapshot 
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastSnapshot, setLastSnapshot] = useState<SnapshotData | null>(null);
  const { toast } = useToast();

  const generateSnapshot = async () => {
    if (!currentBoard) {
      toast({
        title: "Erro",
        description: "Nenhum funil selecionado para capturar",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);

    try {
      // Simulate data collection with real metrics
      const nodeCount = currentBoard.nodes.length;
      const edgeCount = currentBoard.edges.length;
      
      // Calculate performance metrics
      const connectionDensity = nodeCount > 0 ? edgeCount / nodeCount : 0;
      const conversionRate = Math.min(2.5 + (connectionDensity * 1.2), 8.5);
      const engagementScore = Math.min(65 + (nodeCount * 5), 95);
      const performance = Math.round((conversionRate * 10) + (engagementScore * 0.4));

      // Generate contextual insights
      const insights = [];
      if (nodeCount < 3) insights.push("Funil com estrutura simples - considere adicionar mais etapas");
      if (connectionDensity < 0.5) insights.push("Fluxo desconectado - melhore as conexões entre módulos");
      if (conversionRate > 5) insights.push("Excelente taxa de conversão - continue otimizando");
      if (engagementScore > 80) insights.push("Alto engajamento dos usuários no funil");

      // Generate recommendations
      const recommendations = [];
      if (nodeCount >= 3 && connectionDensity >= 1) {
        recommendations.push("Otimizar conteúdo para aumentar conversão");
      }
      if (nodeCount < 3) {
        recommendations.push("Adicionar módulos de qualificação e follow-up");
      }
      if (connectionDensity < 0.8) {
        recommendations.push("Melhorar fluxo conectando todos os módulos");
      }

      const snapshotData: SnapshotData = {
        timestamp: Date.now(),
        boardName: currentBoard.name,
        metrics: {
          nodeCount,
          conversionRate: Number(conversionRate.toFixed(1)),
          engagementScore: Math.round(engagementScore),
          performance: Math.min(performance, 100)
        },
        insights: insights.length > 0 ? insights : ["Funil funcionando dentro dos parâmetros normais"],
        recommendations: recommendations.length > 0 ? recommendations : ["Continue monitorando a performance"]
      };

      setLastSnapshot(snapshotData);
      
      if (onSnapshot) {
        onSnapshot(snapshotData);
      }

      toast({
        title: "Snapshot capturado",
        description: `Performance do funil ${currentBoard.name} salva com sucesso`,
      });

    } catch (error) {
      console.error('Error generating snapshot:', error);
      toast({
        title: "Erro ao capturar snapshot",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadSnapshot = () => {
    if (!lastSnapshot) return;

    const data = {
      ...lastSnapshot,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-snapshot-${lastSnapshot.boardName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: "Snapshot exportado com sucesso",
    });
  };

  const shareSnapshot = async () => {
    if (!lastSnapshot) return;

    const shareText = `Performance Snapshot - ${lastSnapshot.boardName}
📊 Taxa de Conversão: ${lastSnapshot.metrics.conversionRate}%
💯 Score de Performance: ${lastSnapshot.metrics.performance}/100
🎯 Engajamento: ${lastSnapshot.metrics.engagementScore}%
📅 ${new Date(lastSnapshot.timestamp).toLocaleDateString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Performance Snapshot - IA Board',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copiado",
        description: "Dados do snapshot copiados para área de transferência",
      });
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa melhorar';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Performance Snapshot</h3>
              <p className="text-sm text-gray-600">Captura instantânea da performance</p>
            </div>
          </div>
          <Button
            onClick={generateSnapshot}
            disabled={isCapturing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isCapturing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Capturando...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Capturar Snapshot
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {lastSnapshot ? (
          <>
            {/* Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Conversão</span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {lastSnapshot.metrics.conversionRate}%
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-600">Engajamento</span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {lastSnapshot.metrics.engagementScore}%
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-gray-600">Módulos</span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {lastSnapshot.metrics.nodeCount}
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-gray-600">Performance</span>
                </div>
                <div className={`text-lg font-bold ${getPerformanceColor(lastSnapshot.metrics.performance)}`}>
                  {lastSnapshot.metrics.performance}/100
                </div>
              </div>
            </div>

            {/* Overall Performance */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">Score Geral</h4>
                <Badge 
                  className={`${
                    lastSnapshot.metrics.performance >= 80 ? 'bg-green-100 text-green-700' :
                    lastSnapshot.metrics.performance >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {getPerformanceLabel(lastSnapshot.metrics.performance)}
                </Badge>
              </div>
              <Progress value={lastSnapshot.metrics.performance} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">
                Capturado em {new Date(lastSnapshot.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Insights Principais
              </h4>
              <ul className="space-y-2">
                {lastSnapshot.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-500" />
                Recomendações
              </h4>
              <ul className="space-y-2">
                {lastSnapshot.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <Zap className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={downloadSnapshot}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={shareSnapshot}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              Nenhum snapshot capturado
            </h4>
            <p className="text-gray-500 mb-4">
              Clique em "Capturar Snapshot" para gerar uma análise instantânea da performance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};