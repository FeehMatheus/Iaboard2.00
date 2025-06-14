import { useCallback, useState, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Video, Play, Download, ExternalLink, Loader2, Settings, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BRAND_CONFIG } from '@/lib/constants';

interface VideoNodeData {
  text?: string;
  voice?: string;
  avatar?: string;
  type?: 'did' | 'runwayml' | 'pika';
  videoUrl?: string;
  isGenerating?: boolean;
}

export const VideoNode = memo(({ id, data }: NodeProps<VideoNodeData>) => {
  const [text, setText] = useState(data?.text || '');
  const [voice, setVoice] = useState(data?.voice || 'pt-BR-FranciscaNeural');
  const [avatar, setAvatar] = useState(data?.avatar || 'amy-jcwCkr1grs');
  const [type, setType] = useState<'did' | 'runwayml' | 'pika'>(data?.type || 'did');
  const [videoUrl, setVideoUrl] = useState(data?.videoUrl || '');
  const [isGenerating, setIsGenerating] = useState(data?.isGenerating || false);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [availableAvatars, setAvailableAvatars] = useState<any[]>([]);

  const { setNodes } = useReactFlow();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateNodeData = useCallback((updates: Partial<VideoNodeData>) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            }
          : node
      )
    );
  }, [id, setNodes]);

  const loadOptions = useCallback(async () => {
    try {
      const [voicesRes, avatarsRes] = await Promise.all([
        fetch('/api/video/voices'),
        fetch('/api/video/avatars')
      ]);

      if (voicesRes.ok) {
        const voicesData = await voicesRes.json();
        setAvailableVoices(voicesData.voices || []);
      }

      if (avatarsRes.ok) {
        const avatarsData = await avatarsRes.json();
        setAvailableAvatars(avatarsData.avatars || []);
      }
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const generateVideo = async () => {
    if (!text.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite o texto para o vídeo.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    updateNodeData({ isGenerating: true, text, voice, avatar, type });

    try {
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          avatar,
          type,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.videoUrl) {
          setVideoUrl(result.videoUrl);
          updateNodeData({ videoUrl: result.videoUrl, isGenerating: false });
          
          toast({
            title: "Vídeo Gerado!",
            description: `Vídeo criado com sucesso usando ${type.toUpperCase()}`,
          });
        } else if (result.instructionsUrl) {
          window.open(result.instructionsUrl, '_blank');
          updateNodeData({ isGenerating: false });
          
          toast({
            title: "Redirecionado!",
            description: `Abrindo ${type.toUpperCase()} para geração manual`,
          });
        }
      } else {
        throw new Error(result.error || 'Falha na geração do vídeo');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha na geração do vídeo",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      updateNodeData({ isGenerating: false });
    }
  };

  const deleteNode = () => {
    setNodes(nodes => nodes.filter(node => node.id !== id));
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `video-${id}.mp4`;
      a.click();
    }
  };

  const getProviderInfo = () => {
    switch (type) {
      case 'did':
        return {
          name: 'D-ID',
          description: 'IA com avatar real e voz natural',
          color: 'from-blue-500 to-cyan-500'
        };
      case 'runwayml':
        return {
          name: 'RunwayML',
          description: 'Geração de vídeo por IA',
          color: 'from-green-500 to-emerald-500'
        };
      case 'pika':
        return {
          name: 'Pika Labs',
          description: 'Vídeos criativos via Discord',
          color: 'from-purple-500 to-violet-500'
        };
      default:
        return {
          name: 'Vídeo IA',
          description: 'Geração de vídeo',
          color: 'from-gray-500 to-gray-600'
        };
    }
  };

  const providerInfo = getProviderInfo();

  return (
    <div className={`relative ${isResizing ? 'select-none' : ''}`}>
      <NodeResizer
        color="#00d9ff"
        isVisible={true}
        minWidth={320}
        minHeight={300}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
      
      <Card className={`w-full h-full bg-gray-900/95 border-gray-700 backdrop-blur-sm transition-all duration-200 ${
        isExpanded ? 'min-h-[700px]' : 'min-h-[500px]'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 bg-gradient-to-r ${providerInfo.color} rounded-full animate-pulse`} />
              <h3 className="text-sm font-medium text-gray-100">
                Vídeo {providerInfo.name}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteNode}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Select value={type} onValueChange={(value: 'did' | 'runwayml' | 'pika') => setType(value)}>
              <SelectTrigger className="h-8 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="did">D-ID (Avatar + Voz)</SelectItem>
                <SelectItem value="runwayml">RunwayML Gen-2</SelectItem>
                <SelectItem value="pika">Pika Labs</SelectItem>
              </SelectContent>
            </Select>

            {type === 'did' && (
              <div className="grid grid-cols-2 gap-2">
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger className="h-8 bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Voz" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {availableVoices.map(voiceOption => (
                      <SelectItem key={voiceOption} value={voiceOption}>
                        {voiceOption.includes('pt-BR') ? 'Português' : 
                         voiceOption.includes('en-US') ? 'Inglês' : voiceOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={avatar} onValueChange={setAvatar}>
                  <SelectTrigger className="h-8 bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Avatar" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {availableAvatars.map(avatarOption => (
                      <SelectItem key={avatarOption.id} value={avatarOption.id}>
                        {avatarOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Texto para o vídeo:
            </label>
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite o texto que será falado no vídeo..."
              className="min-h-[100px] bg-gray-800 border-gray-600 text-gray-100"
              disabled={isGenerating}
            />
          </div>

          {videoUrl && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block">
                Vídeo Gerado:
              </label>
              <div className="bg-gray-800 rounded-lg p-3">
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded max-h-48"
                  poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMUYyOTM3Ii8+Cjxwb2x5Z29uIHBvaW50cz0iMTIwLDYwIDE4MCw5MCAxMjAsMTIwIiBmaWxsPSIjMDBkOWZmIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNsaXF1ZSBwYXJhIHJlcHJvZHV6aXI8L3RleHQ+Cjwvc3ZnPgo="
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={downloadVideo}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(videoUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Abrir
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-gray-800/50 p-2 rounded">
            <strong>{providerInfo.name}:</strong> {providerInfo.description}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={generateVideo}
            disabled={!text.trim() || isGenerating}
            className={`w-full bg-gradient-to-r ${providerInfo.color} hover:opacity-90 transition-opacity`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Gerando vídeo...
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                Gerar Vídeo com {providerInfo.name}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-cyan-500 border-2 border-white"
      />
    </div>
  );
});

VideoNode.displayName = 'VideoNode';