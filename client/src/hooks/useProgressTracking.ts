import { useState, useCallback, useRef } from 'react';

export interface ProgressStep {
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
    startTime?: number;
    endTime?: number;
  };
}

export interface ProgressConfig {
  totalSteps: number;
  estimatedDuration: number;
  enableRealTimeUpdates: boolean;
}

export interface UseProgressTrackingReturn {
  steps: ProgressStep[];
  currentStep: number;
  isActive: boolean;
  overallProgress: number;
  elapsedTime: number;
  estimatedTimeRemaining: number;
  
  // Control methods
  startProgress: (config: ProgressConfig, initialSteps: Omit<ProgressStep, 'status' | 'progress'>[]) => void;
  updateStepProgress: (stepId: string, progress: number, metadata?: Partial<ProgressStep['metadata']>) => void;
  completeStep: (stepId: string, metadata?: Partial<ProgressStep['metadata']>) => void;
  failStep: (stepId: string, error: string) => void;
  nextStep: () => void;
  retryStep: (stepId: string) => void;
  cancelProgress: () => void;
  resetProgress: () => void;
}

export function useProgressTracking(): UseProgressTrackingReturn {
  const [steps, setSteps] = useState<ProgressStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = useCallback((
    config: ProgressConfig, 
    initialSteps: Omit<ProgressStep, 'status' | 'progress'>[]
  ) => {
    const now = Date.now();
    const processedSteps: ProgressStep[] = initialSteps.map((step, index) => ({
      ...step,
      status: index === 0 ? 'processing' : 'pending',
      progress: 0,
      metadata: {
        ...step.metadata,
        startTime: index === 0 ? now : undefined
      }
    }));

    setSteps(processedSteps);
    setCurrentStep(0);
    setIsActive(true);
    setStartTime(now);
    setElapsedTime(0);

    // Start elapsed time counter
    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  }, []);

  const updateStepProgress = useCallback((
    stepId: string, 
    progress: number, 
    metadata?: Partial<ProgressStep['metadata']>
  ) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            progress: Math.min(100, Math.max(0, progress)),
            metadata: { ...step.metadata, ...metadata }
          }
        : step
    ));
  }, []);

  const completeStep = useCallback((
    stepId: string, 
    metadata?: Partial<ProgressStep['metadata']>
  ) => {
    const now = Date.now();
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status: 'completed',
            progress: 100,
            metadata: { 
              ...step.metadata, 
              ...metadata,
              endTime: now,
              duration: step.metadata?.startTime 
                ? `${((now - step.metadata.startTime) / 1000).toFixed(1)}s`
                : undefined
            }
          }
        : step
    ));
  }, []);

  const failStep = useCallback((stepId: string, error: string) => {
    const now = Date.now();
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status: 'error',
            metadata: { 
              ...step.metadata,
              endTime: now,
              error
            }
          }
        : step
    ));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;
      if (next < steps.length) {
        const now = Date.now();
        setSteps(stepList => stepList.map((step, index) => 
          index === next 
            ? { 
                ...step, 
                status: 'processing',
                metadata: { ...step.metadata, startTime: now }
              }
            : step
        ));
        return next;
      } else {
        // All steps completed
        setIsActive(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prev;
      }
    });
  }, [steps.length]);

  const retryStep = useCallback((stepId: string) => {
    const now = Date.now();
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status: 'processing',
            progress: 0,
            metadata: { 
              ...step.metadata, 
              startTime: now,
              error: undefined 
            }
          }
        : step
    ));
  }, []);

  const cancelProgress = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setSteps([]);
    setCurrentStep(-1);
    setIsActive(false);
    setStartTime(null);
    setElapsedTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Calculate derived values
  const overallProgress = steps.length > 0 
    ? (steps.filter(step => step.status === 'completed').length / steps.length) * 100
    : 0;

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  
  const averageStepTime = completedSteps > 0 
    ? elapsedTime / completedSteps
    : 30; // Default 30 seconds per step

  const estimatedTimeRemaining = totalSteps > completedSteps 
    ? (totalSteps - completedSteps) * averageStepTime
    : 0;

  return {
    steps,
    currentStep,
    isActive,
    overallProgress,
    elapsedTime,
    estimatedTimeRemaining,
    
    startProgress,
    updateStepProgress,
    completeStep,
    failStep,
    nextStep,
    retryStep,
    cancelProgress,
    resetProgress
  };
}

export default useProgressTracking;