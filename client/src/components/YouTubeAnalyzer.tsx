import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Play, FileText, Brain, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface VideoAnalysis {
  url: string;
  title?: string;
  duration?: number;
  transcript?: string;
  keyMoments: Array<{
    timestamp: string;
    description: string;
    importance: number;
  }>;
  summary: string;
  insights: string[];
  actionItems: string[];
}

interface AnalysisResult {
  success: boolean;
  analysis?: VideoAnalysis;
  error?: string;
  timestamp?: string;
}

export function YouTubeAnalyzer() {
  const [url, setUrl] = useState('https://www.youtube.com/live/PL4rWZ0vg14?si=N2G-iWvqP0-a7Q5Y');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeVideo = async () => {
    if (!url.trim()) {
      setResult({
        success: false,
        error: 'URL do YouTube é obrigatória'
      });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/youtube/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro na análise'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Análise Detalhada de Vídeo YouTube</h1>
        <p className="text-gray-300">Análise segundo por segundo com transcrição e insights</p>
      </div>

      {/* Input Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-red-500" />
            URL do Vídeo YouTube
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole a URL do YouTube aqui..."
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Button 
            onClick={analyzeVideo}
            disabled={analyzing}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {analyzing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Analisando Vídeo...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analisar Vídeo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {result.success && result.analysis ? (
            <>
              {/* Video Info */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Informações do Vídeo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {result.analysis.title || 'Título não disponível'}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-300">
                      {result.analysis.duration && (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(result.analysis.duration)}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {result.analysis.keyMoments.length} momentos-chave
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Resumo Executivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {result.analysis.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Key Moments */}
              {result.analysis.keyMoments.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      Momentos-Chave ({result.analysis.keyMoments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {result.analysis.keyMoments.map((moment, index) => (
                          <div key={index} className="border-l-2 border-green-400 pl-4 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                {moment.timestamp}
                              </Badge>
                              <div className="flex">
                                {Array.from({ length: Math.ceil(moment.importance * 5) }).map((_, i) => (
                                  <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm">{moment.description}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insights */}
                {result.analysis.insights.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        Principais Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.analysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Action Items */}
                {result.analysis.actionItems.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-400" />
                        Itens de Ação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.analysis.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                            <Target className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Transcript */}
              {result.analysis.transcript && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      Transcrição Completa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {result.analysis.transcript}
                      </p>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Alert className="bg-red-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {result.error || 'Erro desconhecido na análise'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Como funciona a análise</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-xs space-y-2">
          <p>• Extração de áudio do vídeo do YouTube</p>
          <p>• Transcrição automática usando IA</p>
          <p>• Identificação de momentos-chave por relevância</p>
          <p>• Análise de conteúdo com insights práticos</p>
          <p>• Geração de itens de ação baseados no conteúdo</p>
        </CardContent>
      </Card>
    </div>
  );
}