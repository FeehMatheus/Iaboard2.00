import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Play, Download, Copy, Sparkles, Eye, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoAIModuleProps {
  projectData?: any;
  onVideoGenerated?: (video: any) => void;
  onClose?: () => void;
}

export default function VideoAIModule({ projectData, onVideoGenerated, onClose }: VideoAIModuleProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [variations, setVariations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    produto: projectData?.produto || '',
    avatar: projectData?.avatar || 'empreendedores',
    oferta: projectData?.oferta || '',
    nicho: projectData?.nicho || '',
    objetivo: 'venda_direta' as 'engajamento' | 'autoridade' | 'venda_direta',
    formato: 'reels' as 'reels' | 'shorts' | 'anuncio_youtube' | 'meta_ads',
    duracao: '30s' as '15s' | '30s' | '60s' | '90s'
  });

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCurrentVideo(result.video);
        onVideoGenerated?.(result.video);
      }
    } catch (error) {
      console.error('Erro na geração de vídeo:', error);
    }
    
    setIsGenerating(false);
  };

  const handleGenerateVariations = async () => {
    if (!currentVideo) return;
    
    try {
      const response = await fetch('/api/ai/video/variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseVideo: currentVideo, count: 3 })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setVariations(result.variations);
      }
    } catch (error) {
      console.error('Erro nas variações:', error);
    }
  };

  const formatRoteiro = (roteiro: any[]) => {
    return roteiro.map((cena, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="border rounded-lg p-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50"
      >
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="font-mono">
            Cena {cena.cena} • {cena.tempo}
          </Badge>
          <Badge variant="secondary">{cena.legenda}</Badge>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-sm text-gray-600">Narração:</span>
            <p className="text-sm mt-1">{cena.naracao}</p>
          </div>
          
          <div>
            <span className="font-semibold text-sm text-gray-600">Visual:</span>
            <p className="text-sm text-gray-700 mt-1">{cena.visual}</p>
          </div>
        </div>
      </motion.div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-6 h-6" />
              IA Vídeo Suprema
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="configuracao" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="configuracao">Configuração</TabsTrigger>
              <TabsTrigger value="roteiro">Roteiro</TabsTrigger>
              <TabsTrigger value="variacoes">Variações A/B</TabsTrigger>
              <TabsTrigger value="exportar">Exportar</TabsTrigger>
            </TabsList>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <TabsContent value="configuracao" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Produto</label>
                    <Input
                      value={formData.produto}
                      onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                      placeholder="Ex: Curso de Marketing Digital"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Avatar</label>
                    <Input
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="Ex: empreendedores iniciantes"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Objetivo</label>
                    <Select value={formData.objetivo} onValueChange={(value: any) => setFormData({ ...formData, objetivo: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venda_direta">Venda Direta</SelectItem>
                        <SelectItem value="engajamento">Engajamento</SelectItem>
                        <SelectItem value="autoridade">Autoridade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Formato</label>
                    <Select value={formData.formato} onValueChange={(value: any) => setFormData({ ...formData, formato: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reels">Instagram Reels</SelectItem>
                        <SelectItem value="shorts">YouTube Shorts</SelectItem>
                        <SelectItem value="anuncio_youtube">Anúncio YouTube</SelectItem>
                        <SelectItem value="meta_ads">Meta Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Duração</label>
                    <Select value={formData.duracao} onValueChange={(value: any) => setFormData({ ...formData, duracao: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15s">15 segundos</SelectItem>
                        <SelectItem value="30s">30 segundos</SelectItem>
                        <SelectItem value="60s">60 segundos</SelectItem>
                        <SelectItem value="90s">90 segundos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Nicho</label>
                    <Input
                      value={formData.nicho}
                      onChange={(e) => setFormData({ ...formData, nicho: e.target.value })}
                      placeholder="Ex: desenvolvimento pessoal"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Oferta</label>
                  <Textarea
                    value={formData.oferta}
                    onChange={(e) => setFormData({ ...formData, oferta: e.target.value })}
                    placeholder="Descreva sua oferta principal..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleGenerateVideo} 
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Gerando Roteiro...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Gerar Vídeo IA
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="roteiro" className="space-y-4">
                {currentVideo ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                      <h3 className="font-bold text-lg text-orange-800">{currentVideo.titulo}</h3>
                      <p className="text-orange-700 mt-2 font-medium">{currentVideo.gancho}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Roteiro Detalhado
                      </h4>
                      {formatRoteiro(currentVideo.roteiro)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800">CTA Final</h5>
                        <p className="text-green-700 mt-1">{currentVideo.cta}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800">Estilo Visual</h5>
                        <p className="text-blue-700 mt-1">{currentVideo.estiloVisual}</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h5 className="font-semibold text-purple-800">Trilha Sonora</h5>
                      <p className="text-purple-700 mt-1">{currentVideo.trilhaSonora}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Configure e gere seu vídeo primeiro</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="variacoes" className="space-y-4">
                {currentVideo && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Variações para Teste A/B</h4>
                      <Button onClick={handleGenerateVariations} variant="outline">
                        <Target className="w-4 h-4 mr-2" />
                        Gerar Variações
                      </Button>
                    </div>

                    <AnimatePresence>
                      {variations.map((variation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-blue-50"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline">Variação {index + 1}</Badge>
                            <Button size="sm" variant="ghost">
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-sm">Título:</span>
                              <p className="text-sm mt-1">{variation.titulo}</p>
                            </div>
                            <div>
                              <span className="font-medium text-sm">Gancho:</span>
                              <p className="text-sm mt-1">{variation.gancho}</p>
                            </div>
                            <div>
                              <span className="font-medium text-sm">CTA:</span>
                              <p className="text-sm mt-1">{variation.cta}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="exportar" className="space-y-4">
                {currentVideo && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Exportar Roteiro</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                      
                      <Button variant="outline" className="flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Copiar Roteiro
                      </Button>
                      
                      <Button variant="outline" className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Enviar para Editor
                      </Button>
                      
                      <Button variant="outline" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Gerar Vídeo Real
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Adaptações por Plataforma:</h5>
                      <div className="space-y-2">
                        {currentVideo.adaptacoes?.map((adaptacao: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="font-medium">{adaptacao.plataforma}:</span>
                            <span className="text-gray-600">{adaptacao.ajustes}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}