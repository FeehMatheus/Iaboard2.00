import { useState } from "react";
import { CreditCard, Lock, Crown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    period: string;
    features: string[];
  } | null;
}

export default function PaymentModal({ isOpen, onClose, selectedPlan }: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!selectedPlan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Pagamento processado com sucesso!",
        description: `Bem-vindo ao plano ${selectedPlan.name}! Redirecionando...`,
      });
      setIsProcessing(false);
      onClose();
      // Redirect to dashboard with upgraded plan
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
    }
    return numbers;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 border-0 max-w-none">
        <div className="relative w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl transform scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl"></div>
          
          <div className="relative glass-effect rounded-3xl w-full p-8 border border-white/20 shadow-2xl">
            <DialogHeader className="text-center mb-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-2xl shadow-2xl transform rotate-3 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-blue-700 to-purple-800 rounded-2xl shadow-xl flex items-center justify-center">
                  <CreditCard className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-blue-100 bg-clip-text text-transparent mb-3">
                Finalizar Pagamento
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-lg">
                Assine o plano {selectedPlan.name} e desbloqueie todo o potencial
              </DialogDescription>
            </DialogHeader>

            {/* Plan Summary */}
            <Card className="glass-effect border-white/20 mb-6">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <CardTitle className="text-white text-xl">{selectedPlan.name}</CardTitle>
                </div>
                <div className="text-3xl font-bold text-white">
                  {selectedPlan.price}<span className="text-lg text-gray-400">{selectedPlan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPlan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName" className="text-white font-semibold">Nome do Portador</Label>
                <Input
                  id="cardholderName"
                  type="text"
                  value={paymentData.cardholderName}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                  placeholder="Nome completo como no cartão"
                  className="glass-dark border-white/20 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-white font-semibold">Número do Cartão</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="cardNumber"
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="pl-12 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                    maxLength={19}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-white font-semibold">Validade</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                    placeholder="MM/AA"
                    className="glass-dark border-white/20 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                    maxLength={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-white font-semibold">CVV</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="cvv"
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      className="pl-10 glass-dark border-white/20 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-emerald-300 text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Pagamento 100% seguro com criptografia SSL</span>
                </div>
              </div>
              
              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold py-4 h-auto rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processando pagamento...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Pagar {selectedPlan.price} Agora</span>
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Ao continuar, você concorda com nossos{" "}
                <span className="text-emerald-400 underline cursor-pointer">Termos de Serviço</span>
                {" "}e{" "}
                <span className="text-emerald-400 underline cursor-pointer">Política de Privacidade</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}