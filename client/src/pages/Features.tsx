import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Target, 
  PenTool, 
  Video, 
  Mail, 
  TrendingUp, 
  Users, 
  Globe, 
  BarChart3,
  Palette,
  Shield,
  ArrowRight
} from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
  benefits: string[];
  category: string;
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: Brain,
      title: "IA Suprema Furion",
      description: "Nossa IA proprietária que entende seu negócio e gera conteúdo personalizado de alta conversão",
      benefits: [
        "Aprende com seu histórico de vendas",
        "Adapta tom de voz da sua marca",
        "Otimização contínua baseada em resultados"
      ],
      category: "IA Avançada"
    },
    {
      icon: PenTool,
      title: "Gerador de Copy",
      description: "Crie headlines, descrições de produtos e textos persuasivos que convertem",
      benefits: [
        "Headlines que aumentam CTR em 300%",
        "Copies baseadas em gatilhos mentais",
        "A/B testing automático de variações"
      ],
      category: "Copywriting"
    },
    {
      icon: Video,
      title: "Scripts de VSL",
      description: "Roteiros completos para Video Sales Letters que hipnotizam e vendem",
      benefits: [
        "Estrutura de storytelling comprovada",
        "Ganchos emocionais poderosos",
        "CTAs irresistíveis"
      ],
      category: "Vídeo Marketing"
    },
    {
      icon: Mail,
      title: "Sequências de E-mail",
      description: "Campanhas automatizadas que nutrem leads e convertem em vendas",
      benefits: [
        "Sequências de relacionamento",
        "E-mails de abandono de carrinho",
        "Campanhas de reativação"
      ],
      category: "E-mail Marketing"
    },
    {
      icon: Target,
      title: "Funis Completos",
      description: "Construa funis de vendas otimizados do lead à conversão",
      benefits: [
        "Templates de alta conversão",
        "Fluxos automatizados",
        "Otimização por IA"
      ],
      category: "Funis de Vendas"
    },
    {
      icon: TrendingUp,
      title: "Campanhas de Tráfego",
      description: "Estratégias e anúncios para Facebook, Google e outras plataformas",
      benefits: [
        "Segmentação inteligente",
        "Criativos de alta performance",
        "Otimização de budget automática"
      ],
      category: "Tráfego Pago"
    },
    {
      icon: Globe,
      title: "Canvas Infinito",
      description: "Organize todos seus projetos em um espaço visual colaborativo",
      benefits: [
        "Interface intuitiva tipo Miro",
        "Colaboração em tempo real",
        "Organização visual de projetos"
      ],
      category: "Produtividade"
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Métricas detalhadas e insights acionáveis sobre seu desempenho",
      benefits: [
        "Dashboard completo de KPIs",
        "Relatórios automatizados",
        "Sugestões de otimização"
      ],
      category: "Analytics"
    },
    {
      icon: Users,
      title: "Análise de Concorrência",
      description: "Monitore e aprenda com seus concorrentes automaticamente",
      benefits: [
        "Tracking de campanhas rivais",
        "Análise de estratégias",
        "Alertas de oportunidades"
      ],
      category: "Inteligência Competitiva"
    },
    {
      icon: Palette,
      title: "Templates Premium",
      description: "Biblioteca com centenas de templates testados e aprovados",
      benefits: [
        "Designs responsivos",
        "Otimizados para conversão",
        "Atualizações constantes"
      ],
      category: "Design"
    },
    {
      icon: Shield,
      title: "Segurança Enterprise",
      description: "Proteção de dados e privacidade de nível corporativo",
      benefits: [
        "Criptografia end-to-end",
        "Compliance LGPD",
        "Backups automáticos"
      ],
      category: "Segurança"
    },
    {
      icon: Zap,
      title: "Automações Inteligentes",
      description: "Workflows que funcionam 24/7 para escalar seu negócio",
      benefits: [
        "Leads scoring automático",
        "Nutrição personalizada",
        "Follow-ups inteligentes"
      ],
      category: "Automação"
    }
  ];

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Funcionalidades <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Revolucionárias</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Descubra como nossa plataforma de IA pode transformar completamente 
            sua estratégia de marketing digital e multiplicar seus resultados.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/10 border-white/20 backdrop-blur-lg hover:bg-white/15 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-black" />
                    </div>
                    <Badge variant="outline" className="border-blue-300/30 text-blue-300">
                      {feature.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-yellow-300 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-blue-100">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Section */}
        <div className="bg-white/5 rounded-2xl p-8 mb-16 border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Integrações Poderosas
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Conecte nossa IA com suas ferramentas favoritas e potencialize ainda mais seus resultados
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Facebook Ads", logo: "📘" },
              { name: "Google Ads", logo: "🔍" },
              { name: "Mailchimp", logo: "📧" },
              { name: "HubSpot", logo: "🎯" },
              { name: "Shopify", logo: "🛒" },
              { name: "WordPress", logo: "📝" },
              { name: "Zapier", logo: "⚡" },
              { name: "Stripe", logo: "💳" }
            ].map((integration, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-lg text-center p-4">
                <div className="text-3xl mb-2">{integration.logo}</div>
                <div className="text-white font-medium">{integration.name}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { metric: "+385%", label: "Aumento médio em vendas", icon: TrendingUp },
            { metric: "25.7%", label: "Taxa de conversão média", icon: Target },
            { metric: "72h", label: "ROI positivo garantido", icon: Zap },
            { metric: "98%", label: "Satisfação dos clientes", icon: Users }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30 backdrop-blur-lg text-center">
                <CardContent className="p-6">
                  <IconComponent className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.metric}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-white/20 backdrop-blur-lg p-12">
            <CardContent className="space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Pronto para Revolucionar seu Negócio?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Junte-se a milhares de empreendedores que já estão usando nossa IA 
                para gerar resultados extraordinários todos os dias.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4"
                  onClick={() => window.location.href = '/signup'}
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Ver Preços
                </Button>
              </div>
              
              <div className="text-sm text-blue-200 pt-4">
                ✓ Teste grátis por 7 dias • ✓ Sem cartão de crédito • ✓ Suporte em português
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}