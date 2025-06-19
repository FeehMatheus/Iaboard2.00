import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro na confirmação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Termos obrigatórios",
        description: "Você deve aceitar os termos de uso.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à IA Board! Redirecionando...",
      });
      
      // Redirect to main app
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          
          <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
          <p className="text-gray-400">Junte-se a mais de 50.000 empreendedores</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-white">Cadastro Gratuito</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    placeholder="Crie uma senha forte"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 mt-1" 
                  />
                  <span className="text-sm text-gray-300 leading-relaxed">
                    Eu aceito os{' '}
                    <Link href="/terms">
                      <span className="text-orange-400 hover:text-orange-300">termos de uso</span>
                    </Link>
                    {' '}e{' '}
                    <Link href="/privacy">
                      <span className="text-orange-400 hover:text-orange-300">política de privacidade</span>
                    </Link>
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600 mt-1" />
                  <span className="text-sm text-gray-300 leading-relaxed">
                    Quero receber emails com dicas exclusivas e novidades da IA Board
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar conta gratuita"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link href="/login">
                  <span className="text-orange-400 hover:text-orange-300 cursor-pointer font-semibold">
                    Faça login
                  </span>
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400 mb-4">Ou cadastre-se com</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                  🔐 Continuar com Google
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                  📘 Continuar com Facebook
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Garantias incluídas:</span>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Acesso imediato após cadastro</li>
                <li>• 30 dias de garantia total</li>
                <li>• Suporte premium incluído</li>
                <li>• Sem taxas escondidas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}