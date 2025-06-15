import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Video,
  FileText,
  Brain,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Rocket,
  Lightbulb
} from 'lucide-react';


interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (workflowData: any) => void;
}

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao IA Board',
    subtitle: 'Sua plataforma completa de marketing digital com IA'
  },
  {
    id: 'goal-selection',
    title: 'Qual é seu objetivo principal?',
    subtitle: 'Escolha o que você quer criar primeiro'
  },
  {
    id: 'project-details',
    title: 'Conte-nos sobre seu projeto',
    subtitle: 'Essas informações nos ajudarão a personalizar sua experiência'
  },
  {
    id: 'workflow-creation',
    title: 'Criando seu primeiro workflow',
    subtitle: 'Vamos configurar tudo automaticamente para você'
  },
  {
    id: 'completion',
    title: 'Tudo pronto!',
    subtitle: 'Seu workspace está configurado e pronto para usar'
  }
];

const GOAL_OPTIONS = [
  {
    id: 'marketing-campaign',
    title: 'Campanha de Marketing',
    description: 'Criar uma estratégia completa de marketing digital',
    icon: Target,
    modules: ['market-research', 'audience-analysis', 'content-creation', 'video-ads']
  },
  {
    id: 'video-content',
    title: 'Conteúdo em Vídeo',
    description: 'Produzir vídeos profissionais para redes sociais',
    icon: Video,
    modules: ['video-generation', 'script-writing', 'thumbnail-creation']
  },
  {
    id: 'copywriting',
    title: 'Copywriting & Vendas',
    description: 'Criar textos persuasivos e páginas de vendas',
    icon: FileText,
    modules: ['sales-copy', 'email-sequences', 'landing-pages']
  },
  {
    id: 'business-strategy',
    title: 'Estratégia de Negócio',
    description: 'Desenvolver planos de negócio e análises de mercado',
    icon: TrendingUp,
    modules: ['business-plan', 'market-analysis', 'competitor-research']
  }
];

