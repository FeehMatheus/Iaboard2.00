import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Rocket, 
  Target, 
  Users, 
  Zap,
  Crown,
  Star,
  TrendingUp,
  Shield,
  Globe,
  Play,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Eye,
  Video,
  Image,
  FileText,
  BarChart3,
  Settings,
  Wand2,
  Zap as Lightning
} from 'lucide-react';

export default function SupremaLandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "IA Espiã Suprema",
      description: "Analisa concorrentes reais, extrai estratégias vencedoras e gera templates otimizados automaticamente.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "IA Vídeo Mestre",
      description: "Cria vídeos de vendas completos com roteiro, cenas e edição profissional usando múltiplas IAs.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "IA Tráfego Ultra",
      description: "Gera campanhas para Meta Ads e Google Ads com segmentações precisas e criativos otimizados.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "IA Produto Rápido",
      description: "Constrói produtos digitais e físicos completos baseado no seu nicho e público-alvo.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "IA Total PRO+",
      description: "Combina GPT-4o, Claude Sonnet 4.0 e Gemini Ultra para resultados superiores.",
      color: "from-yellow-500 to-amber-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "IA Aprendizado Contínuo",
      description: "Aprende com cada projeto e melhora automaticamente as próximas criações.",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const aiModules = [
    { name: "IA Branding", description: "Nome, logo e identidade visual", icon: <Sparkles className="w-5 h-5" /> },
    { name: "IA Persuasão", description: "Gatilhos mentais por nicho", icon: <Brain className="w-5 h-5" /> },
    { name: "IA Copywriting", description: "Textos com dados de mercado", icon: <FileText className="w-5 h-5" /> },
    { name: "IA Landing Page", description: "Design gerado automaticamente", icon: <Globe className="w-5 h-5" /> },
    { name: "IA Imagens", description: "Visuais e gráficos únicos", icon: <Image className="w-5 h-5" /> },
    { name: "IA Analytics", description: "Análise e otimização", icon: <BarChart3 className="w-5 h-5" /> }
  ];

  const stats = [
    { number: "50+", label: "IAs Integradas", icon: <Cpu className="w-6 h-6" /> },
    { number: "98%", label: "Taxa de Sucesso", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "24/7", label: "Funcionamento", icon: <Lightning className="w-6 h-6" /> },
    { number: "1000+", label: "Projetos Criados", icon: <Rocket className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <motion.header 
        className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl blur-lg opacity-30" />
                <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  IA BOARD SUPREMA™
                </h1>
                <p className="text-xs text-gray-400">by Filippe - Versão Definitiva</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400 text-green-400">
                <Crown className="w-3 h-3 mr-1" />
                SUPREMA
              </Badge>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
                onClick={() => window.location.href = '/canvas'}
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ y, opacity }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </motion.div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-400 text-purple-400 px-4 py-2">
              <Rocket className="w-4 h-4 mr-2" />
              Revolução em Inteligência Artificial
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              IA BOARD
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              SUPREMA™
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              A única plataforma que combina <span className="text-cyan-400 font-semibold">50+ IAs avançadas</span> para 
              criar funis completos de vendas, produtos digitais e campanhas de tráfego - 
              <span className="text-purple-400 font-semibold"> tudo automaticamente</span>.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-8 py-4 text-lg shadow-2xl shadow-cyan-500/25"
                onClick={() => window.location.href = '/canvas'}
              >
                <Play className="w-6 h-6 mr-2" />
                Começar Produto Inteligente
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                <Eye className="w-6 h-6 mr-2" />
                Ver Demo em Ação
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-2 text-cyan-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              IAs Supremas Integradas
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cada módulo IA é uma revolução tecnológica que automatiza processos complexos 
              e entrega resultados profissionais em minutos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <Card className="h-full bg-gradient-to-br from-slate-900/50 to-purple-900/30 border border-white/10 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Modules Grid */}
          <motion.div
            className="bg-gradient-to-r from-slate-900/50 to-purple-900/30 rounded-2xl p-8 border border-white/10 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-6 text-white">
              Módulos IA Especializados
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {aiModules.map((module, index) => (
                <motion.div
                  key={module.name}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-cyan-400">{module.icon}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{module.name}</div>
                    <div className="text-xs text-gray-400">{module.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Centro de Comando */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Centro de Comando Inteligente
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Controle total sobre seus projetos com visualização em tempo real, 
              reorganização por arraste e otimização automática.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {[
                  { icon: <Settings className="w-6 h-6" />, title: "Visualização Completa", desc: "Veja todo o fluxo do funil em tempo real" },
                  { icon: <Zap className="w-6 h-6" />, title: "Reorganização Drag & Drop", desc: "Mova blocos e reconecte fluxos facilmente" },
                  { icon: <Brain className="w-6 h-6" />, title: "Modo Aprendizado", desc: "IA explica cada decisão e processo" },
                  { icon: <Crown className="w-6 h-6" />, title: "Otimização Suprema", desc: "Botão mágico que otimiza tudo automaticamente" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-cyan-400 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 border border-cyan-400/30">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Interface Suprema</h3>
                  <p className="text-gray-400 text-sm">Controle total em suas mãos</p>
                </div>
                
                {/* Mock interface preview */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-3 border border-cyan-400/30"
                      animate={{ 
                        scale: [1, 1.02, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full" />
                          <span className="text-white text-sm">Módulo IA {i}</span>
                        </div>
                        <div className="text-cyan-400 text-xs">ATIVO</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Comece Sua Revolução Agora
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se à nova era da criação automatizada. 
              Sua primeira criação suprema está a um clique de distância.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-12 py-6 text-xl shadow-2xl shadow-green-500/25"
                onClick={() => window.location.href = '/canvas?mode=suprema'}
              >
                <Rocket className="w-6 h-6 mr-3" />
                Iniciar IA Board Suprema
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Sem instalação</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Uso imediato</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>IAs reais</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 IA Board Suprema™ by Filippe. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Powered by GPT-4o, Claude Sonnet 4.0, Gemini Ultra e mais de 50 IAs avançadas.
          </p>
        </div>
      </footer>
    </div>
  );
}