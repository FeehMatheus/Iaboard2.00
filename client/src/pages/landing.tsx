import { useState } from "react";
import { Zap, Eye, Video, TrendingUp, FileText, Folder, Check, Star, ArrowRight, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    window.location.href = '/dashboard';
    return null;
  }

  const features = [
    {
      icon: Zap,
      title: "IA Board V2 - Criador de Funis",
      description: "Crie funis completos com 8 etapas usando múltiplas IAs (GPT, Claude, Gemini)",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Eye,
      title: "IA Espiã v2",
      description: "Análise avançada de concorrentes e templates prontos para usar",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Video,
      title: "IA Vídeo Avançado",
      description: "Geração de roteiros e estruturas de vídeo profissionais",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: TrendingUp,
      title: "IA Tráfego Master",
      description: "Campanhas com segmentação comportamental avançada",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: FileText,
      title: "IA Copy & Headlines",
      description: "Copy de alta conversão baseado em dados reais",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Folder,
      title: "Gerenciador de Funis",
      description: "Organização e gestão de múltiplos projetos",
      color: "from-violet-500 to-purple-600"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      badge: null,
      features: [
        "3 funis por mês",
        "50 gerações de IA",
        "IA Board V2 - Criador de Funis",
        "Gerenciador de Funis",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      popular: false
    },
    {
      name: "Starter",
      price: "R$ 47",
      period: "/mês",
      description: "Para empreendedores sérios",
      badge: "MAIS POPULAR",
      features: [
        "10 funis por mês",
        "500 gerações de IA",
        "Todas as ferramentas básicas",
        "IA Espiã v2",
        "IA Copy & Headlines",
        "Suporte prioritário",
        "Templates premium"
      ],
      buttonText: "Começar Agora",
      popular: true
    },
    {
      name: "Pro",
      price: "R$ 97",
      period: "/mês",
      description: "Para agências e experts",
      badge: "PROFISSIONAL",
      features: [
        "50 funis por mês",
        "2000 gerações de IA",
        "Todas as ferramentas",
        "IA Vídeo Avançado",
        "IA Tráfego Master",
        "Análises detalhadas",
        "API access",
        "Suporte 24/7"
      ],
      buttonText: "Upgrade Pro",
      popular: false
    },
    {
      name: "Enterprise",
      price: "R$ 297",
      period: "/mês",
      description: "Para grandes empresas",
      badge: "ENTERPRISE",
      features: [
        "Funis ilimitados",
        "Gerações ilimitadas",
        "Todas as ferramentas",
        "White-label",
        "Integração personalizada",
        "Gerente dedicado",
        "Treinamento da equipe",
        "SLA garantido"
      ],
      buttonText: "Contatar Vendas",
      popular: false
    }
  ];

  return (
    <div className="font-inter bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="glass-effect rounded-2xl p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 text-white">🧠</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IA Board V2</h1>
                <p className="text-sm text-gray-300">by FILIPPE</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowLogin(true)}
                className="glass-effect hover:bg-white/20 transition-all duration-300 text-white border-white/20"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => setShowRegister(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-white font-semibold"
              >
                Criar Conta
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2 text-sm font-semibold mb-6">
            🚀 Modo IA Total™ - Revolucione Seus Funis
          </Badge>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Plataforma Inteligente</span>
          <br />
          <span className="text-white">de Criação de Funis</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Utilize múltiplas IAs (GPT-4o, Claude Sonnet 4, Gemini Pro) para criar automaticamente 
          funis completos de vendas. Fluxo estratégico de 8 etapas com conteúdo inteligente 
          para cada fase do seu negócio.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            onClick={() => setShowRegister(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xl font-bold px-12 py-6 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 animate-pulse-glow"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <span>Começar Grátis Agora</span>
              <div className="bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                GRÁTIS
              </div>
            </div>
          </Button>
          
          <Button 
            variant="outline"
            className="glass-effect hover:bg-white/10 text-white border-white/30 text-xl font-semibold px-12 py-6 h-auto rounded-2xl transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Video className="w-6 h-6" />
              <span>Ver Demonstração</span>
            </div>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold gradient-text mb-2">10,000+</div>
            <div className="text-gray-300">Funis Criados</div>
          </div>
          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold gradient-text mb-2">500M+</div>
            <div className="text-gray-300">Gerações de IA</div>
          </div>
          <div className="glass-effect rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold gradient-text mb-2">98%</div>
            <div className="text-gray-300">Taxa de Satisfação</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ferramentas Poderosas de IA
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cada ferramenta foi desenvolvida para maximizar seus resultados usando 
            a mais avançada tecnologia de inteligência artificial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="glass-effect rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 animate-fade-in group" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Planos flexíveis para cada necessidade. Comece grátis e evolua conforme cresce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`glass-effect border-white/20 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <Badge className={`${
                    plan.popular ? 'bg-indigo-500' : 'bg-purple-500'
                  } text-white border-0 font-bold`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                <div className="text-4xl font-bold gradient-text mb-2">
                  {plan.price}<span className="text-lg text-gray-400">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-300">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => setShowRegister(true)}
                  className={`w-full h-12 font-semibold ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white' 
                      : 'glass-effect hover:bg-white/20 text-white border-white/30'
                  } transition-all duration-300`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="glass-effect rounded-3xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto Para Revolucionar Seus Funis?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Junte-se a milhares de empreendedores que já estão usando IA para 
            criar funis de vendas mais eficientes e lucrativos.
          </p>
          
          <Button 
            onClick={() => setShowRegister(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-2xl font-bold px-16 py-8 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 animate-pulse-glow"
          >
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8" />
              <span>Começar Agora - É Grátis</span>
              <div className="bg-amber-400 text-slate-900 px-4 py-2 rounded-full text-lg font-bold">
                0% Risco
              </div>
            </div>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 IA Board V2 by FILIPPE. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}