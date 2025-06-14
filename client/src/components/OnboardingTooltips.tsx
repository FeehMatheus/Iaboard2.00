import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, MousePointer2, Sparkles } from 'lucide-react';
import { useOnboardingStore } from '@/lib/onboardingStore';

interface TooltipStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const TOOLTIP_STEPS: TooltipStep[] = [
  {
    id: 'canvas-welcome',
    target: '.infinite-canvas',
    title: 'Canvas Infinito',
    description: 'Este é seu espaço de trabalho onde você pode criar e conectar módulos de IA',
    position: 'bottom'
  },
  {
    id: 'right-click',
    target: '.infinite-canvas',
    title: 'Menu Contextual',
    description: 'Clique com o botão direito em qualquer lugar para adicionar novos módulos',
    position: 'top',
    action: 'right-click'
  },
  {
    id: 'node-connections',
    target: '.workflow-node',
    title: 'Conectar Módulos',
    description: 'Arraste das bordas dos módulos para criar conexões e workflows',
    position: 'right'
  },
  {
    id: 'execute-module',
    target: '.execute-button',
    title: 'Executar IA',
    description: 'Clique para executar o módulo e gerar conteúdo com inteligência artificial',
    position: 'top'
  }
];

interface OnboardingTooltipsProps {
  isActive: boolean;
  onComplete: () => void;
}

export const OnboardingTooltips = ({ isActive, onComplete }: OnboardingTooltipsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const { hasCompletedOnboarding } = useOnboardingStore();

  const currentTooltip = TOOLTIP_STEPS[currentStep];

  useEffect(() => {
    if (isActive && !hasCompletedOnboarding) {
      setShowTooltip(true);
    }
  }, [isActive, hasCompletedOnboarding]);

  const handleNext = () => {
    if (currentStep < TOOLTIP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setShowTooltip(false);
    onComplete();
  };

  const handleComplete = () => {
    setShowTooltip(false);
    onComplete();
  };

  const getTooltipPosition = () => {
    const target = document.querySelector(currentTooltip?.target);
    if (!target) return { top: '50%', left: '50%' };

    const rect = target.getBoundingClientRect();
    const position = currentTooltip.position;

    switch (position) {
      case 'top':
        return {
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 20}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  if (!isActive || !showTooltip || !currentTooltip) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={handleSkip}
        />

        {/* Highlight Target */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="absolute border-2 border-blue-400 rounded-lg shadow-lg pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            width: '200px',
            height: '150px',
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Tooltip */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="absolute pointer-events-auto"
          style={getTooltipPosition()}
        >
          <Card className="w-80 bg-white dark:bg-gray-800 shadow-2xl border-2 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {currentTooltip.title}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Passo {currentStep + 1} de {TOOLTIP_STEPS.length}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {currentTooltip.description}
              </p>

              {currentTooltip.action && (
                <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MousePointer2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    {currentTooltip.action === 'right-click' && 'Clique com o botão direito'}
                    {currentTooltip.action === 'drag' && 'Arraste para conectar'}
                    {currentTooltip.action === 'click' && 'Clique para executar'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {TOOLTIP_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-blue-600'
                          : index < currentStep
                          ? 'bg-blue-300'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSkip}
                  >
                    Pular
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {currentStep === TOOLTIP_STEPS.length - 1 ? 'Finalizar' : 'Próximo'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pulsing Animation for Target */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute border-2 border-blue-400/50 rounded-lg pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            width: '220px',
            height: '170px',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </AnimatePresence>
  );
};