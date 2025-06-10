import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Play, 
  Users, 
  CheckCircle2, 
  Star,
  DollarSign,
  Zap,
  Brain,
  Target,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  Crown,
  ArrowRight
} from 'lucide-react';

export default function MaquinaMilionaria() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "Juliane Borges",
      result: "Renda recorrente mensal de mais de R$10.000,00",
      video: "PJqLUrWbO4k"
    },
    {
      name: "Rafael dos Santos", 
      result: "Mais de 1 milhão e meio de reais faturados",
      video: "S1TJdfGcixA"
    },
    {
      name: "Guilherme de Jesus",
      result: "Mais de 1 milhão de reais faturados", 
      video: "DTbZsOHo05g"
    },
    {
      name: "Raphael Romie",
      result: "Mais de 8 dígitos anuais",
      video: "eUpTfcd_OAU"
    }
  ];

  const metodologia = [
    {
      fase: "Fase 1",
      titulo: "O seu ponto de partida",
      descricao: "Aqui você vai entender como todo o máquina milionária funciona e vai receber o mapa de tudo que vai criar em minutos com ajuda do Furion. Além disso, vai ganhar todos os acessos e bônus secretos dentro da plataforma outsider.",
      icon: "🎯"
    },
    {
      fase: "Fase 2", 
      titulo: "Dominando a Inteligência Artificial",
      descricao: "Aqui, vamos te mostrar como você pode criar o seu próprio produto do zero. Aqui é onde te mostraremos todas as minúcias do 'motor' da máquina que funcionará para você 24h por dia.",
      icon: "🤖"
    },
    {
      fase: "Fase 3",
      titulo: "Criando sua Máquina Milionária", 
      descricao: "Aqui você vai colocar tudo que foi criado pelo Furion em prática. Todas as engrenagens da sua máquina milionária se juntarão em um sistema que atrai vendas em tempo recorde!",
      icon: "⚙️"
    },
    {
      fase: "Fase 4",
      titulo: "Hora de imprimir dinheiro",
      descricao: "Nessa fase você vai aprender a usar a ferramenta milionária: O Meta Ads. O combustível que levará pessoas ao site do produto, criando anúncios simples usando inteligência artificial.",
      icon: "💰"
    },
    {
      fase: "Fase 5", 
      titulo: "Escalando seu faturamento",
      descricao: "Essa fase dará o conhecimento de escala, que será usado principalmente quando o seu negócio estiver faturando 5 dígitos mensais.",
      icon: "📈"
    }
  ];

  const vantagens = [
    {
      icon: <Clock className="w-8 h-8" />,
      titulo: "Mais dinheiro, mais tempo, mais liberdade.",
      descricao: "Nos últimos 12 anos eu criei um jeito simples de construir um verdadeiro império online. Agora em 2025, isso ficou 100x mais fácil e rápido com o poder da Inteligência Artificial…"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      titulo: "Sua própria Máquina Milionária de Vendas",
      descricao: "Esse método vai te mostrar o caminho para que a Inteligência Artificial faça todo o trabalho pesado enquanto você assiste as notificações de venda caindo na tela do seu celular"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      titulo: "Um cérebro multimilionário a sua disposição",
      descricao: "Eu reuní 12 anos da minha experiência numa inteligência que você terá acesso e será capaz de transformar ideias em dinheiro, ou melhor, muito dinheiro!"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      titulo: "O poder da mais avançada I.A de marketing nas suas mãos!",
      descricao: "Crie o seu produto do 0 ou aumente as suas vendas em 2x, 5x, 10x mais! Zero esforço, sem mostrar seu rosto e sem precisar ter conhecimento pra isso."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Máquina Milionária</h1>
              <p className="text-xs text-orange-400">Transforme seu computador em uma máquina de dinheiro</p>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#vantagens" className="text-gray-300 hover:text-white transition-colors">Vantagens</a>
            <a href="#metodo" className="text-gray-300 hover:text-white transition-colors">Método</a>
            <a href="#garantia" className="text-gray-300 hover:text-white transition-colors">Garantia</a>
            <a href="#duvidas" className="text-gray-300 hover:text-white transition-colors">Dúvidas</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Transforme seu computador em uma
              <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Máquina Milionária
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Mesmo que você esteja começando do <strong>absoluto zero</strong> ou que já tenha feito de tudo na internet!
            </p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <div className="text-orange-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <div className="text-orange-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <div className="text-orange-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>
          </motion.div>
          
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-4 border-gray-800">
              {!videoPlaying ? (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-black font-medium text-sm">
                    🔊 ATIVAR SOM
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={() => setVideoPlaying(true)}
                    className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-4 border-white/50"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </Button>
                  
                  <div className="absolute bottom-4 right-4 text-white text-sm">
                    AGUARDANDO LIVE STREAM
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <p className="text-white">Video player seria integrado aqui</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Students Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center space-x-4"
          >
            <Users className="w-6 h-6 text-orange-400" />
            <span className="text-white font-bold text-lg">+ de 19.165 alunos desde 2021</span>
          </motion.div>
          
          {/* Price and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Por apenas</p>
              <div className="text-4xl font-bold text-white mb-2">
                12X de <span className="text-orange-400">R$309,96</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold"
            >
              QUERO TER UMA MÁQUINA MILIONÁRIA
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Vantagens Section */}
      <section id="vantagens" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="bg-orange-500/20 text-orange-300 mb-4 text-lg px-6 py-2">Vantagens</Badge>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Faça vendas em <span className="text-orange-400">tempo recorde</span><br />
            e viva como um verdadeiro milionário!
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {vantagens.map((vantagem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start space-x-6"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                {vantagem.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{vantagem.titulo}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{vantagem.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Novidade Furion */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="bg-red-500/20 text-red-300 mb-4 text-lg px-6 py-2">
            A MAIOR NOVIDADE DO MERCADO NOS ÚLTIMOS ANOS!
          </Badge>
          
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl p-12 mb-8">
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-orange-500 text-white text-xl px-8 py-3">
                NOVIDADE: FURION.AI ✓
              </Badge>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              A inteligência forjada para<br />
              <span className="text-orange-400">transformar ideias em dinheiro!</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-6xl mx-auto leading-relaxed">
              Ambiciosamente eu e a minha equipe reunimos todo o conhecimento que acumulamos em 12 anos e criamos uma inteligência capaz de ser o seu maior e talvez ÚNICO aliado para vender milhões! Uma máquina com poderes de uma equipe de marketing completa, seja para um simples iniciante, um empreendedor de loja física ou até mesmo um dono de um império das vendas…
            </p>
          </div>
        </motion.div>
      </section>

      {/* Depoimentos */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            O que os alunos têm a dizer
          </h2>
          <p className="text-2xl text-orange-400 font-bold">
            Você será o próximo case de sucesso!
          </p>
          <p className="text-lg text-gray-300 mt-4">
            Se contra fatos não há argumentos, contra resultados também não. Veja abaixo o poder do que só o conhecimento certo é capaz de fazer.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-black/50 border-orange-500/30 h-full">
                <CardContent className="p-8">
                  <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
                    <Button className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{testimonial.name}</h3>
                  <p className="text-green-400 font-bold text-lg">{testimonial.result}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Metodologia */}
      <section id="metodo" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="bg-orange-500/20 text-orange-300 mb-4 text-lg px-6 py-2">Método</Badge>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Conheça as <span className="text-orange-400">5 etapas</span> do<br />
            Método Máquina Milionária
          </h2>
        </motion.div>
        
        <div className="space-y-16">
          {metodologia.map((fase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`flex items-center gap-12 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex-1">
                <Card className="bg-black/50 border-orange-500/30">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{fase.icon}</div>
                      <div>
                        <Badge className="bg-orange-500/20 text-orange-300 mb-2">{fase.fase}</Badge>
                        <h3 className="text-2xl font-bold text-white">{fase.titulo}</h3>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">{fase.descricao}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                {index + 1}
              </div>
            </motion.div>
          ))}
          
          {/* Fase Extra */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
              <CardContent className="p-12">
                <div className="text-4xl mb-4">🎥</div>
                <Badge className="bg-purple-500/20 text-purple-300 mb-4">Fase Extra</Badge>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Acompanhamento AO VIVO por 3 meses
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                  Ao decidir fazer parte do projeto Máquina Milionário agora, você garante acesso exclusivo a 6 lives de acompanhamento comigo.
                  Nas lives fechadas, vou abrir minha tela e te mostrar: onde clica, o que digita e como montar sua máquina de vendas com o FURION do zero…
                  Mesmo que você ainda ache que "funil" é coisa de cozinha.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Oferta Final */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl p-12 text-center"
        >
          <Badge className="bg-red-500 text-white mb-6 text-lg px-6 py-2">
            NOVIDADES
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
            Aqui está TUDO o que você terá acesso:
          </h2>
          
          <p className="text-xl text-gray-300 mb-12">
            Garanta a sua vaga no Método Máquina Milionária e tenha acesso a um combo completo contendo…
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">1. O MÉTODO:</h3>
              <h4 className="text-lg font-semibold text-orange-400 mb-2">
                Acesso Completo ao Método Máquina Milionária
              </h4>
              <p className="text-gray-400">(Valor: R$2997)</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-2">2. A INTELIGÊNCIA FURION:</h3>
              <h4 className="text-lg font-semibold text-orange-400 mb-2">
                Acesso à Inteligência Artificial Furion.ai por 6 meses
              </h4>
              <p className="text-gray-400">(Valor: R$1297)</p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold text-white mb-2">3. MENTORIA:</h3>
              <h4 className="text-lg font-semibold text-orange-400 mb-2">
                Mentorias de Acompanhamento
              </h4>
              <p className="text-gray-400">(Valor: R$2497)</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Por apenas</p>
              <div className="text-5xl font-bold text-white mb-4">
                12X de <span className="text-orange-400">R$309,96</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold"
            >
              QUERO TER UMA MÁQUINA MILIONÁRIA
            </Button>
            
            <p className="text-gray-400">
              🔒 Compra 100% segura e protegida
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DollarSign className="w-8 h-8 text-orange-400" />
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