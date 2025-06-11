import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Zap, Brain, Target, TrendingUp, Star, 
  Rocket, Sparkles, ArrowRight, CheckCircle, 
  Users, DollarSign, Clock, Play, Award,
  BarChart3, Shield, FileText, Mail, X,
  CreditCard, Lock, Eye, EyeOff
} from 'lucide-react';

export default function HomeSupreme() {
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Login/Register state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'R$ 97',
      period: '/mês',
      features: [
        '5 projetos por mês',
        'IA básica integrada',
        'Suporte por email',
        'Templates essenciais'
      ],
      color: 'from-blue-500 to-purple-600',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 'R$ 297',
      period: '/mês',
      features: [
        'Projetos ilimitados',
        'IA Suprema (Claude + GPT-4)',
        'Canvas Infinito',
        'Suporte prioritário',
        'Analytics avançados',
        'Exportação completa'
      ],
      color: 'from-orange-500 to-red-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'R$ 797',
      period: '/mês',
      features: [
        'Tudo do Professional',
        'IA Quântica multidimensional',
        'Suporte VIP 24/7',
        'Treinamento personalizado',
        'API dedicada',
        'Manager de sucesso'
      ],
      color: 'from-purple-500 to-pink-600',
      popular: false
    }
  ];

  const handleAuth = async () => {
    // Simulate auth process
    setTimeout(() => {
      setShowAuthModal(false);
      setLocation('/dashboard');
    }, 1000);
  };

  const handlePlanSelect = (planId: string) => {
    // Simulate plan selection and redirect to payment
    setShowPlansModal(false);
    setLocation('/checkout');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Badge className="bg-orange-600 text-white px-6 py-2 text-lg font-bold">
              <Crown className="w-5 h-5 mr-2" />
              Máquina Milionária 3.0
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Crie Campanhas que{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Vendem Milhões
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Sistema de IA mais avançado do mundo para gerar funnels, copies e estratégias que convertem
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button 
              onClick={() => setShowPlansModal(true)}
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 w-full sm:w-auto"
            >
              <Rocket className="w-5 h-5 mr-3" />
              COMEÇAR AGORA
              <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
            </Button>
            
            <Button 
              onClick={() => setShowAuthModal(true)}
              variant="outline"
              size="lg" 
              className="border-2 border-white/20 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg rounded-xl w-full sm:w-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              JÁ TENHO CONTA
            </Button>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                  <metric.icon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-xl md:text-2xl font-bold text-white">{metric.number}</div>
                  <div className="text-gray-400 text-sm">{metric.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Resultados{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Comprovados
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/70 border-gray-700 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
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

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 w-full max-w-md mx-auto relative"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {authMode === 'login' ? 'Entrar na Conta' : 'Criar Conta'}
                </h2>
                <p className="text-gray-400">
                  {authMode === 'login' ? 'Acesse sua conta para continuar' : 'Crie sua conta gratuitamente'}
                </p>
              </div>

              <div className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                )}
                
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                    className="bg-gray-800 border-gray-700 text-white pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAuth}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3"
              >
                {authMode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
              </Button>

              <div className="text-center mt-4">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {authMode === 'login' ? 'Não tem conta? Criar agora' : 'Já tem conta? Entrar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plans Modal */}
      <AnimatePresence>
        {showPlansModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 w-full max-w-5xl mx-auto relative max-h-[90vh] overflow-y-auto"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlansModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Escolha Seu{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Plano
                  </span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Comece a gerar milhões hoje mesmo
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative ${plan.popular ? 'transform scale-105' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-orange-600 text-white px-4 py-1">
                          MAIS POPULAR
                        </Badge>
                      </div>
                    )}
                    
                    <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full hover:border-orange-500/50 transition-all duration-300 ${plan.popular ? 'border-orange-500/50' : ''}`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} p-3 mb-4 mx-auto`}>
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white text-center mb-2">{plan.name}</h3>
                        
                        <div className="text-center mb-6">
                          <span className="text-3xl font-bold text-white">{plan.price}</span>
                          <span className="text-gray-400">{plan.period}</span>
                        </div>
                        
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-gray-300">
                              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <Button
                          onClick={() => handlePlanSelect(plan.id)}
                          className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold py-3`}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          ESCOLHER PLANO
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-400 mr-2" />
                    Garantia 30 dias
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 text-blue-400 mr-2" />
                    Pagamento seguro
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-yellow-400 mr-2" />
                    Suporte premium
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}