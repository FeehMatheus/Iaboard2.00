import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ActionButton, DownloadButton } from '@/components/ActionButton';
import { 
  Rocket, TrendingUp, Target, Brain, Video, Mail, 
  FileText, BarChart3, Share2, Download, Play, 
  Settings, Zap, Crown, Star, Clock
} from 'lucide-react';
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
  gerarEstrategia
} from '@/lib/aiActions';

interface AdvancedCTAsProps {
  nodeType: string;
  nodeData?: any;
  onSuccess?: (result: any) => void;
  className?: string;
}

export function AdvancedCTAs({ nodeType, nodeData, onSuccess, className = "" }: AdvancedCTAsProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workflowProgress, setWorkflowProgress] = useState(0);

  const workflows = {
    produto: [
      {
        id: 'produto-completo',
        title: 'Criar Produto Completo',
        description: 'Gera produto digital com página de vendas, VSL e estratégia',
        icon: Brain,
        color: 'bg-purple-500',
        steps: ['Análise de mercado', 'Criação do produto', 'Página de vendas', 'Estratégia de lançamento'],
        action: () => gerarProdutoIA({
          niche: 'marketing-digital',
          audience: 'empreendedores',
          priceRange: 'R$ 297 - R$ 497'
        })
      },
      {
        id: 'validacao-mercado',
        title: 'Validar no Mercado',
        description: 'Teste seu produto com audiência real',
        icon: Target,
        color: 'bg-green-500',
        steps: ['Criação de MVP', 'Landing de teste', 'Campanha de validação', 'Análise de resultados'],
        action: () => ({ success: true, data: { validated: true, feedback: 'Produto validado com 78% de interesse' } })
      }
    ],
    copywriting: [
      {
        id: 'copy-multipla',
        title: 'Copy Multi-Variação',
        description: 'Gera múltiplas versões para teste A/B',
        icon: FileText,
        color: 'bg-blue-500',
        steps: ['Análise do público', 'Geração de variações', 'Setup de testes', 'Relatório de performance'],
        action: () => gerarCopywriting({
          tipo: 'headline',
          produto: 'Produto Digital',
          audience: 'Empreendedores'
        })
      },
      {
        id: 'copy-otimizada',
        title: 'Otimização por IA',
        description: 'Otimiza copy existente baseada em dados',
        icon: Zap,
        color: 'bg-yellow-500',
        steps: ['Análise da copy atual', 'Identificação de melhorias', 'Geração otimizada', 'Comparação de métricas'],
        action: () => ({ success: true, data: { improvement: '32% mais conversões' } })
      }
    ],
    vsl: [
      {
        id: 'vsl-profissional',
        title: 'VSL Profissional',
        description: 'Roteiro completo com timing e indicações',
        icon: Video,
        color: 'bg-red-500',
        steps: ['Estrutura do roteiro', 'Timing de engajamento', 'CTAs estratégicos', 'Guia de produção'],
        action: () => gerarVideoIA({
          produto: 'Curso Digital',
          duracao: '15-20 minutos',
          audience: 'empreendedores'
        })
      },
      {
        id: 'vsl-rapido',
        title: 'VSL Rápido (5min)',
        description: 'Versão condensada de alta conversão',
        icon: Clock,
        color: 'bg-orange-500',
        steps: ['Hook poderoso', 'Problema + solução', 'Prova social', 'Oferta irresistível'],
        action: () => ({ success: true, data: { script: 'VSL de 5 minutos criado' } })
      }
    ],
    funnel: [
      {
        id: 'funil-supremo',
        title: 'Funil Supremo',
        description: 'Funil completo com todas as páginas',
        icon: Target,
        color: 'bg-green-500',
        steps: ['Landing principal', 'Páginas de upsell', 'Sequência de e-mail', 'Automações'],
        action: () => gerarFunilCompleto({
          produto: 'Produto Digital',
          audience: 'empreendedores',
          objetivo: 'maximizar-receita'
        })
      },
      {
        id: 'funil-express',
        title: 'Funil Express',
        description: 'Implementação em 24h',
        icon: Rocket,
        color: 'bg-purple-500',
        steps: ['Página de captura', 'Página de vendas', 'Thank you page', 'E-mail básico'],
        action: () => ({ success: true, data: { message: 'Funil express criado' } })
      }
    ],
    traffic: [
      {
        id: 'campanha-multipla',
        title: 'Campanha Multi-Plataforma',
        description: 'Facebook, Google e Instagram simultaneamente',
        icon: TrendingUp,
        color: 'bg-yellow-500',
        steps: ['Configuração Facebook', 'Setup Google Ads', 'Instagram Stories', 'Monitoramento unificado'],
        action: () => iniciarCampanhaAds({
          produto: 'Produto Digital',
          budget: 500,
          platform: 'multi-platform',
          audience: 'empreendedores'
        })
      },
      {
        id: 'trafego-organico',
        title: 'Tráfego Orgânico',
        description: 'Estratégia de conteúdo e SEO',
        icon: Star,
        color: 'bg-indigo-500',
        steps: ['Pesquisa de palavras-chave', 'Calendário de conteúdo', 'Otimização SEO', 'Distribuição social'],
        action: () => ({ success: true, data: { strategy: 'Estratégia orgânica criada' } })
      }
    ],
    strategy: [
      {
        id: 'estrategia-completa',
        title: 'Estratégia 360°',
        description: 'Planejamento completo de 90 dias',
        icon: Crown,
        color: 'bg-purple-600',
        steps: ['Análise SWOT', 'Definição de KPIs', 'Roadmap detalhado', 'Cronograma de execução'],
        action: () => gerarEstrategia({
          objetivo: 'crescimento-acelerado',
          prazo: '90 dias',
          budget: 'R$ 50.000'
        })
      }
    ]
  };

  const currentWorkflows = workflows[nodeType as keyof typeof workflows] || [];

  const executeWorkflow = async (workflow: any) => {
    setActiveWorkflow(workflow.id);
    setWorkflowProgress(0);

    // Simulate workflow progress
    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => setWorkflowProgress(i), i * 50);
    }

    try {
      const result = await workflow.action();
      setTimeout(() => {
        setActiveWorkflow(null);
        setWorkflowProgress(0);
        onSuccess?.(result);
      }, 5000);
      return result;
    } catch (error) {
      setActiveWorkflow(null);
      setWorkflowProgress(0);
      throw error;
    }
  };

  if (currentWorkflows.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>CTAs avançadas não disponíveis para este tipo de módulo</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ações Avançadas</h3>
        <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          IA Suprema
        </Badge>
      </div>

      {activeWorkflow && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Executando workflow...</span>
              </div>
              <Progress value={workflowProgress} className="h-2" />
              <p className="text-xs text-gray-600">
                Progresso: {workflowProgress}% - {workflowProgress < 25 ? 'Iniciando' : 
                                                   workflowProgress < 50 ? 'Processando' :
                                                   workflowProgress < 75 ? 'Finalizando' : 'Concluindo'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {currentWorkflows.map((workflow) => {
          const Icon = workflow.icon;
          const isActive = activeWorkflow === workflow.id;
          
          return (
            <Card 
              key={workflow.id} 
              className={`transition-all duration-200 ${
                isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${workflow.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{workflow.title}</CardTitle>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Etapas do Processo:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {workflow.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <ActionButton
                    label="Executar Workflow"
                    loadingLabel="Executando..."
                    successLabel="Concluído!"
                    action={() => executeWorkflow(workflow)}
                    className="flex-1"
                    disabled={!!activeWorkflow}
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!!activeWorkflow}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <DownloadButton
            label="Exportar Resultados"
            downloadAction={() => baixarPDF({
              nome: `${nodeType}_resultados`,
              tipo: 'workflow',
              conteudo: nodeData
            })}
            className="flex-1"
          />
          
          <ActionButton
            label="Relatório IA"
            loadingLabel="Gerando..."
            successLabel="Pronto!"
            action={() => gerarRelatorioAnalytics({
              projeto: nodeType,
              periodo: '30 dias'
            })}
            variant="outline"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}