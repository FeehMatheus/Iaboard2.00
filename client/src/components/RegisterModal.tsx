import { useState } from "react";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isRegistering, registerError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData, {
      onSuccess: () => {
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao criar conta",
          description: error.message || "Tente novamente",
          variant: "destructive",
        });
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 border-0 max-w-none overflow-y-auto">
        <div className="relative w-full max-w-md mx-auto my-8">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 rounded-3xl blur-xl transform scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl"></div>
          
          <div className="relative glass-effect rounded-3xl w-full p-8 border border-white/20 shadow-2xl">
            <DialogHeader className="text-center mb-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 rounded-2xl shadow-2xl transform -rotate-3 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 rounded-2xl shadow-xl flex items-center justify-center">
                  <UserPlus className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-indigo-100 bg-clip-text text-transparent mb-3">
                Crie Sua Conta
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-lg">
                Junte-se a milhares de criadores de funis
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white font-semibold">Nome</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Seu nome"
                    className="glass-dark border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white font-semibold">Sobrenome</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Sobrenome"
                    className="glass-dark border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-semibold">Nome de usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="seuusuario"
                    className="pl-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
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
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="pl-12 pr-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    minLength={8}
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

              {/* Features Preview */}
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-purple-300 font-medium mb-2">✨ Incluído no plano gratuito:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• 3 funis por mês</li>
                  <li>• 50 gerações de IA</li>
                  <li>• Ferramentas básicas</li>
                  <li>• Suporte por email</li>
                </ul>
              </div>

              {registerError && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{registerError.message}</p>
                </div>
              )}
              
              <Button 
                type="submit"
                disabled={isRegistering}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 h-auto rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isRegistering ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Criar Conta Grátis</span>
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Já tem uma conta?{" "}
                <button 
                  onClick={onSwitchToLogin}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors underline decoration-purple-400/50 hover:decoration-purple-300"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}