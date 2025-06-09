import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { selectBestAIProvider } from '@/lib/ai-services';

interface GenerationStep {
  step: number;
  title: string;
  description: string;
  status: string;
  completed: boolean;
  data?: any;
}

const stepDefinitions = [
  { title: "Definindo Nicho", description: "IA está analisando mercado e identificando oportunidades...", status: "Analisando tendências de mercado..." },
  { title: "Criando Avatar", description: "Desenvolvendo persona detalhada do cliente ideal...", status: "Definindo características demográficas..." },
  { title: "Gerando Oferta", description: "Criando proposta irresistível personalizada...", status: "Calculando proposta de valor..." },
  { title: "Criando Página de Vendas", description: "Desenvolvendo landing page otimizada...", status: "Estruturando elementos de conversão..." },
  { title: "Criando Produto", description: "Estruturando produto digital/físico...", status: "Definindo especificações do produto..." },
  { title: "Gerando Copy & Headlines", description: "Criando textos persuasivos de alta conversão...", status: "Otimizando headlines para conversão..." },
  { title: "Criando Roteiro de Vídeo", description: "Desenvolvendo script completo para apresentação...", status: "Estruturando narrativa do vídeo..." },
  { title: "Gerando Campanha de Tráfego", description: "Criando estratégia completa de marketing...", status: "Definindo segmentação e orçamento..." }
];

export function useAIGeneration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<GenerationStep[]>(
    stepDefinitions.map((step, index) => ({
      step: index + 1,
      ...step,
      completed: false
    }))
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [funnelId, setFunnelId] = useState<number | null>(null);
  const [productType, setProductType] = useState<string>('');
  const [completedData, setCompletedData] = useState<any>({});

  const queryClient = useQueryClient();

  const generateContentMutation = useMutation({
    mutationFn: async ({ step, funnelId, productType, previousSteps }: {
      step: number;
      funnelId: number;
      productType: string;
      previousSteps: any;
    }) => {
      const aiProvider = selectBestAIProvider(step);
      const response = await apiRequest('POST', '/api/ai/generate', {
        step,
        funnelId,
        productType,
        previousSteps,
        aiProvider,
        prompt: `Generate content for step ${step}`
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update completed data
      const newCompletedData = { ...completedData };
      newCompletedData[variables.step] = JSON.parse(data.content);
      setCompletedData(newCompletedData);

      // Mark step as completed
      setSteps(prev => prev.map(step => 
        step.step === variables.step 
          ? { ...step, completed: true, data: JSON.parse(data.content) }
          : step
      ));

      // Update funnel in backend
      apiRequest('PATCH', `/api/funnels/${variables.funnelId}/step`, {
        currentStep: variables.step,
        stepData: { [variables.step]: JSON.parse(data.content) }
      });
    },
    onError: (error) => {
      console.error('Generation error:', error);
    }
  });

  const createFunnelMutation = useMutation({
    mutationFn: async ({ name, productType }: { name: string; productType: string }) => {
      const response = await apiRequest('POST', '/api/funnels', {
        name,
        productType,
        userId: null // For now, not implementing user auth
      });
      return response.json();
    },
    onSuccess: (funnel) => {
      setFunnelId(funnel.id);
      queryClient.invalidateQueries({ queryKey: ['/api/funnels'] });
    }
  });

  const startGeneration = useCallback(async (selectedProductType: string) => {
    setIsProcessing(true);
    setProductType(selectedProductType);
    setCurrentStep(0);
    
    // Create funnel first
    const funnelName = `Funil ${selectedProductType} - ${new Date().toLocaleDateString('pt-BR')}`;
    
    try {
      await createFunnelMutation.mutateAsync({
        name: funnelName,
        productType: selectedProductType
      });
    } catch (error) {
      console.error('Failed to create funnel:', error);
      setIsProcessing(false);
      return;
    }
  }, [createFunnelMutation]);

  const processNextStep = useCallback(async () => {
    if (!funnelId || currentStep >= steps.length) {
      setIsProcessing(false);
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    try {
      await generateContentMutation.mutateAsync({
        step: nextStep,
        funnelId,
        productType,
        previousSteps: completedData
      });

      // Auto-proceed to next step after a delay
      setTimeout(() => {
        if (nextStep < steps.length) {
          processNextStep();
        } else {
          setIsProcessing(false);
        }
      }, 2000);

    } catch (error) {
      console.error('Failed to generate content for step:', nextStep, error);
      setIsProcessing(false);
    }
  }, [currentStep, funnelId, productType, completedData, generateContentMutation, steps.length]);

  const resetGeneration = useCallback(() => {
    setCurrentStep(0);
    setSteps(stepDefinitions.map((step, index) => ({
      step: index + 1,
      ...step,
      completed: false
    })));
    setIsProcessing(false);
    setFunnelId(null);
    setProductType('');
    setCompletedData({});
  }, []);

  return {
    steps,
    currentStep,
    isProcessing,
    funnelId,
    productType,
    completedData,
    startGeneration,
    processNextStep,
    resetGeneration,
    isGenerating: generateContentMutation.isPending
  };
}
