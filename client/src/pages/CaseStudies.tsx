import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, DollarSign, Users, Target, Crown, 
  ArrowRight, Play, ExternalLink, Home
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function CaseStudies() {
  const [, setLocation] = useLocation();

  const cases = [
    {
      id: 1,
      title: "E-commerce Fashion: +400% ROI em 90 dias",
      client: "ModaX Store",
      industry: "E-commerce",
      challenge: "Baixa conversão e alto CAC",
      solution: "Funil otimizado com IA + VSL personalizada",
      results: {
        roi: "+400%",
        conversion: "+250%",
        revenue: "R$ 2.3M",
        timeline: "90 dias"
      },
      description: "Transformamos uma loja online com baixa performance em uma máquina de vendas usando nossa IA para criar campanhas personalizadas, VSLs otimizadas e funnels de alta conversão.",
      image: "/api/placeholder/600/400"
    },
    {
      id: 2,
      title: "Infoprodutos: De R$ 50k para R$ 500k/mês",
      client: "EduTech Solutions",
      industry: "Educação Digital",
      challenge: "Escalabilidade limitada",
      solution: "Automação completa + IA para conteúdo",
      results: {
        roi: "+900%",
        conversion: "+180%",
        revenue: "R$ 500k/mês",
        timeline: "120 dias"
      },
      description: "Automatizamos completamente o processo de vendas e criação de conteúdo, permitindo escalar de R$ 50k para R$ 500k mensais sem aumentar a equipe.",
      image: "/api/placeholder/600/400"
    },
    {
      id: 3,
      title: "SaaS B2B: +300% em leads qualificados",
      client: "TechFlow Pro",
      industry: "SaaS B2B",
      challenge: "Leads de baixa qualidade",
      solution: "IA para qualificação + nurturing automático",
      results: {
        roi: "+300%",
        conversion: "+220%",
        revenue: "R$ 1.8M",
        timeline: "60 dias"
      },
      description: "Implementamos sistema de IA para qualificar leads automaticamente e nurturing personalizado, triplicando a qualidade dos leads em apenas 60 dias.",
      image: "/api/placeholder/600/400"
    },
    {
      id: 4,
      title: "Consultoria: R$ 100k para R$ 1M em receita",
      client: "ConsultX Premium",
      industry: "Consultoria",
      challenge: "Precificação e posicionamento",
      solution: "Reposicionamento + funil premium",
      results: {
        roi: "+1000%",
        conversion: "+400%",
        revenue: "R$ 1M",
        timeline: "180 dias"
      },
      description: "Reposicionamos completamente a consultoria, criamos funil premium e implementamos estratégias de alta conversão, multiplicando a receita por 10x.",
      image: "/api/placeholder/600/400"
    }
  ];

  const metrics = [
    { label: "ROI Médio", value: "+650%", icon: TrendingUp },
    { label: "Receita Gerada", value: "R$ 15M+", icon: DollarSign },
    { label: "Clientes Atendidos", value: "500+", icon: Users },
    { label: "Taxa de Sucesso", value: "94%", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Início
              </Button>
              <div className="h-6 w-px bg-gray-700" />
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Cases de Sucesso</span>
              </div>
            </div>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Cases de <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Sucesso</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Descubra como empresas reais transformaram seus negócios e multiplicaram seus resultados 
            usando nossa plataforma de IA para marketing digital.
          </p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 text-center">
                <CardContent className="p-6">
                  <metric.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Case Studies */}
        <div className="space-y-12">
          {cases.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {caseStudy.industry}
                      </Badge>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {caseStudy.results.timeline}
                      </Badge>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {caseStudy.title}
                    </h2>
                    
                    <p className="text-gray-300 mb-6">
                      {caseStudy.description}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <span className="text-sm text-gray-400">Cliente:</span>
                        <span className="ml-2 text-white font-semibold">{caseStudy.client}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Desafio:</span>
                        <span className="ml-2 text-white">{caseStudy.challenge}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Solução:</span>
                        <span className="ml-2 text-white">{caseStudy.solution}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{caseStudy.results.roi}</div>
                        <div className="text-sm text-gray-400">ROI</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">{caseStudy.results.conversion}</div>
                        <div className="text-sm text-gray-400">Conversão</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{caseStudy.results.revenue}</div>
                        <div className="text-sm text-gray-300">Receita Gerada</div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      onClick={() => setLocation('/dashboard')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Replicar Este Sucesso
                    </Button>
                  </div>

                  <div className="bg-gray-700/30 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Resultados Comprovados</h3>
                      <p className="text-gray-400 text-sm">
                        Dados auditados e verificados por terceiros
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Ser o Próximo Case de Sucesso?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a centenas de empresas que já transformaram seus resultados
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xl px-8 py-4"
            >
              <Crown className="w-5 h-5 mr-2" />
              Começar Agora Grátis
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation('/features')}
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-xl px-8 py-4"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Ver Funcionalidades
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}