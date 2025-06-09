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
          description: "Bem-vindo de volta ao IA Board V2",
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
      <DialogContent className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-0 max-w-none">
        <div className="glass-effect rounded-3xl max-w-md w-full p-8 animate-slide-up">
          <DialogHeader className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold text-white mb-2">Entrar na Sua Conta</DialogTitle>
            <p className="text-gray-300">Acesse suas ferramentas de IA</p>
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
                  className="pl-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500"
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
                  className="pl-12 pr-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500"
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

            {loginError && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{loginError.message}</p>
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 h-auto rounded-xl transition-all duration-300"
            >
              {isLoggingIn ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Não tem uma conta?{" "}
              <button 
                onClick={onSwitchToRegister}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Criar conta grátis
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}