import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/auth/register', {
        method: 'POST',
        body: data
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à Máquina Milionária AI. Redirecionando para o dashboard...",
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    });
  };

  const handleDemoAccess = () => {
    const demoMutation = useMutation({
      mutationFn: async () => {
        return apiRequest('/api/auth/demo-login', {
          method: 'POST'
        });
      },
      onSuccess: () => {
        toast({
          title: "Acesso demo ativado!",
          description: "Explore todas as funcionalidades gratuitamente.",
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    });
    
    demoMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="text-white space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              Transforme seu Negócio com 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> IA Suprema</span>
            </h1>
            <p className="text-xl text-blue-100">
              Junte-se a milhares de empreendedores que já revolucionaram seus resultados
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-400/20 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Geração de Conteúdo Instantânea</h3>
                <p className="text-blue-100">
                  Crie copies, VSLs, e-mails e campanhas de tráfego em segundos com nossa IA avançada
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-400/20 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Funis de Alta Conversão</h3>
                <p className="text-blue-100">
                  Construa funis completos que convertem até 25% mais que a média do mercado
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-400/20 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Canvas Infinito</h3>
                <p className="text-blue-100">
                  Organize todos seus projetos em um espaço visual intuitivo e colaborativo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg border border-white/20">
            <p className="text-sm text-blue-200 mb-2">💎 Garantia de 30 dias</p>
            <p className="text-white">
              Se não aumentar seus resultados em 30 dias, devolvemos 100% do seu investimento
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Criar Conta Gratuita</CardTitle>
            <CardDescription className="text-blue-200">
              Comece sua transformação digital agora mesmo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">Nome</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white">Sobrenome</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                    placeholder="Sobrenome"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Criando conta...' : 'Criar Conta Gratuita'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-blue-200">Ou</span>
              </div>
            </div>

            <Button 
              onClick={handleDemoAccess}
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Acessar Versão Demo Gratuita
            </Button>

            <p className="text-xs text-blue-200 text-center">
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="#" className="text-yellow-400 hover:underline">Termos de Uso</a>{' '}
              e{' '}
              <a href="#" className="text-yellow-400 hover:underline">Política de Privacidade</a>
            </p>

            <div className="text-center">
              <p className="text-blue-200">
                Já tem uma conta?{' '}
                <a href="/login" className="text-yellow-400 hover:underline font-medium">
                  Faça login
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}