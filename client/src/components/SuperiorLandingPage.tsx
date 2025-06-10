import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Zap, 
  Brain, 
  Video, 
  Target, 
  Crown, 
  Play,
  CheckCircle2,
  TrendingUp,
  Users,
  Sparkles,
  Rocket,
  Shield,
  Globe,
  DollarSign,
  BarChart3,
  Eye,
  Settings
} from 'lucide-react';

export default function SuperiorLandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "Marina Silva",
      result: "R$ 2.3 milhões faturados",
      description: "Em 6 meses usando o IA Board Suprema",
      avatar: "MS"
    },
    {
      name: "Carlos Mendes", 
      result: "R$ 450.000 mensais",
      description: "Renda recorrente com automação completa",
      avatar: "CM"
    },
    {
      name: "Ana Costa",
      result: "R$ 1.8 milhões",
      description: "Primeiro ano com nossa metodologia",
      avatar: "AC"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "IA Suprema Multi-Modal",
      description: "GPT-4o + Claude Sonnet 4 trabalhando simultaneamente para resultados 300% superiores"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video AI Profissional",
      description: "Cria roteiros completos com framework PASTOR e adaptações para todas as plataformas"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Traffic AI Ultra",
      description: "Campanhas otimizadas para Meta, Google, TikTok e YouTube com ROI predefinido"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Workflow Automático",
      description: "Sistema completo que executa todos os módulos sequencialmente sem intervenção"
    }
  ];

  const methodology = [
    {
      phase: "Fase 1",
      title: "Análise Suprema de Mercado",
      description: "IA Espiã analisa concorrentes e identifica oportunidades milionárias em minutos",
      icon: <Eye className="w-6 h-6" />
    },
    {
      phase: "Fase 2", 
      title: "Branding Master AI",
      description: "Cria identidade visual completa e posicionamento estratégico automaticamente",
      icon: <Crown className="w-6 h-6" />
    },
    {
      phase: "Fase 3",
      title: "Copywriting Persuasivo",
      description: "Headlines, páginas de venda e email marketing com poder de conversão comprovado",
      icon: <Zap className="w-6 h-6" />
    },
    {
      phase: "Fase 4",
      title: "Landing Pages Supremas",
      description: "Páginas otimizadas com taxa de conversão superior a 15%",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      phase: "Fase 5",
      title: "Export & Deploy Total",
      description: "Sistema completo exportado em ZIP profissional pronto para implementar",
      icon: <Settings className="w-6 h-6" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="glass-effect rounded-2xl p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IA Board Suprema</h1>
                <p className="text-xs text-gray-300">Superior ao Máquina Milionária</p>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <a href="#vantagens" className="text-gray-300 hover:text-white transition-colors">Vantagens</a>
              <a href="#metodo" className="text-gray-300 hover:text-white transition-colors">Metodologia</a>
              <a href="#garantia" className="text-gray-300 hover:text-white transition-colors">Garantia</a>
              <a href="#depoimentos" className="text-gray-300 hover:text-white transition-colors">Resultados</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2">
              🔥 SUPERIOR AO MÁQUINA MILIONÁRIA
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Transforme seu computador em uma
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent block">
                Máquina Bilionária
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Mesmo que você esteja começando do <strong>absoluto zero</strong> ou já tenha investido milhares em outros cursos. 
              Nossa IA é <strong>300% mais avançada</strong> que qualquer concorrente.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-white">GPT-4o + Claude Sonnet 4 trabalhando simultaneamente</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-white">Video AI com framework PASTOR profissional</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-white">Traffic AI para todas as plataformas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="text-white">Export completo em ZIP profissional</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                QUERO O IA BOARD SUPREMA
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">89.473</div>
                <div className="text-sm text-gray-400">Alunos transformados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">R$ 2.8BI</div>
                <div className="text-sm text-gray-400">Faturamento gerado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-sm text-gray-400">Primeiros resultados</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-effect rounded-3xl p-8 backdrop-blur-xl">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-600/20"></div>
                <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 z-10">
                  <Play className="w-8 h-8 text-white" />
                </Button>
                
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  🔴 AO VIVO
                </div>
                
                <div className="absolute bottom-4 right-4 text-white text-sm">
                  +2.347 assistindo agora
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Demonstração ao Vivo: Criando R$ 50.000 em 1 Hora
                </h3>
                <p className="text-gray-300">
                  Assista como nossa IA cria um negócio completo do zero, 
                  incluindo produto, landing page, campanhas e sistema de vendas automatizado.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="vantagens" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="bg-purple-500/20 text-purple-300 mb-4">SUPERIORIDADE COMPROVADA</Badge>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Por que somos <span className="text-orange-400">300% superiores</span><br />
            ao Máquina Milionária?
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-effect border-white/10 h-full hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Resultados que <span className="text-green-400">superam</span><br />
            qualquer concorrente
          </h2>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-effect border-white/10 h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">{testimonial.result}</h3>
                  <p className="text-white font-semibold mb-2">{testimonial.name}</p>
                  <p className="text-gray-300 text-sm">{testimonial.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section id="metodo" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Metodologia <span className="text-purple-400">Suprema</span><br />
            em 5 Etapas Revolucionárias
          </h2>
        </motion.div>
        
        <div className="space-y-8">
          {methodology.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex-1">
                <Card className="glass-effect border-white/10">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                        {phase.icon}
                      </div>
                      <div>
                        <Badge className="bg-orange-500/20 text-orange-300 mb-2">{phase.phase}</Badge>
                        <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">{phase.description}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-effect rounded-3xl p-12 text-center"
        >
          <Badge className="bg-red-500/20 text-red-300 mb-6 text-lg px-6 py-2">
            ⚡ OFERTA LIMITADA - ÚLTIMAS 24 HORAS
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            De R$ 9.997 por apenas
          </h2>
          
          <div className="mb-8">
            <span className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              12x R$ 197
            </span>
            <p className="text-xl text-gray-300 mt-2">ou R$ 1.997 à vista</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="text-white text-lg">IA Board Suprema Completo (Valor: R$ 4.997)</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="text-white text-lg">6 Meses de IA Premium (Valor: R$ 2.997)</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="text-white text-lg">Mentoria VIP 1:1 por 90 dias (Valor: R$ 3.997)</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="text-white text-lg">Garantia de Resultados 365 dias</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold"
          >
            <Crown className="w-6 h-6 mr-3" />
            GARANTIR MINHA VAGA AGORA
          </Button>
          
          <p className="text-gray-400 mt-4">
            🔒 Pagamento 100% seguro • Garantia incondicional de 365 dias
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">IA Board Suprema</span>
          </div>
          <p className="text-gray-400">
            © 2025 IA Board Suprema. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
          </p>
        </div>
      </footer>
    </div>
  );
}