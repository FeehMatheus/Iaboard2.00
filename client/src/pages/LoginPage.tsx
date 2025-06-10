import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, CheckCircle, Star, Globe, Zap, ArrowRight, Lock, Mail, User, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'premium'>('pro');
  
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return await response.json();
    },
    onSuccess: (data) => {
      onLogin(data.user);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo à Máquina Milionária",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; plan: string }) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return await response.json();
    },
    onSuccess: (data) => {
      onLogin(data.user);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à Máquina Milionária",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive",
      });
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas devem ser iguais",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate({ name, email, password, plan: selectedPlan });
  };

  const plans = [
    {
      id: 'basic' as const,
      name: 'Básico',
      price: 'R$ 97',
      installments: '3x R$ 32,33',
      features: [
        'Acesso ao Furion.AI básico',
        'Módulo 1: Fundamentos',
        'Suporte por email',
        'Materiais em PDF'
      ],
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'pro' as const,
      name: 'Profissional',
      price: 'R$ 309,96',
      installments: '12x R$ 25,83',
      features: [
        'Acesso completo ao Furion.AI',
        'Todos os 5 módulos',
        'Lives de acompanhamento',
        'Suporte prioritário',
        'Furion.AI Suprema',
        'Sistema de quadros infinitos'
      ],
      color: 'from-orange-500 to-red-600',
      popular: true
    },
    {
      id: 'premium' as const,
      name: 'VIP Multimilionário',
      price: 'R$ 597',
      installments: '12x R$ 49,75',
      features: [
        'Tudo do plano Profissional',
        'Mentoria 1:1 exclusiva',
        'Grupo VIP no Telegram',
        'Bônus: 8 módulos extras',
        'Certificado de conclusão',
        'Garantia estendida 90 dias'
      ],
      color: 'from-purple-600 to-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="p-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold">Máquina Milionária</span>
          </div>
          <Button 
            onClick={onBack}
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            ← Voltar
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transforme sua vida com a
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                {" "}Máquina Milionária
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Junte-se a mais de 50.000 alunos que já transformaram suas vidas financeiras
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulário de Login/Cadastro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center">
                  <Lock className="w-6 h-6 mr-2 text-orange-500" />
                  Acesso à Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger value="login" className="text-white">Fazer Login</TabsTrigger>
                    <TabsTrigger value="register" className="text-white">Criar Conta</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <div>
                      <Label className="text-white">Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Senha</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <Button
                      onClick={handleLogin}
                      disabled={loginMutation.isPending}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      {loginMutation.isPending ? 'Entrando...' : 'Entrar na Plataforma'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="register" className="space-y-4">
                    <div>
                      <Label className="text-white">Nome Completo</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Senha</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Confirmar Senha</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <Button
                      onClick={handleRegister}
                      disabled={registerMutation.isPending}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      {registerMutation.isPending ? 'Criando conta...' : 'Garantir Minha Vaga'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Planos de Assinatura */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Escolha seu Plano</h3>
            <div className="space-y-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-orange-500 bg-gradient-to-br from-orange-500/10 to-red-600/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        MAIS POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <p className="text-gray-400">{plan.installments}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{plan.price}</div>
                      <div className="text-sm text-gray-400">à vista</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      className={`w-full bg-gradient-to-r ${plan.color} text-white`}
                      disabled={selectedPlan !== plan.id}
                    >
                      {selectedPlan === plan.id ? 'Plano Selecionado' : 'Selecionar Plano'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Garantias e Benefícios */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid md:grid-cols-4 gap-8 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">Garantia 30 Dias</h4>
            <p className="text-gray-400 text-sm">Satisfação garantida ou seu dinheiro de volta</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">IA Avançada</h4>
            <p className="text-gray-400 text-sm">Tecnologia de ponta para seus negócios</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">Resultados Comprovados</h4>
            <p className="text-gray-400 text-sm">Mais de 50.000 alunos transformados</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">Acesso Vitalício</h4>
            <p className="text-gray-400 text-sm">Conteúdo disponível para sempre</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}