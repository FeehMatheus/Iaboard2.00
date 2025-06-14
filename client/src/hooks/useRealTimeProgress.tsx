import { useState, useEffect, useCallback, useRef } from 'react';

interface ProgressUpdate {
  step: string;
  progress: number;
  message: string;
  timestamp: number;
}

interface UseRealTimeProgressProps {
  moduleType: string;
  isActive: boolean;
  onComplete?: () => void;
}

export function useRealTimeProgress({ 
  moduleType, 
  isActive, 
  onComplete 
}: UseRealTimeProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const stepTimeoutRef = useRef<NodeJS.Timeout>();

  const steps = {
    'ia-copy': [
      { id: 'analyze', label: 'Analisando prompt e mercado', duration: 2000 },
      { id: 'generate', label: 'Gerando headlines persuasivas', duration: 3000 },
      { id: 'optimize', label: 'Otimizando copy com IA', duration: 2500 },
      { id: 'finalize', label: 'Finalizando conteúdo', duration: 1500 }
    ],
    'ia-video': [
      { id: 'script', label: 'Criando roteiro dinâmico', duration: 2500 },
      { id: 'scenes', label: 'Planejando cenas visuais', duration: 2000 },
      { id: 'generate', label: 'Gerando vídeo com IA', duration: 4000 },
      { id: 'render', label: 'Renderizando resultado final', duration: 3000 }
    ],
    'ia-produto': [
      { id: 'research', label: 'Pesquisa de mercado avançada', duration: 2500 },
      { id: 'strategy', label: 'Desenvolvendo estratégia', duration: 2000 },
      { id: 'pricing', label: 'Calculando preços otimizados', duration: 1500 },
      { id: 'launch', label: 'Criando plano de lançamento', duration: 2000 }
    ],
    'ia-trafego': [
      { id: 'audience', label: 'Segmentando público-alvo', duration: 1800 },
      { id: 'channels', label: 'Selecionando canais ideais', duration: 1500 },
      { id: 'campaigns', label: 'Criando campanhas otimizadas', duration: 3000 },
      { id: 'tracking', label: 'Configurando métricas', duration: 1200 }
    ],
    'ia-analytics': [
      { id: 'kpis', label: 'Definindo KPIs estratégicos', duration: 1800 },
      { id: 'dashboard', label: 'Montando dashboard inteligente', duration: 2500 },
      { id: 'insights', label: 'Extraindo insights de dados', duration: 2200 },
      { id: 'recommendations', label: 'Gerando recomendações', duration: 1500 }
    ]
  };

  const moduleSteps = steps[moduleType as keyof typeof steps] || [];

  const addProgressUpdate = useCallback((step: string, progress: number, message: string) => {
    setProgressUpdates(prev => [...prev, {
      step,
      progress,
      message,
      timestamp: Date.now()
    }]);
  }, []);

  const simulateStepProgress = useCallback((stepIndex: number) => {
    if (stepIndex >= moduleSteps.length) {
      setIsComplete(true);
      setOverallProgress(100);
      onComplete?.();
      return;
    }

    const step = moduleSteps[stepIndex];
    const stepDuration = step.duration;
    const progressIncrement = 100 / (stepDuration / 100); // Update every 100ms
    
    setCurrentStep(stepIndex);
    setStepProgress(0);
    
    addProgressUpdate(step.id, 0, `Iniciando: ${step.label}`);

    let currentStepProgress = 0;
    
    progressIntervalRef.current = setInterval(() => {
      currentStepProgress += progressIncrement;
      
      if (currentStepProgress >= 100) {
        currentStepProgress = 100;
        setStepProgress(100);
        
        // Update overall progress
        const newOverallProgress = ((stepIndex + 1) / moduleSteps.length) * 100;
        setOverallProgress(newOverallProgress);
        
        addProgressUpdate(step.id, 100, `Concluído: ${step.label}`);
        
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        
        // Move to next step after brief pause
        stepTimeoutRef.current = setTimeout(() => {
          simulateStepProgress(stepIndex + 1);
        }, 500);
        
        return;
      }
      
      setStepProgress(currentStepProgress);
      
      // Add intermediate progress updates
      if (currentStepProgress % 25 === 0) {
        const progressMessages = [
          `Processando: ${step.label}`,
          `Analisando dados: ${step.label}`,
          `Otimizando resultado: ${step.label}`,
          `Finalizando: ${step.label}`
        ];
        const messageIndex = Math.floor(currentStepProgress / 25) - 1;
        if (messageIndex >= 0 && messageIndex < progressMessages.length) {
          addProgressUpdate(step.id, currentStepProgress, progressMessages[messageIndex]);
        }
      }
    }, 100);
  }, [moduleSteps, addProgressUpdate, onComplete]);

  const startProgress = useCallback(() => {
    if (!isActive || moduleSteps.length === 0) return;
    
    setCurrentStep(0);
    setStepProgress(0);
    setOverallProgress(0);
    setProgressUpdates([]);
    setIsComplete(false);
    
    simulateStepProgress(0);
  }, [isActive, moduleSteps.length, simulateStepProgress]);

  const resetProgress = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    
    setCurrentStep(0);
    setStepProgress(0);
    setOverallProgress(0);
    setProgressUpdates([]);
    setIsComplete(false);
  }, []);

  // Start progress when component becomes active
  useEffect(() => {
    if (isActive) {
      startProgress();
    } else {
      resetProgress();
    }
    
    // Cleanup on unmount
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, [isActive, startProgress, resetProgress]);

  return {
    currentStep,
    stepProgress,
    overallProgress,
    progressUpdates,
    isComplete,
    steps: moduleSteps,
    currentStepData: moduleSteps[currentStep],
    resetProgress
  };
}