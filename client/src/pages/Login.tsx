import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular login API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel da IA Board...",
      });
      
      // Redirect to main app after successful login
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">IA Board by Filippe</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-400">Acesse sua conta da IA Board Milionária</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-white">Fazer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                  <span className="text-sm text-gray-300">Lembrar de mim</span>
                </label>
                <Link href="/forgot-password">
                  <span className="text-sm text-orange-400 hover:text-orange-300 cursor-pointer">
                    Esqueci minha senha
                  </span>
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Ainda não tem uma conta?{' '}
                <Link href="/register">
                  <span className="text-orange-400 hover:text-orange-300 cursor-pointer font-semibold">
                    Cadastre-se aqui
                  </span>
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400 mb-4">Ou continue com</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                  🔐 Entrar com Google
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                  📘 Entrar com Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}