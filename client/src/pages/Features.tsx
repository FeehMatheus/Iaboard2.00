import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, FileText, Video, Mail, Target, TrendingUp,
  Zap, Globe, BarChart3, Users, Crown, Home, Play
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function Features() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Brain,
      title: "IA Avançada para Marketing",
      description: "Nossa IA analisa seu mercado e gera estratégias personalizadas com precisão cirúrgica.",
      benefits: ["Análise de mercado instantânea", "Estratégias personalizadas", "Otimização contínua"]
    },
    {
      icon: FileText,
      title: "Geração de Copy de Alta Conversão",
      description: "Crie textos persuasivos que convertem usando técnicas comprovadas de copywriting.",
      benefits: ["Templates testados", "Personalização automática", "A/B testing integrado"]
    },
    {
      icon: Video,
      title: "Criação de VSL Automática",
      description: "Gere roteiros de vídeo sales letter otimizados para máxima conversão.",
      benefits: ["Roteiros profissionais", "Estrutura AIDA", "Timing otimizado"]
    },
    {
      icon: Mail,
      title: "Sequências de Email Marketing",
      description: "Automatize campanhas de email com sequências inteligentes e personalizadas.",
      benefits: ["Automação completa", "Segmentação avançada", "Taxa de abertura otimizada"]
    },
    {
      icon: Target,
      title: "Campanhas de Anúncios Pagos",
      description: "Crie anúncios de alta performance para Facebook, Google e outras plataformas.",
      benefits: ["Multi-plataforma", "Targeting preciso", "ROI maximizado"]
    },
    {
      icon: TrendingUp,
      title: "Funnels de Vendas Inteligentes",
      description: "Construa funis de vendas otimizados com base em dados e comportamento do usuário.",
      benefits: ["Conversão otimizada", "Multi-etapas", "Analytics integrados"]
    },
    {
      icon: Globe,
      title: "Canvas Infinito",
      description: "Visualize e organize seus projetos em um espaço infinito e colaborativo.",
      benefits: ["Interface intuitiva", "Colaboração em tempo real", "Organização visual"]
    },
    {
      icon: BarChart3,
      title: "Analytics Avançados",
      description: "Monitore performance e otimize resultados com métricas detalhadas.",
      benefits: ["Dashboards personalizados", "Relatórios automáticos", "Insights acionáveis"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Experimentar Agora
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Funcionalidades <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Poderosas</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Descubra todas as ferramentas que vão transformar seu marketing digital
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 h-full hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-12"
        >
          <Crown className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Experimente todas essas funcionalidades agora mesmo
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xl px-8 py-4"
            >
              <Zap className="w-5 h-5 mr-2" />
              Demo Gratuito
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation('/pricing')}
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-xl px-8 py-4"
            >
              Ver Preços
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}