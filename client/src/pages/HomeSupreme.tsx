import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Zap, Brain, Target, TrendingUp, Star, 
  Rocket, Sparkles, ArrowRight, CheckCircle, 
  Users, DollarSign, Clock, Play, Award,
  BarChart3, Shield, FileText, Mail
} from 'lucide-react';
import { AdvancedCTAModal, QuickActionCTA } from '@/components/ui/advanced-cta-system';

export default function HomeSupreme() {
  const [showCTAModal, setShowCTAModal] = useState(false);
  const [, setLocation] = useLocation();

  const metrics = [
    { number: "15.847", label: "Usuários Ativos", icon: Users },
    { number: "R$ 45M+", label: "Faturamento Gerado", icon: DollarSign },
    { number: "97.3%", label: "Taxa de Sucesso", icon: CheckCircle },
    { number: "24/7", label: "IA Ativa", icon: Clock }
  ];

  const testimonials = [
    {
      name: "Rafael Costa",
      revenue: "R$ 47k/mês",
      quote: "Automatizei meu funil e tripliquei o faturamento em 3 meses.",
      rating: 5
    },
    {
      name: "Ana Ferreira", 
      revenue: "R$ 28k/mês",
      quote: "Economizo 20 horas por semana com o sistema de criação.",
      rating: 5
    },
    {
      name: "Marcos Ribeiro",
      revenue: "R$ 65k/mês", 
      quote: "Conversão aumentou 340%. Investimento que se paga.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "IA Multidimensional",
      description: "Processamento neural avançado com 12 camadas paralelas",
      metric: "97.3%",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Target,
      title: "Tráfego Supremo", 
      description: "Campanhas otimizadas com ROI médio de 12.7x",
      metric: "12.7x",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Rocket,
      title: "Canvas Infinito",
      description: "Projetos ilimitados em espaço multidimensional",
      metric: "∞",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Badge className="bg-orange-600 text-white px-6 py-2 text-lg font-bold mb-6">
              <Crown className="w-5 h-5 mr-2" />
              Máquina Milionária 3.0
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Transforme{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Ideias
            </span>
            <br />
            em{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Milhões
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Sistema de IA mais avançado do mundo para criar campanhas, 
            funnels e estratégias que geram milhões
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <Button 
              onClick={() => setShowCTAModal(true)}
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 text-xl rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300"
            >
              <Rocket className="w-6 h-6 mr-3" />
              COMEÇAR AGORA
              <Sparkles className="w-6 h-6 ml-3 animate-pulse" />
            </Button>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                  <metric.icon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{metric.number}</div>
                  <div className="text-gray-400 text-sm">{metric.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tecnologia{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Avançada
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sistema projetado para maximizar resultados com inteligência artificial
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full hover:border-orange-500/50 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="text-3xl font-bold text-orange-400">{feature.metric}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Resultados{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Reais
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Empreendedores que já transformaram suas vidas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-gray-800/70 border-gray-700 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-300 italic mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {testimonial.revenue}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl p-12 backdrop-blur-sm border border-orange-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para ser o Próximo{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Milionário?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a mais de 15 mil empreendedores de sucesso
            </p>
            
            <Button 
              onClick={() => setShowCTAModal(true)}
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 text-xl rounded-xl shadow-2xl"
            >
              <Crown className="w-6 h-6 mr-3" />
              TRANSFORMAR AGORA
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Acesso Imediato
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-400 mr-2" />
                Garantia 30 Dias
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-yellow-400 mr-2" />
                Suporte Premium
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced CTA System */}
      <AdvancedCTAModal
        isOpen={showCTAModal}
        onClose={() => setShowCTAModal(false)}
        onNavigate={(path) => setLocation(path)}
      />
      
      <QuickActionCTA onOpenModal={() => setShowCTAModal(true)} />
    </div>
  );
}