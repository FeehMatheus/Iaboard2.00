import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown, ArrowRight, Brain, Target, TrendingUp, Users, Shield, Sparkles, LogIn, UserPlus, Eye, Video, FileText, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import PaymentModal from "@/components/PaymentModal";
import Logo from "@/components/Logo";

export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "3 funis por mês",
        "50 gerações de IA",
        "Criador de funis básico",
        "Suporte por email",
        "Templates básicos"
      ],
      cta: "Começar Grátis",
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Starter",
      price: "R$ 47",
      period: "/mês",
      description: "Para criadores ativos",
      features: [
        "15 funis por mês",
        "300 gerações de IA",
        "Todas as ferramentas básicas",
        "IA Espiã v2",
        "VSL Automático",
        "Suporte prioritário",
        "Templates premium"
      ],
      cta: "Escolher Starter",
      popular: true,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Pro",
      price: "R$ 97",
      period: "/mês",
      description: "Para profissionais",
      features: [
        "50 funis por mês",
        "1000 gerações de IA",
        "Todas as ferramentas",
        "IA Copy Avançada",
        "Análise de performance",
        "White-label",
        "Suporte 24/7",
        "API access"
      ],
      cta: "Escolher Pro",
      popular: false,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "R$ 197",
      period: "/mês",
      description: "Para agências",
      features: [
        "Funis ilimitados",
        "Gerações ilimitadas",
        "Todas as ferramentas",
        "Equipe ilimitada",
        "Treinamento dedicado",
        "Integração customizada",
        "Suporte dedicado",
        "SLA garantido"
      ],
      cta: "Falar com Vendas",
      popular: false,
      color: "from-amber-500 to-yellow-600"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "IA Múltipla",
      description: "Combina GPT-4, Claude e Gemini para resultados únicos"
    },
    {
      icon: Target,
      title: "8 Etapas Inteligentes",
      description: "Workflow completo desde análise até conversão"
    },
    {
      icon: TrendingUp,
      title: "Performance Otimizada",
      description: "Algoritmos testados que maximizam conversões"
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Criptografia avançada e proteção total"
    },
    {
      icon: Users,
      title: "Equipe Colaborativa",
      description: "Trabalhe em equipe com permissões granulares"
    },
    {
      icon: Sparkles,
      title: "Templates Premium",
      description: "Biblioteca com funis de alta conversão"
    }
  ];

  return (
    <div className="font-inter bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <nav className="glass-effect rounded-2xl p-3 md:p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button 
                onClick={() => setIsLoginOpen(true)}
                variant="ghost" 
                size="sm"
                className="glass-effect hover:bg-white/20 transition-all duration-300 text-white border border-white/20 px-4 py-2 h-auto rounded-lg text-sm font-medium"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Entrar
              </Button>
              
              <Button 
                onClick={() => setIsRegisterOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold px-4 py-2 h-auto rounded-lg text-sm transition-all duration-300 shadow-lg"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Criar Conta
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30 mb-6">
            🚀 Nova versão com IA avançada
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
            <span className="text-white drop-shadow-2xl">Crie Funis que</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-xl">
              Convertem 347%
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">mais em 8 Minutos</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-200 mb-8 max-w-5xl mx-auto leading-relaxed font-medium">
            🚀 <strong className="text-white font-bold">Revolucione suas vendas</strong> com a única plataforma que combina 
            <span className="text-blue-400 font-bold"> GPT-4o, Claude Sonnet e Gemini</span> para criar funis
            <span className="text-emerald-400 font-bold"> que realmente vendem</span>.
          </p>

          {/* Key Benefits Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            <div className="glass-effect rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center h-full">
                  <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <p className="text-white font-bold text-lg mb-1">Setup em 8 min</p>
              <p className="text-gray-300 text-sm">Funil completo automatizado</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center h-full">
                  <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <p className="text-white font-bold text-lg mb-1">+347% conversão</p>
              <p className="text-gray-300 text-sm">Resultado médio comprovado</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center h-full">
                  <Brain className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <p className="text-white font-bold text-lg mb-1">3 IAs trabalhando</p>
              <p className="text-gray-300 text-sm">Máxima inteligência artificial</p>
            </div>
          </div>

          {/* Demo Account Info */}
          <div className="glass-effect rounded-3xl p-8 mb-12 max-w-lg mx-auto border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">🎯 Teste Gratuitamente</h3>
              <p className="text-gray-300">Acesso completo às ferramentas Pro</p>
            </div>
            <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
              <div className="space-y-3 text-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Email:</span>
                  <code className="bg-white/10 px-3 py-1 rounded-lg text-emerald-300 font-mono">demo@iaboard.com</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Senha:</span>
                  <code className="bg-white/10 px-3 py-1 rounded-lg text-emerald-300 font-mono">demo123</code>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              onClick={() => setIsRegisterOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold px-12 py-6 text-xl h-auto rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              🎯 Começar Grátis - 7 Dias
            </Button>
            
            <Button 
              onClick={() => setIsLoginOpen(true)}
              variant="outline"
              className="glass-effect hover:bg-white/10 text-white border-2 border-white/30 font-semibold px-10 py-6 text-xl h-auto rounded-2xl transition-all duration-300 hover:border-white/50"
            >
              <Eye className="w-6 h-6 mr-3" />
              Testar Demo
            </Button>
          </div>

          {/* Urgency & Social Proof */}
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-400/30">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-300 font-medium text-sm">🔥 Apenas 47 vagas restantes no plano Pro em Janeiro</span>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span className="text-sm"><strong className="text-white">2.847</strong> empresários usando</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm"><strong className="text-white">4.9/5</strong> avaliação média</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm"><strong className="text-white">100%</strong> garantia 30 dias</span>
              </div>
            </div>

            {/* Enhanced Testimonial */}
            <div className="max-w-2xl mx-auto glass-effect rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-3">
                "Aumentei minhas vendas em 284% no primeiro mês com o IA Board. A automação é impressionante e os funis realmente convertem!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
                <div>
                  <p className="text-emerald-400 font-semibold text-sm">Marina Silva</p>
                  <p className="text-gray-500 text-xs">CEO, Tech Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-center text-white mb-6 tracking-tight">
            Por que Empresários Escolhem o
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"> IA Board V2</span>?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 text-center mb-16 max-w-4xl mx-auto font-medium leading-relaxed">
            A única plataforma que combina <span className="text-blue-400 font-bold">múltiplas inteligências artificiais</span> para criar funis de 
            <span className="text-emerald-400 font-bold"> alta conversão automaticamente</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-effect border-white/20 hover:bg-white/10 transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Planos que Aceleram Seus Resultados
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Mais de <span className="text-emerald-400 font-bold">2.847 empresários</span> já escolheram nossos planos para <span className="text-blue-400 font-semibold">triplicar suas vendas</span>. 
              Cancele quando quiser, sem taxa.
            </p>
            
            {/* Value propositions */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-400/30">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">7 dias grátis</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-400/30">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Garantia 30 dias</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-400/30">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Setup instantâneo</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`glass-effect border-white/20 hover:border-white/40 transition-all duration-300 relative ${
                  plan.popular ? 'ring-2 ring-indigo-500/50 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                        : 'glass-effect hover:bg-white/10 text-white border-white/30'
                    }`}
                    onClick={() => {
                      if (plan.name === 'Free') {
                        setIsRegisterOpen(true);
                      } else {
                        setSelectedPlan(plan);
                        setIsPaymentOpen(true);
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-effect rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Revolucionar Seus Funis?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já estão criando funis inteligentes com IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setIsRegisterOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg h-auto rounded-xl transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              Começar Gratuitamente
            </Button>
            
            <Button 
              variant="outline"
              className="glass-effect hover:bg-white/10 text-white border-white/30 font-semibold px-8 py-4 text-lg h-auto rounded-xl transition-all duration-300"
            >
              <Video className="w-5 h-5 mr-2" />
              Ver Demonstração
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              © 2024 IA Board V2. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      
      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}