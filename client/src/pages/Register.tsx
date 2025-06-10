import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, User, Brain, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan: 'starter'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '47',
      description: 'Perfeito para começar',
      features: ['10 projetos/mês', 'Copy básicas', 'Suporte email'],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '97',
      description: 'Para profissionais',
      features: ['50 projetos/mês', 'Todos recursos', 'Suporte prioritário'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '197',
      description: 'Para empresas',
      features: ['Projetos ilimitados', 'IA personalizada', 'Suporte dedicado'],
      popular: false
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro na confirmação",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          plan: formData.plan
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para a plataforma..."
        });
        
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);
      } else {
        const error = await response.json();
        toast({
          title: "Erro no cadastro",
          description: error.message || "Erro ao criar conta",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Tente novamente em alguns momentos",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 pt-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">AI Marketing Pro</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Comece sua jornada</h1>
          <p className="text-gray-400">Crie sua conta e transforme seu marketing digital</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div>
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-center text-white">Criar Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-300">Nome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="bg-gray-800/50 border-gray-600 text-white pl-10 focus:border-blue-500"
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-300">Sobrenome</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                        placeholder="Seu sobrenome"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white pl-10 focus:border-blue-500"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white pl-10 pr-10 focus:border-blue-500"
                        placeholder="Mínimo 8 caracteres"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white pl-10 pr-10 focus:border-blue-500"
                        placeholder="Confirme sua senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded border-gray-600 bg-gray-800"
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-400">
                      Aceito os{' '}
                      <Link href="/terms" className="text-blue-400 hover:underline">
                        Termos de Serviço
                      </Link>{' '}
                      e{' '}
                      <Link href="/privacy" className="text-blue-400 hover:underline">
                        Política de Privacidade
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
                  >
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Já tem uma conta?{' '}
                    <Link href="/login">
                      <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                        Faça login
                      </Button>
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans Selection */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Escolha seu plano</h2>
              <p className="text-gray-400">Comece com 7 dias grátis em qualquer plano</p>
            </div>

            <div className="space-y-4">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => handleInputChange('plan', plan.id)}
                  className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all ${
                    formData.plan === plan.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Mais Popular
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.plan === plan.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-600'
                          }`}
                        >
                          {formData.plan === plan.id && (
                            <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      </div>
                      
                      <p className="text-gray-400 mb-3">{plan.description}</p>
                      
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-white">R$ {plan.price}</div>
                      <div className="text-gray-400 text-sm">/mês</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">7 dias grátis</span>
              </div>
              <p className="text-sm text-gray-300">
                Teste todos os recursos sem compromisso. Cancele a qualquer momento durante o período de teste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}