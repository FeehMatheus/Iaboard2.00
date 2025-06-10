import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, DollarSign, Users, Eye, Download, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrafficAIModuleProps {
  projectData?: any;
  onCampaignGenerated?: (campaign: any) => void;
  onClose?: () => void;
}

export default function TrafficAIModule({ projectData, onCampaignGenerated, onClose }: TrafficAIModuleProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [spyData, setSpyData] = useState<any>(null);
  const [formData, setFormData] = useState({
    produto: projectData?.produto || '',
    avatar: projectData?.avatar || 'empreendedores',
    oferta: projectData?.oferta || '',
    nicho: projectData?.nicho || '',
    orcamento: 3000,
    objetivo: 'vendas' as 'vendas' | 'leads' | 'awareness' | 'trafego',
    plataforma: 'meta' as 'meta' | 'google' | 'tiktok' | 'youtube' | 'todas',
    publico: {
      idade: '25-45',
      genero: 'todos',
      interesses: ['empreendedorismo', 'marketing digital'],
      comportamentos: ['compradores online'],
      localizacao: 'Brasil'
    }
  });

  const handleGenerateCampaigns = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/traffic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.campaigns);
        setSelectedCampaign(result.campaigns[0]);
        onCampaignGenerated?.(result.campaigns);
      }
    } catch (error) {
      console.error('Erro na geração de campanhas:', error);
    }
    
    setIsGenerating(false);
  };

  const handleSpyCompetitors = async () => {
    try {
      const response = await fetch('/api/ai/traffic/spy-competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nicho: formData.nicho, 
          plataforma: formData.plataforma 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSpyData(result.spyData);
      }
    } catch (error) {
      console.error('Erro na espionagem:', error);
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('pt-BR').format(value);

  const getPlatformIcon = (platform: string) => {
    const icons = {
      meta: '📘',
      google: '🔍',
      tiktok: '🎵',
      youtube: '📺'
    };
    return icons[platform as keyof typeof icons] || '📊';
  };

  const renderCampaignCard = (campaign: any, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selectedCampaign?.nome === campaign.nome 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => setSelectedCampaign(campaign)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getPlatformIcon(campaign.plataforma)}</span>
          <div>
            <h4 className="font-semibold">{campaign.nome}</h4>
            <Badge variant="outline" className="text-xs">
              {campaign.plataforma.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Orçamento Diário</div>
          <div className="font-bold text-green-600">
            {formatCurrency(campaign.configuracao.orcamentoDiario)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-500">CTR Estimado</div>
          <div className="font-semibold text-blue-600">{campaign.predicoes.ctr}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">CPC Médio</div>
          <div className="font-semibold text-orange-600">{formatCurrency(campaign.predicoes.cpc)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">ROI Projetado</div>
          <div className="font-semibold text-green-600">{campaign.predicoes.roi}x</div>
        </div>
      </div>
    </motion.div>
  );

  const renderCreativeCard = (criativo: any, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-blue-50"
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary">{criativo.tipo.toUpperCase()}</Badge>
        <Button size="sm" variant="ghost">
          <Eye className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-xs font-medium text-gray-600 mb-1">TÍTULO</div>
          <div className="font-semibold text-sm">{criativo.titulo}</div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-gray-600 mb-1">DESCRIÇÃO</div>
          <div className="text-sm text-gray-700">{criativo.descricao}</div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-gray-600 mb-1">TEXTO DO ANÚNCIO</div>
          <div className="text-sm text-gray-800 bg-white p-2 rounded border">
            {criativo.texto}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {criativo.cta}
          </Badge>
          <div className="text-xs text-gray-500">{criativo.sugestaoVisual}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Traffic AI Supremo
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="configuracao" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="configuracao">Configuração</TabsTrigger>
              <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
              <TabsTrigger value="criativos">Criativos</TabsTrigger>
              <TabsTrigger value="espionagem">Espionagem</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <TabsContent value="configuracao" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
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
                    <label className="text-sm font-medium">Orçamento Total (R$)</label>
                    <Input
                      type="number"
                      value={formData.orcamento}
                      onChange={(e) => setFormData({ ...formData, orcamento: Number(e.target.value) })}
                      placeholder="3000"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Objetivo</label>
                    <Select value={formData.objetivo} onValueChange={(value: any) => setFormData({ ...formData, objetivo: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="leads">Leads</SelectItem>
                        <SelectItem value="awareness">Awareness</SelectItem>
                        <SelectItem value="trafego">Tráfego</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Plataforma</label>
                    <Select value={formData.plataforma} onValueChange={(value: any) => setFormData({ ...formData, plataforma: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meta">Meta Ads</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="tiktok">TikTok Ads</SelectItem>
                        <SelectItem value="youtube">YouTube Ads</SelectItem>
                        <SelectItem value="todas">Todas as Plataformas</SelectItem>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Interesses do Público</label>
                    <Input
                      value={formData.publico.interesses.join(', ')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        publico: { 
                          ...formData.publico, 
                          interesses: e.target.value.split(', ').filter(Boolean) 
                        } 
                      })}
                      placeholder="empreendedorismo, marketing digital, vendas"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Faixa Etária</label>
                    <Select 
                      value={formData.publico.idade} 
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        publico: { ...formData.publico, idade: value } 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24 anos</SelectItem>
                        <SelectItem value="25-34">25-34 anos</SelectItem>
                        <SelectItem value="35-44">35-44 anos</SelectItem>
                        <SelectItem value="45-54">45-54 anos</SelectItem>
                        <SelectItem value="25-45">25-45 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleGenerateCampaigns} 
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Gerando Campanhas...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Gerar Campanhas IA
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={handleSpyCompetitors} 
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Espionar Concorrentes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="campanhas" className="space-y-4">
                {campaigns.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaigns.map((campaign, index) => renderCampaignCard(campaign, index))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Configure e gere suas campanhas primeiro</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="criativos" className="space-y-4">
                {selectedCampaign ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Criativos - {selectedCampaign.nome}</h4>
                      <Badge variant="outline">{selectedCampaign.plataforma.toUpperCase()}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedCampaign.criativos?.map((criativo: any, index: number) => 
                        renderCreativeCard(criativo, index)
                      )}
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h5 className="font-semibold text-amber-800 mb-2">Variações A/B Sugeridas</h5>
                      <div className="space-y-2">
                        {selectedCampaign.variacoesAB?.map((variacao: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="font-medium">{variacao.variacao}:</span>
                            <span className="text-amber-700">{variacao.hipotese}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Selecione uma campanha para ver os criativos</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="espionagem" className="space-y-4">
                {spyData ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-bold text-red-800 mb-2">🕵️ Análise Competitiva</h4>
                      <p className="text-red-700">Nicho: {formData.nicho} | Plataforma: {formData.plataforma.toUpperCase()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-800 mb-3">Criativos Dominantes</h5>
                        <ul className="space-y-1 text-sm">
                          {spyData.criativosDominantes?.map((item: string, index: number) => (
                            <li key={index} className="text-blue-700">• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-3">Padrões de Copy</h5>
                        <ul className="space-y-1 text-sm">
                          {spyData.copyPatterns?.map((item: string, index: number) => (
                            <li key={index} className="text-green-700">• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-800 mb-3">Segmentação Eficaz</h5>
                        <ul className="space-y-1 text-sm">
                          {spyData.segmentacao?.map((item: string, index: number) => (
                            <li key={index} className="text-purple-700">• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-orange-800 mb-3">Oportunidades</h5>
                        <ul className="space-y-1 text-sm">
                          {spyData.oportunidades?.map((item: string, index: number) => (
                            <li key={index} className="text-orange-700">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold mb-3">Recomendações Estratégicas</h5>
                      <ul className="space-y-2">
                        {spyData.recomendacoes?.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Use a espionagem para analisar concorrentes</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                {selectedCampaign && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="font-bold text-xl mb-4">Predições de Performance</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{selectedCampaign.predicoes.ctr}%</div>
                          <div className="text-sm opacity-90">CTR Estimado</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatCurrency(selectedCampaign.predicoes.cpc)}</div>
                          <div className="text-sm opacity-90">CPC Médio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatNumber(selectedCampaign.predicoes.conversoes)}</div>
                          <div className="text-sm opacity-90">Conversões/Mês</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{selectedCampaign.predicoes.roi}x</div>
                          <div className="text-sm opacity-90">ROI Projetado</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-3">Otimizações Recomendadas</h5>
                        <ul className="space-y-2">
                          {selectedCampaign.otimizacoes?.map((otim: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span className="text-green-700">{otim}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-3">Métricas de Acompanhamento</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Alcance Mensal</span>
                            <span className="font-semibold">{formatNumber(selectedCampaign.predicoes.alcance)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Impressões</span>
                            <span className="font-semibold">{formatNumber(selectedCampaign.predicoes.alcance * 2.5)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cliques Estimados</span>
                            <span className="font-semibold">{formatNumber(Math.round(selectedCampaign.predicoes.alcance * selectedCampaign.predicoes.ctr / 100))}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold">Exportar Campanha</h5>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            CSV
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            PDF
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Zap className="w-3 h-3 mr-1" />
                            Publicar
                          </Button>
                        </div>
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