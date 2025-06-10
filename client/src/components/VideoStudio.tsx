import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Download, 
  Video, 
  Mic, 
  Settings, 
  Wand2,
  Clock,
  FileVideo,
  Eye,
  Share
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface VideoStudioProps {
  onClose?: () => void;
}

export default function VideoStudio({ onClose }: VideoStudioProps) {
  const [script, setScript] = useState('');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('presentation');
  const [duration, setDuration] = useState(60);
  const [voiceType, setVoiceType] = useState('neutral');
  const [resolution, setResolution] = useState('1080p');
  const [music, setMusic] = useState(false);
  const [createdVideo, setCreatedVideo] = useState<any>(null);
  const [generatingScript, setGeneratingScript] = useState(false);
  const { toast } = useToast();

  // Gerar script automaticamente
  const scriptMutation = useMutation({
    mutationFn: async (data: { prompt: string; type: string }) => {
      const response = await apiRequest('POST', '/api/videos/generate-script', data);
      return response;
    },
    onSuccess: (data) => {
      setScript(data.script);
      setGeneratingScript(false);
      toast({
        title: "Script Gerado!",
        description: "Script criado com sucesso usando IA.",
      });
    },
    onError: () => {
      setGeneratingScript(false);
      toast({
        title: "Erro",
        description: "Falha ao gerar script. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Criar vídeo
  const videoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/videos/create', data);
      return response;
    },
    onSuccess: (data) => {
      setCreatedVideo(data);
      toast({
        title: "Vídeo Criado!",
        description: "Seu vídeo foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar vídeo. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleGenerateScript = () => {
    if (!prompt.trim()) {
      toast({
        title: "Atenção",
        description: "Digite uma descrição para gerar o script.",
        variant: "destructive",
      });
      return;
    }
    
    setGeneratingScript(true);
    scriptMutation.mutate({ prompt, type: 'vsl' });
  };

  const handleCreateVideo = () => {
    if (!script.trim()) {
      toast({
        title: "Atenção", 
        description: "Script é obrigatório para criar o vídeo.",
        variant: "destructive",
      });
      return;
    }

    videoMutation.mutate({
      script,
      style,
      duration,
      voiceType,
      resolution,
      music
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Estúdio de Vídeos IA
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Crie vídeos profissionais com inteligência artificial
                </p>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!createdVideo ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Configurações do Vídeo */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Wand2 className="w-5 h-5" />
                      <span>Gerar Script com IA</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prompt">Descreva o vídeo que deseja criar</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Ex: Um vídeo explicando como nosso produto revoluciona o marketing digital..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={handleGenerateScript}
                      disabled={generatingScript || !prompt.trim()}
                      className="w-full"
                    >
                      {generatingScript ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Gerando Script...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Gerar Script com IA
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileVideo className="w-5 h-5" />
                      <span>Script do Vídeo</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Cole ou edite o script do seu vídeo aqui..."
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5" />
                      <span>Configurações</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Estilo do Vídeo</Label>
                        <Select value={style} onValueChange={setStyle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="presentation">Apresentação</SelectItem>
                            <SelectItem value="animated">Animado</SelectItem>
                            <SelectItem value="live">Ao Vivo</SelectItem>
                            <SelectItem value="documentary">Documentário</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Tipo de Voz</Label>
                        <Select value={voiceType} onValueChange={setVoiceType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Masculina</SelectItem>
                            <SelectItem value="female">Feminina</SelectItem>
                            <SelectItem value="neutral">Neutra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Duração (segundos)</Label>
                        <Input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          min="30"
                          max="300"
                        />
                      </div>

                      <div>
                        <Label>Resolução</Label>
                        <Select value={resolution} onValueChange={setResolution}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="720p">HD (720p)</SelectItem>
                            <SelectItem value="1080p">Full HD (1080p)</SelectItem>
                            <SelectItem value="4k">4K Ultra HD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="music"
                        checked={music}
                        onChange={(e) => setMusic(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="music">Incluir música de fundo</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview e Criação */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>Preview do Vídeo</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          {script ? 'Clique em "Criar Vídeo" para gerar' : 'Adicione um script para visualizar'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resumo da Criação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duração:</span>
                      <Badge variant="outline">{duration}s</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Resolução:</span>
                      <Badge variant="outline">{resolution}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Estilo:</span>
                      <Badge variant="outline">{style}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Voz:</span>
                      <Badge variant="outline">{voiceType}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Música:</span>
                      <Badge variant="outline">{music ? 'Sim' : 'Não'}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleCreateVideo}
                  disabled={videoMutation.isPending || !script.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3"
                  size="lg"
                >
                  {videoMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Criando Vídeo...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Criar Vídeo com IA
                    </>
                  )}
                </Button>

                {videoMutation.isPending && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso da criação</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          Tempo estimado: 2-3 minutos
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            /* Vídeo Criado */
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
              >
                <Play className="w-10 h-10 text-white" />
              </motion.div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Vídeo Criado com Sucesso!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Seu vídeo foi gerado e está pronto para uso
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                    <video 
                      controls 
                      className="w-full h-full rounded-lg"
                      poster={createdVideo.thumbnailUrl}
                    >
                      <source src={createdVideo.videoUrl} type="video/mp4" />
                      Seu navegador não suporta vídeo HTML5.
                    </video>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>ID do Vídeo:</span>
                      <span className="font-mono">{createdVideo.videoId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {createdVideo.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Duração:</span>
                      <span>{createdVideo.metadata.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tamanho:</span>
                      <span>{createdVideo.metadata.fileSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <a href={createdVideo.downloadUrl} download>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Vídeo
                  </a>
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCreatedVideo(null)}
                >
                  Criar Novo Vídeo
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}