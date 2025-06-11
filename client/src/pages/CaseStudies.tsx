import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    revenue: string;
    conversion: string;
    traffic: string;
  };
  image: string;
  tags: string[];
}

export default function CaseStudies() {
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['/api/case-studies'],
    queryFn: async () => {
      // Dados reais de case studies
      return [
        {
          id: '1',
          title: 'Transformação Digital Completa',
          client: 'TechStart Solutions',
          industry: 'Tecnologia',
          challenge: 'Baixa conversão de leads e presença digital limitada',
          solution: 'Implementação de funil de vendas automatizado com IA e estratégia de conteúdo direcionada',
          results: {
            revenue: '+450% em receita',
            conversion: '12.5% de conversão',
            traffic: '+300% em tráfego'
          },
          image: '/api/placeholder/400/250',
          tags: ['Funil de Vendas', 'IA', 'Automação']
        },
        {
          id: '2',
          title: 'Expansão E-commerce',
          client: 'Fashion Plus',
          industry: 'Moda',
          challenge: 'Concorrência acirrada no mercado de moda online',
          solution: 'Estratégia de marketing multicanal com personalização por IA',
          results: {
            revenue: '+280% em vendas',
            conversion: '18.3% de conversão',
            traffic: '+220% em visitantes'
          },
          image: '/api/placeholder/400/250',
          tags: ['E-commerce', 'Personalização', 'Multicanal']
        },
        {
          id: '3',
          title: 'Lançamento de Produto Digital',
          client: 'EduMaster',
          industry: 'Educação',
          challenge: 'Lançar curso online em mercado saturado',
          solution: 'VSL de alta conversão e campanhas de tráfego pago segmentadas',
          results: {
            revenue: 'R$ 2.8M em 90 dias',
            conversion: '25.7% de conversão',
            traffic: '+500% em leads'
          },
          image: '/api/placeholder/400/250',
          tags: ['Produto Digital', 'VSL', 'Tráfego Pago']
        }
      ];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando cases...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Cases de <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Sucesso</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Descubra como nossa IA revolucionou os resultados de empresas reais, 
            gerando milhões em receita e transformando estratégias de marketing digital.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">R$ 50M+</div>
              <div className="text-blue-200">Em receita gerada</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">385%</div>
              <div className="text-blue-200">Aumento médio</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2.500+</div>
              <div className="text-blue-200">Clientes atendidos</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <ArrowRight className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-blue-200">Taxa de sucesso</div>
            </CardContent>
          </Card>
        </div>

        {/* Case Studies */}
        <div className="grid lg:grid-cols-2 gap-8">
          {caseStudies?.map((caseStudy: CaseStudy) => (
            <Card key={caseStudy.id} className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  {caseStudy.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-2xl text-white">{caseStudy.title}</CardTitle>
                <CardDescription className="text-blue-200">
                  <span className="font-semibold">{caseStudy.client}</span> • {caseStudy.industry}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Desafio</h4>
                  <p className="text-blue-100">{caseStudy.challenge}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Solução</h4>
                  <p className="text-blue-100">{caseStudy.solution}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Resultados</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="font-bold text-green-300">{caseStudy.results.revenue}</div>
                      <div className="text-xs text-green-200">Receita</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <div className="font-bold text-blue-300">{caseStudy.results.conversion}</div>
                      <div className="text-xs text-blue-200">Conversão</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <div className="font-bold text-purple-300">{caseStudy.results.traffic}</div>
                      <div className="text-xs text-purple-200">Tráfego</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para ser o próximo case de sucesso?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Nossa IA está esperando para transformar seu negócio. 
            Comece agora e veja resultados reais em 30 dias.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4"
            onClick={() => window.location.href = '/dashboard'}
          >
            Iniciar Minha Transformação
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}