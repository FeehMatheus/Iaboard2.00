import { useState } from "react";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
          description: "Bem-vindo ao IA Board V2. Comece a criar seus funis agora!",
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
      <DialogContent className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-0 max-w-none">
        <div className="glass-effect rounded-3xl max-w-md w-full p-8 animate-slide-up">
          <DialogHeader className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold text-white mb-2">Criar Conta Grátis</DialogTitle>
            <p className="text-gray-300">Comece a criar funis inteligentes hoje</p>
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
                  className="glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500"
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
                  className="glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500"
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
                  className="pl-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500"
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
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="pl-12 pr-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-indigo-500"
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

            {registerError && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{registerError.message}</p>
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={isRegistering}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 h-auto rounded-xl transition-all duration-300"
            >
              {isRegistering ? "Criando conta..." : "Criar Conta Grátis"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Já tem uma conta?{" "}
              <button 
                onClick={onSwitchToLogin}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}