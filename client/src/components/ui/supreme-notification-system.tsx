import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Zap, Crown, TrendingUp, Target, Brain,
  Sparkles, Award, DollarSign, Users, Clock, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SupremeNotificationProps {
  isVisible: boolean;
  onComplete: () => void;
  type?: 'creation' | 'processing' | 'success' | 'upgrade';
}

const PROCESSING_STAGES = [
  { text: 'Inicializando IA Suprema...', progress: 10, icon: Zap, color: 'text-orange-400' },
  { text: 'Conectando APIs Claude & GPT-4...', progress: 25, icon: Crown, color: 'text-purple-400' },
  { text: 'Processamento Quântico Ativo...', progress: 45, icon: Brain, color: 'text-blue-400' },
  { text: 'Analisando Dados de Mercado...', progress: 65, icon: TrendingUp, color: 'text-green-400' },
  { text: 'Gerando Conteúdo Premium...', progress: 85, icon: Target, color: 'text-yellow-400' },
  { text: 'Otimizando para Conversão...', progress: 95, icon: Award, color: 'text-pink-400' },
  { text: 'Sistema Operacional!', progress: 100, icon: CheckCircle, color: 'text-green-500' }
];

const REAL_TIME_STATS = [
  { label: 'Projetos Criados', value: '247', increment: true, icon: Target },
  { label: 'Usuários Online', value: '1.843', increment: true, icon: Users },
  { label: 'Faturamento Hoje', value: 'R$ 127k', increment: true, icon: DollarSign },
  { label: 'Taxa Conversão', value: '97.8%', increment: false, icon: TrendingUp }
];

export function SupremeNotificationSystem({ isVisible, onComplete, type = 'processing' }: SupremeNotificationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(REAL_TIME_STATS);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= PROCESSING_STAGES.length - 1) {
          clearInterval(interval);
          setShowStats(true);
          setTimeout(() => {
            onComplete();
          }, 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    // Animate stats
    const statsInterval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.increment ? 
          stat.label.includes('Projetos') ? `${247 + Math.floor(Math.random() * 5)}` :
          stat.label.includes('Usuários') ? `${1843 + Math.floor(Math.random() * 20)}` :
          stat.label.includes('Faturamento') ? `R$ ${127 + Math.floor(Math.random() * 3)}k` :
          stat.value
          : stat.value
      })));
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(statsInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const currentStageData = PROCESSING_STAGES[currentStage];
  const IconComponent = currentStageData?.icon || Clock;

  return (
    <AnimatePresence>
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
          className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 max-w-lg w-full text-center relative"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onComplete}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>

          {!showStats ? (
            <>
              {/* Processing Stage */}
              <motion.div
                key={currentStage}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <IconComponent className={`w-8 h-8 ${currentStageData?.color || 'text-orange-400'} animate-pulse`} />
                </div>
              </motion.div>

              {/* Status Text */}
              <motion.h3
                key={`text-${currentStage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-white mb-4"
              >
                {currentStageData?.text || 'Inicializando...'}
              </motion.h3>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentStageData?.progress || 0}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                />
              </div>

              {/* Progress Percentage */}
              <p className="text-orange-400 font-medium text-lg">
                {currentStageData?.progress || 0}% concluído
              </p>
            </>
          ) : (
            /* Success State with Stats */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-500 mr-2" />
                <h3 className="text-2xl font-bold text-white">Sistema Ativo!</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-5 h-5 text-orange-400 mr-2" />
                      <span className="text-sm text-gray-400">{stat.label}</span>
                    </div>
                    <motion.div 
                      key={stat.value}
                      initial={{ scale: 1.2, color: '#f97316' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-xl font-bold text-center"
                    >
                      {stat.value}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <Badge className="bg-green-600 text-white px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Plataforma Operacional
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}