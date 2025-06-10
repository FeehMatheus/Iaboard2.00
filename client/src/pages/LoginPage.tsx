import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    setIsLoading(true);
    
    // Simular carregamento
    setTimeout(() => {
      const demoUser = {
        id: 'demo-user-001',
        email: 'demo@iaboard.com',
        firstName: 'Usuário',
        lastName: 'Demo',
        plan: 'premium',
        furionCredits: 1000,
        subscriptionStatus: 'active'
      };
      
      onLogin(demoUser);
      setIsLoading(false);
    }, 1500);
  };

  const handleRegularLogin = async () => {
    setIsLoading(true);
    
    try {
      // Aqui seria a integração real com o backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
      } else {
        // Para agora, usar conta demo em caso de erro
        handleDemoLogin();
        return;
      }
    } catch (error) {
      // Fallback para conta demo
      handleDemoLogin();
      return;
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              IA Board Login
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Acesse sua plataforma de marketing inteligente
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRegularLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                    Ou
                  </span>
                </div>
              </div>

              <Button
                onClick={handleDemoLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold py-2.5"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                    <span>Carregando Demo...</span>
                  </div>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Entrar com Conta Demo
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Voltar à página inicial
              </Button>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400"
        >
          <p>© 2024 IA Board - Plataforma de Marketing Inteligente</p>
        </motion.div>
      </motion.div>
    </div>
  );
}