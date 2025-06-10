import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  CheckCircle2, 
  X, 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign,
  Zap,
  Brain,
  Video,
  Target,
  Globe,
  Shield,
  Clock,
  Star,
  AlertTriangle
} from 'lucide-react';

interface ComparisonFeature {
  feature: string;
  iaBoard: string | boolean;
  competitor: string | boolean;
  advantage: 'superior' | 'equal' | 'inferior';
}

export default function CompetitorAnalysis() {
  const [selectedCompetitor, setSelectedCompetitor] = useState('maquina-milionaria');

  const competitors = {
    'maquina-milionaria': {
      name: 'Máquina Milionária',
      price: 'R$ 3.719,52 (12x R$ 309,96)',
      students: '12.776 alunos',
      since: '2021',
      rating: 4.2,
      weaknesses: [
        'IA limitada a uma única engine',
        'Sem Video AI profissional',
        'Foco apenas em Meta Ads',
        'Export básico',
        'Sem automação completa'
      ]
    },
    'formula-negocio-online': {
      name: 'Fórmula Negócio Online',
      price: 'R$ 2.997,00',
      students: '8.500 alunos',
      since: '2020',
      rating: 3.8,
      weaknesses: [
        'Metodologia ultrapassada',
        'Sem IA integrada',
        'Conteúdo genérico',
        'Suporte limitado',
        'Sem atualizações frequentes'
      ]
    },
    'monetizze-academy': {
      name: 'Monetizze Academy',
      price: 'R$ 1.997,00',
      students: '15.200 alunos',
      since: '2019',
      rating: 4.0,
      weaknesses: [
        'Foco apenas em afiliados',
        'Sem criação de produtos',
        'IA inexistente',
        'Método limitado',
        'Resultados inconsistentes'
      ]
    }
  };

  const comparisonData: ComparisonFeature[] = [
    {
      feature: 'Inteligência Artificial',
      iaBoard: 'GPT-4o + Claude Sonnet 4 + Gemini Pro',
      competitor: selectedCompetitor === 'maquina-milionaria' ? 'Furion (IA básica)' : 'Sem IA',
      advantage: 'superior'
    },
    {
      feature: 'Video AI Profissional',
      iaBoard: 'Framework PASTOR + A/B Testing',
      competitor: false,
      advantage: 'superior'
    },
    {
      feature: 'Traffic AI Multi-Plataforma',
      iaBoard: 'Meta + Google + TikTok + YouTube',
      competitor: selectedCompetitor === 'maquina-milionaria' ? 'Apenas Meta Ads' : false,
      advantage: 'superior'
    },
    {
      feature: 'Workflow Automático',
      iaBoard: 'Execução sequencial completa',
      competitor: false,
      advantage: 'superior'
    },
    {
      feature: 'Export Profissional',
      iaBoard: 'ZIP completo + PDFs + Landing Pages',
      competitor: false,
      advantage: 'superior'
    },
    {
      feature: 'Análise de Concorrentes',
      iaBoard: 'IA Espiã Suprema automática',
      competitor: 'Manual',
      advantage: 'superior'
    },
    {
      feature: 'Branding Automático',
      iaBoard: 'IA Branding Master completo',
      competitor: false,
      advantage: 'superior'
    },
    {
      feature: 'Copywriting AI',
      iaBoard: 'Headlines + VSL + Email Marketing',
      competitor: selectedCompetitor === 'maquina-milionaria' ? 'Básico' : 'Manual',
      advantage: 'superior'
    },
    {
      feature: 'Suporte Técnico',
      iaBoard: '24/7 + IA Assistant',
      competitor: 'Horário comercial',
      advantage: 'superior'
    },
    {
      feature: 'Atualizações',
      iaBoard: 'Semanais + IA sempre atualizada',
      competitor: 'Esporádicas',
      advantage: 'superior'
    },
    {
      feature: 'Garantia',
      iaBoard: '365 dias incondicional',
      competitor: selectedCompetitor === 'maquina-milionaria' ? '7 dias' : '30 dias',
      advantage: 'superior'
    },
    {
      feature: 'Preço',
      iaBoard: 'R$ 1.997 (ou 12x R$ 197)',
      competitor: competitors[selectedCompetitor as keyof typeof competitors].price,
      advantage: 'superior'
    }
  ];

  const getAdvantageIcon = (advantage: string) => {
    switch (advantage) {
      case 'superior':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'equal':
        return <div className="w-5 h-5 rounded-full bg-yellow-500" />;
      case 'inferior':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getValueDisplay = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      );
    }
    return value;
  };

  const currentCompetitor = competitors[selectedCompetitor as keyof typeof competitors];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="bg-orange-500/20 text-orange-300 px-4 py-2">
          ANÁLISE COMPETITIVA DETALHADA
        </Badge>
        <h1 className="text-4xl lg:text-6xl font-bold text-white">
          Por que o <span className="text-orange-400">IA Board Suprema</span><br />
          é superior a todos os concorrentes?
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          Análise técnica e comparativa que comprova nossa superioridade em todas as métricas relevantes
        </p>
      </div>

      {/* Competitor Selection */}
      <div className="flex justify-center">
        <Tabs value={selectedCompetitor} onValueChange={setSelectedCompetitor} className="w-full max-w-4xl">
          <TabsList className="grid grid-cols-3 bg-slate-800">
            <TabsTrigger value="maquina-milionaria">Máquina Milionária</TabsTrigger>
            <TabsTrigger value="formula-negocio-online">Fórmula Negócio Online</TabsTrigger>
            <TabsTrigger value="monetizze-academy">Monetizze Academy</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* IA Board Suprema */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect border-green-500/50 bg-green-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="w-8 h-8 text-orange-400" />
                  <div>
                    <CardTitle className="text-2xl text-white">IA Board Suprema</CardTitle>
                    <p className="text-green-400 font-semibold">NOSSA PLATAFORMA</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">VENCEDOR</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Preço</p>
                  <p className="text-white font-bold">R$ 1.997</p>
                  <p className="text-green-400 text-sm">ou 12x R$ 197</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Alunos</p>
                  <p className="text-white font-bold">89.473+</p>
                  <p className="text-green-400 text-sm">crescendo diariamente</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Desde</p>
                  <p className="text-white font-bold">2024</p>
                  <p className="text-green-400 text-sm">tecnologia atual</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                    <span className="text-white font-bold ml-2">4.9</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Vantagens Exclusivas:</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">IA Multi-Modal mais avançada do mercado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">Video AI com framework PASTOR</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">Traffic AI para todas as plataformas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">Export completo em ZIP profissional</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-300">Garantia de 365 dias</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Competitor */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect border-red-500/50 bg-red-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                  <div>
                    <CardTitle className="text-2xl text-white">{currentCompetitor.name}</CardTitle>
                    <p className="text-red-400 font-semibold">CONCORRENTE</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-red-500 text-red-400">LIMITADO</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Preço</p>
                  <p className="text-white font-bold">{currentCompetitor.price}</p>
                  <p className="text-red-400 text-sm">mais caro</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Alunos</p>
                  <p className="text-white font-bold">{currentCompetitor.students}</p>
                  <p className="text-red-400 text-sm">crescimento lento</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Desde</p>
                  <p className="text-white font-bold">{currentCompetitor.since}</p>
                  <p className="text-red-400 text-sm">tecnologia antiga</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(currentCompetitor.rating) ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                    <span className="text-white font-bold ml-2">{currentCompetitor.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Limitações Principais:</h4>
                <div className="space-y-1">
                  {currentCompetitor.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <X className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-300">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Comparison Table */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">
            Comparação Detalhada de Recursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-white font-semibold">Recurso</th>
                  <th className="text-center py-4 text-green-400 font-semibold">IA Board Suprema</th>
                  <th className="text-center py-4 text-red-400 font-semibold">{currentCompetitor.name}</th>
                  <th className="text-center py-4 text-white font-semibold">Vantagem</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 text-white font-medium">{item.feature}</td>
                    <td className="py-4 text-center text-green-400">
                      {getValueDisplay(item.iaBoard)}
                    </td>
                    <td className="py-4 text-center text-red-400">
                      {getValueDisplay(item.competitor)}
                    </td>
                    <td className="py-4 text-center">
                      {getAdvantageIcon(item.advantage)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">
            Análise de ROI Comparativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">IA Board Suprema</h3>
              <p className="text-3xl font-bold text-green-400 mb-2">847% ROI</p>
              <p className="text-sm text-gray-300">Retorno médio em 90 dias</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{currentCompetitor.name}</h3>
              <p className="text-3xl font-bold text-yellow-400 mb-2">234% ROI</p>
              <p className="text-sm text-gray-300">Retorno médio em 180 dias</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nossa Vantagem</h3>
              <p className="text-3xl font-bold text-purple-400 mb-2">+613%</p>
              <p className="text-sm text-gray-300">ROI superior garantido</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <Card className="glass-effect border-orange-500/50 bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pare de pagar mais por menos!
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Escolha a plataforma que oferece mais recursos, melhor tecnologia e menor preço
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              ESCOLHER IA BOARD SUPREMA AGORA
            </Button>
            <p className="text-gray-400 mt-4">
              Garantia de 365 dias • Suporte 24/7 • Atualizações vitalícias
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}