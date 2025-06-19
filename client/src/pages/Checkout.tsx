import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, CreditCard, Building, CheckCircle, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Checkout() {
  const [location] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check if boleto was selected from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'boleto') {
      setPaymentMethod('boleto');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (paymentMethod === 'credit') {
        toast({
          title: "Pagamento aprovado!",
          description: "Seu acesso à IA Board foi liberado. Redirecionando...",
        });
      } else {
        toast({
          title: "Boleto gerado com sucesso!",
          description: "Você receberá o boleto por email. Acesso liberado após confirmação do pagamento.",
        });
      }
      
      // Redirect to success page
      setTimeout(() => {
        window.location.href = '/success';
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Tente novamente ou entre em contato com o suporte.",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
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
          
          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Compra</h1>
          <p className="text-gray-400">Falta pouco para transformar sua vida financeira!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('credit')}
                    className={paymentMethod === 'credit' ? 'bg-orange-600' : 'border-gray-600 text-white hover:bg-gray-700'}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Cartão de Crédito
                  </Button>
                  <Button
                    variant={paymentMethod === 'boleto' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('boleto')}
                    className={paymentMethod === 'boleto' ? 'bg-orange-600' : 'border-gray-600 text-white hover:bg-gray-700'}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Boleto Bancário
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Nome completo</label>
                      <Input
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Telefone</label>
                      <Input
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">CPF</label>
                      <Input
                        placeholder="000.000.000-00"
                        value={formData.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>

                  {paymentMethod === 'credit' && (
                    <>
                      <div className="pt-4 border-t border-gray-600">
                        <h3 className="text-lg font-semibold text-white mb-4">Dados do Cartão</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-300">Número do cartão</label>
                            <Input
                              placeholder="0000 0000 0000 0000"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-300">Validade</label>
                              <Input
                                placeholder="MM/AA"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-300">CVV</label>
                              <Input
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-300">Nome no cartão</label>
                            <Input
                              placeholder="Nome como aparece no cartão"
                              value={formData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 py-4 text-lg font-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      paymentMethod === 'credit' ? "Processando pagamento..." : "Gerando boleto..."
                    ) : (
                      paymentMethod === 'credit' ? "🚀 FINALIZAR COMPRA" : "📄 GERAR BOLETO"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-orange-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">IA Board Milionária - ACESSO COMPLETO</h3>
                    <p className="text-sm text-gray-400">Método completo + IA + Bônus + Suporte</p>
                  </div>
                  <Badge className="bg-green-600">MELHOR OFERTA</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Valor original:</span>
                    <span className="line-through">R$ 5.997,00</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Desconto especial:</span>
                    <span className="text-green-400">-R$ 2.800,00</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total:</span>
                      <span>R$ 3.197,00</span>
                    </div>
                    <div className="text-center text-yellow-400 font-semibold">
                      ou 12x de R$ 309,96
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-300 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">Oferta por tempo limitado!</span>
                  </div>
                  <p className="text-xs text-yellow-200 mt-1">
                    Este preço especial expira em breve. Garante já sua vaga!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Suas Garantias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">30 dias de garantia total</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Acesso imediato após pagamento</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Suporte premium incluído</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Certificado SSL</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-300 text-sm mb-2">
                🔒 Seus dados estão protegidos
              </p>
              <p className="text-gray-400 text-xs">
                Utilizamos criptografia de nível bancário para proteger suas informações
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}