import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Users, Clock, Zap, Brain, Globe, ArrowDown, Star, Award, TrendingUp, Rocket, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface MaquinaMilionariaProps {
  onOpenFurion: () => void;
  onAccessPlatform: () => void;
}

export default function MaquinaMilionaria({ onOpenFurion, onAccessPlatform }: MaquinaMilionariaProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold">Máquina Milionária</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#vantagens" className="text-gray-300 hover:text-white transition-colors">Vantagens</a>
            <a href="#metodo" className="text-gray-300 hover:text-white transition-colors">Método</a>
            <a href="#garantia" className="text-gray-300 hover:text-white transition-colors">Garantia</a>
            <a href="#duvidas" className="text-gray-300 hover:text-white transition-colors">Dúvidas</a>
          </nav>
        </div>
      </header>

      {/* Hero Section - Exata do original */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Transforme seu<br />
              computador em uma<br />
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Máquina Milionária
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Mesmo que você esteja começando do <strong className="text-white">absoluto zero</strong> ou que já tenha feito de tudo na internet!
            </p>

            {/* Setas decorativas - igual ao original */}
            <div className="flex justify-center space-x-4 mb-12">
              <ArrowDown className="w-6 h-6 text-orange-500 animate-bounce" />
              <ArrowDown className="w-6 h-6 text-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <ArrowDown className="w-6 h-6 text-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>

            {/* Video Player - Replica do original */}
            <div className="relative max-w-4xl mx-auto mb-16">
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border-4 border-gray-700 shadow-2xl">
                {!videoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&crop=center" 
                      alt="Video Preview"
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <Button
                      onClick={() => setVideoPlaying(true)}
                      className="absolute z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </Button>
                    
                    {/* Botão Ativar Som - igual ao original */}
                    <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded font-bold text-sm">
                      🔊 ATIVAR SOM
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-400">AGUARDANDO LIVE STREAM</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prova Social - + de 50.000 alunos */}
            <div className="mb-12">
              <p className="text-2xl font-bold text-orange-500 mb-6">+ de 50.000 alunos desde 2021</p>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=200&fit=crop&crop=center" 
                  alt="Fotos dos alunos"
                  className="rounded-lg opacity-80"
                />
              </div>
            </div>

            {/* Pricing e CTA - Exato do original */}
            <div className="text-center mb-8">
              <p className="text-xl text-gray-400 mb-2">Por apenas</p>
              <div className="text-4xl md:text-5xl font-bold mb-8">
                <span className="text-orange-500">12X de </span>
                <span className="text-white">R$309,96</span>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-16 py-8 text-2xl font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                QUERO TER UMA MÁQUINA MILIONÁRIA
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vantagens Section - Igual ao original */}
      <section id="vantagens" className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Faça vendas em tempo recorde<br />
              e viva como um verdadeiro milionário!
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Mais dinheiro, mais tempo, mais liberdade.</h3>
              <p className="text-gray-400 leading-relaxed">
                Nos últimos 12 anos eu criei um jeito simples de construir um verdadeiro império online. 
                Agora em 2025, isso ficou 100x mais fácil e rápido com o poder da Inteligência Artificial…
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Sua própria Máquina Milionária de Vendas</h3>
              <p className="text-gray-400 leading-relaxed">
                Esse método vai te mostrar o caminho para que a Inteligência Artificial faça todo o trabalho pesado 
                enquanto você assiste as notificações de venda caindo na tela do seu celular
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Um cérebro multimilionário a sua disposição</h3>
              <p className="text-gray-400 leading-relaxed">
                Eu reuní 12 anos da minha experiência numa inteligência que você terá acesso e será capaz de 
                transformar ideias em dinheiro, ou melhor, muito dinheiro!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">O poder da mais avançada I.A de marketing nas suas mãos!</h3>
              <p className="text-gray-400 leading-relaxed">
                Crie o seu produto do 0 ou aumente as suas vendas em 2x, 5x, 10x mais!
                Zero esforço, sem mostrar seu rosto e sem precisar ter conhecimento pra isso.
                O Máquina Milionária te mostrará como…
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
              A MAIOR NOVIDADE DO MERCADO NOS ÚLTIMOS ANOS!
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-8">O que os alunos tem a dizer</h3>
            <p className="text-xl text-gray-400">Você será o próximo case de sucesso!</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Juliane Borges", result: "Renda recorrente mensal de mais de R$10.000,00" },
              { name: "Rafael dos Santos", result: "Mais de 1 milhão e meio de reais faturados" },
              { name: "Guilherme de Jesus", result: "Mais de 1 milhão de reais faturados" },
              { name: "Raphael Romie", result: "Mais de 8 dígitos anuais" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
              >
                <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-orange-500" />
                </div>
                <h4 className="font-bold text-lg mb-2">{testimonial.name}</h4>
                <p className="text-orange-500 font-semibold">{testimonial.result}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FURION.AI Section - Destaque especial */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-3 mb-8">
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full font-bold text-lg">
                NOVIDADE: FURION.AI
              </span>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              A inteligência forjada para<br />
              transformar ideias em dinheiro!
            </h2>
            
            <p className="text-xl text-gray-200 mb-12 max-w-5xl mx-auto leading-relaxed">
              Ambiciosamente eu e a minha equipe reunimos todo o conhecimento que acumulamos em 12 anos e criamos 
              uma inteligência capaz de ser o seu maior e talvez ÚNICO aliado para vender milhões! Uma máquina com 
              poderes de uma equipe de marketing completa, seja para um simples iniciante, um empreendedor de loja 
              física ou até mesmo um dono de um império das vendas…
            </p>

            {/* Video do Furion */}
            <div className="relative max-w-4xl mx-auto mb-12">
              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border-4 border-purple-500/30 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-purple-800 to-blue-800 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-20 h-20 text-white mx-auto mb-4 animate-pulse" />
                    <p className="text-xl text-gray-300 mb-4">Conheça o Furion no vídeo abaixo:</p>
                    <Button
                      onClick={() => {}}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30"
                    >
                      <Play className="w-6 h-6 text-white ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={onOpenFurion}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Brain className="w-6 h-6 mr-3" />
                CONHECER O FURION.AI
              </Button>
              
              <Button
                onClick={onAccessPlatform}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl font-bold rounded-xl"
              >
                ACESSAR PLATAFORMA COMPLETA
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-6 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">+ de 50.000 alunos desde 2021</h3>
          <div className="text-2xl mb-8">
            Por apenas <span className="font-bold">12X de R$309,96</span>
          </div>
          <Button 
            size="lg" 
            className="bg-black hover:bg-gray-900 text-white px-16 py-6 text-xl font-bold rounded-xl"
          >
            QUERO TER UMA MÁQUINA MILIONÁRIA
          </Button>
        </div>
      </section>
    </div>
  );
}