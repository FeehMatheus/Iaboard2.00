import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Brain, Sparkles, Download, Copy, RefreshCw, Zap, Target, TrendingUp, Eye, Star, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FurionAIProps {
  onClose: () => void;
}

interface FurionResult {
  success: boolean;
  conteudo: string;
  estrutura?: any;
  proximosPassos?: string[];
  estimativaROI?: string;
  arquivos?: Array<{
    nome: string;
    tipo: string;
    conteudo: string;
  }>;
}

export default function FurionAI({ onClose }: FurionAIProps) {
  const [prompt, setPrompt] = useState('');
  const [tipo, setTipo] = useState<'produto' | 'copy' | 'anuncio' | 'funil' | 'estrategia'>('produto');
  const [nicho, setNicho] = useState('');
  const [avatarCliente, setAvatarCliente] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [result, setResult] = useState<FurionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');
  
  const { toast } = useToast();

  const furionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/furion/processar', data);
      return await response.json();
    },
    onSuccess: (data: FurionResult) => {
      setResult(data);
      setActiveTab('result');
      toast({
        title: "✨ Furion.AI Processado!",
        description: "Sua solução foi gerada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no Furion.AI",
        description: error.message || "Erro ao processar sua solicitação",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva o que você quer criar",
        variant: "destructive",
      });
      return;
    }

    furionMutation.mutate({
      prompt,
      tipo,
      nicho,
      avatarCliente,
      orcamento,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência",
    });
  };

  const downloadFile = (arquivo: any) => {
    const blob = new Blob([arquivo.conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = arquivo.nome;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">FURION.AI</h2>
              <p className="text-purple-200">Inteligência Artificial Multimilionária</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'input'
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Nova Criação
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'result'
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-800/50'
                  : 'text-gray-400 hover:text-white'
              }`}
              disabled={!result}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Resultados
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Tipo de Criação */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { value: 'produto', label: 'Produto Digital', icon: Zap, color: 'from-orange-500 to-red-500' },
                    { value: 'copy', label: 'Copy de Vendas', icon: Star, color: 'from-green-500 to-teal-500' },
                    { value: 'anuncio', label: 'Anúncios', icon: Eye, color: 'from-blue-500 to-purple-500' },
                    { value: 'funil', label: 'Funil Completo', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
                    { value: 'estrategia', label: 'Estratégia', icon: Globe, color: 'from-yellow-500 to-orange-500' },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setTipo(option.value as any)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        tipo === option.value
                          ? `border-purple-500 bg-gradient-to-br ${option.color} text-white`
                          : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                      }`}
                    >
                      <option.icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-semibold">{option.label}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Prompt Principal */}
                <div>
                  <Label className="text-white text-lg font-semibold mb-3 block">
                    Descreva o que você quer criar
                  </Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Quero criar um curso sobre marketing digital para iniciantes que ensina como fazer a primeira venda em 30 dias..."
                    className="min-h-32 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 resize-none"
                  />
                </div>

                {/* Campos Adicionais */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white font-semibold mb-2 block">Nicho (Opcional)</Label>
                    <Input
                      value={nicho}
                      onChange={(e) => setNicho(e.target.value)}
                      placeholder="Ex: Emagrecimento"
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label className="text-white font-semibold mb-2 block">Avatar Cliente (Opcional)</Label>
                    <Input
                      value={avatarCliente}
                      onChange={(e) => setAvatarCliente(e.target.value)}
                      placeholder="Ex: Mulheres 25-40 anos"
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label className="text-white font-semibold mb-2 block">Orçamento (Opcional)</Label>
                    <Input
                      value={orcamento}
                      onChange={(e) => setOrcamento(e.target.value)}
                      placeholder="Ex: R$ 5.000"
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Botão de Gerar */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={furionMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {furionMutation.isPending ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                        FURION TRABALHANDO...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        GERAR COM FURION.AI
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Header do Resultado */}
                <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-green-400">✨ Criação Finalizada!</h3>
                    <Badge className="bg-green-500 text-white">Sucesso</Badge>
                  </div>
                  {result.estimativaROI && (
                    <p className="text-green-300">
                      <strong>ROI Estimado:</strong> {result.estimativaROI}
                    </p>
                  )}
                </div>

                {/* Conteúdo Principal */}
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Conteúdo Gerado</CardTitle>
                    <Button
                      onClick={() => copyToClipboard(result.conteudo)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                  </CardHeader>
                  <CardContent className="text-gray-300">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed max-h-80 overflow-y-auto">
                      {result.conteudo}
                    </div>
                  </CardContent>
                </Card>

                {/* Próximos Passos */}
                {result.proximosPassos && result.proximosPassos.length > 0 && (
                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-400" />
                        Próximos Passos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.proximosPassos.map((passo, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{passo}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Arquivos Gerados */}
                {result.arquivos && result.arquivos.length > 0 && (
                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Download className="w-5 h-5 mr-2 text-green-400" />
                        Arquivos Gerados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {result.arquivos.map((arquivo, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-semibold">{arquivo.nome}</h4>
                                <p className="text-gray-400 text-sm">{arquivo.tipo}</p>
                              </div>
                              <Button
                                onClick={() => downloadFile(arquivo)}
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:text-white"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Ações */}
                <div className="flex justify-center space-x-4 pt-4">
                  <Button
                    onClick={() => setActiveTab('input')}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white"
                  >
                    Nova Criação
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Tudo
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}