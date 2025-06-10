import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  X, 
  Send, 
  Download, 
  Eye, 
  Loader2,
  Sparkles,
  Target,
  FileText,
  Megaphone,
  TrendingUp,
  Layout,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FurionInterfaceProps {
  onClose: () => void;
}

interface FurionResponse {
  success: boolean;
  conteudo: string;
  estrutura?: any;
  arquivos?: Array<{
    nome: string;
    tipo: string;
    conteudo: string;
  }>;
  proximosPassos?: string[];
  estimativaROI?: string;
  metadata?: any;
}

export default function FurionInterface({ onClose }: FurionInterfaceProps) {
  const [activeTab, setActiveTab] = useState('produto');
  const [prompt, setPrompt] = useState('');
  const [nicho, setNicho] = useState('');
  const [avatarCliente, setAvatarCliente] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [resultado, setResultado] = useState<FurionResponse | null>(null);

  const furionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/furion/processar', data);
      return response.json();
    },
  });

  const tipos = [
    {
      id: 'produto',
      nome: 'Criar Produto',
      descricao: 'Crie produtos digitais completos do zero',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500',
      placeholder: 'Crie um curso online sobre marketing digital para iniciantes...'
    },
    {
      id: 'copy',
      nome: 'Copy Persuasiva',
      descricao: 'Textos que convertem e vendem',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-500',
      placeholder: 'Escreva uma copy para vender um curso de culinária vegetariana...'
    },
    {
      id: 'anuncio',
      nome: 'Anúncios',
      descricao: 'Campanhas que geram resultados',
      icon: <Megaphone className="w-6 h-6" />,
      color: 'bg-orange-500',
      placeholder: 'Crie anúncios para Facebook/Instagram para um produto de emagrecimento...'
    },
    {
      id: 'funil',
      nome: 'Funil de Vendas',
      descricao: 'Sistemas completos de conversão',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500',
      placeholder: 'Monte um funil completo para vender um infoproduto de R$ 497...'
    },
    {
      id: 'landing',
      nome: 'Landing Page',
      descricao: 'Páginas que capturam e convertem',
      icon: <Layout className="w-6 h-6" />,
      color: 'bg-red-500',
      placeholder: 'Crie uma landing page para capturar leads interessados em investimentos...'
    },
    {
      id: 'estrategia',
      nome: 'Estratégia',
      descricao: 'Planos completos de marketing',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-indigo-500',
      placeholder: 'Desenvolva uma estratégia completa para lançar um produto...'
    }
  ];

  const tipoAtivo = tipos.find(t => t.id === activeTab);

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    furionMutation.mutate({
      tipo: activeTab,
      prompt: prompt.trim(),
      nicho: nicho.trim(),
      avatarCliente: avatarCliente.trim(),
      orcamento: orcamento.trim(),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadFile = (arquivo: any) => {
    const element = document.createElement('a');
    const file = new Blob([arquivo.conteudo], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = arquivo.nome;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Furion.AI</h2>
                <p className="text-purple-100">Inteligência Artificial para Negócios Digitais</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Tipos */}
          <div className="w-80 bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Escolha o que criar:</h3>
            <div className="space-y-3">
              {tipos.map((tipo) => (
                <motion.div
                  key={tipo.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    activeTab === tipo.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    setActiveTab(tipo.id);
                    setPrompt('');
                    setResultado(null);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activeTab === tipo.id ? 'bg-white/20' : tipo.color
                    }`}>
                      <div className={activeTab === tipo.id ? 'text-white' : 'text-white'}>
                        {tipo.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{tipo.nome}</p>
                      <p className="text-sm opacity-90">{tipo.descricao}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col">
            {/* Formulário */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 rounded-lg ${tipoAtivo?.color}`}>
                  <div className="text-white">
                    {tipoAtivo?.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{tipoAtivo?.nome}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{tipoAtivo?.descricao}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Descreva o que você quer criar:</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={tipoAtivo?.placeholder}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nicho/Segmento:</label>
                    <Input
                      value={nicho}
                      onChange={(e) => setNicho(e.target.value)}
                      placeholder="Ex: Saúde, Tecnologia, Finanças"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Público-alvo:</label>
                    <Input
                      value={avatarCliente}
                      onChange={(e) => setAvatarCliente(e.target.value)}
                      placeholder="Ex: Empreendedores de 25-45 anos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Orçamento (opcional):</label>
                    <Input
                      value={orcamento}
                      onChange={(e) => setOrcamento(e.target.value)}
                      placeholder="Ex: R$ 50-200/dia"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || furionMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {furionMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Furion.AI está criando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Criar com Furion.AI
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Resultados */}
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence>
                {furionMutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Furion.AI está trabalhando...</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Criando conteúdo profissional para você. Isso pode levar alguns segundos.
                    </p>
                  </motion.div>
                )}

                {furionMutation.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Erro no processamento</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ocorreu um erro. Tente novamente ou ajuste sua solicitação.
                    </p>
                  </motion.div>
                )}

                {furionMutation.data && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Resultado criado pelo Furion.AI</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Concluído
                      </Badge>
                    </div>

                    {/* Conteúdo Principal */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Conteúdo Gerado</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(furionMutation.data.conteudo)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-80 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">
                            {furionMutation.data.conteudo}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Arquivos Gerados */}
                    {furionMutation.data.arquivos && furionMutation.data.arquivos.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Arquivos Gerados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-3">
                            {furionMutation.data.arquivos.map((arquivo: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  <div>
                                    <p className="font-medium text-sm">{arquivo.nome}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{arquivo.tipo}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(arquivo.conteudo)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => downloadFile(arquivo)}>
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Próximos Passos */}
                    {furionMutation.data.proximosPassos && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Próximos Passos Recomendados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {furionMutation.data.proximosPassos.map((passo: string, index: number) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {index + 1}
                                  </span>
                                </div>
                                <span className="text-sm">{passo}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* ROI Estimado */}
                    {furionMutation.data.estimativaROI && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-semibold">ROI Estimado</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {furionMutation.data.estimativaROI}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}

                {!furionMutation.isPending && !furionMutation.data && !furionMutation.error && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Pronto para criar?</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Escolha o tipo de conteúdo, descreva o que você quer e deixe o Furion.AI trabalhar para você.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}