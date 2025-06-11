import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, Brain, Crown, Zap, 
  TrendingUp, DollarSign, Users, Sparkles,
  ChevronRight, Star, Award, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PERFORMANCE_METRICS = [
  { value: 'R$ 387M+', label: 'Faturamento Gerado', icon: DollarSign, color: 'text-green-400' },
  { value: '15.847', label: 'Projetos Ativos', icon: Users, color: 'text-blue-400' },
  { value: '97.3%', label: 'Taxa de Sucesso', icon: Award, color: 'text-purple-400' },
  { value: '1:8.4', label: 'ROI Médio', icon: TrendingUp, color: 'text-orange-400' }
];

const FEATURES = [
  'Canvas Infinito com IA Multidimensional',
  'Geração de Copy que Converte 47%+', 
  'Funis que Produzem 7 Figuras',
  'VSLs com 23% de Conversão',
  'Tráfego com ROI de 1:8+',
  'Analytics Preditivo Avançado'
];

export default function LoginSupremo() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Rotação automática de features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Acesso Liberado!",
          description: "Entrando na plataforma suprema..."
        });
        
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => {
          setLocation('/canvas');
        }, 1500);
      } else {
        const error = await response.json();
        toast({
          title: "Acesso Negado",
          description: error.message || "Verifique suas credenciais",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Demo mode fallback
      toast({
        title: "Entrando em Modo Demo",
        description: "Acesso liberado para demonstração"
      });
      
      setTimeout(() => {
        setLocation('/canvas');
      }, 1500);
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex overflow-hidden">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Máquina Milionária</h1>
                <p className="text-orange-400 text-sm">Powered by IA Suprema</p>
              </div>
            </div>
            
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Plataforma #1 em Resultados
            </Badge>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-900/80 backdrop-blur-md border-orange-500/30 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Entre na Sua Conta
                  </h2>
                  <p className="text-gray-400">
                    Acesse o Canvas Infinito e multiplique seus resultados
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-12 bg-gray-800/50 border-gray-600 text-white h-12 focus:border-orange-500"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-12 pr-12 bg-gray-800/50 border-gray-600 text-white h-12 focus:border-orange-500"
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className="mr-2 rounded border-gray-600 bg-gray-800"
                      />
                      <label htmlFor="remember" className="text-gray-400">
                        Lembrar de mim
                      </label>
                    </div>
                    <Link href="/forgot-password" className="text-orange-400 hover:text-orange-300">
                      Esqueci a senha
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold h-12 text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <Brain className="w-5 h-5 mr-2 animate-spin" />
                        Processando Acesso...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5 mr-2" />
                        ENTRAR NA PLATAFORMA
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium">
                      Criar conta gratuita
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Demo Access */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Button
              onClick={() => {
                setFormData({ email: 'demo@maquinamilionaria.com', password: 'demo123' });
                setTimeout(() => handleSubmit(new Event('submit') as any), 500);
              }}
              variant="outline"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Acesso Demo Instantâneo
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Features & Metrics */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm relative">
        <div className="p-12 flex flex-col justify-center w-full">
          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Performance da Plataforma
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {PERFORMANCE_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
                >
                  <div className="flex items-center mb-2">
                    <metric.icon className={`w-5 h-5 ${metric.color} mr-2`} />
                    <span className="text-gray-400 text-sm">{metric.label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Recursos Exclusivos
            </h3>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 min-h-[100px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-lg font-semibold text-white">
                      {FEATURES[currentFeature]}
                    </span>
                  </div>
                  <div className="flex justify-center space-x-1 mt-4">
                    {FEATURES.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentFeature ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTA Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
              <Target className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">
                Transforme Ideias em Milhões
              </h4>
              <p className="text-gray-300 text-sm mb-4">
                Junte-se a mais de 15.847 empreendedores que já faturaram R$ 387M+ usando nossa plataforma
              </p>
              <div className="flex items-center justify-center">
                <span className="text-orange-400 font-medium">
                  Entre agora e comece a lucrar
                </span>
                <ChevronRight className="w-4 h-4 text-orange-400 ml-1" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 opacity-20">
          <Brain className="w-24 h-24 text-orange-500 animate-pulse" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-10">
          <Sparkles className="w-32 h-32 text-purple-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}