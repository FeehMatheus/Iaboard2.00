import { useState } from "react";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, loginError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: () => {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Erro no login",
          description: error.message || "Verifique suas credenciais",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 border-0 max-w-none">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl"></div>
          
          <div className="relative glass-effect rounded-3xl max-w-md w-full p-8 border border-white/20 shadow-2xl">
            <DialogHeader className="text-center mb-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 rounded-2xl shadow-2xl transform rotate-3 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 rounded-2xl shadow-xl flex items-center justify-center">
                  <LogIn className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-3">
                Bem-vindo de Volta
              </DialogTitle>
              <p className="text-gray-300 text-lg">Entre e continue criando funis inteligentes</p>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="pl-12 pr-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Demo Account Info */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-4">
                <p className="text-sm text-indigo-300 font-medium mb-2">🎯 Conta Demo Disponível:</p>
                <div className="text-xs text-gray-300 space-y-1">
                  <p><span className="text-indigo-400">Email:</span> demo@iaboard.com</p>
                  <p><span className="text-indigo-400">Senha:</span> demo123</p>
                </div>
              </div>

              {loginError && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{loginError.message}</p>
                </div>
              )}
              
              <Button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 h-auto rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isLoggingIn ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-5 h-5" />
                    <span>Entrar na Conta</span>
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Não tem uma conta?{" "}
                <button 
                  onClick={onSwitchToRegister}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline decoration-indigo-400/50 hover:decoration-indigo-300"
                >
                  Criar conta grátis
                </button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}