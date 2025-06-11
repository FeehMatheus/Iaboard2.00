import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, Zap, Crown, Rocket, ArrowRight } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  icon: any;
  buttonText: string;
  credits: string;
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const { toast } = useToast();

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'R$ 97',
      period: '/mês',
      description: 'Perfeito para empreendedores iniciantes',
      features: [
        '500 créditos Furion mensais',
        'Geração de copies e VSLs',
        'Canvas infinito básico',
        '10 projetos simultâneos',
        'Suporte por e-mail',
        'Templates básicos'
      ],
      highlighted: false,
      icon: Zap,
      buttonText: 'Começar Grátis',
      credits: '500 créditos'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 'R$ 197',
      period: '/mês',
      description: 'Para empresários que querem escalar',
      features: [
        '2.000 créditos Furion mensais',
        'Todas as funcionalidades de IA',
        'Canvas infinito avançado',
        'Projetos ilimitados',
        'Análise de concorrência',
        'Suporte prioritário',
        'Templates premium',
        'Integrações avançadas'
      ],
      highlighted: true,
      icon: Crown,
      buttonText: 'Mais Popular',
      credits: '2.000 créditos'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'R$ 497',
      period: '/mês',
      description: 'Para grandes empresas e agências',
      features: [
        '10.000 créditos Furion mensais',
        'IA personalizada para sua marca',
        'Canvas colaborativo completo',
        'Múltiplas marcas/clientes',
        'API dedicada',
        'Suporte 24/7',
        'Consultoria estratégica',
        'White-label disponível'
      ],
      highlighted: false,
      icon: Rocket,
      buttonText: 'Falar com Vendas',
      credits: '10.000 créditos'
    }
  ];

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      return apiRequest('/api/subscription/create', {
        method: 'POST',
        body: { planId }
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será direcionado para finalizar sua assinatura.",
      });
      // Simulate redirect to payment
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Erro no processo",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      });
    }
  });

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === 'enterprise') {
      // Open contact form or redirect to sales
      window.open('mailto:vendas@maquinamilionaria.ai?subject=Interesse no Plano Enterprise', '_blank');
    } else {
      subscribeMutation.mutate(planId);
    }
  };

  const handleDemoAccess = () => {
    const demoMutation = useMutation({
      mutationFn: async () => {
        return apiRequest('/api/auth/demo-login', {
          method: 'POST'
        });
      },
      onSuccess: () => {
        toast({
          title: "Acesso demo ativado!",
          description: "Explore todas as funcionalidades por 7 dias.",
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    });
    
    demoMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Invista no Seu <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Futuro</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Escolha o plano perfeito para transformar seu negócio com nossa IA revolucionária. 
            Garantia de 30 dias ou seu dinheiro de volta.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
              ✓ Sem taxa de setup
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
              ✓ Cancele quando quiser
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              ✓ Suporte em português
            </Badge>
          </div>

          <Button 
            onClick={handleDemoAccess}
            variant="outline" 
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 mb-8"
            size="lg"
          >
            Testar Grátis por 7 Dias
          </Button>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/15 transition-all duration-300 ${
                  plan.highlighted 
                    ? 'ring-2 ring-yellow-400 scale-105 shadow-2xl shadow-yellow-400/20' 
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-2">
                      MAIS POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-4 p-3 bg-white/10 rounded-full w-fit">
                    <IconComponent className="h-8 w-8 text-yellow-400" />
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200">{plan.period}</span>
                  </div>
                  <p className="text-blue-100">{plan.description}</p>
                  <div className="text-sm text-yellow-300 font-medium">{plan.credits}</div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-blue-100">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-3 font-bold ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                    disabled={subscribeMutation.isPending && selectedPlan === plan.id}
                  >
                    {subscribeMutation.isPending && selectedPlan === plan.id 
                      ? 'Processando...' 
                      : plan.buttonText
                    }
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  O que são créditos Furion?
                </h3>
                <p className="text-blue-100">
                  Créditos Furion são nossa moeda interna que você usa para gerar conteúdo com IA. 
                  Cada geração consome entre 1-5 créditos dependendo da complexidade.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-blue-100">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. 
                  Seus projetos permanecerão salvos por 30 dias.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Há garantia de reembolso?
                </h3>
                <p className="text-blue-100">
                  Oferecemos garantia incondicional de 30 dias. Se não estiver satisfeito, 
                  devolvemos 100% do seu investimento.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Posso trocar de plano depois?
                </h3>
                <p className="text-blue-100">
                  Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  As mudanças são aplicadas no próximo ciclo de cobrança.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ainda tem dúvidas?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a escolher o melhor plano 
            e começar sua jornada de transformação digital.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => window.open('mailto:suporte@maquinamilionaria.ai', '_blank')}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              size="lg"
            >
              Falar com Suporte
            </Button>
            <Button 
              onClick={() => window.location.href = '/signup'}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
              size="lg"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}