import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Brain, Zap, Target, TrendingUp, Users } from 'lucide-react';

const methodSteps = [
  {
    phase: 'Fase 1',
    title: 'O seu ponto de partida',
    description: 'Aqui você vai entender como toda a IA Board funciona e vai receber o mapa de tudo que vai criar em minutos com ajuda da nossa IA. Além disso, vai ganhar todos os acessos e bônus secretos dentro da plataforma.',
    icon: MapPin,
    color: 'from-blue-500 to-blue-600'
  },
  {
    phase: 'Fase 2',
    title: 'Dominando a Inteligência Artificial',
    description: 'Aqui, vamos te mostrar como você pode criar o seu próprio produto do zero. Aqui é onde te mostraremos todas as minúcias do "motor" da máquina que funcionará para você 24h por dia. Você começará a criar um passo a passo "duplicável" para quantos produtos quiser vender… E o melhor, sem a necessidade de mostrar o seu rosto e vendendo em qualquer moeda do planeta!',
    icon: Brain,
    color: 'from-purple-500 to-purple-600'
  },
  {
    phase: 'Fase 3',
    title: 'Criando sua IA Board Milionária',
    description: 'Aqui você vai colocar tudo que foi criado pela IA em prática. Todas as engrenagens da sua máquina milionária se juntarão em um sistema que atrai vendas em tempo recorde!',
    icon: Zap,
    color: 'from-orange-500 to-orange-600'
  },
  {
    phase: 'Fase 4',
    title: 'Hora de imprimir dinheiro',
    description: 'Nessa fase você vai aprender a usar a ferramenta milionária: O Meta Ads. O combustível que levará pessoas ao site do produto, criando anúncios simples usando inteligência artificial para fazer todo o trabalho pesado.',
    icon: Target,
    color: 'from-green-500 to-green-600'
  },
  {
    phase: 'Fase 5',
    title: 'Escalando seu faturamento',
    description: 'Essa fase dará o conhecimento de escala, que será usado principalmente quando o seu negócio estiver faturando 5 dígitos mensais. Trouxe um dos maiores especialistas em escala de negócios digitais para mostrar exatamente como multiplicar AINDA MAIS o seu faturamento online.',
    icon: TrendingUp,
    color: 'from-red-500 to-red-600'
  },
  {
    phase: 'Fase Extra',
    title: 'Acompanhamento AO VIVO por 3 meses',
    description: 'Ao decidir fazer parte do projeto IA Board Milionária agora, você garante acesso exclusivo a 6 lives de acompanhamento comigo. Nas lives fechadas, vou abrir minha tela e te mostrar: onde clica, o que digita e como montar sua máquina de vendas com a IA Board do zero… Mesmo que você ainda ache que "funil" é coisa de cozinha.',
    icon: Users,
    color: 'from-pink-500 to-pink-600'
  }
];

export function MethodSteps() {
  return (
    <section id="metodo" className="py-16 px-4 bg-gray-900/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Conheça as 6 etapas do Método IA Board Milionária
          </h2>
        </div>

        <div className="space-y-12">
          {methodSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < methodSteps.length - 1 && (
                <div className="absolute left-1/2 top-full w-px h-12 bg-gradient-to-b from-orange-400 to-transparent transform -translate-x-1/2 z-10"></div>
              )}
              
              <Card className="bg-gray-800 border-gray-700 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <Badge className="bg-orange-600 text-white mb-2">
                        {step.phase}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}