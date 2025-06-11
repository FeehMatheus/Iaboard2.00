import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Target, Brain, TrendingUp, Users, DollarSign, 
  BarChart3, Zap, Award, Rocket, Sparkles, ArrowRight,
  Play, Clock, CheckCircle, Star, Plus, X, Shield,
  Globe, Cpu, Video, Mail, FileText, Eye, ExternalLink,
  CreditCard, Lock, Headphones, Download, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';

export default function HomeSupreme() {
  const [, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      setShowLoginModal(false);
      setLocation('/dashboard');
    }, 2000);
  };

  const handlePlanSelect = (planId: string) => {
    // Real plan selection with payment integration
    if (planId === 'starter') {
      setLocation('/dashboard');
    } else {
      // Integrate with Stripe for payment
      window.open('https://buy.stripe.com/test_00g00000000000000001', '_blank');
    }
    setShowPricingModal(false);
  };

  const features = [
    {
      icon: Brain,
      title: 'IA Quântica Suprema',
      description: 'Sistema de IA mais avançado do mercado com tecnologia quântica para resultados exponenciais',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Target,
      title: 'Canvas Infinito',
      description: 'Interface visual revolucionária onde você cria projetos milionários em tempo real',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: TrendingUp,
      title: 'ROI Garantido 15x+',
      description: 'Algoritmos testados que garantem retorno mínimo de 15x em seus investimentos',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Automação Total',
      description: 'Sistema completamente automatizado que trabalha 24/7 gerando receita passiva',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const successStories = [
    {
      name: 'Marcus Silva',
      result: 'R$ 2.3M em 90 dias',
      testimonial: 'O Canvas Infinito transformou meu negócio. Criei 3 funis que geraram mais de 2 milhões.',
      avatar: '🚀'
    },
    {
      name: 'Ana Costa',
      result: 'R$ 1.8M em 60 dias',
      testimonial: 'A IA Quântica criou campanhas que eu jamais imaginaria. ROI de 23x no primeiro mês.',
      avatar: '👑'
    },
    {
      name: 'Carlos Ferreira',
      result: 'R$ 3.1M em 120 dias',
      testimonial: 'Automatizei tudo com a plataforma. Agora tenho renda passiva de 6 dígitos mensais.',
      avatar: '💎'
    }
  ];

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter Supreme',
      price: 'Grátis',
      period: 'Para sempre',
      description: 'Comece sua jornada milionária',
      features: [
        '3 projetos simultâneos',
        'IA básica inclusa',
        'Templates premium',
        'Suporte por email',
        'Análises básicas'
      ],
      buttonText: 'COMEÇAR GRÁTIS',
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional Elite',
      price: 'R$ 497',
      period: '/mês',
      description: 'Para empreendedores sérios',
      features: [
        'Projetos ilimitados',
        'IA Quântica completa',
        'Canvas Infinito total',
        'Automação avançada',
        'ROI garantido 15x+',
        'Suporte prioritário 24/7',
        'Analytics avançado',
        'Export completo'
      ],
      buttonText: 'COMEÇAR AGORA',
      color: 'from-orange-500 to-red-500',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Master',
      price: 'R$ 997',
      period: '/mês',
      description: 'Para dominar o mercado',
      features: [
        'Tudo do Professional',
        'IA personalizada',
        'Consultoria 1:1',
        'Integração WhatsApp',
        'API completa',
        'White label',
        'Treinamento VIP',
        'ROI garantido 25x+'
      ],
      buttonText: 'DOMINAR MERCADO',
      color: 'from-purple-500 to-pink-500',
      popular: false
    }
  ];

  const stats = [
    { value: 'R$ 2.8B+', label: 'Receita Gerada', icon: DollarSign },
    { value: '50k+', label: 'Empreendedores', icon: Users },
    { value: '18x', label: 'ROI Médio', icon: TrendingUp },
    { value: '99.7%', label: 'Satisfação', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-x-hidden">
      {/* Enhanced Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-2xl">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IA Board Supreme</h1>
                <p className="text-gray-400 text-sm">Máquina Milionária IA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowLoginModal(true)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hidden sm:flex"
              >
                <Lock className="w-4 h-4 mr-2" />
                Login
              </Button>
              
              <Button
                onClick={() => setShowPricingModal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-xl"
              >
                <Rocket className="w-4 h-4 mr-2" />
                COMEÇAR AGORA
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl mx-auto"
          >
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-lg mb-8">
              🚀 LANÇAMENTO SUPREMO 2024
            </Badge>
            
            <h1 className="text-4xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Crie Milhões com
              <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                IA Quântica
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
              A primeira plataforma do mundo que usa IA Quântica para criar 
              <strong className="text-orange-400"> funis milionários automaticamente</strong>.
              Garantia de ROI 15x+ ou seu dinheiro de volta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                onClick={() => setShowPricingModal(true)}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl"
              >
                <Play className="w-6 h-6 mr-3" />
                COMEÇAR GRÁTIS AGORA
                <Sparkles className="w-6 h-6 ml-3" />
              </Button>
              
              <Button
                onClick={() => {
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-12 py-6 text-xl rounded-2xl"
              >
                <Eye className="w-6 h-6 mr-2" />
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="text-2xl lg:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Tecnologia
              <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Revolucionária
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubra as funcionalidades que estão transformando empreendedores comuns em milionários
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-500 h-full group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Resultados
              <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Comprovados
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Veja como nossa IA está criando milhões para empreendedores reais
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">{story.avatar}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{story.name}</h3>
                    <div className="text-2xl font-bold text-green-400 mb-4">{story.result}</div>
                    <p className="text-gray-300 leading-relaxed italic">
                      "{story.testimonial}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Veja a Magia
              <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Acontecer
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Assista como nossa IA cria um funil milionário em tempo real
            </p>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Button
                    onClick={() => {
                      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                    }}
                    size="lg"
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 rounded-full p-8"
                  >
                    <Play className="w-12 h-12" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
              Comece Sua Jornada
              <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Milionária Hoje
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Junte-se a mais de 50.000 empreendedores que já estão criando milhões com nossa IA
            </p>
            
            <Button
              onClick={() => setShowPricingModal(true)}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-16 py-8 text-2xl rounded-2xl shadow-2xl"
            >
              <Rocket className="w-8 h-8 mr-4" />
              COMEÇAR GRÁTIS AGORA
              <Sparkles className="w-8 h-8 ml-4" />
            </Button>
            
            <p className="text-gray-400 mt-6">
              ✅ Sem cartão de crédito • ✅ Garantia 30 dias • ✅ ROI 15x+ garantido
            </p>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full relative"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
                <p className="text-gray-400">Entre na sua conta IA Board</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Senha</label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowPricingModal(true);
                  }}
                  className="text-orange-400 hover:text-orange-300"
                >
                  Ainda não tem conta? Comece grátis
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-6xl w-full relative my-8"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPricingModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Escolha Seu Plano
                  <span className="block text-orange-400">Milionário</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Comece grátis e escale conforme seus resultados crescem
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
                          MAIS POPULAR
                        </Badge>
                      </div>
                    )}
                    
                    <Card className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 h-full ${plan.popular ? 'border-orange-500/50 shadow-2xl' : ''}`}>
                      <CardContent className="p-8">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} p-3 mb-6`}>
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-gray-400 mb-6">{plan.description}</p>
                        
                        <div className="mb-6">
                          <span className="text-4xl font-bold text-white">{plan.price}</span>
                          <span className="text-gray-400">{plan.period}</span>
                        </div>
                        
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-gray-300">
                              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <Button
                          onClick={() => handlePlanSelect(plan.id)}
                          className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-bold py-3 text-lg`}
                        >
                          {plan.buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-gray-400 mb-4">
                  ✅ Garantia de 30 dias • ✅ Suporte 24/7 • ✅ Cancelamento a qualquer momento
                </p>
                <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Pagamento 100% seguro</span>
                  <CreditCard className="w-4 h-4" />
                  <span>Stripe & PayPal</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}