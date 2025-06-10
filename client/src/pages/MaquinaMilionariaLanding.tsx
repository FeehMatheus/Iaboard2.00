import { useState } from 'react';
import { Link } from 'wouter';
import { Play, CheckCircle, Users, Star, Globe, Brain, Clock, Cog } from 'lucide-react';

export default function MaquinaMilionariaLanding() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Juliane Borges",
      title: "Renda recorrente mensal de mais de R$10.000,00",
      videoId: "PJqLUrWbO4k"
    },
    {
      name: "Rafael dos Santos", 
      title: "Mais de 1 milhão e meio de reais faturados",
      videoId: "S1TJdfGcixA"
    },
    {
      name: "Guilherme de Jesus",
      title: "Mais de 1 milhão de reais faturados", 
      videoId: "DTbZsOHo05g"
    },
    {
      name: "Raphael Romie",
      title: "Mais de 8 dígitos anuais",
      videoId: "eUpTfcd_OAU"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-white font-bold text-xl">Máquina Milionária</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#vantagens" className="text-gray-300 hover:text-orange-400 transition-colors">Vantagens</a>
            <a href="#metodo" className="text-gray-300 hover:text-orange-400 transition-colors">Método</a>
            <a href="#garantia" className="text-gray-300 hover:text-orange-400 transition-colors">Garantia</a>
            <a href="#faq" className="text-gray-300 hover:text-orange-400 transition-colors">Dúvidas</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Transforme seu<br />
              computador em uma<br />
              <span className="text-orange-500">Máquina Milionária</span>
            </h1>
            <p className="text-xl text-gray-300">
              Mesmo que você esteja começando do <strong>absoluto zero</strong> ou que já tenha 
              feito de tudo na internet!
            </p>
            <div className="flex space-x-4 text-orange-500">
              <span>→</span><span>→</span><span>→</span>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative">
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="aspect-video bg-black relative">
                {!isVideoPlaying ? (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
                    <img 
                      src="https://thumbs.tv.pandavideo.com.br/vz-2cdebb25-226/3b46e22c-3332-4257-a708-f6b7b1ffc3ff/cover.jpg"
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <button className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors shadow-lg">
                      <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                    </button>
                    <button className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors">
                      🔊 ATIVAR SOM
                    </button>
                  </div>
                ) : (
                  <iframe
                    src="https://player-vz-2cdebb25-226.tv.pandavideo.com.br/embed/?v=3b46e22c-3332-4257-a708-f6b7b1ffc3ff&autoplay=1"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-8">+ de 50.000 alunos desde 2021</h2>
          <img 
            src="https://maquinamilionaria.com/images/img-compradores.png"
            alt="Fotos dos alunos"
            className="mx-auto mb-8 max-w-2xl w-full"
          />
          <div className="space-y-4">
            <p className="text-3xl font-bold">
              Por apenas <span className="text-orange-500">12X de R$309,96</span>
            </p>
            <Link href="/checkout">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all">
                QUERO TER UMA MÁQUINA MILIONÁRIA
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vantagens Section */}
      <section id="vantagens" className="bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Faça vendas em tempo recorde</h2>
            <p className="text-xl text-orange-500">e viva como um verdadeiro milionário!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold">Mais dinheiro, mais tempo, mais liberdade.</h3>
              <p className="text-gray-400">
                Nos últimos 12 anos eu criei um jeito simples de construir um verdadeiro império online. 
                Agora em 2025, isso ficou 100x mais fácil e rápido com o poder da Inteligência Artificial…
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Cog className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold">Sua própria Máquina Milionária de Vendas</h3>
              <p className="text-gray-400">
                Esse método vai te mostrar o caminho para que a Inteligência Artificial faça todo o trabalho 
                pesado enquanto você assiste as notificações de venda caindo na tela do seu celular
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold">Um cérebro multimilionário a sua disposição</h3>
              <p className="text-gray-400">
                Eu reuní 12 anos da minha experiência numa inteligência que você terá acesso e será capaz 
                de transformar ideias em dinheiro, ou melhor, muito dinheiro!
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold">O poder da mais avançada I.A de marketing nas suas mãos!</h3>
              <p className="text-gray-400">
                Crie o seu produto do 0 ou aumente as suas vendas em 2x, 5x, 10x mais! 
                Zero esforço, sem mostrar seu rosto e sem precisar ter conhecimento pra isso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">A MAIOR NOVIDADE DO MERCADO NOS ÚLTIMOS ANOS!</h2>
            <p className="text-xl text-gray-300">O que os alunos tem a dizer</p>
            <h3 className="text-2xl font-bold text-orange-500 mt-4">Você será o próximo case de sucesso!</h3>
            <p className="text-gray-400 mt-2">
              Se contra fatos não há argumentos, contra resultados também não. Veja abaixo o poder do que 
              só o conhecimento certo é capaz de fazer. Seja o próximo a mostrar seus ganhos…
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="aspect-video bg-black relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${testimonial.videoId}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-orange-500 text-sm">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FURION.AI Section */}
      <section className="bg-gradient-to-r from-orange-600/20 to-red-600/20 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 px-6 py-2 rounded-full mb-4">
              <span className="text-orange-500 font-bold">NOVIDADE: FURION.AI</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4">A inteligência forjada para transformar ideias em dinheiro!</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              Ambiciosamente eu e a minha equipe reunimos todo o conhecimento que acumulamos em 12 anos e criamos 
              uma inteligência capaz de ser o seu maior e talvez ÚNICO aliado para vender milhões! Uma máquina com 
              poderes de uma equipe de marketing completa, seja para um simples iniciante, um empreendedor de loja 
              física ou até mesmo um dono de um império das vendas…
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src="https://player-vz-2cdebb25-226.tv.pandavideo.com.br/embed/?v=09ce2740-09ea-4339-b723-23bba934e486"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/furion-access">
              <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all">
                QUERO ACESSO AO FURION.AI
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Método Section */}
      <section id="metodo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Conheça as 5 etapas do Método Máquina Milionária</h2>
          </div>

          <div className="space-y-16">
            {[
              {
                phase: "Fase 1",
                title: "O seu ponto de partida",
                description: "Aqui você vai entender como todo o máquina milionária funciona e vai receber o mapa de tudo que vai criar em minutos com ajuda do Furion. Além disso, vai ganhar todos os acessos e bônus secretos dentro da plataforma outsider.",
                image: "https://maquinamilionaria.com/images/metodo1.png"
              },
              {
                phase: "Fase 2", 
                title: "Dominando a Inteligência Artificial",
                description: "Aqui, vamos te mostrar como você pode criar o seu próprio produto do zero. Aqui é onde te mostraremos todas as minúcias do 'motor' da máquina que funcionará para você 24h por dia.",
                image: "https://maquinamilionaria.com/images/metodo2.png"
              },
              {
                phase: "Fase 3",
                title: "Criando sua Máquina Milionária", 
                description: "Aqui você vai colocar tudo que foi criado pelo Furion em prática. Todas as engrenagens da sua máquina milionária se juntarão em um sistema que atrai vendas em tempo recorde!",
                image: "https://maquinamilionaria.com/images/metodo3.png"
              },
              {
                phase: "Fase 4",
                title: "Hora de imprimir dinheiro",
                description: "Nessa fase você vai aprender a usar a ferramenta milionária: O Meta Ads. O combustível que levará pessoas ao site do produto, criando anúncios simples usando inteligência artificial.",
                image: "https://maquinamilionaria.com/images/metodo4.png"
              },
              {
                phase: "Fase 5",
                title: "Escalando seu faturamento",
                description: "Essa fase dará o conhecimento de escala, que será usado principalmente quando o seu negócio estiver faturando 5 dígitos mensais.",
                image: "https://maquinamilionaria.com/images/metodo5.png"
              }
            ].map((phase, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full font-bold">
                    {phase.phase}
                  </div>
                  <h3 className="text-3xl font-bold">{phase.title}</h3>
                  <p className="text-gray-400 text-lg">{phase.description}</p>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img src={phase.image} alt={phase.title} className="w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">Aqui está TUDO o que você terá acesso:</h2>
            <p className="text-xl text-gray-300">
              Garanta a sua vaga no Método Máquina Milionária e tenha acesso a um combo completo contendo…
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl p-8 border border-orange-500/30">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Ao fazer parte do projeto Máquina Milionária agora, você recebe:</h3>
              </div>

              <div className="space-y-6 mb-8">
                {[
                  { item: "Máquina Milionária", description: "(acesso de 1 ano)", price: "R$2997,00", status: "" },
                  { item: "Furion.ai", description: "(6 meses de acesso a minha nova IA)", price: "R$1297,00", status: "GRÁTIS" },
                  { item: "6 Lives de acompanhamento", description: "(que ficarão gravadas)", price: "R$2497,00", status: "GRÁTIS" },
                  { item: "Comunidade Exclusiva no Circle", description: "", price: "R$997,00", status: "GRÁTIS" },
                  { item: "Treinamento de Criação De Anúncios e Vídeos Com I.A", description: "", price: "R$997,00", status: "GRÁTIS" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-700">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <span className="font-bold">{item.item}</span>
                        {item.description && <span className="text-gray-400"> {item.description}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${item.status === 'GRÁTIS' ? 'line-through text-gray-500' : 'text-white'}`}>
                        {item.price}
                      </div>
                      {item.status && <div className="text-green-400 font-bold">{item.status}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center border-t border-gray-700 pt-8">
                <div className="text-2xl mb-4">
                  <span className="line-through text-gray-500">Valor TOTAL: R$ 8.785,00</span>
                </div>
                <div className="text-4xl font-bold text-orange-500 mb-8">
                  Por apenas 12X de R$309,96
                </div>
                <Link href="/checkout">
                  <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all w-full max-w-md">
                    QUERO TER UMA MÁQUINA MILIONÁRIA
                  </button>
                </Link>
                <div className="mt-4">
                  <img src="https://maquinamilionaria.com/images/bandeiras.png" alt="Cartões aceitos" className="mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia Section */}
      <section id="garantia" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Selo Outlier de Satisfação</h2>
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-8 border border-green-500/30">
              <p className="text-lg leading-relaxed">
                Estou tão confiante no poder do Método Máquina Milionária que estou assumindo todo o risco: 
                Use o sistema por <strong className="text-green-400">7 dias</strong>. Explore o material, 
                implemente as estratégias, veja o potencial por si mesmo. Se por qualquer motivo você não 
                ficar completamente satisfeito, basta enviar um email para 
                <strong className="text-orange-500"> furion@suportebilhon.com</strong> que alguém da minha 
                equipe vai processar o reembolso de 100% do valor investido. Sem perguntas. Sem burocracia. 
                Sem má vontade.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/checkout">
                <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all">
                  QUERO TER UMA MÁQUINA MILIONÁRIA
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Perguntas Frequentes</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "#1 Quais são as formas de pagamento?",
                answer: "Você pode realizar o pagamento por Cartão de Crédito, Boleto Bancário, PIX, PayPal, Google Pay, Samsung Pay e Débito Bancário."
              },
              {
                question: "#2 Como vou receber o acesso à Máquina Milionária?", 
                answer: "Assim que o pagamento for aprovado, você recebe um e-mail com o seu login. Se pagar no boleto, pode levar até 2 dias úteis (mas se quiser ver resultado logo, não banque o lento)."
              },
              {
                question: "#3 O conteúdo é ao vivo ou gravado?",
                answer: "As aulas da Máquina Milionária são gravadas, porque liberdade não combina com compromisso de Zoom marcado. Você assiste quando quiser, quantas vezes quiser, onde quiser. Só as 6 Lives de acompanhamento são ao vivo, mas também ficarão gravadas."
              },
              {
                question: "#4 Por quanto tempo vou ter acesso?",
                answer: "Você terá acesso à Máquina Milionária por 12 meses. E acesso ao FURION (IA) como bônus por 6 meses. Tempo mais que suficiente para implementar tudo e ver os resultados."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-orange-500 mb-4">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-white font-bold text-xl">Máquina Milionária</span>
          </div>
          <p className="text-gray-400">© 2025 Máquina Milionária. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}