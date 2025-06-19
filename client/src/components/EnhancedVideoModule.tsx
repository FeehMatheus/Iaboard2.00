import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Download, Clock, FileText, Film, Settings, Package } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface EnhancedVideoModuleProps {
  data: {
    prompt?: string;
    duration?: number;
    style?: string;
  };
  isConnectable: boolean;
}

export function EnhancedVideoModule({ data, isConnectable }: EnhancedVideoModuleProps) {
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [duration, setDuration] = useState(data?.duration || 15);
  const [style, setStyle] = useState(data?.style || 'cinematic');
  const [productionPackage, setProductionPackage] = useState<any>(null);
  const { toast } = useToast();

  const { data: systemStatus } = useQuery({
    queryKey: ['/api/video-enhanced/status'],
    refetchInterval: 10000,
  });

  const generatePackageMutation = useMutation({
    mutationFn: async (params: { prompt: string; duration: number; style: string }) => {
      const response = await fetch('/api/video-enhanced/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Erro na geração do pacote');
      return response.json();
    },
    onSuccess: (result) => {
      setProductionPackage(result);
      toast({
        title: "Pacote de produção gerado!",
        description: `Sistema Enhanced Hybrid pronto em ${result.processingTime}ms`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na geração",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const capabilities = systemStatus?.capabilities || [];
  const features = systemStatus?.features || [];

  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      
      <Card className="w-80 bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/30 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm font-bold">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-300" />
              SISTEMA DE VÍDEO APRIMORADO
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="default" className="text-xs bg-green-600 text-white">
                Operacional
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 p-4 pt-0">
          <div>
            <label className="text-xs font-medium mb-2 block text-white">Conceito de Vídeo</label>
            <Textarea
              placeholder="Ex: CEO apresentando startup inovadora em palco moderno com hologramas..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium mb-1 block text-white">Duração</label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 segundos</SelectItem>
                  <SelectItem value="10">10 segundos</SelectItem>
                  <SelectItem value="15">15 segundos</SelectItem>
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">1 minuto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block text-white">Estilo</label>
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
            onClick={() => generatePackageMutation.mutate({ prompt, duration, style })}
            disabled={!prompt || generatePackageMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {generatePackageMutation.isPending ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Gerando Pacote...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Gerar Pacote de Produção
              </>
            )}
          </Button>

          {productionPackage && (
            <div className="mt-4 p-3 rounded-lg bg-white/10 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white">Pacote Profissional</span>
                <Badge variant="default" className="text-xs bg-green-600 text-white">
                  Completo
                </Badge>
              </div>
              
              <div className="space-y-2">
                {productionPackage.files?.script && (
                  <Button
                    onClick={() => window.open(productionPackage.files.script, '_blank')}
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white text-xs justify-start"
                  >
                    <FileText className="w-3 h-3 mr-2" />
                    Roteiro Profissional
                  </Button>
                )}
                
                {productionPackage.files?.storyboard && (
                  <Button
                    onClick={() => window.open(productionPackage.files.storyboard, '_blank')}
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white text-xs justify-start"
                  >
                    <Film className="w-3 h-3 mr-2" />
                    Storyboard Detalhado
                  </Button>
                )}
                
                {productionPackage.files?.specs && (
                  <Button
                    onClick={() => window.open(productionPackage.files.specs, '_blank')}
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white text-xs justify-start"
                  >
                    <Settings className="w-3 h-3 mr-2" />
                    Especificações Técnicas
                  </Button>
                )}
                
                {productionPackage.files?.notes && (
                  <Button
                    onClick={() => window.open(productionPackage.files.notes, '_blank')}
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white text-xs justify-start"
                  >
                    <FileText className="w-3 h-3 mr-2" />
                    Notas de Produção
                  </Button>
                )}
                
                {productionPackage.files?.videoPackage && (
                  <Button
                    onClick={() => window.open(productionPackage.files.videoPackage, '_blank')}
                    size="sm"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xs font-semibold justify-start"
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Pacote Completo (JSON)
                  </Button>
                )}
              </div>
              
              <div className="mt-3 pt-2 border-t border-white/20">
                <p className="text-xs text-white/70">
                  {productionPackage.provider} • {productionPackage.processingTime}ms
                </p>
                <p className="text-xs text-green-300 font-medium">
                  Pronto para produção real
                </p>
              </div>
            </div>
          )}

          {systemStatus && (
            <div className="mt-3 p-2 rounded bg-white/5 border border-white/10">
              <div className="text-xs text-white/80 font-medium mb-1">Capacidades do Sistema:</div>
              <div className="text-xs text-white/60 space-y-1">
                {capabilities.slice(0, 3).map((cap: string, i: number) => (
                  <div key={i}>• {cap}</div>
                ))}
                {capabilities.length > 3 && (
                  <div className="text-white/50">+{capabilities.length - 3} mais...</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}