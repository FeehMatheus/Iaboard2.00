import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Sparkles, Rocket, Target, Brain, 
  TrendingUp, Zap, CheckCircle, ArrowRight,
  X, Play, Download, Share, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedPopup } from './enhanced-popup-system';

interface CTAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function AdvancedCTAModal({ isOpen, onClose, onNavigate }: CTAModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const ctaOptions = [
    {
      id: 'canvas',
      title: 'Canvas Infinito',
      subtitle: 'Crie projetos ilimitados',
      description: 'Acesse a interface principal onde você pode criar e gerenciar todos os seus projetos de marketing digital',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      path: '/canvas',
      features: ['8 tipos de projetos', 'IA avançada', 'Templates premium', 'Exportação completa'],
      badge: 'PRINCIPAL'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Completo',
      subtitle: 'Visão geral dos resultados',
      description: 'Monitore performance, analytics e métricas de todos os seus projetos em tempo real',
      icon: TrendingUp,
      color: 'from-blue-500 to-purple-500',
      path: '/dashboard',
      features: ['Analytics em tempo real', 'Relatórios avançados', 'KPIs personalizados', 'Insights de IA'],
      badge: 'ANALYTICS'
    },
    {
      id: 'login',
      title: 'Área do Usuário',
      subtitle: 'Acesse sua conta',
      description: 'Entre na sua conta para acessar todos os recursos premium e histórico de projetos',
      icon: Target,
      color: 'from-green-500 to-teal-500',
      path: '/login',
      features: ['Perfil personalizado', 'Histórico completo', 'Configurações avançadas', 'Suporte premium'],
      badge: 'CONTA'
    }
  ];

  const handleSelectOption = (option: any) => {
    setSelectedOption(option.id);
    setTimeout(() => {
      onNavigate(option.path);
      onClose();
    }, 800);
  };

  return (
    <EnhancedPopup
      isOpen={isOpen}
      onClose={onClose}
      title="Escolha Sua Próxima Ação"
      maxWidth="max-w-6xl"
      className="text-center"
    >
      <div className="space-y-6">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Transforme Suas Ideias em Resultados
          </h3>
          <p className="text-gray-300">
            Escolha a melhor opção para começar sua jornada de sucesso
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ctaOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => handleSelectOption(option)}
            >
              <Card className={`h-full bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-500 group-hover:border-orange-500/50 ${
                selectedOption === option.id ? 'ring-2 ring-orange-500 border-orange-500' : ''
              }`}>
                <CardHeader className="text-center pb-4">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color} p-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs">
                      {option.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {option.title}
                  </CardTitle>
                  <p className="text-orange-400 font-medium">
                    {option.subtitle}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {option.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-bold transition-all duration-300 group-hover:shadow-lg`}
                    disabled={selectedOption === option.id}
                  >
                    {selectedOption === option.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Redirecionando...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Acessar Agora
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>15.847 usuários ativos</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span>R$ 45M+ gerados</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-blue-400 mr-1" />
              <span>97.3% taxa de sucesso</span>
            </div>
          </div>
        </div>
      </div>
    </EnhancedPopup>
  );
}

interface QuickActionCTAProps {
  onOpenModal: () => void;
}

export function QuickActionCTA({ onOpenModal }: QuickActionCTAProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        onClick={onOpenModal}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300"
      >
        <Crown className="w-5 h-5 mr-2" />
        Começar Agora
        <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
      </Button>
    </motion.div>
  );
}