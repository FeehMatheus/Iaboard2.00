import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  Brain, 
  Sparkles, 
  Target, 
  FileText, 
  TrendingUp,
  Play,
  Download,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface FurionInterfaceProps {
  onClose?: () => void;
}

export default function FurionInterface({ onClose }: FurionInterfaceProps) {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [formData, setFormData] = useState({
    prompt: '',
    tipo: 'produto',
    nicho: '',
    avatarCliente: '',
    contexto: ''
  });

  const tiposDisponiveis = [
    { value: 'produto', label: 'Criar Produto Digital', icon: '📦' },
    { value: 'copy', label: 'Copy de Vendas', icon: '✍️' },
    { value: 'anuncio', label: 'Anúncios Meta Ads', icon: '📢' },
    { value: 'funil', label: 'Funil de Vendas', icon: '🚀' },
    { value: 'estrategia', label: 'Estratégia Completa', icon: '🎯' }
  ];

  const processarFurion = async () => {
    if (!formData.prompt) {
      alert('Digite sua ideia ou prompt');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/furion/processar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setResultado(data);
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao processar:', error);
      alert('Erro ao processar com Furion AI');
    }
    
    setLoading(false);
  };

  const criarProdutoCompleto = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/furion/criar-produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideiaProduto: formData.prompt,
          nicho: formData.nicho,
          avatarCliente: formData.avatarCliente,
          precoDesejado: 'R$ 997'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResultado(data);
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto');
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-orange-500/30"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">FURION.AI</h1>
                <p className="text-orange-400">A inteligência forjada para transformar ideias em dinheiro!</p>
              </div>
            </div>
            
            {onClose && (
              <Button 
                onClick={onClose}
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                ✕ Fechar
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <Card className="bg-black/50 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    Configure o Furion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Tipo de Criação
                    </label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                      <SelectTrigger className="bg-black/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposDisponiveis.map(tipo => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.icon} {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Sua Ideia ou Prompt
                    </label>
                    <Textarea
                      value={formData.prompt}
                      onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                      placeholder="Ex: Curso de marketing digital para iniciantes..."
                      className="bg-black/50 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Nicho
                      </label>
                      <Input
                        value={formData.nicho}
                        onChange={(e) => setFormData({...formData, nicho: e.target.value})}
                        placeholder="Ex: Empreendedorismo"
                        className="bg-black/50 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Avatar Cliente
                      </label>
                      <Input
                        value={formData.avatarCliente}
                        onChange={(e) => setFormData({...formData, avatarCliente: e.target.value})}
                        placeholder="Ex: Iniciantes"
                        className="bg-black/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Contexto Adicional
                    </label>
                    <Textarea
                      value={formData.contexto}
                      onChange={(e) => setFormData({...formData, contexto: e.target.value})}
                      placeholder="Informações extras, objetivos específicos..."
                      className="bg-black/50 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={processarFurion}
                  disabled={loading || !formData.prompt}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-6 text-lg font-bold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Furion processando...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Processar com Furion
                    </>
                  )}
                </Button>

                {formData.tipo === 'produto' && (
                  <Button 
                    onClick={criarProdutoCompleto}
                    disabled={loading || !formData.prompt}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-400 hover:bg-orange-500/10 py-4"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Criar Produto Método Completo
                  </Button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {resultado ? (
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Resultado do Furion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <pre className="text-green-300 text-sm whitespace-pre-wrap">
                          {resultado.conteudo}
                        </pre>
                      </div>

                      {resultado.estrutura && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                          <h4 className="text-blue-300 font-semibold mb-2">Estrutura Gerada:</h4>
                          <pre className="text-blue-200 text-sm">
                            {JSON.stringify(resultado.estrutura, null, 2)}
                          </pre>
                        </div>
                      )}

                      {resultado.proximosPassos && (
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                          <h4 className="text-purple-300 font-semibold mb-2">Próximos Passos:</h4>
                          <ul className="text-purple-200 text-sm space-y-1">
                            {resultado.proximosPassos.map((passo: string, index: number) => (
                              <li key={index}>• {passo}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {resultado.estimativaROI && (
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                          <h4 className="text-orange-300 font-semibold mb-2">Estimativa ROI:</h4>
                          <p className="text-orange-200 text-sm">{resultado.estimativaROI}</p>
                        </div>
                      )}

                      {resultado.metodoCompleto && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <h4 className="text-yellow-300 font-semibold mb-2">Método Máquina Milionária:</h4>
                          {Object.entries(resultado.metodoCompleto).map(([fase, descricao]: [string, any]) => (
                            <div key={fase} className="text-yellow-200 text-sm mb-1">
                              <strong>{fase}:</strong> {descricao}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/50 border-gray-600">
                  <CardContent className="p-8 text-center">
                    <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                      Furion está aguardando
                    </h3>
                    <p className="text-gray-500">
                      Digite sua ideia e clique em "Processar com Furion" para começar
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}