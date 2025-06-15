import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Clock, 
  Zap, 
  Target, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealTimeProgress } from '../hooks/useRealTimeProgress';

interface AdvancedProgressDashboardProps {
  moduleType: 'ia-copy' | 'ia-video' | 'ia-produto' | 'ia-trafego' | 'ia-analytics';
  isActive: boolean;
  onComplete?: () => void;
  showDetailedMetrics?: boolean;
}

export function AdvancedProgressDashboard({ 
  moduleType, 
  isActive, 
  onComplete,
  showDetailedMetrics = true 
}: AdvancedProgressDashboardProps) {
  const {
    currentStep,
    stepProgress,
    overallProgress,
    progressUpdates,
    isComplete,
    steps,
    currentStepData
  } = useRealTimeProgress({ moduleType, isActive, onComplete });

  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);

      // Calculate estimated time remaining based on current progress
      if (overallProgress > 0) {
        const totalEstimated = (elapsed / overallProgress) * 100;
        const remaining = Math.max(0, totalEstimated - elapsed);
        setEstimatedTimeRemaining(Math.floor(remaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (progress: number) => {
    if (progress === 100) return 'text-green-600 dark:text-green-400';
    if (progress > 0) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getStatusIcon = (progress: number) => {
    if (progress === 100) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (progress > 0) return <PlayCircle className="w-4 h-4 text-blue-500 animate-pulse" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  if (!isActive && overallProgress === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl"
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              {moduleType.toUpperCase().replace('-', ' ')} - Progresso em Tempo Real
            </CardTitle>
            <Badge variant={isComplete ? "default" : "secondary"} className="font-medium">
              {isComplete ? "Concluído" : "Processando"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-bold">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-muted" />
          </div>

          {/* Current Step Progress */}
          {currentStepData && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2 p-3 bg-primary/5 rounded-lg border border-primary/10"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium">{currentStepData.label}</span>
                </div>
                <span className="text-sm font-bold">{Math.round(stepProgress)}%</span>
              </div>
              <Progress value={stepProgress} className="h-2" />
            </motion.div>
          )}

          {/* Metrics Grid */}
          {showDetailedMetrics && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Tempo Decorrido</p>
                  <p className="text-sm font-semibold">{formatTime(elapsedTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Target className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Tempo Restante</p>
                  <p className="text-sm font-semibold">{formatTime(estimatedTimeRemaining)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Etapas do Processo
            </h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              <AnimatePresence>
                {steps.map((step, index) => {
                  const stepProgressValue = index < currentStep ? 100 : 
                                          index === currentStep ? stepProgress : 0;
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 p-2 rounded-md transition-all ${
                        index === currentStep 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getStatusIcon(stepProgressValue)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${getStatusColor(stepProgressValue)}`}>
                          {step.label}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`text-xs font-semibold ${getStatusColor(stepProgressValue)}`}>
                          {Math.round(stepProgressValue)}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent Updates */}
          {progressUpdates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Atualizações Recentes
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                <AnimatePresence>
                  {progressUpdates.slice(-3).reverse().map((update, index) => (
                    <motion.div
                      key={`${update.step}-${update.timestamp}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-xs p-2 bg-muted/40 rounded border-l-2 border-primary/30"
                    >
                      <p className="font-medium text-muted-foreground">
                        {update.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {new Date(update.timestamp).toLocaleTimeString()}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completion State */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg text-center"
            >
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-green-700 dark:text-green-300">
                Processamento Concluído com Sucesso!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Tempo total: {formatTime(elapsedTime)}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}