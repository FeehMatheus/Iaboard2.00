import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Video, 
  PenTool, 
  Package, 
  Target, 
  BarChart3,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
  detail?: string;
}

interface DynamicProgressProps {
  moduleType: 'ia-copy' | 'ia-video' | 'ia-produto' | 'ia-trafego' | 'ia-analytics';
  isActive: boolean;
  onComplete?: () => void;
  customSteps?: ProgressStep[];
}

const moduleIcons = {
  'ia-copy': PenTool,
  'ia-video': Video,
  'ia-produto': Package,
  'ia-trafego': Target,
  'ia-analytics': BarChart3
};

const defaultSteps = {
  'ia-copy': [
    { id: 'analyze', label: 'Analisando prompt', duration: 1000, status: 'pending' as const },
    { id: 'research', label: 'Pesquisando mercado', duration: 2000, status: 'pending' as const },
    { id: 'generate', label: 'Gerando headlines', duration: 3000, status: 'pending' as const },
    { id: 'optimize', label: 'Otimizando persuasão', duration: 2000, status: 'pending' as const },
    { id: 'finalize', label: 'Finalizando copy', duration: 1000, status: 'pending' as const }
  ],
  'ia-video': [
    { id: 'script', label: 'Criando roteiro', duration: 2000, status: 'pending' as const },
    { id: 'scenes', label: 'Definindo cenas', duration: 2500, status: 'pending' as const },
    { id: 'generate', label: 'Gerando vídeo IA', duration: 4000, status: 'pending' as const },
    { id: 'effects', label: 'Aplicando efeitos', duration: 2000, status: 'pending' as const },
    { id: 'render', label: 'Renderizando final', duration: 3000, status: 'pending' as const }
  ],
  'ia-produto': [
    { id: 'market', label: 'Análise de mercado', duration: 2000, status: 'pending' as const },
    { id: 'strategy', label: 'Estratégia de produto', duration: 2500, status: 'pending' as const },
    { id: 'pricing', label: 'Definindo preços', duration: 1500, status: 'pending' as const },
    { id: 'launch', label: 'Plano de lançamento', duration: 2000, status: 'pending' as const },
    { id: 'forecast', label: 'Projeções de vendas', duration: 1500, status: 'pending' as const }
  ],
  'ia-trafego': [
    { id: 'audience', label: 'Segmentando público', duration: 1500, status: 'pending' as const },
    { id: 'platforms', label: 'Selecionando canais', duration: 1000, status: 'pending' as const },
    { id: 'campaigns', label: 'Criando campanhas', duration: 3000, status: 'pending' as const },
    { id: 'budget', label: 'Otimizando budget', duration: 2000, status: 'pending' as const },
    { id: 'tracking', label: 'Configurando tracking', duration: 1500, status: 'pending' as const }
  ],
  'ia-analytics': [
    { id: 'metrics', label: 'Definindo KPIs', duration: 1500, status: 'pending' as const },
    { id: 'dashboard', label: 'Criando dashboard', duration: 2500, status: 'pending' as const },
    { id: 'reports', label: 'Gerando relatórios', duration: 2000, status: 'pending' as const },
    { id: 'insights', label: 'Extraindo insights', duration: 2500, status: 'pending' as const },
    { id: 'recommendations', label: 'Sugestões de melhoria', duration: 1500, status: 'pending' as const }
  ]
};

export function DynamicProgressVisualization({ 
  moduleType, 
  isActive, 
  onComplete, 
  customSteps 
}: DynamicProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<ProgressStep[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const stepTimeoutRef = useRef<NodeJS.Timeout>();

  const ModuleIcon = moduleIcons[moduleType];

  useEffect(() => {
    const moduleSteps = customSteps || defaultSteps[moduleType];
    const initializedSteps: ProgressStep[] = moduleSteps.map((step, index) => ({
      ...step,
      status: (index === 0 && isActive ? 'active' : 'pending') as ProgressStep['status']
    }));
    setSteps(initializedSteps);
  }, [moduleType, customSteps, isActive]);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      return;
    }

    if (currentStep >= steps.length) {
      onComplete?.();
      return;
    }

    const currentStepData = steps[currentStep];
    if (!currentStepData) return;

    // Update step status to active
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      status: index === currentStep ? 'active' : 
              index < currentStep ? 'completed' : 'pending'
    })));

    // Progressive fill animation
    const duration = currentStepData.duration || 2000;
    const stepSize = 100 / steps.length;
    const startProgress = currentStep * stepSize;
    const endProgress = (currentStep + 1) * stepSize;

    let currentProgress = startProgress;
    const increment = (endProgress - startProgress) / (duration / 50);

    intervalRef.current = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, endProgress));

      if (currentProgress >= endProgress) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        // Mark current step as completed
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === currentStep ? 'completed' : step.status
        })));

        // Move to next step after a brief pause
        stepTimeoutRef.current = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 300);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, [currentStep, steps.length, isActive, onComplete]);

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  if (!isActive && progress === 0) return null;

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <ModuleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              {moduleType.toUpperCase().replace('-', ' ')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gerando conteúdo com IA
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-500 ml-auto animate-pulse" />
        </div>

        {/* Main Progress Bar */}
        <div className="mb-4">
          <Progress 
            value={progress} 
            className="h-3 bg-slate-200 dark:bg-slate-700"
          />
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
            <span>0%</span>
            <span className="font-medium">{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  step.status === 'active' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' 
                    : step.status === 'completed'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    step.status === 'active' ? 'text-blue-700 dark:text-blue-300' :
                    step.status === 'completed' ? 'text-green-700 dark:text-green-300' :
                    'text-slate-600 dark:text-slate-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.detail && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {step.detail}
                    </p>
                  )}
                </div>
                {step.status === 'active' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Brain className="w-4 h-4 text-blue-500" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Completion State */}
        {progress >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center"
          >
            <CheckCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">Conteúdo gerado com sucesso!</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}