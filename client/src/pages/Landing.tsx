import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { 
  Brain, Crown, Zap, Target, TrendingUp, Video, 
  FileText, Mail, Star, Check, Play, ArrowRight
} from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [showPromoVideo, setShowPromoVideo] = useState(false);

  const generatePromoVideo = async () => {
    try {
      setVideoLoading(true);
      
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: `Revolucione seu negócio com o IA BOARD BY FILIPPE - a plataforma mais avançada de inteligência artificial para empreendedores digitais. 

Imagine ter acesso a 10 IAs especializadas trabalhando simultaneamente para criar produtos digitais completos, campanhas de marketing de alta conversão e estratégias de crescimento automático.

Com nossa tecnologia exclusiva de Pensamento Poderoso, você obtém resultados extraordinários em tempo record. Milhares de empreendedores já estão dominando seus mercados com nossa plataforma.

Crie VSLs cinematográficos, copies persuasivas, funis otimizados e campanhas de tráfego inteligentes - tudo com poucos cliques no nosso quadro infinito revolucionário.

Não perca esta oportunidade única de transformar seu negócio com a mais avançada tecnologia de IA do mercado. Comece agora mesmo sua demo gratuita e descubra o poder da automação inteligente!`,
          style: 'promotional',
          duration: 120,
          voiceGender: 'female',
          backgroundMusic: true,
          subtitles: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedVideo(result.video);
        setShowPromoVideo(true);
      }
    } catch (error) {
      console.error('Video generation failed:', error);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setLocation('/dashboard');
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  const plans = [
    {
      name: 'Demo',
      price: 'Grátis',
      description: 'Teste todas as funcionalidades',
      features: [
        '3 projetos IA',
        'Quadro infinito básico',
        'Exportação PDF',
        'Suporte por email'
      ],
      action: () => handleDemoLogin(),
      buttonText: 'Começar Demo',
      popular: false
    },
    {
      name: 'Criador',
      price: 'R$ 97/mês',
      description: 'Para empreendedores sérios',
      features: [
        'Projetos IA ilimitados',
        'Todas as IAs ativadas',
        'Modo Pensamento Poderoso™',
        'Exportação completa',
        'IA Espiã concorrência',
        'Suporte prioritário'
      ],
      action: () => setLocation('/pricing'),
      buttonText: 'Escolher Criador',
      popular: true
    },
    {
      name: 'Total Pro+',
      price: 'R$ 197/mês',
      description: 'Máxima potência empresarial',
      features: [
        'Tudo do Criador +',
        'API personalizada',
        'White label',
        'Integração Zapier',
        'Consultoria mensal',
        'Suporte 24/7'
      ],
      action: () => setLocation('/pricing'),
      buttonText: 'Escolher Pro+',
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Empreendedor Digital',
      content: 'Criei meu primeiro produto em 2 horas com o IA Board. Já vendi R$ 15.000 no primeiro mês!',
      rating: 5
    },
    {
      name: 'Marina Santos',
      role: 'Coach de Negócios',
      content: 'O Modo Pensamento Poderoso™ é revolucionário. A IA literalmente constrói todo o funil sozinha.',
      rating: 5
    },
    {
      name: 'Pedro Oliveira',
      role: 'Agência de Marketing',
      content: 'Automatizamos 80% do nosso processo criativo. Nossos clientes ficam impressionados.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Crown className="w-4 h-4 mr-2" />
              IA Board by Filippe™
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Construa Produtos e Vendas com
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}IAs Reais
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              A primeira plataforma que usa múltiplas IAs para criar produtos digitais completos, 
              páginas de vendas e campanhas de tráfego automaticamente.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
                onClick={handleDemoLogin}
              >
                <Play className="w-5 h-5 mr-2" />
                Começar Demo Grátis
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Video className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>

            {/* Video Demo */}
            <div className="relative max-w-4xl mx-auto">
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-8">
                  {generatedVideo ? (
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative group cursor-pointer overflow-hidden"
                         onClick={() => window.open(generatedVideo.videoUrl, '_blank')}>
                      {generatedVideo.thumbnailUrl ? (
                        <img 
                          src={generatedVideo.thumbnailUrl} 
                          alt="IA Board Promotional Video" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Video className="w-16 h-16 mx-auto mb-4 text-purple-300" />
                            <h3 className="text-xl font-bold mb-2">Vídeo Promocional IA</h3>
                            <p className="text-sm text-purple-200">Criado com IA cinematográfica</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 rounded-lg group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                          <Play className="w-10 h-10 text-purple-600 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                          <h4 className="text-white font-bold text-sm">IA BOARD BY FILIPPE™</h4>
                          <p className="text-purple-200 text-xs">Vídeo promocional gerado com IA real</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-white">Duração: {generatedVideo.scriptData?.totalDuration || 120}s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : videoLoading ? (
                    <div className="aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">Gerando Vídeo Promocional...</h3>
                        <p className="text-sm text-purple-200">IA criando conteúdo cinematográfico</p>
                        <div className="mt-4 w-64 bg-purple-800/30 rounded-full h-2 mx-auto">
                          <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="video-generator-btn aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg flex items-center justify-center group cursor-pointer relative overflow-hidden border-2 border-purple-500/30 hover:border-purple-400/50 transition-colors"
                         onClick={generatePromoVideo}>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                      <div className="text-center text-white z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl mb-4 mx-auto">
                          <Video className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Gerar Vídeo Promocional</h3>
                        <p className="text-purple-200 mb-4">Clique para criar um vídeo cinematográfico com IA</p>
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 inline-block">
                          <p className="text-xs text-purple-300">✨ Narração profissional • 🎬 Visuais cinematográficos • 🎵 Trilha sonora</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Múltiplas IAs Trabalhando Para Você
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Cada IA especializada em uma função específica, trabalhando em conjunto 
              para criar seu império digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'IA Criador de Produtos',
                description: 'Gera produtos digitais completos com pesquisa de mercado e validação'
              },
              {
                icon: FileText,
                title: 'IA Copywriter Pro',
                description: 'Cria headlines, VSLs e copies de alta conversão automaticamente'
              },
              {
                icon: Video,
                title: 'IA Vídeo Mestre',
                description: 'Produz roteiros, vozes e vídeos profissionais em minutos'
              },
              {
                icon: Target,
                title: 'IA Tráfego Ultra',
                description: 'Configura campanhas otimizadas no Facebook, Google e Instagram'
              },
              {
                icon: TrendingUp,
                title: 'IA Analytics Plus',
                description: 'Monitora métricas e otimiza conversões em tempo real'
              },
              {
                icon: Zap,
                title: 'IA Espiã',
                description: 'Analisa concorrência e identifica oportunidades de mercado'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Resultados Reais de Usuários Reais
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-purple-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Escolha Seu Plano de Dominação
            </h2>
            <p className="text-gray-300 text-lg">
              Todos os planos incluem acesso completo às IAs e quadro infinito
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-black/40 border-purple-500/30 backdrop-blur-sm relative ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Mais Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-purple-400">{plan.price}</div>
                  <p className="text-gray-300">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                    onClick={plan.action}
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto Para Revolucionar Seus Negócios?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já estão usando 
            IAs para criar impérios digitais automáticos.
          </p>
          
          <Button 
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-xl"
            onClick={handleDemoLogin}
          >
            <Crown className="w-6 h-6 mr-3" />
            Começar Agora - Demo Grátis
          </Button>
        </div>
      </div>
    </div>
  );
}