import { useCallback, useState, useEffect, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Video, 
  Play, 
  Loader2, 
  Download, 
  X,
  Settings,
  ExternalLink,
  Upload,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { apiRequest } from '@/lib/queryClient';

interface PikaVideoNodeData {
  prompt?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: string;
  videoUrl?: string;
  isGenerating?: boolean;
}

export const PikaVideoNode = memo(({ id, data }: NodeProps<PikaVideoNodeData>) => {
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [aspectRatio, setAspectRatio] = useState(data?.aspectRatio || '16:9');
  const [style, setStyle] = useState(data?.style || 'cinematic');
  const [videoUrl, setVideoUrl] = useState(data?.videoUrl || '');
  const [manualVideoUrl, setManualVideoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(data?.isGenerating || false);
  const [isResizing, setIsResizing] = useState(false);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [discordInstructions, setDiscordInstructions] = useState<any>(null);

  const { setNodes } = useReactFlow();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateNodeData = useCallback((updates: Partial<PikaVideoNodeData>) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, [id, setNodes]);

  const generateVideo = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erro",
        description: "Digite um prompt para gerar o vídeo",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    updateNodeData({ isGenerating: true });

    try {
      const response = await fetch('/api/pika/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          style
        })
      });

      const data = await response.json();

      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        updateNodeData({ 
          videoUrl: data.videoUrl, 
          isGenerating: false 
        });
        toast({
          title: "Vídeo Gerado!",
          description: "Seu vídeo foi criado com sucesso"
        });
      } else {
        throw new Error(data.error || 'Falha na geração do vídeo');
      }
    } catch (error) {
      console.error('Erro na geração do vídeo:', error);
      toast({
        title: "Erro na Geração",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      updateNodeData({ isGenerating: false });
    }
  };

  const uploadManualVideo = async () => {
    if (!manualVideoUrl.trim()) {
      toast({
        title: "Erro",
        description: "Cole o link do vídeo gerado no Pika Labs",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/pika/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoUrl: manualVideoUrl,
          originalPrompt: prompt
        })
      });

      const data = await response.json();

      if (data.success) {
        setVideoUrl(data.videoUrl);
        updateNodeData({ videoUrl: data.videoUrl });
        setShowManualUpload(false);
        setManualVideoUrl('');
        toast({
          title: "Vídeo Carregado!",
          description: "Vídeo foi adicionado com sucesso"
        });
      } else {
        throw new Error(data.error || 'Falha no upload do vídeo');
      }
    } catch (error) {
      toast({
        title: "Erro no Upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Comando copiado para a área de transferência"
    });
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `pika-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const playVideo = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <Card className="w-80 min-h-[400px] bg-white/95 dark:bg-gray-900/95 backdrop-blur border-2 border-purple-200 dark:border-purple-800 shadow-lg relative">
      <NodeResizer
        color="#8b5cf6"
        isVisible={isResizing}
        minWidth={300}
        minHeight={400}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
      
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#8b5cf6' }}
      />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pika Labs Video
            </h3>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configurações do Vídeo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Proporção</Label>
                  <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as '16:9' | '9:16' | '1:1')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Paisagem)</SelectItem>
                      <SelectItem value="9:16">9:16 (Retrato)</SelectItem>
                      <SelectItem value="1:1">1:1 (Quadrado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estilo</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematic">Cinemático</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="realistic">Realista</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="abstract">Abstrato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="prompt">Prompt do Vídeo</Label>
          <Textarea
            id="prompt"
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o vídeo que você quer criar..."
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={generateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                Gerar Vídeo
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowManualUpload(true)}
            size="sm"
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>

        {videoUrl && (
          <div className="space-y-2">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: '200px' }}
            />
            <div className="flex gap-2">
              <Button onClick={playVideo} variant="outline" size="sm" className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Assistir
              </Button>
              <Button onClick={downloadVideo} variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#8b5cf6' }}
      />

      {/* Manual Upload Dialog */}
      <Dialog open={showManualUpload} onOpenChange={setShowManualUpload}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Manual do Pika Labs</DialogTitle>
          </DialogHeader>
          
          {discordInstructions && (
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Comando para o Discord:</h4>
                <div className="flex items-center gap-2">
                  <code className="bg-black text-green-400 px-2 py-1 rounded flex-1">
                    {discordInstructions.discordCommand}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(discordInstructions.discordCommand)}
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Instruções:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {discordInstructions.instructions.map((instruction: string, index: number) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {discordInstructions.webhook && (
                <Button
                  onClick={() => window.open(discordInstructions.webhook, '_blank')}
                  className="w-full"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Discord do Pika Labs
                </Button>
              )}
            </div>
          )}

          <div className="space-y-4 mt-4">
            <div>
              <Label>Cole o link do vídeo gerado:</Label>
              <Input
                value={manualVideoUrl}
                onChange={(e) => setManualVideoUrl(e.target.value)}
                placeholder="https://cdn.discordapp.com/attachments/..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={uploadManualVideo} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Carregar Vídeo
              </Button>
              <Button
                onClick={() => setShowManualUpload(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
});

PikaVideoNode.displayName = 'PikaVideoNode';