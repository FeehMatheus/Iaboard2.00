import { useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle, CreditCard, Shield, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const packages = [
    { item: "Método Máquina Milionária", description: "(acesso de 1 ano)", originalPrice: "R$ 2.997,00", included: true },
    { item: "FURION.AI", description: "(6 meses de acesso)", originalPrice: "R$ 1.297,00", included: true, free: true },
    { item: "6 Lives de Acompanhamento", description: "(gravadas)", originalPrice: "R$ 2.497,00", included: true, free: true },
    { item: "Comunidade Exclusiva", description: "(Circle)", originalPrice: "R$ 997,00", included: true, free: true },
    { item: "Treinamento IA de Vídeos", description: "(completo)", originalPrice: "R$ 997,00", included: true, free: true }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false);
      // Redirecionar para página de sucesso ou FURION.AI
      window.location.href = '/furion-ai';
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-white font-bold text-lg">Máquina Milionária</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Finalize sua Compra</h1>
            <p className="text-gray-400">Você está a um passo de transformar sua vida financeira</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário de Pagamento */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-orange-500" />
                    <span>Informações de Pagamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-orange-500">Dados Pessoais</h3>
                      
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-gray-800 border-gray-700"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">E-mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-gray-800 border-gray-700"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="bg-gray-800 border-gray-700"
                            placeholder="(11) 99999-9999"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="document">CPF</Label>
                        <Input
                          id="document"
                          value={formData.document}
                          onChange={(e) => handleInputChange('document', e.target.value)}
                          className="bg-gray-800 border-gray-700"
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    {/* Método de Pagamento */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-orange-500">Método de Pagamento</h3>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('credit')}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            paymentMethod === 'credit' 
                              ? 'border-orange-500 bg-orange-500/20 text-orange-500' 
                              : 'border-gray-700 bg-gray-800 text-gray-400'
                          }`}
                        >
                          Cartão
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('pix')}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            paymentMethod === 'pix' 
                              ? 'border-orange-500 bg-orange-500/20 text-orange-500' 
                              : 'border-gray-700 bg-gray-800 text-gray-400'
                          }`}
                        >
                          PIX
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('boleto')}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            paymentMethod === 'boleto' 
                              ? 'border-orange-500 bg-orange-500/20 text-orange-500' 
                              : 'border-gray-700 bg-gray-800 text-gray-400'
                          }`}
                        >
                          Boleto
                        </button>
                      </div>

                      {paymentMethod === 'credit' && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Número do Cartão</Label>
                            <Input
                              id="cardNumber"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                              className="bg-gray-800 border-gray-700"
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="cardName">Nome no Cartão</Label>
                            <Input
                              id="cardName"
                              value={formData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                              className="bg-gray-800 border-gray-700"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cardExpiry">Validade</Label>
                              <Input
                                id="cardExpiry"
                                value={formData.cardExpiry}
                                onChange={(e) => handleInputChange('cardExpiry', formatExpiry(e.target.value))}
                                className="bg-gray-800 border-gray-700"
                                placeholder="MM/AA"
                                maxLength={5}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardCvv">CVV</Label>
                              <Input
                                id="cardCvv"
                                value={formData.cardCvv}
                                onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                                className="bg-gray-800 border-gray-700"
                                placeholder="000"
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'pix' && (
                        <div className="text-center py-8">
                          <div className="w-32 h-32 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl">📱</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Após finalizar, você receberá o código PIX para pagamento
                          </p>
                        </div>
                      )}

                      {paymentMethod === 'boleto' && (
                        <div className="text-center py-8">
                          <div className="w-32 h-32 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <span className="text-4xl">🧾</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            O boleto será enviado por email e pode levar até 2 dias úteis para processar
                          </p>
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 h-12 text-lg font-bold"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="w-5 h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        `Finalizar Compra - ${paymentMethod === 'credit' ? '12x de R$ 309,96' : 'R$ 3.719,52'}`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Segurança */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="py-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Pagamento 100% seguro e criptografado</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Garantia de 7 dias - Satisfação total ou seu dinheiro de volta</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {packages.map((pkg, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">{pkg.item}</div>
                          <div className="text-sm text-gray-400">{pkg.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`${pkg.free ? 'line-through text-gray-500' : 'text-white font-medium'}`}>
                          {pkg.originalPrice}
                        </div>
                        {pkg.free && <div className="text-green-400 font-bold text-sm">GRÁTIS</div>}
                      </div>
                    </div>
                  ))}

                  <Separator className="bg-gray-700" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="line-through text-gray-500">R$ 8.785,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Desconto:</span>
                      <span className="text-green-400">-R$ 5.065,48</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-orange-500">R$ 3.719,52</span>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                      ou 12x de R$ 309,96 sem juros
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Garantias */}
              <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30">
                <CardContent className="py-6">
                  <h3 className="font-bold text-green-400 mb-4">🛡️ Suas Garantias</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>7 dias de garantia incondicional</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Acesso imediato após aprovação</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Suporte dedicado</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sem pegadinhas ou taxas ocultas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Cartões Aceitos */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="py-4">
                  <h4 className="font-medium mb-3">Formas de Pagamento Aceitas</h4>
                  <div className="flex items-center space-x-2">
                    <img src="https://maquinamilionaria.com/images/bandeiras.png" alt="Cartões aceitos" className="h-8" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Visa, Mastercard, Elo, PIX, Boleto, PayPal e mais
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}