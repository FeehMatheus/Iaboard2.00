import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, CheckCircle, Users, Clock, Zap, Brain, Globe, Star } from 'lucide-react';
import { VideoTestimonials } from '@/components/VideoTestimonials';
import { PricingSection } from '@/components/PricingSection';
import { MethodSteps } from '@/components/MethodSteps';

export function Landing() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">IA Board by Filippe</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#vantagens" className="hover:text-orange-400 transition-colors">Vantagens</a>
            <a href="#metodo" className="hover:text-orange-400 transition-colors">Método</a>
            <a href="#garantia" className="hover:text-orange-400 transition-colors">Garantia</a>
            <a href="#faq" className="hover:text-orange-400 transition-colors">Dúvidas</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Transforme seu computador em uma{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
              IA Board Milionária
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Mesmo que você esteja começando do{' '}
            <span className="font-bold text-white">absoluto zero</span>{' '}
            ou que já tenha feito de tudo na internet!
          </p>

          {/* Decorative Arrows */}
          <div className="flex justify-center gap-4 mb-12">
            <div className="w-8 h-8 text-orange-400">↓</div>
            <div className="w-8 h-8 text-orange-400">↓</div>
            <div className="w-8 h-8 text-orange-400">↓</div>
          </div>

          {/* Main Video */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
              {!videoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                  </button>
                  <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm">
                    🔊 ATIVAR SOM
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Users className="w-6 h-6 text-orange-400" />
            <span className="text-lg font-semibold">+ de 50.000 alunos desde 2021</span>
          </div>

          {/* Pricing CTA */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-lg mb-2">Por apenas</p>
              <div className="text-4xl font-bold mb-4">
                12x de <span className="text-yellow-300">R$ 309,96</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/checkout">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-bold px-8">
                    QUERO TER UMA IA BOARD MILIONÁRIA
                  </Button>
                </Link>
                <Link href="/checkout?payment=boleto">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    QUERO PAGAR NO BOLETO
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="vantagens" className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Faça vendas em tempo recorde
            </h2>
            <p className="text-xl text-gray-300">
              e viva como um verdadeiro milionário!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Mais dinheiro, mais tempo, mais liberdade</h3>
                <p className="text-gray-300">
                  Nos últimos 12 anos eu criei um jeito simples de construir um verdadeiro império online. 
                  Agora em 2025, isso ficou 100x mais fácil e rápido com o poder da Inteligência Artificial…
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Sua própria IA Board Milionária de Vendas</h3>
                <p className="text-gray-300">
                  Esse método vai te mostrar o caminho para que a Inteligência Artificial faça todo o trabalho pesado 
                  enquanto você assiste as notificações de venda caindo na tela do seu celular
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Um cérebro multimilionário a sua disposição</h3>
                <p className="text-gray-300">
                  Eu reuní 12 anos da minha experiência numa inteligência que você terá acesso e será capaz de 
                  transformar ideias em dinheiro, ou melhor, muito dinheiro!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">O poder da mais avançada I.A de marketing nas suas mãos!</h3>
                <p className="text-gray-300">
                  Crie o seu produto do 0 ou aumente as suas vendas em 2x, 5x, 10x mais! 
                  Zero esforço, sem mostrar seu rosto e sem precisar ter conhecimento pra isso.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-orange-600 text-white mb-4">
              A MAIOR NOVIDADE DO MERCADO NOS ÚLTIMOS ANOS!
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que os alunos tem a dizer
            </h2>
            <p className="text-xl text-gray-300">
              Você será o próximo case de sucesso!
            </p>
          </div>

          <VideoTestimonials />
        </div>
      </section>

      {/* IA Board Feature Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-orange-600 text-white">
              NOVIDADE: IA BOARD BY FILIPPE
            </Badge>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            A inteligência forjada para transformar ideias em dinheiro!
          </h2>

          <p className="text-lg text-gray-300 mb-8 max-w-4xl mx-auto">
            Ambiciosamente eu e a minha equipe reunimos todo o conhecimento que acumulamos em 12 anos e criamos 
            uma inteligência capaz de ser o seu maior e talvez ÚNICO aliado para vender milhões! Uma máquina com 
            poderes de uma equipe de marketing completa, seja para um simples iniciante, um empreendedor de loja 
            física ou até mesmo um dono de um império das vendas…
          </p>

          <p className="text-xl font-semibold mb-8">
            Conheça a IA Board no vídeo abaixo:
          </p>

          {/* Second Video */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <button
                  onClick={() => {}}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* Social Proof Repeat */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Users className="w-6 h-6 text-orange-400" />
            <span className="text-lg font-semibold">+ de 50.000 alunos desde 2021</span>
          </div>

          {/* Pricing CTA Repeat */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-lg mb-2">Por apenas</p>
              <div className="text-4xl font-bold mb-4">
                12x de <span className="text-yellow-300">R$ 309,96</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/checkout">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-bold px-8">
                    QUERO TER UMA IA BOARD MILIONÁRIA
                  </Button>
                </Link>
                <Link href="/checkout?payment=boleto">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    QUERO PAGAR NO BOLETO
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <MethodSteps />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">IA Board by Filippe</span>
          </div>
          <p className="text-gray-400">
            © 2025 IA Board by Filippe. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}