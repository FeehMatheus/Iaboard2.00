import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle, Download, Play, Users, ArrowRight } from 'lucide-react';

export function Success() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Success Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">IA Board by Filippe</span>
          </div>
          
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Parabéns! Sua compra foi confirmada!
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Bem-vindo à IA Board Milionária! Seu acesso foi liberado e você já pode começar a transformar sua vida financeira.
          </p>
        </div>

        {/* Access Card */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500 border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Seu Acesso Está Pronto!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-green-400 mb-2">✅ Acesso Liberado</h3>
                <p className="text-gray-300 text-sm">
                  Você já pode acessar todos os módulos da IA Board e começar a criar seus primeiros conteúdos milionários.
                </p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-2">📧 Email de Confirmação</h3>
                <p className="text-gray-300 text-sm">
                  Verifique sua caixa de entrada. Enviamos todos os detalhes do seu acesso e materiais extras.
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">🎁 Bônus Especiais Incluídos</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Acesso ao grupo VIP no Telegram</li>
                <li>• 6 Lives exclusivas nos próximos 3 meses</li>
                <li>• Templates prontos de alta conversão</li>
                <li>• Suporte premium prioritário</li>
              </ul>
            </div>

            <div className="space-y-4">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 text-lg"
                >
                  🚀 ACESSAR IA BOARD AGORA
                </Button>
              </Link>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar App
                </Button>
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  Grupo VIP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Primeiros Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h4 className="font-semibold text-white">Acesse a Plataforma</h4>
                <p className="text-gray-300 text-sm">
                  Faça login na IA Board e explore todos os módulos disponíveis.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h4 className="font-semibold text-white">Assista ao Treinamento</h4>
                <p className="text-gray-300 text-sm">
                  Comece pelas aulas fundamentais para entender todo o método.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h4 className="font-semibold text-white">Crie Seu Primeiro Projeto</h4>
                <p className="text-gray-300 text-sm">
                  Use a IA para gerar seu primeiro conteúdo e começar a vender.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-redirect notification */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-blue-300">
            <ArrowRight className="w-5 h-5" />
            <span className="font-semibold">
              Redirecionando automaticamente em {countdown} segundos...
            </span>
          </div>
          <p className="text-blue-200 text-sm mt-2">
            Ou clique no botão acima para acessar imediatamente
          </p>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Precisa de ajuda? Nossa equipe está aqui para você!
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" className="text-orange-400 hover:text-orange-300">
              💬 Suporte no WhatsApp
            </Button>
            <Button variant="ghost" className="text-orange-400 hover:text-orange-300">
              📧 Enviar Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}