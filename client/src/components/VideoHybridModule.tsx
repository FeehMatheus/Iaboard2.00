import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Play, Download, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface VideoHybridModuleProps {
  data: {
    prompt?: string;
    duration?: number;
    style?: string;
  };
  isConnectable: boolean;
}

export function VideoHybridModule({ data, isConnectable }: VideoHybridModuleProps) {
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [duration, setDuration] = useState(data?.duration || 5);
  const [style, setStyle] = useState(data?.style || 'realistic');
  const [videoResult, setVideoResult] = useState<any>(null);
  const { toast } = useToast();

  const { data: providerStatus } = useQuery({
    queryKey: ['/api/video-hybrid/status'],
    refetchInterval: 30000, // Check status every 30 seconds
  });

  const generateVideoMutation = useMutation({
    mutationFn: async (params: { prompt: string; duration: number; style: string }) => {
      const response = await fetch('/api/functional-video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Erro na geração de vídeo');
      return response.json();
    },
    onSuccess: (result) => {
      setVideoResult(result);
      if (result.isRealVideo) {
        toast({
          title: "Vídeo gerado com sucesso!",
          description: `Provedor: ${result.provider} em ${result.processingTime}ms`,
        });
      } else {
        toast({
          title: "Placeholder gerado",
          description: "Configure chaves de API para vídeos reais",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro na geração",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activeProviders = (providerStatus as any)?.activeProviders || 0;
  const hasRealProviders = activeProviders > 1; // More than just local fallback

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-red-500"
      />
      
      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl w-80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm font-bold">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              IA DE VÍDEO HÍBRIDO
            </div>
            <div className="flex items-center gap-1">
              {hasRealProviders ? (
                <CheckCircle className="w-4 h-4 text-green-300" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
              )}
              <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                {activeProviders} APIs
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 p-4 pt-0">
          <div>
            <label className="text-xs font-medium mb-2 block">Prompt do Vídeo</label>
            <Textarea
              placeholder="Ex: Uma pessoa caminhando na praia ao pôr do sol..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium mb-1 block">Duração</label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 segundos</SelectItem>
                  <SelectItem value="5">5 segundos</SelectItem>
                  <SelectItem value="10">10 segundos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Estilo</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realista</SelectItem>
                  <SelectItem value="animated">Animado</SelectItem>
                  <SelectItem value="cinematic">Cinematográfico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => generateVideoMutation.mutate({ prompt, duration, style })}
            disabled={!prompt || generateVideoMutation.isPending}
            className="w-full bg-white/20 hover:bg-white/30 text-white"
          >
            {generateVideoMutation.isPending ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Gerando Vídeo...
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                Gerar Vídeo
              </>
            )}
          </Button>

          {videoResult && (
            <div className="bg-white/10 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  {videoResult.provider}
                </Badge>
                <span className="text-xs text-white/70">
                  {videoResult.processingTime}ms
                </span>
              </div>

              {videoResult.isRealVideo ? (
                <div className="space-y-2">
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <Play className="w-8 h-8 mx-auto mb-2 text-white/70" />
                    <p className="text-xs text-white/70">Vídeo Gerado</p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <a href={videoResult.video.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Vídeo
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-yellow-200">
                    <AlertTriangle className="w-4 h-4" />
                    Configure APIs para vídeos reais
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    <a href={videoResult.video.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Descrição
                    </a>
                  </Button>
                </div>
              )}

              {videoResult.message && (
                <p className="text-xs text-white/80">{videoResult.message}</p>
              )}
            </div>
          )}

          {/* Provider Status */}
          <div className="text-xs text-white/60 space-y-1">
            <p className="font-medium">Provedores Disponíveis:</p>
            {(providerStatus as any)?.providers?.map((provider: any) => (
              <div key={provider.name} className="flex items-center justify-between">
                <span>{provider.name}</span>
                <span className={provider.available ? 'text-green-300' : 'text-red-300'}>
                  {provider.available ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-purple-500"
      />
    </div>
  );
}