import { useState } from 'react';
import { Link } from 'wouter';
import { Play, CheckCircle, Users, Star, Globe, Brain, Clock, Cog, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-blue-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">AI Marketing Pro</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Recursos</a>
            <a href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors">Preços</a>
            <a href="#testimonials" className="text-gray-300 hover:text-blue-400 transition-colors">Depoimentos</a>
            <a href="#faq" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-blue-400">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
              <span className="text-blue-400 font-semibold">🚀 Nova Geração de IA para Marketing</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Transforme Seu
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Marketing Digital
              </span>
              <br />
              com IA Avançada
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Crie campanhas, copies, funnels e estratégias de marketing que convertem usando 
              nossa inteligência artificial treinada pelos melhores profissionais do mercado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg">
                  Começar Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-8 py-4 text-lg">
                Ver Demonstração
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Teste grátis por 7 dias</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Demo Video */}
          <div className="relative">
            <div className="bg-gray-900/50 rounded-2xl overflow-hidden shadow-2xl border border-blue-500/30 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-blue-900/30 to-purple-900/30 relative">
                {!isVideoPlaying ? (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <button className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-all shadow-lg group-hover:scale-110">
                      <Play className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      ▶️ Ver Como Funciona
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
                      <p className="text-gray-400">Demonstração em Vídeo</p>
                      <p className="text-sm text-gray-500 mt-2">Sistema de IA para Marketing Digital</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              🔥 Mais de 10.000 usuários
            </div>
            <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ⭐ 4.9/5 Avaliação
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-black/30 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-8">Mais de 10.000 empresas confiam em nossa IA</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 opacity-60">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-16 flex items-center justify-center">
                <span className="text-gray-500 font-semibold">Empresa {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tudo que Você Precisa para
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Dominar o Marketing</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Nossa IA foi treinada com milhões de campanhas de sucesso para entregar resultados excepcionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Copy de Vendas com IA",
                description: "Gere textos persuasivos que convertem visitantes em clientes usando técnicas comprovadas de copywriting.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Play className="w-8 h-8" />,
                title: "Criação de VSLs",
                description: "Roteiros completos para Video Sales Letters que mantêm a audiência engajada do início ao fim.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Funnels Inteligentes",
                description: "Construa funis de venda otimizados que guiam seus prospects através da jornada de compra.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Análise de Audiência",
                description: "Entenda profundamente seu público-alvo e crie mensagens que ressoam com suas necessidades.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Campanhas de Ads",
                description: "Anúncios otimizados para Facebook, Instagram e Google Ads que maximizam seu ROI.",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Automação Completa",
                description: "Automatize todo seu marketing digital e foque no que realmente importa: crescer seu negócio.",
                color: "from-teal-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all group hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-black/30 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Escolha o Plano Ideal</h2>
            <p className="text-xl text-gray-400">Preços transparentes que cabem no seu orçamento</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "47",
                period: "/mês",
                description: "Perfeito para começar",
                features: [
                  "10 projetos de IA por mês",
                  "Copy e headlines básicas",
                  "Suporte por email",
                  "Templates básicos"
                ],
                cta: "Começar Grátis",
                popular: false
              },
              {
                name: "Professional",
                price: "97",
                period: "/mês",
                description: "Para profissionais sérios",
                features: [
                  "50 projetos de IA por mês",
                  "Todos os tipos de conteúdo",
                  "VSLs e funnels completos",
                  "Suporte prioritário",
                  "Analytics avançados",
                  "Exportação ilimitada"
                ],
                cta: "Teste 7 Dias Grátis",
                popular: true
              },
              {
                name: "Enterprise",
                price: "197",
                period: "/mês",
                description: "Para agências e empresas",
                features: [
                  "Projetos ilimitados",
                  "IA personalizada",
                  "Integrações avançadas",
                  "Suporte dedicado",
                  "Treinamento exclusivo",
                  "API completa"
                ],
                cta: "Falar com Vendas",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border transition-all hover:scale-105 ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-700/50 hover:border-blue-500/50'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Mais Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">R$ {plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancele a qualquer momento</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Suporte incluído</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6">
              Pronto para Revolucionar
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Seu Marketing?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Junte-se a milhares de empresas que já descobriram o poder da IA para marketing digital
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-12 py-4 text-lg">
                  Começar Teste Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-12 py-4 text-lg">
                Agendar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">AI Marketing Pro</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Revolucionando o marketing digital com inteligência artificial avançada.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Integrações</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 AI Marketing Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}