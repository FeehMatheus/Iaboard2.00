import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Crown, Zap, Brain, Target, TrendingUp, Star, 
  Rocket, Sparkles, Award, Eye, BarChart3, 
  Play, ArrowRight, CheckCircle, Users, 
  DollarSign, Clock, Shield, Flame,
  ChevronDown, MousePointer, Video,
  FileText, Mail, Image, PieChart
} from 'lucide-react';

export default function HomeEnhanced() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const { scrollY } = useScroll();
  
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "IA Multidimensional",
      description: "12 camadas neurais processando em paralelo",
      metric: "97.3%",
      metricLabel: "precisão",
      color: "from-purple-600 to-blue-600"
    },
    {
      icon: Target,
      title: "Tráfego Supremo",
      description: "Campanhas que geram ROI de 12.7x",
      metric: "R$ 2.8M",
      metricLabel: "gerados",
      color: "from-red-600 to-pink-600"
    },
    {
      icon: Sparkles,
      title: "Campo Quântico",
      description: "Energia cósmica alinhada para resultados",
      metric: "847W",
      metricLabel: "energia",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Rocket,
      title: "Canvas Infinito",
      description: "Projetos ilimitados em espaço multidimensional",
      metric: "∞",
      metricLabel: "projetos",
      color: "from-green-500 to-teal-500"
    }
  ];

  const testimonials = [
    {
      name: "Rafael Costa",
      role: "Marketing Digital",
      revenue: "R$ 47k/mês",
      quote: "Automatizei meu funil de vendas e tripliquei o faturamento em 3 meses. A plataforma realmente funciona.",
      image: "👨‍💻"
    },
    {
      name: "Ana Ferreira",
      role: "Consultora",
      revenue: "R$ 28k/mês",
      quote: "O sistema de criação de conteúdo me economiza 20 horas por semana. Resultados impressionantes.",
      image: "👩‍💼"
    },
    {
      name: "Marcos Ribeiro",
      role: "E-commerce",
      revenue: "R$ 65k/mês",
      quote: "Consegui escalar minha operação e aumentar a conversão em 340%. Investimento que se paga.",
      image: "📈"
    }
  ];

  const stats = [
    { number: "15.847", label: "Usuários Ativos", icon: Users },
    { number: "R$ 45M", label: "Faturamento Gerado", icon: DollarSign },
    { number: "97.3%", label: "Taxa de Sucesso", icon: CheckCircle },
    { number: "24/7", label: "IA Processando", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </motion.div>

      {/* Floating Cursor Effect */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{ y: heroY }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 text-lg font-bold mb-6">
              <Crown className="w-5 h-5 mr-2" />
              Máquina Milionária 3.0 - IA Suprema
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
          >
            Transforme{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
              Ideias
            </span>
            <br />
            em{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Milhões
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            A única plataforma de IA que combina{' '}
            <span className="text-purple-400 font-semibold">processamento quântico</span>,{' '}
            <span className="text-orange-400 font-semibold">tráfego supremo</span> e{' '}
            <span className="text-blue-400 font-semibold">canvas infinito</span>{' '}
            para criar o sistema marketing mais poderoso do planeta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-10 py-5 text-xl rounded-xl shadow-2xl hover:shadow-orange-500/50 transform transition-all duration-300">
                <Link href="/canvas">
                  <Crown className="w-7 h-7 mr-3" />
                  CANVAS INFINITO SUPREMO
                  <Sparkles className="w-7 h-7 ml-3 animate-pulse" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size="lg" className="border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-bold px-8 py-4 text-lg rounded-xl backdrop-blur-sm">
                <Link href="/dashboard">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Dashboard Completo
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size="lg" className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold px-8 py-4 text-lg rounded-xl backdrop-blur-sm">
                <Link href="/login">
                  <Rocket className="w-6 h-6 mr-3" />
                  Entrar Agora
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-400"
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tecnologia{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Suprema
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sistema de IA mais avançado do mundo, projetado para maximizar resultados
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full hover:bg-gray-800/70 transition-all duration-500 group-hover:border-purple-500/50">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-400">{feature.metric}</div>
                        <div className="text-xs text-gray-500">{feature.metricLabel}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Resultados{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Comprovados
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mais de 15 mil empreendedores já transformaram suas vidas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">{testimonial.image}</div>
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                        <Badge className="mt-2 bg-green-600 text-white">
                          {testimonial.revenue}
                        </Badge>
                      </div>
                    </div>
                    <blockquote className="text-gray-300 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500/20 to-purple-600/20 rounded-3xl p-12 backdrop-blur-sm border border-orange-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para ser o Próximo{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Milionário?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a mais de 15 mil empreendedores que já descobriram o poder da IA Suprema
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-8"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 text-xl rounded-xl shadow-2xl">
                <Link href="/canvas">
                  <Crown className="w-6 h-6 mr-3" />
                  Acessar Canvas Infinito
                  <Sparkles className="w-6 h-6 ml-3" />
                </Link>
              </Button>
            </motion.div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-400 mr-2" />
                100% Seguro
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                Ativação instantânea
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-8 h-8 text-orange-400 mr-3" />
            <span className="text-2xl font-bold text-white">Máquina Milionária</span>
          </div>
          <p className="text-gray-400 mb-6">
            A plataforma de IA mais avançada para empreendedores que pensam grande
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-orange-400 transition-colors">Termos</Link>
            <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacidade</Link>
            <Link href="/support" className="hover:text-orange-400 transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}