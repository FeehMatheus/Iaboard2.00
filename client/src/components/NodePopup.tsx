import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionButton, DownloadButton } from "@/components/ActionButton";
import {
  gerarProdutoIA,
  gerarPaginaVendas,
  gerarVideoIA,
  iniciarCampanhaAds,
  gerarFunilCompleto,
  gerarSequenciaEmail,
  baixarPDF,
  gerarRelatorioAnalytics,
  gerarCopywriting,
  gerarEstrategia,
  ActionResult
} from "@/lib/aiActions";
import {
  Brain,
  Video,
  Mail,
  Target,
  TrendingUp,
  FileText,
  BarChart3,
  Rocket,
  Download,
  Eye,
  Settings,
  Play
} from "lucide-react";

interface Node {
  id: string;
  type: string;
  title: string;
  content?: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data?: any;
}

interface NodePopupProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (nodeId: string, updates: Partial<Node>) => void;
}

export function NodePopup({ node, isOpen, onClose, onUpdate }: NodePopupProps) {
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState("config");
  const [results, setResults] = useState<any>(null);

  if (!node) return null;

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuccess = (result: ActionResult) => {
    setResults(result.data);
    setActiveTab("results");
    onUpdate(node.id, {
      content: result.data,
      data: { ...node.data, lastResult: result.data }
    });
  };

  const renderConfigTab = () => {
    switch (node.type) {
      case 'produto':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="niche">Nicho do Produto</Label>
              <Select onValueChange={(value) => handleFormChange('niche', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nicho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing-digital">Marketing Digital</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="fitness">Fitness e Saúde</SelectItem>
                  <SelectItem value="financas">Finanças Pessoais</SelectItem>
                  <SelectItem value="programacao">Programação</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience">Público-Alvo</Label>
              <Input
                placeholder="Ex: Empreendedores iniciantes"
                value={formData.audience || ''}
                onChange={(e) => handleFormChange('audience', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="priceRange">Faixa de Preço</Label>
              <Select onValueChange={(value) => handleFormChange('priceRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R$ 97 - R$ 197">R$ 97 - R$ 197</SelectItem>
                  <SelectItem value="R$ 297 - R$ 497">R$ 297 - R$ 497</SelectItem>
                  <SelectItem value="R$ 697 - R$ 997">R$ 697 - R$ 997</SelectItem>
                  <SelectItem value="R$ 1.997+">R$ 1.997+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ActionButton
              label="Criar Produto com IA"
              loadingLabel="Gerando produto"
              successLabel="Produto criado!"
              action={() => gerarProdutoIA({
                niche: formData.niche || 'marketing-digital',
                audience: formData.audience || 'empreendedores',
                priceRange: formData.priceRange || 'R$ 297 - R$ 497'
              })}
              onSuccess={handleSuccess}
              className="w-full"
            />
          </div>
        );

      case 'copywriting':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="copyType">Tipo de Copy</Label>
              <Select onValueChange={(value) => handleFormChange('copyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headline">Headlines</SelectItem>
                  <SelectItem value="anuncio">Anúncios</SelectItem>
                  <SelectItem value="email">E-mails</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="social">Redes Sociais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="produto">Produto/Serviço</Label>
              <Input
                placeholder="Nome do produto ou serviço"
                value={formData.produto || ''}
                onChange={(e) => handleFormChange('produto', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="audience">Público-Alvo</Label>
              <Input
                placeholder="Descreva seu público"
                value={formData.audience || ''}
                onChange={(e) => handleFormChange('audience', e.target.value)}
              />
            </div>
            <ActionButton
              label="Gerar Copy com IA"
              loadingLabel="Criando copy"
              successLabel="Copy pronta!"
              action={() => gerarCopywriting({
                tipo: formData.copyType || 'headline',
                produto: formData.produto || 'Produto Digital',
                audience: formData.audience || 'Empreendedores'
              })}
              onSuccess={handleSuccess}
              className="w-full"
            />
          </div>
        );

      case 'vsl':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="produto">Produto para VSL</Label>
              <Input
                placeholder="Nome do produto"
                value={formData.produto || ''}
                onChange={(e) => handleFormChange('produto', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duracao">Duração do Vídeo</Label>
              <Select onValueChange={(value) => handleFormChange('duracao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-8 minutos">5-8 minutos</SelectItem>
                  <SelectItem value="10-15 minutos">10-15 minutos</SelectItem>
                  <SelectItem value="20-30 minutos">20-30 minutos</SelectItem>
                  <SelectItem value="45+ minutos">45+ minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience">Público-Alvo</Label>
              <Input
                placeholder="Descreva o público"
                value={formData.audience || ''}
                onChange={(e) => handleFormChange('audience', e.target.value)}
              />
            </div>
            <ActionButton
              label="Gerar VSL com IA"
              loadingLabel="Criando roteiro"
              successLabel="VSL pronto!"
              action={() => gerarVideoIA({
                produto: formData.produto || 'Curso Digital',
                duracao: formData.duracao || '10-15 minutos',
                audience: formData.audience || 'Empreendedores'
              })}
              onSuccess={handleSuccess}
              className="w-full"
            />
          </div>
        );

      case 'funnel':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="produto">Produto</Label>
              <Input
                placeholder="Nome do produto"
                value={formData.produto || ''}
                onChange={(e) => handleFormChange('produto', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="audience">Público-Alvo</Label>
              <Input
                placeholder="Descreva o público"
                value={formData.audience || ''}
                onChange={(e) => handleFormChange('audience', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="objetivo">Objetivo Principal</Label>
              <Select onValueChange={(value) => handleFormChange('objetivo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Maximizar Vendas</SelectItem>
                  <SelectItem value="leads">Capturar Leads</SelectItem>
                  <SelectItem value="engagement">Aumentar Engajamento</SelectItem>
                  <SelectItem value="conversao">Otimizar Conversão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ActionButton
              label="Gerar Funil Completo"
              loadingLabel="Construindo funil"
              successLabel="Funil pronto!"
              action={() => gerarFunilCompleto({
                produto: formData.produto || 'Produto Digital',
                audience: formData.audience || 'Empreendedores',
                objetivo: formData.objetivo || 'vendas'
              })}
              onSuccess={handleSuccess}
              className="w-full"
            />
          </div>
        );

      case 'traffic':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="produto">Produto/Campanha</Label>
              <Input
                placeholder="Nome do produto"
                value={formData.produto || ''}
                onChange={(e) => handleFormChange('produto', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget Diário</Label>
              <Select onValueChange={(value) => handleFormChange('budget', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">R$ 50/dia</SelectItem>
                  <SelectItem value="100">R$ 100/dia</SelectItem>
                  <SelectItem value="200">R$ 200/dia</SelectItem>
                  <SelectItem value="500">R$ 500/dia</SelectItem>
                  <SelectItem value="1000">R$ 1.000/dia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="platform">Plataforma</Label>
              <Select onValueChange={(value) => handleFormChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook Ads</SelectItem>
                  <SelectItem value="Google">Google Ads</SelectItem>
                  <SelectItem value="Instagram">Instagram Ads</SelectItem>
                  <SelectItem value="TikTok">TikTok Ads</SelectItem>
                  <SelectItem value="YouTube">YouTube Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience">Público-Alvo</Label>
              <Input
                placeholder="Descreva o público"
                value={formData.audience || ''}
                onChange={(e) => handleFormChange('audience', e.target.value)}
              />
            </div>
            <ActionButton
              label="Iniciar Campanha de Tráfego"
              loadingLabel="Configurando campanha"
              successLabel="Campanha ativa!"
              action={() => iniciarCampanhaAds({
                produto: formData.produto || 'Produto Digital',
                budget: formData.budget || 100,
                platform: formData.platform || 'Facebook',
                audience: formData.audience || 'Empreendedores'
              })}
              onSuccess={handleSuccess}
              className="w-full"
            />
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="objetivo">Objetivo Principal</Label>
              <Select onValueChange={(value) => handleFormChange('objetivo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lancar-produto">Lançar Produto</SelectItem>
                  <SelectItem value="escalar-vendas">Escalar Vendas</SelectItem>
                  <SelectItem value="aumentar-ticket">Aumentar Ticket Médio</SelectItem>
                  <SelectItem value="expandir-mercado">Expandir Mercado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prazo">Prazo</Label>
              <Select onValueChange={(value) => handleFormChange('prazo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 dias">30 dias</SelectItem>
                  <SelectItem value="90 dias">90 dias</SelectItem>
                  <SelectItem value="6 meses">6 meses</SelectItem>
                  <SelectItem value="1 ano">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Budget Total</Label>
              <Select onValueChange={(value) => handleFormChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R$ 5.000">R$ 5.000</SelectItem>
                  <SelectItem value="R$ 10.000">R$ 10.000</SelectItem>
                  <SelectItem value="R$ 25.000">R$ 25.000</SelectItem>
                  <SelectItem value="R$ 50.000">R$ 50.000</SelectItem>
                  <SelectItem value="R$ 100.000+">R$ 100.000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ActionButton
              label="Gerar Estratégia Completa"
              loadingLabel="Criando estratégia"
              successLabel="Estratégia pronta!"
              action={() => gerarEstrategia({
                objetivo: formData.objetivo || 'lancar-produto',
                prazo: formData.prazo || '90 dias',
                budget: formData.budget || 'R$ 10.000'
              })}
              onSuccess={handleSuccess}
              className="w-full"
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Configurações específicas não disponíveis para este tipo de nó.</p>
          </div>
        );
    }
  };

  const renderResultsTab = () => {
    if (!results) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Execute uma ação para ver os resultados aqui.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Resultados Gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(results).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <Label className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <div className="mt-1">
                    {typeof value === 'object' && value !== null ? (
                      <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm">{String(value)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <DownloadButton
            label="Baixar PDF"
            downloadAction={() => baixarPDF({
              nome: node.title,
              tipo: node.type,
              conteudo: results
            })}
            className="flex-1"
          />
          <ActionButton
            label="Gerar Relatório"
            loadingLabel="Gerando relatório"
            successLabel="Relatório pronto!"
            action={() => gerarRelatorioAnalytics({
              projeto: node.title,
              periodo: '30 dias'
            })}
            onSuccess={(result) => {
              setResults(prev => ({ ...prev, relatorio: result.data }));
            }}
            className="flex-1"
          />
        </div>
      </div>
    );
  };

  const getNodeIcon = () => {
    const icons = {
      produto: Brain,
      copywriting: FileText,
      vsl: Video,
      funnel: Target,
      traffic: TrendingUp,
      strategy: Rocket,
      email: Mail,
      analytics: BarChart3
    };
    const Icon = icons[node.type as keyof typeof icons] || Settings;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getNodeIcon()}
            {node.title}
            <Badge variant="outline">{node.type}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="actions">Ações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4">
            {renderConfigTab()}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {renderResultsTab()}
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ActionButton
                label="Duplicar Nó"
                loadingLabel="Duplicando"
                successLabel="Duplicado!"
                action={async () => ({ success: true, data: { message: 'Nó duplicado' } })}
                variant="outline"
              />
              <ActionButton
                label="Conectar a..."
                loadingLabel="Conectando"
                successLabel="Conectado!"
                action={async () => ({ success: true, data: { message: 'Conexão criada' } })}
                variant="outline"
              />
              <ActionButton
                label="Exportar Dados"
                loadingLabel="Exportando"
                successLabel="Exportado!"
                action={async () => ({ success: true, data: { message: 'Dados exportados' } })}
                variant="outline"
              />
              <ActionButton
                label="Compartilhar"
                loadingLabel="Compartilhando"
                successLabel="Compartilhado!"
                action={async () => ({ success: true, data: { message: 'Link de compartilhamento criado' } })}
                variant="outline"
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}