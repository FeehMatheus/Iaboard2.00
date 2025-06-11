import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Rocket, Star, TrendingUp, Users, DollarSign, 
  Crown, Zap, Award, Target, Brain, BarChart3,
  CheckCircle, ArrowRight, Play, Globe, Video,
  Mail, FileText, Settings, Download, Sparkles,
  Shield, Headphones, Clock, Trophy, Bolt,
  Workflow, Database, Server, Code, Layout
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const DEMO_USER = {
  email: 'demo@maquinamilionaria.ai',
  password: 'demo123',
  firstName: 'Demo',
  lastName: 'User'
};

export function Landing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo login mutation
  const demoLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/demo-login', DEMO_USER);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Acesso Demo Liberado!",
        description: "Bem-vindo à Máquina Milionária AI - Explore todas as funcionalidades.",
      });
      setLocation('/dashboard');
    },
    onError: () => {
      toast({
        title: "Erro no Login Demo",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  });

  // Newsletter signup
  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/newsletter/subscribe', { email });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Inscrição Realizada!",
        description: "Você receberá atualizações exclusivas sobre IA para marketing.",
      });
      setEmail('');
    }
  });

  const handleDemoAccess = () => {
    setIsLoading(true);
    demoLoginMutation.mutate();
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "IA Suprema Multi-Modal",
      description: "OpenAI GPT-4o + Anthropic Claude integrados para máxima performance",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Workflow,
      title: "Board Infinito Render.com Style",
      description: "Interface visual revolucionária para criar funis milionários",
      gradient: "from-purple-500 to-violet-500"
    },
    {
      icon: Target,
      title: "Funis Cakto.com.br Style",
      description: "Templates profissionais que convertem de R$ 2k a R$ 50k",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Analytics Real-Time",
      description: "Métricas avançadas com dashboards que mostram seu ROI",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Zap,
      title: "A/B Testing Inteligente",
      description: "Otimização automática para maximizar conversões",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Crown,
      title: "Automação Completa",
      description: "Do tráfego ao checkout, tudo funcionando automaticamente",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Empreendedor Digital",
      content: "Faturei R$ 127.000 no primeiro mês usando os funis da Máquina Milionária AI",
      rating: 5,
      revenue: "R$ 127k"
    },
    {
      name: "Mariana Costa",
      role: "Coach de Negócios",
      content: "A IA criou campanhas que eu levaria semanas para fazer. ROI de 1:15!",
      rating: 5,
      revenue: "R$ 89k"
    },
    {
      name: "Roberto Mendes",
      role: "Consultor",
      content: "Nunca vi uma ferramenta tão poderosa. É realmente uma máquina de fazer dinheiro.",
      rating: 5,
      revenue: "R$ 203k"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 197",
      period: "/mês",
      description: "Para empreendedores iniciantes",
      features: [
        "5 Funis Completos",
        "IA GPT-4o Integrada",
        "Analytics Básico",
        "Templates Profissionais",
        "Suporte por Email"
      ],
      cta: "Começar Agora",
      popular: false
    },
    {
      name: "Professional",
      price: "R$ 397",
      period: "/mês",
      description: "Para negócios em crescimento",
      features: [
        "Funis Ilimitados",
        "IA GPT-4o + Claude",
        "Analytics Avançado",
        "A/B Testing",
        "Automação Completa",
        "Suporte Prioritário",
        "Integrações Premium"
      ],
      cta: "Upgrade Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 997",
      period: "/mês",
      description: "Para empresas e agências",
      features: [
        "Tudo do Professional",
        "White Label",
        "API Personalizada",
        "Suporte 24/7",
        "Consultoria Estratégica",
        "Implementação Dedicada"
      ],
      cta: "Falar com Vendas",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-blue-500/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Máquina Milionária AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white"
              onClick={() => setLocation('/features')}
            >
              Funcionalidades
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white"
              onClick={() => setLocation('/pricing')}
            >
              Preços
            </Button>
            <Button
              onClick={handleDemoAccess}
              disabled={isLoading || demoLoginMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-lg"
            >
              {isLoading || demoLoginMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  CONTA DEMO
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white mb-6">
              🚀 Nova Era do Marketing Digital
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              MÁQUINA
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}MILIONÁRIA
              </span>
              <br />
              <span className="text-4xl md:text-6xl">com IA Suprema</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              A primeira plataforma que combina <strong>GPT-4o + Claude + Board Infinito</strong> 
              para criar funis milionários automaticamente. Do zero aos R$ 100k/mês.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleDemoAccess}
                disabled={isLoading || demoLoginMutation.isPending}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-2xl text-lg px-8 py-4"
              >
                {isLoading || demoLoginMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Preparando Demo...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    ACESSAR DEMO GRATUITO
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold text-lg px-8 py-4"
                onClick={() => setLocation('/case-studies')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Ver Cases de Sucesso
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex justify-center items-center gap-8 text-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">R$ 2.7M+</div>
                <div className="text-sm">Faturamento Gerado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-sm">Empreendedores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">98.7%</div>
                <div className="text-sm">Taxa de Sucesso</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tecnologia que <span className="text-blue-400">Revoluciona</span> Resultados
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combinamos as IAs mais avançadas do mundo com interfaces inspiradas 
              no Render.com e funcionalidades do Cakto.com.br
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-blue-500 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Resultados <span className="text-green-400">Comprovados</span>
            </h2>
            <p className="text-xl text-gray-300">
              Veja o que nossos clientes estão conquistando
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold">{testimonial.name}</h3>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        {testimonial.revenue}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Escolha seu <span className="text-blue-400">Plano</span>
            </h2>
            <p className="text-xl text-gray-300">
              Comece gratuitamente com nossa demo completa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={plan.popular ? 'scale-105' : ''}
              >
                <Card className={`bg-gray-800/50 backdrop-blur-sm border-gray-700 h-full relative ${
                  plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : ''
                }`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      MAIS POPULAR
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-white">
                      {plan.price}
                      <span className="text-lg text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-gray-400">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                      } text-white font-bold`}
                      onClick={() => setLocation('/signup')}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Pronto para Construir sua
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Máquina Milionária?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Acesse agora mesmo nossa demonstração completa e veja como 
              nossa IA pode transformar seu negócio digital.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleDemoAccess}
                disabled={isLoading || demoLoginMutation.isPending}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-2xl text-xl px-12 py-6"
              >
                {isLoading || demoLoginMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    EXPERIMENTAR AGORA GRÁTIS
                  </>
                )}
              </Button>
            </div>

            {/* Newsletter */}
            <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
                <Button 
                  type="submit"
                  disabled={newsletterMutation.isPending}
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  {newsletterMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Receba updates exclusivos sobre IA e marketing digital
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-gray-800 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">Máquina Milionária AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transformando empreendedores em milionários através de IA avançada.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Integrações</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">Cases</a></li>
                <li><a href="#" className="hover:text-white">Suporte</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Máquina Milionária AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;