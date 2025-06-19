import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Zap, Crown } from 'lucide-react';

const features = [
  'O MÉTODO: 6 Fases completas do IA Board Milionária',
  'ACESSO À IA BOARD: Inteligência artificial exclusiva',
  'TEMPLATES PRONTOS: Mais de 100 modelos para usar',
  'SUPORTE PREMIUM: Atendimento prioritário 24/7',
  'LIVES EXCLUSIVAS: 6 sessões ao vivo por 3 meses',
  'GARANTIA TOTAL: 30 dias para testar sem riscos',
  'BÔNUS ESPECIAIS: Cursos complementares (valor R$ 2.997)',
  'COMUNIDADE VIP: Acesso ao grupo exclusivo de alunos',
  'ATUALIZAÇÕES GRATUITAS: Todas as melhorias incluídas',
  'CERTIFICADO: Documento oficial de conclusão'
];

export function PricingSection() {
  return (
    <section id="precos" className="py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-orange-600 text-white mb-4">
            NOVIDADES
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Aqui está TUDO o que você terá acesso:
          </h2>
          <p className="text-xl text-gray-300">
            Garanta a sua vaga no Método IA Board Milionária e tenha acesso a um combo completo contendo…
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-orange-500 border-2 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-600 text-white animate-pulse">
                OFERTA LIMITADA
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-8 h-8 text-yellow-400" />
                <CardTitle className="text-3xl font-bold text-white">
                  IA Board Milionária - ACESSO COMPLETO
                </CardTitle>
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-300 ml-2">(+ de 50.000 alunos satisfeitos)</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    O que está incluído:
                  </h3>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-6">
                  <div className="bg-black/30 rounded-2xl p-6">
                    <div className="text-gray-400 line-through text-lg mb-2">
                      De R$ 5.997,00
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      Por apenas
                    </div>
                    <div className="text-5xl font-bold text-yellow-400 mb-4">
                      12x de R$ 309,96
                    </div>
                    <div className="text-gray-300">
                      ou R$ 3.197,00 à vista com 15% de desconto
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 text-lg"
                      >
                        🚀 QUERO TER UMA IA BOARD MILIONÁRIA
                      </Button>
                    </Link>
                    
                    <Link href="/checkout?payment=boleto">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full border-white text-white hover:bg-white/10 py-4"
                      >
                        💳 QUERO PAGAR NO BOLETO
                      </Button>
                    </Link>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Garantia de 30 dias</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Acesso imediato</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-purple-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Suporte premium</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-yellow-300 font-semibold">
                  ⚡ ATENÇÃO: Esta oferta especial expira em breve! 
                  Apenas 47 vagas restantes para este preço.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}