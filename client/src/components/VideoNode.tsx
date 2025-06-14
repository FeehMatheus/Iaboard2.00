import { useCallback, useState, useEffect, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  Play, 
  Loader2, 
  Download, 
  X,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VideoNodeData {
  text?: string;
  voice?: string;
  avatar?: string;
  type?: 'did' | 'runway' | 'pika';
  videoUrl?: string;
  isGenerating?: boolean;
}

export const VideoNode = memo(({ id, data }: NodeProps<VideoNodeData>) => {
  const [text, setText] = useState(data?.text || '');
  const [voice, setVoice] = useState(data?.voice || 'pt-BR-FranciscaNeural');
  const [avatar, setAvatar] = useState(data?.avatar || 'amy-jcwCkr1grs');
  const [type, setType] = useState(data?.type || 'did');
  const [videoUrl, setVideoUrl] = useState(data?.videoUrl || '');
  const [isGenerating, setIsGenerating] = useState(data?.isGenerating || false);
  const [isResizing, setIsResizing] = useState(false);
  const [voices, setVoices] = useState<string[]>([]);
  const [avatars, setAvatars] = useState<Array<{id: string, name: string, preview_url?: string}>>([]);

  const { setNodes } = useReactFlow();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load available voices and avatars
  useEffect(() => {
    const loadResources = async () => {
      try {
        const [voicesRes, avatarsRes] = await Promise.all([
          fetch('/api/video/voices'),
          fetch('/api/video/avatars')
        ]);
        
        const voicesData = await voicesRes.json();
        const avatarsData = await avatarsRes.json();
        
        if (voicesData.success) {
          setVoices(voicesData.voices);
        }
        
        if (avatarsData.success) {
          setAvatars(avatarsData.avatars);
        }
      } catch (error) {
        console.error('Failed to load video resources:', error);
      }
    };

    loadResources();
  }, []);

  // Update node data when state changes
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                text,
                voice,
                avatar,
                type,
                videoUrl,
                isGenerating,
              },
            }
          : node
      )
    );
  }, [text, voice, avatar, type, videoUrl, isGenerating, id, setNodes]);

  const generateVideo = async () => {
    if (!text.trim()) {
      toast({
        title: "Texto Obrigatório",
        description: "Digite o texto para gerar o vídeo.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setVideoUrl('');

    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: text.trim(),
          voice,
          avatar,
          type,
        }),
      });

      const data = await response.json();

      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        toast({
          title: "Vídeo Gerado!",
          description: "Vídeo criado com sucesso usando D-ID.",
        });
      } else {
        throw new Error(data.error || 'Falha na geração do vídeo');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "Erro na Geração",
        description: error instanceof Error ? error.message : "Falha ao gerar vídeo",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteNode = () => {
    setNodes(nodes => nodes.filter(node => node.id !== id));
  };

  const downloadVideo = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className={`relative ${isResizing ? 'select-none' : ''}`}>
      <NodeResizer
        color="#ec4899"
        isVisible={true}
        minWidth={320}
        minHeight={400}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
      
      <Card className="w-full h-full bg-card border-border shadow-lg">
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Gerador de Vídeo IA</h3>
                <p className="text-xs text-muted-foreground">D-ID, RunwayML, Pika Labs</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteNode}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Select value={type} onValueChange={(value: 'did' | 'runway' | 'pika') => setType(value)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="did">D-ID (Avatar + Voz)</SelectItem>
              <SelectItem value="runway">RunwayML (Geração)</SelectItem>
              <SelectItem value="pika">Pika Labs (Animação)</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-1 p-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Script do Vídeo:
            </label>
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite o texto que será falado no vídeo..."
              className="min-h-[80px] text-sm"
              disabled={isGenerating}
            />
          </div>

          {type === 'did' && (
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Avatar:
                </label>
                <Select value={avatar} onValueChange={setAvatar}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {avatars.map((av) => (
                      <SelectItem key={av.id} value={av.id}>
                        {av.name || av.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Voz:
                </label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {videoUrl && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block">
                Vídeo Gerado:
              </label>
              <div className="bg-muted p-3 rounded-lg">
                <video 
                  controls 
                  className="w-full h-32 object-cover rounded"
                  src={videoUrl}
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='12'%3ECarregando...%3C/text%3E%3C/svg%3E"
                />
                <Button
                  size="sm"
                  onClick={downloadVideo}
                  className="mt-2 h-7 text-xs w-full"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Abrir Vídeo
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={generateVideo}
            disabled={!text.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 transition-opacity"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Gerando Vídeo...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Gerar Vídeo com IA
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 border-2 border-background"
      />
    </div>
  );
});

VideoNode.displayName = 'VideoNode';