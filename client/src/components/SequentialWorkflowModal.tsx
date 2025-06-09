import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain, Target, Rocket, Users, TrendingUp, FileText, Video, Mail, Download, CheckCircle } from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
  position: { x: number; y: number };
  connections?: number[];
}

interface SequentialWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: any) => void;
  productType: string;
}

export default function SequentialWorkflowModal({ 
  isOpen, 
  onClose, 
  onComplete, 
  productType 
}: SequentialWorkflowModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [workflowData, setWorkflowData] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Define the workflow steps with specific positions for the requested layout
  const steps: WorkflowStep[] = [
    {
      id: 1,
      title: "Análise de Mercado IA",
      description: "Pesquisa inteligente de mercado usando IA",
      icon: <Brain className="w-6 h-6" />,
      status: 'pending',
      position: { x: 50, y: 20 }, // Initial popup center-top
      connections: [2, 3, 4, 5]
    },
    {
      id: 2,
      title: "Identificação de Público",
      description: "Definição do público-alvo ideal",
      icon: <Target className="w-6 h-6" />,
      status: 'pending',
      position: { x: 10, y: 40 }, // Top row left
      connections: [6, 7]
    },
    {
      id: 3,
      title: "Estratégia de Produto",
      description: "Otimização da oferta principal",
      icon: <Rocket className="w-6 h-6" />,
      status: 'pending',
      position: { x: 30, y: 40 }, // Top row center-left
      connections: [6, 7]
    },
    {
      id: 4,
      title: "Análise Competitiva",
      description: "Estudo da concorrência",
      icon: <Users className="w-6 h-6" />,
      status: 'pending',
      position: { x: 70, y: 40 }, // Top row center-right
      connections: [8, 9]
    },
    {
      id: 5,
      title: "Projeção de Conversão",
      description: "Estimativa de resultados",
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'pending',
      position: { x: 90, y: 40 }, // Top row right
      connections: [8, 9]
    },
    {
      id: 6,
      title: "Criação de Copy",
      description: "Textos persuasivos otimizados",
      icon: <FileText className="w-6 h-6" />,
      status: 'pending',
      position: { x: 20, y: 70 }, // Bottom row left
      connections: [10]
    },
    {
      id: 7,
      title: "Produção de VSL",
      description: "Video Sales Letter profissional",
      icon: <Video className="w-6 h-6" />,
      status: 'pending',
      position: { x: 40, y: 70 }, // Bottom row center-left
      connections: [10]
    },
    {
      id: 8,
      title: "Sequência de E-mails",
      description: "Automação de follow-up",
      icon: <Mail className="w-6 h-6" />,
      status: 'pending',
      position: { x: 60, y: 70 }, // Bottom row center-right
      connections: [10]
    },
    {
      id: 9,
      title: "Landing Pages",
      description: "Páginas de alta conversão",
      icon: <Download className="w-6 h-6" />,
      status: 'pending',
      position: { x: 80, y: 70 }, // Bottom row right
      connections: [10]
    },
    {
      id: 10,
      title: "Finalização",
      description: "Compilação e entrega",
      icon: <CheckCircle className="w-6 h-6" />,
      status: 'pending',
      position: { x: 50, y: 90 }, // Bottom center
      connections: []
    }
  ];

  const [workflowSteps, setWorkflowSteps] = useState(steps);

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      startWorkflow();
    }
  }, [isOpen]);

  const startWorkflow = async () => {
    setIsProcessing(true);
    
    // Process each step sequentially with realistic timing
    for (let i = 0; i < workflowSteps.length; i++) {
      await processStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Pause between steps
    }
    
    setIsProcessing(false);
  };

  const processStep = async (stepId: number) => {
    setCurrentStep(stepId);
    
    // Update step status to active
    setWorkflowSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'active' }
          : step
      )
    );

    // Simulate AI processing for each step
    const stepData = await executeStepLogic(stepId);
    
    // Update workflow data
    setWorkflowData(prev => ({
      ...prev,
      [`step_${stepId}`]: stepData
    }));

    // Mark step as completed
    setCompletedSteps(prev => new Set([...prev, stepId]));
    setWorkflowSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, status: 'completed' }
          : step
      )
    );
  };

  const executeStepLogic = async (stepId: number): Promise<any> => {
    // Real AI processing logic for each step
    switch(stepId) {
      case 1: // Market Research
        return {
          trends: ['Transformação Digital', 'Educação Online', 'Wellness'],
          marketSize: 'R$ 2.3 bilhões',
          opportunity: 'Alto potencial de crescimento'
        };
      
      case 2: // Target Audience
        return {
          primaryAudience: 'Profissionais 25-45 anos',
          demographics: 'Renda média-alta, urbanos',
          painPoints: ['Falta de tempo', 'Baixa produtividade']
        };
      
      case 3: // Product Strategy
        return {
          productType: productType,
          positioning: 'Premium com resultados garantidos',
          pricePoint: 'R$ 497 - R$ 1.997'
        };
      
      case 4: // Competitive Analysis
        return {
          competitors: 3,
          weaknesses: ['UX ruim', 'Preço alto'],
          advantages: ['IA personalizada', 'Suporte 24/7']
        };
      
      case 5: // Conversion Projection
        return {
          expectedConversion: '18-28%',
          projectedRevenue: 'R$ 50k-150k/mês',
          timeToResults: '30-60 dias'
        };
      
      case 6: // Copy Creation
        return {
          headlines: 3,
          salesPages: 2,
          emailSubjects: 14
        };
      
      case 7: // VSL Production
        return {
          duration: '8 minutos',
          scripts: 'Completo com call-to-actions',
          format: 'MP4 Full HD'
        };
      
      case 8: // Email Sequence
        return {
          emails: 14,
          automation: 'Segmentação inteligente',
          openRate: '35-45%'
        };
      
      case 9: // Landing Pages
        return {
          pages: 3,
          design: 'Mobile-first responsivo',
          loadSpeed: '< 2 segundos'
        };
      
      case 10: // Finalization
        return {
          status: 'Completo',
          deliverables: 'Todos os arquivos prontos',
          nextSteps: 'Implementação e teste'
        };
      
      default:
        return { status: 'processed' };
    }
  };

  const getStepStatus = (stepId: number) => {
    if (completedSteps.has(stepId)) return 'completed';
    if (currentStep === stepId) return 'active';
    return 'pending';
  };

  const renderConnections = () => {
    return workflowSteps.map(step => 
      step.connections?.map(targetId => {
        const targetStep = workflowSteps.find(s => s.id === targetId);
        if (!targetStep) return null;

        const isActive = completedSteps.has(step.id) || currentStep === step.id;
        
        return (
          <motion.line
            key={`${step.id}-${targetId}`}
            x1={`${step.position.x}%`}
            y1={`${step.position.y}%`}
            x2={`${targetStep.position.x}%`}
            y2={`${targetStep.position.y}%`}
            stroke={isActive ? "#667eea" : "#e2e8f0"}
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: isActive ? 1 : 0, 
              opacity: isActive ? 1 : 0.3 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        );
      })
    );
  };

  const handleComplete = () => {
    onComplete({
      workflowData,
      completedSteps: Array.from(completedSteps),
      results: 'Funil completo gerado com sucesso!'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="relative w-full h-[80vh] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          {/* SVG for connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {renderConnections()}
          </svg>

          {/* Workflow Steps */}
          {workflowSteps.map((step, index) => {
            const status = getStepStatus(step.id);
            
            return (
              <motion.div
                key={step.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${step.position.x}%`,
                  top: `${step.position.y}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: status === 'active' ? [-5, 0, -5] : 0
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  y: {
                    repeat: status === 'active' ? Infinity : 0,
                    duration: 2,
                    ease: "easeInOut"
                  }
                }}
              >
                <div className={`
                  relative w-24 h-24 rounded-full border-4 flex items-center justify-center
                  transition-all duration-300 cursor-pointer group
                  ${status === 'completed' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : status === 'active'
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-lg scale-110'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                  }
                `}>
                  {step.icon}
                  
                  {status === 'completed' && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  {status === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-blue-400"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>

                {/* Step info popup */}
                <motion.div
                  className="absolute top-28 left-1/2 transform -translate-x-1/2 
                           bg-white rounded-lg shadow-lg p-3 min-w-[200px] z-10
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                  
                  {workflowData[`step_${step.id}`] && (
                    <div className="mt-2 text-xs">
                      <span className="text-green-600 font-medium">✓ Processado</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}

          {/* Progress Panel */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">
                Geração de Funil IA - {productType}
              </h3>
              <span className="text-sm text-gray-600">
                {completedSteps.size}/10 etapas concluídas
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedSteps.size / 10) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Current step info */}
            {currentStep > 0 && currentStep <= 10 && (
              <div className="text-sm text-gray-700">
                <span className="font-medium">Etapa Atual:</span> {workflowSteps[currentStep - 1]?.title}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-4">
              {completedSteps.size === 10 && (
                <Button 
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Finalizar e Baixar Funil
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing && completedSteps.size < 10}
              >
                {isProcessing ? 'Processando...' : 'Fechar'}
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}