export const OnboardingWizard = ({ isOpen, onClose, onComplete }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    targetAudience: '',
    industry: '',
    budget: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Remove useReactFlow hook - not needed for onboarding

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleGoalSelection = useCallback((goalId: string) => {
    setSelectedGoal(goalId);
    setTimeout(handleNext, 300);
  }, [handleNext]);

  const handleProjectDataChange = useCallback((field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  }, []);

  const createWorkflow = useCallback(async () => {
    setIsCreating(true);
    
    try {
      const selectedGoalData = GOAL_OPTIONS.find(goal => goal.id === selectedGoal);
      if (!selectedGoalData) return;

      // Create nodes based on selected goal
      const nodes = selectedGoalData.modules.map((module, index) => ({
        id: `node-${index}`,
        type: getNodeTypeForModule(module),
        position: { x: 250 * index, y: 100 },
        data: {
          label: getModuleLabel(module),
          prompt: getDefaultPrompt(module, projectData),
          ...getModuleDefaults(module)
        }
      }));

      // Create edges to connect the workflow
      const edges = nodes.slice(0, -1).map((_, index) => ({
        id: `edge-${index}`,
        source: `node-${index}`,
        target: `node-${index + 1}`,
        animated: true,
        style: { stroke: '#667eea' }
      }));

      // Complete onboarding
      onComplete({
        goal: selectedGoal,
        projectData,
        workflowNodes: nodes.length,
        createdAt: new Date().toISOString(),
        generatedNodes: nodes,
        generatedEdges: edges
      });

      setTimeout(handleNext, 1000);
    } catch (error) {
      console.error('Error creating workflow:', error);
    } finally {
      setIsCreating(false);
    }
  }, [selectedGoal, projectData, onComplete, handleNext]);

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo ao futuro do marketing digital
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Com o IA Board, você pode criar campanhas profissionais, gerar vídeos incríveis e 
          desenvolver estratégias de marketing usando o poder da inteligência artificial.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center">
          <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">IA Avançada</p>
        </div>
        <div className="text-center">
          <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Vídeos Profissionais</p>
        </div>
        <div className="text-center">
          <Rocket className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Resultados Rápidos</p>
        </div>
      </div>
    </div>
  );

  const renderGoalSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-300">
          Escolha seu objetivo para criarmos o workflow perfeito para você
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOAL_OPTIONS.map((goal) => {
          const IconComponent = goal.icon;
          return (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                selectedGoal === goal.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              onClick={() => handleGoalSelection(goal.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {goal.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {goal.modules.slice(0, 3).map((module) => (
                    <Badge key={module} variant="secondary" className="text-xs">
                      {getModuleLabel(module)}
                    </Badge>
                  ))}
                  {goal.modules.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{goal.modules.length - 3} mais
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderProjectDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-300">
          Vamos personalizar a experiência para suas necessidades específicas
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project-name">Nome do Projeto</Label>
          <Input
            id="project-name"
            placeholder="Ex: Campanha Verão 2024"
            value={projectData.name}
            onChange={(e) => handleProjectDataChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Setor/Indústria</Label>
          <Input
            id="industry"
            placeholder="Ex: E-commerce, Saúde, Educação"
            value={projectData.industry}
            onChange={(e) => handleProjectDataChange('industry', e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descrição do Projeto</Label>
          <Textarea
            id="description"
            placeholder="Descreva brevemente o que você quer alcançar..."
            value={projectData.description}
            onChange={(e) => handleProjectDataChange('description', e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target-audience">Público-Alvo</Label>
          <Input
            id="target-audience"
            placeholder="Ex: Jovens 18-35 anos, Empresários"
            value={projectData.targetAudience}
            onChange={(e) => handleProjectDataChange('targetAudience', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Orçamento Estimado</Label>
          <Input
            id="budget"
            placeholder="Ex: R$ 10.000 - R$ 50.000"
            value={projectData.budget}
            onChange={(e) => handleProjectDataChange('budget', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderWorkflowCreation = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          {isCreating ? (
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Rocket className="w-10 h-10 text-white" />
          )}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isCreating ? 'Criando seu workflow...' : 'Pronto para começar!'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          {isCreating 
            ? 'Estamos configurando todos os módulos de IA personalizados para seu projeto.'
            : 'Vamos criar um workflow completo baseado nas suas preferências.'
          }
        </p>
      </div>
      {selectedGoal && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Objetivo selecionado:</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {GOAL_OPTIONS.find(g => g.id === selectedGoal)?.title}
          </div>
          {projectData.name && (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1">Projeto:</div>
              <div className="font-medium text-gray-900 dark:text-white">{projectData.name}</div>
            </>
          )}
        </div>
      )}
      {!isCreating && (
        <Button onClick={createWorkflow} size="lg" className="mt-6">
          <Play className="w-5 h-5 mr-2" />
          Criar Workflow
        </Button>
      )}
    </div>
  );

  const renderCompletion = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Parabéns! Seu workspace está pronto
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Seu workflow foi criado com sucesso. Agora você pode começar a gerar conteúdo 
          profissional com inteligência artificial.
        </p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
        <div className="text-green-800 dark:text-green-200 font-medium mb-2">
          O que você pode fazer agora:
        </div>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
          <li>• Executar módulos de IA individuais</li>
          <li>• Gerar vídeos profissionais</li>
          <li>• Criar conteúdo de marketing</li>
          <li>• Analisar resultados em tempo real</li>
        </ul>
      </div>
      <Button onClick={onClose} size="lg" className="mt-6">
        <Sparkles className="w-5 h-5 mr-2" />
        Começar a Criar
      </Button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'welcome':
        return renderWelcomeStep();
      case 'goal-selection':
        return renderGoalSelection();
      case 'project-details':
        return renderProjectDetails();
      case 'workflow-creation':
        return renderWorkflowCreation();
      case 'completion':
        return renderCompletion();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStepData.id) {
      case 'welcome':
        return true;
      case 'goal-selection':
        return selectedGoal !== null;
      case 'project-details':
        return projectData.name.trim() !== '';
      case 'workflow-creation':
        return false; // Handled by the create button
      case 'completion':
        return false; // Final step
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStepData.title}
          </DialogTitle>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {currentStepData.subtitle}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Passo {currentStep + 1} de {ONBOARDING_STEPS.length}</span>
              <span>{Math.round(progress)}% completo</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px] flex items-center justify-center">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentStep < ONBOARDING_STEPS.length - 1 && currentStepData.id !== 'workflow-creation' && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions
function getNodeTypeForModule(module: string): string {
  const nodeTypeMap: Record<string, string> = {
    'market-research': 'aiModule',
    'audience-analysis': 'aiModule',
    'content-creation': 'aiModule',
    'video-ads': 'pikaVideo',
    'video-generation': 'pikaVideo',
    'script-writing': 'aiModule',
    'thumbnail-creation': 'aiModule',
    'sales-copy': 'aiModule',
    'email-sequences': 'aiModule',
    'landing-pages': 'aiModule',
    'business-plan': 'aiModule',
    'market-analysis': 'aiModule',
    'competitor-research': 'aiModule'
  };
  return nodeTypeMap[module] || 'aiModule';
}

function getModuleLabel(module: string): string {
  const labelMap: Record<string, string> = {
    'market-research': 'Pesquisa de Mercado',
    'audience-analysis': 'Análise de Público',
    'content-creation': 'Criação de Conteúdo',
    'video-ads': 'Vídeos Publicitários',
    'video-generation': 'Geração de Vídeo',
    'script-writing': 'Roteiro',
    'thumbnail-creation': 'Thumbnail',
    'sales-copy': 'Copy de Vendas',
    'email-sequences': 'Sequência de E-mails',
    'landing-pages': 'Landing Page',
    'business-plan': 'Plano de Negócio',
    'market-analysis': 'Análise de Mercado',
    'competitor-research': 'Pesquisa de Concorrentes'
  };
  return labelMap[module] || module;
}

function getDefaultPrompt(module: string, projectData: any): string {
  const { name, description, targetAudience, industry } = projectData;
  const baseContext = `Projeto: ${name}. Público: ${targetAudience}. Setor: ${industry}. ${description}`;
  
  const promptMap: Record<string, string> = {
    'market-research': `Faça uma pesquisa completa de mercado para ${baseContext}`,
    'audience-analysis': `Analise detalhadamente o público-alvo para ${baseContext}`,
    'content-creation': `Crie conteúdo estratégico para ${baseContext}`,
    'video-ads': `Gere um vídeo publicitário profissional para ${baseContext}`,
    'video-generation': `Crie um vídeo promocional para ${baseContext}`,
    'script-writing': `Escreva um roteiro envolvente para ${baseContext}`,
    'sales-copy': `Desenvolva uma copy de vendas persuasiva para ${baseContext}`,
    'business-plan': `Elabore um plano de negócio detalhado para ${baseContext}`
  };
  
  return promptMap[module] || `Desenvolva uma estratégia para ${baseContext}`;
}

function getModuleDefaults(module: string): any {
  if (module.includes('video')) {
    return {
      aspectRatio: '16:9',
      style: 'cinematic',
      duration: 10
    };
  }
  return {};
}