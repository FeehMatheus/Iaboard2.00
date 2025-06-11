import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Zap, Target, Brain, TrendingUp, X, ArrowRight,
  Rocket, Sparkles, Award, Shield, CheckCircle, Play,
  BarChart3, Users, DollarSign, Clock, FileText, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdvancedCTAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

interface QuickActionCTAProps {
  onOpenModal: () => void;
}

const CTA_OPTIONS = [
  {
    id: 'canvas',
    title: 'Canvas Infinito',
    description: 'Crie projetos ilimitados em espaço multidimensional',
    path: '/canvas',
    icon: Target,
    color: 'from-blue-500 to-purple-600',
    metrics: ['∞ Projetos', '24/7 Ativo', 'IA Suprema'],
    badge: 'POPULAR'
  },
  {
    id: 'dashboard',
    title: 'Dashboard Supremo',
    description: 'Central de controle com analytics avançados',
    path: '/dashboard',
    icon: BarChart3,
    color: 'from-green-500 to-teal-600',
    metrics: ['97.8% Precisão', 'Real-time', 'Auto-otimização'],
    badge: 'RECOMENDADO'
  },
  {
    id: 'platform',
    title: 'Plataforma IA',
    description: 'Sistema completo de inteligência artificial',
    path: '/platform',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    metrics: ['Multi-modal', 'Claude + GPT-4', 'Quantum'],
    badge: 'PREMIUM'
  },
  {
    id: 'supreme',
    title: 'Versão Suprema',
    description: 'Acesso total aos recursos mais avançados',
    path: '/supreme',
    icon: Crown,
    color: 'from-orange-500 to-red-600',
    metrics: ['Tudo Incluído', 'Suporte VIP', 'ROI 12.7x'],
    badge: 'EXCLUSIVO'
  }
];

export function AdvancedCTAModal({ isOpen, onClose, onNavigate }: AdvancedCTAModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option.id);
    setIsAnimating(true);
    
    setTimeout(() => {
      onNavigate(option.path);
      onClose();
      setIsAnimating(false);
      setSelectedOption(null);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Escolha Sua{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Jornada
                </span>
              </h2>
              <p className="text-gray-300 text-lg">
                Selecione o caminho para maximizar seus resultados
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {CTA_OPTIONS.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`cursor-pointer ${selectedOption === option.id ? 'ring-2 ring-orange-500' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden">
                    {/* Badge */}
                    {option.badge && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-orange-600 text-white text-xs px-2 py-1">
                          {option.badge}
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-6">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${option.color} p-3 mb-4`}>
                        <option.icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 mb-4 leading-relaxed">{option.description}</p>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {option.metrics.map((metric, idx) => (
                          <span key={idx} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                            {metric}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-medium`}
                          disabled={isAnimating}
                        >
                          {selectedOption === option.id ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Zap className="w-4 h-4 mr-2" />
                              </motion.div>
                              Iniciando...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              ACESSAR AGORA
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bottom Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-700/50"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">15.847</div>
                <div className="text-sm text-gray-400">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">R$ 45M+</div>
                <div className="text-sm text-gray-400">Faturamento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">97.3%</div>
                <div className="text-sm text-gray-400">Taxa Sucesso</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function QuickActionCTA({ onOpenModal }: QuickActionCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 300 }}
      className="fixed bottom-8 right-8 z-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        {/* Pulse Effect */}
        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-30"></div>
        
        {/* Main Button */}
        <Button
          onClick={onOpenModal}
          size="lg"
          className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-full w-16 h-16 shadow-2xl hover:shadow-orange-500/50"
        >
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Rocket className="w-6 h-6" />
          </motion.div>
        </Button>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-orange-500/30"
            >
              Acesso Rápido
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-orange-500/30"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}