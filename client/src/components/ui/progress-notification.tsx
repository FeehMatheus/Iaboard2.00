import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Clock, Zap, Crown, TrendingUp,
  DollarSign, Users, Target, Award, Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProgressNotificationProps {
  isVisible: boolean;
  onComplete: () => void;
}

const PROGRESS_STEPS = [
  { text: 'Iniciando IA Suprema...', progress: 10, icon: Zap, color: 'text-orange-400' },
  { text: 'Conectando APIs Reais...', progress: 25, icon: Crown, color: 'text-purple-400' },
  { text: 'Processamento Quântico...', progress: 45, icon: Sparkles, color: 'text-blue-400' },
  { text: 'Analisando Mercado...', progress: 65, icon: TrendingUp, color: 'text-green-400' },
  { text: 'Gerando Conteúdo Premium...', progress: 85, icon: Target, color: 'text-yellow-400' },
  { text: 'Otimizando Conversões...', progress: 95, icon: Award, color: 'text-pink-400' },
  { text: 'Acesso Liberado!', progress: 100, icon: CheckCircle, color: 'text-green-500' }
];

const REAL_TIME_METRICS = [
  { label: 'Projetos Ativos', value: '15.847', icon: Users },
  { label: 'Faturamento', value: 'R$ 387M+', icon: DollarSign },
  { label: 'Taxa de Sucesso', value: '97.3%', icon: Target },
  { label: 'ROI Médio', value: '1:8.4', icon: TrendingUp }
];

export function ProgressNotification({ isVisible, onComplete }: ProgressNotificationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= PROGRESS_STEPS.length - 1) {
          clearInterval(interval);
          setShowMetrics(true);
          setTimeout(onComplete, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const currentStepData = PROGRESS_STEPS[currentStep];
  const IconComponent = currentStepData?.icon || Clock;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 max-w-md w-full mx-4 text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Main Content */}
          {!showMetrics ? (
            <>
              {/* Progress Icon */}
              <motion.div
                key={currentStep}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                <div className={`w-16 h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center`}>
                  <IconComponent className={`w-8 h-8 ${currentStepData?.color || 'text-orange-400'} animate-pulse`} />
                </div>
              </motion.div>

              {/* Progress Text */}
              <motion.h3
                key={`text-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-white mb-4"
              >
                {currentStepData?.text || 'Carregando...'}
              </motion.h3>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentStepData?.progress || 0}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                />
              </div>

              {/* Progress Percentage */}
              <p className="text-orange-400 font-medium">
                {currentStepData?.progress || 0}% concluído
              </p>
            </>
          ) : (
            /* Real-time Metrics */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-2" />
                <h3 className="text-2xl font-bold text-white">Sistema Ativo!</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {REAL_TIME_METRICS.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-center mb-1">
                      <metric.icon className="w-4 h-4 text-orange-400 mr-1" />
                      <span className="text-xs text-gray-400">{metric.label}</span>
                    </div>
                    <div className="text-lg font-bold text-white text-center">
                      {metric.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              <Badge className="bg-green-600 text-white mt-4">
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