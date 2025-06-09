import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown, ArrowRight, Brain, Target, TrendingUp, Users, Shield, Sparkles, LogIn, UserPlus, Eye, Video, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import Logo from "@/components/Logo";

export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

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
      <header className="relative z-10 p-6">
        <nav className="glass-effect rounded-2xl p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsLoginOpen(true)}
                variant="ghost" 
                className="glass-effect hover:bg-white/20 transition-all duration-300 text-white border-white/20"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
              
              <Button 
                onClick={() => setIsRegisterOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300"
              >
                <UserPlus className="w-4 h-4 mr-2" />
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
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Crie Funis</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Inteligentes
            </span>
            <br />
            <span className="text-white">em Minutos</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            A plataforma de IA mais avançada para criar funis de vendas completos. 
            <strong className="text-indigo-400"> Múltiplas IAs, 8 etapas automáticas</strong> e 
            resultados comprovados.
          </p>

          {/* Demo Account Info */}
          <div className="glass-effect rounded-2xl p-6 mb-12 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">🎯 Conta Demo Disponível</h3>
            <div className="text-left space-y-2 text-gray-300">
              <p><strong>Email:</strong> demo@iaboard.com</p>
              <p><strong>Senha:</strong> demo123</p>
              <p className="text-sm text-indigo-400">Acesso completo às ferramentas Pro</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              onClick={() => setIsRegisterOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg h-auto rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Começar Grátis Agora
            </Button>
            
            <Button 
              onClick={() => setIsLoginOpen(true)}
              variant="outline"
              className="glass-effect hover:bg-white/10 text-white border-white/30 font-semibold px-8 py-4 text-lg h-auto rounded-xl transition-all duration-300"
            >
              <Eye className="w-5 h-5 mr-2" />
              Testar Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="flex items-center text-gray-400">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span>4.9/5 avaliação</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Users className="w-5 h-5 mr-2" />
              <span>+10.000 usuários</span>
            </div>
            <div className="flex items-center text-gray-400">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span>300% ROI médio</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Por que escolher o IA Board V2?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            A única plataforma que combina múltiplas inteligências artificiais para criar funis de alta conversão
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Planos para Todo Tamanho
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades. Upgrade ou downgrade a qualquer momento.
            </p>
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
                    onClick={() => setIsRegisterOpen(true)}
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
    </div>
  );
}