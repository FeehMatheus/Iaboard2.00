import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, Check, Zap, Star, CreditCard, 
  Shield, Rocket, Target, Brain
} from 'lucide-react';

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePlanSelection = async (planId: string, price: number) => {
    setLoadingPlan(planId);
    
    try {
      // Create payment session with real Stripe integration
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId, 
          price,
          currency: 'BRL'
        })
      });

      const data = await response.json();
      
      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create payment session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erro no Pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleDemoAccess = async () => {
    try {
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setLocation('/dashboard');
        toast({
          title: "Demo Ativada",
          description: "Bem-vindo ao IA Board! Explore todas as funcionalidades.",
        });
      }
    } catch (error) {
      console.error('Demo access failed:', error);
    }
  };

  const plans = [
    {
      id: 'demo',
      name: 'Demo Gratuita',
      price: 0,
      originalPrice: null,
      description: 'Teste completo por 7 dias',
      badge: 'Grátis',
      badgeColor: 'bg-green-500',
      features: [
        '3 projetos IA completos',
        'Todas as IAs disponíveis',
        'Quadro infinito básico',
        'Exportação PDF',
        'Templates prontos',
        'Suporte por email'
      ],
      limitations: [
        'Limite de 3 projetos',
        'Sem modo automático',
        'Marca d\'água nos exports'
      ],
      cta: 'Começar Demo Grátis',
      action: () => handleDemoAccess(),
      popular: false
    },
    {
      id: 'criador',
      name: 'Plano Criador',
      price: 97,
      originalPrice: 197,
      description: 'Para empreendedores sérios',
      badge: 'Mais Popular',
      badgeColor: 'bg-purple-500',
      features: [
        'Projetos IA ilimitados',
        'Todas as 6 IAs ativadas',
        'Modo Pensamento Poderoso™',
        'IA Espiã concorrência',
        'Exportação completa sem marca',
        'Templates premium',
        'Integração com redes sociais',
        'Analytics avançado',
        'Suporte prioritário',
        'Atualizações automáticas'
      ],
      limitations: [],
      cta: 'Escolher Criador',
      action: () => handlePlanSelection('criador', 97),
      popular: true
    },
    {
      id: 'total-pro',
      name: 'Total Pro+',
      price: 197,
      originalPrice: 397,
      description: 'Máxima potência empresarial',
      badge: 'Premium',
      badgeColor: 'bg-gold-500',
      features: [
        'Tudo do Plano Criador +',
        'API personalizada exclusiva',
        'White label completo',
        'Integração Zapier/Make',
        'IA personalizada treinada',
        'Consultoria mensal 1h',
        'Setup personalizado',
        'Suporte 24/7 WhatsApp',
        'Acesso beta novas IAs',
        'Garantia 90 dias'
      ],
      limitations: [],
      cta: 'Escolher Pro+',
      action: () => handlePlanSelection('total-pro', 197),
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'As IAs funcionam realmente?',
      answer: 'Sim! Integramos com OpenAI, Claude e outras APIs de IA real. Não são simulações - são as mesmas IAs que grandes empresas usam.'
    },
    {
      question: 'Posso cancelar quando quiser?',
      answer: 'Absolutamente. Sem contratos ou fidelidade. Cancele a qualquer momento com 1 clique.'
    },
    {
      question: 'Funciona para qualquer nicho?',
      answer: 'Sim! As IAs são treinadas para trabalhar com qualquer mercado: saúde, educação, tecnologia, consultoria, e-commerce, etc.'
    },
    {
      question: 'Preciso de conhecimento técnico?',
      answer: 'Zero conhecimento técnico necessário. É point-and-click. As IAs fazem todo o trabalho pesado.'
    },
    {
      question: 'Há garantia?',
      answer: 'Sim! 30 dias de garantia total no Criador e 90 dias no Total Pro+. Se não gostar, devolvemos 100%.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-purple-400 mr-3" />
            <span className="text-2xl font-bold text-white">IA Board by Filippe™</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/')}
            className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
          >
            Voltar ao Início
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Star className="w-4 h-4 mr-2" />
            Oferta Limitada - 50% OFF
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Escolha Seu Plano de
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Dominação Digital
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Mais de 10.000 empreendedores já estão usando nossas IAs para criar 
            impérios digitais automáticos. Sua vez chegou.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-400" />
              SSL Seguro
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-green-400" />
              Pagamento Protegido
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-green-400" />
              Ativação Imediata
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-black/40 border-purple-500/30 backdrop-blur-sm ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className={`${plan.badgeColor} text-white px-4 py-1`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-white text-2xl mb-2">{plan.name}</CardTitle>
                
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <div className="text-4xl font-bold text-green-400">GRÁTIS</div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          R$ {plan.originalPrice}
                        </span>
                      )}
                      <div className="text-4xl font-bold text-purple-400">
                        R$ {plan.price}
                      </div>
                      <span className="text-gray-400">/mês</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-300">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">✅ Incluído:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-gray-300 text-sm">
                        <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="text-gray-400 font-semibold mb-3">⚠️ Limitações:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-gray-500 text-sm">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : plan.price === 0
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                  } text-white py-3`}
                  onClick={plan.action}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Processando...
                    </div>
                  ) : (
                    <>
                      {plan.price === 0 ? (
                        <Rocket className="w-4 h-4 mr-2" />
                      ) : (
                        <Crown className="w-4 h-4 mr-2" />
                      )}
                      {plan.cta}
                    </>
                  )}
                </Button>

                {plan.price > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      💳 Cartão, PIX ou Boleto • Cancele quando quiser
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">10.000+</div>
              <div className="text-gray-400">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">R$ 50M+</div>
              <div className="text-gray-400">Gerado em Vendas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">4.9/5</div>
              <div className="text-gray-400">Avaliação Média</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto Para Transformar Seu Negócio?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Junte-se aos milhares de empreendedores que já estão usando 
            IAs para criar impérios digitais automáticos.
          </p>
          
          <Button 
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-xl"
            onClick={() => handlePlanSelection('criador', 97)}
          >
            <Brain className="w-6 h-6 mr-3" />
            Começar Agora - Plano Criador
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            ⚡ Ativação imediata • 🔒 Pagamento 100% seguro • 🎯 Garantia 30 dias
          </p>
        </div>
      </div>
    </div>
  );
}