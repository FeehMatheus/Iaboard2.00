import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, AlertCircle, Zap, FileText, Video, Image, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  estimatedTime?: string;
  type: 'text' | 'video' | 'image' | 'copy' | 'analysis';
  metadata?: {
    tokensUsed?: number;
    fileSize?: string;
    duration?: string;
    provider?: string;
  };
}

interface ProgressVisualizationProps {
  steps: ProgressStep[];
  currentStep: number;
  isActive: boolean;
  onCancel?: () => void;
  onRetry?: (stepId: string) => void;
}

const getStepIcon = (type: string, status: string) => {
  const icons = {
    text: FileText,
    video: Video,
    image: Image,
    copy: MessageSquare,
    analysis: Zap
  };
  
  const IconComponent = icons[type as keyof typeof icons] || FileText;
  
  const getColor = () => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-blue-500 animate-pulse';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };
  
  return <IconComponent className={`w-5 h-5 ${getColor()}`} />;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'processing':
      return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Circle className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

export function ProgressVisualization({ 
  steps, 
  currentStep, 
  isActive, 
  onCancel, 
  onRetry 
}: ProgressVisualizationProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(1);
  
  useEffect(() => {
    if (isActive && currentStep >= 0) {
      const timer = setTimeout(() => {
        setVisibleSteps(Math.min(currentStep + 2, steps.length));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isActive, steps.length]);

  const overallProgress = steps.length > 0 
    ? (steps.filter(step => step.status === 'completed').length / steps.length) * 100
    : 0;

  const currentStepData = steps[currentStep];
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const errorSteps = steps.filter(step => step.status === 'error').length;

  if (!isActive || steps.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Criando Conteúdo com IA
            </CardTitle>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{completedSteps} de {steps.length} etapas concluídas</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {currentStepData && (
            <div className="flex items-center gap-3 pt-2">
              {getStepIcon(currentStepData.type, currentStepData.status)}
              <div className="flex-1">
                <div className="font-medium text-sm">{currentStepData.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentStepData.description}
                </div>
              </div>
              <Badge className={getStatusColor(currentStepData.status)}>
                {currentStepData.status === 'processing' ? 'Processando...' :
                 currentStepData.status === 'completed' ? 'Concluído' :
                 currentStepData.status === 'error' ? 'Erro' : 'Aguardando'}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {steps.slice(0, visibleSteps).map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border transition-all ${
                  index === currentStep 
                    ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950' 
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStepIcon(step.type, step.status)}
                      <span className="font-medium text-sm">{step.title}</span>
                      {step.estimatedTime && step.status === 'processing' && (
                        <span className="text-xs text-gray-500">
                          ~{step.estimatedTime}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {step.description}
                    </p>

                    {step.status === 'processing' && (
                      <div className="space-y-1">
                        <Progress value={step.progress} className="h-1" />
                        <div className="text-xs text-gray-500">
                          {step.progress}% concluído
                        </div>
                      </div>
                    )}

                    {step.metadata && step.status === 'completed' && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {step.metadata.tokensUsed && (
                          <Badge variant="outline" className="text-xs">
                            {step.metadata.tokensUsed} tokens
                          </Badge>
                        )}
                        {step.metadata.fileSize && (
                          <Badge variant="outline" className="text-xs">
                            {step.metadata.fileSize}
                          </Badge>
                        )}
                        {step.metadata.duration && (
                          <Badge variant="outline" className="text-xs">
                            {step.metadata.duration}
                          </Badge>
                        )}
                        {step.metadata.provider && (
                          <Badge variant="outline" className="text-xs">
                            {step.metadata.provider}
                          </Badge>
                        )}
                      </div>
                    )}

                    {step.status === 'error' && onRetry && (
                      <button
                        onClick={() => onRetry(step.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mt-1"
                      >
                        Tentar novamente
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleSteps < steps.length && (
            <div className="text-center py-2">
              <span className="text-xs text-gray-500">
                +{steps.length - visibleSteps} etapas restantes
              </span>
            </div>
          )}
        </CardContent>

        {errorSteps > 0 && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {errorSteps} etapa{errorSteps > 1 ? 's' : ''} falharam
                </span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Verifique os erros acima e tente novamente se necessário.
              </p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default ProgressVisualization;