import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Zap, Rocket, Home } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Pricing() {
  const [, setLocation] = useLocation();

  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "50 gerações de IA por mês",
        "Templates básicos",
        "Suporte por email",
        "1 usuário",
        "Exportação básica"
      ],
      cta: "Começar Agora",
      popular: false
    },
    {
      name: "Professional",
      price: "R$ 297",
      period: "/mês",
      description: "Para negócios em crescimento",
      features: [
        "500 gerações de IA por mês",
        "Todos os templates premium",
        "Suporte prioritário",
        "5 usuários",
        "Canvas infinito",
        "Análise avançada",
        "Exportação completa"
      ],
      cta: "Mais Popular",
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 997",
      period: "/mês",
      description: "Para grandes empresas",
      features: [
        "Gerações ilimitadas",
        "Templates personalizados",
        "Suporte dedicado 24/7",
        "Usuários ilimitados",
        "API personalizada",
        "Integrações avançadas",
        "White-label disponível"
      ],
      cta: "Contatar Vendas",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Início
            </Button>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Demo Grátis
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Planos e <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Preços</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Escolha o plano ideal para transformar seu negócio
          </p>
        </motion.div>

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
    </div>
  );
}