import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Users, Clock, Zap, Brain, Globe, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onOpenFurion: () => void;
  onOpenFurionSuprema: () => void;
  onAccessPlatform: () => void;
}

export default function LandingPage({ onOpenFurion, onAccessPlatform }: LandingPageProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const testimonials = [
    {
      name: "Juliane Borges",
      result: "Renda recorrente mensal de mais de R$10.000,00",
      videoId: "PJqLUrWbO4k"
    },
    {
      name: "Rafael dos Santos", 
      result: "Mais de 1 milhão e meio de reais faturados",
      videoId: "S1TJdfGcixA"
    },
    {
      name: "Guilherme de Jesus",
      result: "Mais de 1 milhão de reais faturados", 
      videoId: "DTbZsOHo05g"
    },
    {
      name: "Raphael Romie",
      result: "Mais de 8 dígitos anuais",
      videoId: "eUpTfcd_OAU"
    }
  ];

  const metodologyPhases = [
    {
      phase: 1,
      title: "O seu ponto de partida",
      description: "Aqui você vai entender como todo o máquina milionária funciona e vai receber o mapa de tudo que vai criar em minutos com ajuda do Furion. Além disso, vai ganhar todos os acessos e bônus secretos dentro da plataforma outsider."
    },
    {
      phase: 2,
      title: "Dominando a Inteligência Artificial",
      description: "Aqui, vamos te mostrar como você pode criar o seu próprio produto do zero. Aqui é onde te mostraremos todas as minúcias do 'motor' da máquina que funcionará para você 24h por dia. Você começará a criar um passo a passo 'duplicável' para quantos produtos quiser vender… E o melhor, sem a necessidade de mostrar o seu rosto e vendendo em qualquer moeda do planeta!"
    },
    {
      phase: 3,
      title: "Criando sua Máquina Milionária",
      description: "Aqui você vai colocar tudo que foi criado pelo Furion em prática. Todas as engrenagens da sua máquina milionária se juntarão em um sistema que atrai vendas em tempo recorde!"
    },
    {
      phase: 4,
      title: "Hora de imprimir dinheiro",
      description: "Nessa fase você vai aprender a usar a ferramenta milionária: O Meta Ads. O combustível que levará pessoas ao site do produto, criando anúncios simples usando inteligência artificial para fazer todo o trabalho pesado."
    },
    {
      phase: 5,
      title: "Escalando seu faturamento",
      description: "Essa fase dará o conhecimento de escala, que será usado principalmente quando o seu negócio estiver faturando 5 dígitos mensais. Trouxe um dos maiores especialistas em escala de negócios digitais para mostrar exatamente como multiplicar AINDA MAIS o seu faturamento online."
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-12 h-12 text-orange-400" />,
      title: "Mais dinheiro, mais tempo, mais liberdade.",
      description: "Nos últimos 12 anos eu criei um jeito simples de construir um verdadeiro império online. Agora em 2025, isso ficou 100x mais fácil e rápido com o poder da Inteligência Artificial…"
    },
    {
      icon: <Zap className="w-12 h-12 text-orange-400" />,
      title: "Sua própria Máquina Milionária de Vendas",
      description: "Esse método vai te mostrar o caminho para que a Inteligência Artificial faça todo o trabalho pesado enquanto você assiste as notificações de venda caindo na tela do seu celular"
    },
    {
      icon: <Brain className="w-12 h-12 text-orange-400" />,
      title: "Um cérebro multimilionário a sua disposição",
      description: "Eu reuní 12 anos da minha experiência numa inteligência que você terá acesso e será capaz de transformar ideias em dinheiro, ou melhor, muito dinheiro!"
    },
    {
      icon: <Globe className="w-12 h-12 text-orange-400" />,
      title: "O poder da mais avançada I.A de marketing nas suas mãos!",
      description: "Crie o seu produto do 0 ou aumente as suas vendas em 2x, 5x, 10x mais! Zero esforço, sem mostrar seu rosto e sem precisar ter conhecimento pra isso. O Máquina Milionária te mostrará como…"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header/Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-bold text-white">Máquina Milionária</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#vantagens" className="text-gray-300 hover:text-white transition-colors">Vantagens</a>
          <a href="#metodo" className="text-gray-300 hover:text-white transition-colors">Método</a>
          <a href="#garantia" className="text-gray-300 hover:text-white transition-colors">Garantia</a>
          <a href="#duvidas" className="text-gray-300 hover:text-white transition-colors">Dúvidas</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Transforme seu computador em uma{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                Máquina Milionária
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Mesmo que você esteja começando do <strong>absoluto zero</strong> ou que já tenha feito de tudo na internet!
            </p>

            {/* Video Player */}
            <div className="relative max-w-4xl mx-auto mb-8">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {!videoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <button
                      onClick={() => setVideoPlaying(true)}
                      className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                    
                    <div className="absolute top-4 left-4">
                      <Button variant="outline" size="sm" className="text-black bg-white border-white">
                        🔊 ATIVAR SOM
                      </Button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src="https://player.vimeo.com/video/demo?autoplay=1"
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center justify-center space-x-2 mb-8"
            >
              <Users className="w-6 h-6 text-orange-400" />
              <span className="text-white font-bold text-lg">+ de 39.718 alunos desde 2021</span>
            </motion.div>

            {/* Pricing and CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-2">Por apenas</p>
                <div className="text-4xl md:text-5xl font-bold text-white mb-6">
                  12X de <span className="text-orange-400">R$309,96</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold flex-1 max-w-md"
                >
                  QUERO TER UMA MÁQUINA MILIONÁRIA
                </Button>
                
                <Button 
                  onClick={onOpenFurion}
                  size="lg" 
                  variant="outline"
                  className="border-orange-500 text-orange-400 hover:bg-orange-500/10 px-8 py-6 text-lg font-bold flex-1 max-w-md"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  TESTAR FURION.AI GRÁTIS
                </Button>
                
                <Button 
                  onClick={onAccessPlatform}
                  size="lg" 
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg font-bold flex-1 max-w-md"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  ACESSAR PLATAFORMA
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="vantagens" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Faça vendas em tempo recorde
            </h2>
            <p className="text-xl text-orange-400 font-semibold">
              e viva como um verdadeiro milionário!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4">
                  {benefit.icon}
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A MAIOR NOVIDADE DO MERCADO NOS ÚLTIMOS ANOS!
            </h2>
            <p className="text-xl text-gray-300 mb-8">O que os alunos tem a dizer</p>
            <h3 className="text-2xl font-bold text-orange-400">
              Você será o próximo case de sucesso!
            </h3>
            <p className="text-gray-300 mt-4">
              Se contra fatos não há argumentos, contra resultados também não. Veja abaixo o poder do que só o conhecimento certo é capaz de fazer. Seja o próximo a mostrar seus ganhos…
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${testimonial.videoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{testimonial.name}</h4>
                <p className="text-orange-400 font-semibold">{testimonial.result}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Furion.AI Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold">NOVIDADE:</span>
              <span className="text-3xl font-bold">FURION.AI</span>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              A inteligência forjada para transformar ideias em dinheiro!
            </h2>
            
            <p className="text-xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Ambiciosamente eu e a minha equipe reunimos todo o conhecimento que acumulamos em 12 anos e criamos uma inteligência capaz de ser o seu maior e talvez ÚNICO aliado para vender milhões! Uma máquina com poderes de uma equipe de marketing completa, seja para um simples iniciante, um empreendedor de loja física ou até mesmo um dono de um império das vendas…
            </p>
            
            <Button
              onClick={onOpenFurion}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold"
            >
              <Brain className="w-6 h-6 mr-3" />
              CONHECER O FURION.AI
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="metodo" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Conheça as 5 etapas do Método Máquina Milionária
            </h2>
          </motion.div>

          <div className="space-y-16">
            {metodologyPhases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">Fase {phase.phase}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{phase.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-6xl font-bold text-gray-600">{phase.phase}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-600 to-red-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Aqui está TUDO o que você terá acesso:
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">1. O MÉTODO:</h3>
                <p className="text-lg">Acesso Completo ao Método Máquina Milionária</p>
                <p className="text-orange-200 mt-2">(Valor: R$2997)</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">2. A INTELIGÊNCIA FURION:</h3>
                <p className="text-lg">Acesso à Inteligência Artificial Furion.ai por 6 meses</p>
                <p className="text-orange-200 mt-2">(Valor: R$1297)</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">3. MENTORIA:</h3>
                <p className="text-lg">Acompanhamento AO VIVO por 3 meses</p>
                <p className="text-orange-200 mt-2">(Valor: R$1997)</p>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-2xl text-orange-200 mb-2">Por apenas</p>
              <div className="text-5xl font-bold text-white mb-6">
                12X de <span className="text-yellow-300">R$309,96</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-12 py-6 text-2xl font-bold shadow-2xl"
            >
              GARANTIR MINHA VAGA AGORA
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-white">Máquina Milionária</span>
          </div>
          <p className="text-gray-400">
            © 2025 Máquina Milionária. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}