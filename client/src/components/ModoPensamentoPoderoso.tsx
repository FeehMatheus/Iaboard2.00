import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Crown, Zap, Target, CheckCircle, Clock, 
  AlertCircle, ArrowRight, Sparkles, Rocket
} from 'lucide-react';

interface ModoPensamentoPoderosoProps {
  open: boolean;
  onClose: () => void;
  onExecutionStart: (executionData: any) => void;
}

interface ExecutionStep {
  step: number;
  module: string;
  name: string;
  status: 'pending' | 'executing' | 'completed' | 'error';
  result?: any;
  error?: string;
  timestamp?: string;
}

export function ModoPensamentoPoderoso({ open, onClose, onExecutionStart }: ModoPensamentoPoderosoProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [estimatedValue, setEstimatedValue] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productType: '',
    targetAudience: '',
    budget: '',
    goals: '',
    niche: '',
    timeline: '30'
  });

  const productTypes = [
    'Curso Digital',
    'Ebook/Livro Digital',
    'Consultoria Online',
    'Software/App',
    'Membros/Comunidade',
    'Coaching/Mentoria',
    'Templates/Planilhas',
    'Webinar/Workshop'
  ];

  const audiences = [
    'Empreendedores',
    'Profissionais Liberais',
    'Estudantes',
    'Aposentados',
    'Mães Empreendedoras',
    'Jovens Adultos',
    'Executivos',
    'Freelancers'
  ];

  const executionPlan = [
    { step: 1, module: 'market-research', name: 'Pesquisa de Mercado IA', icon: Target },
    { step: 2, module: 'product-creation', name: 'Criação do Produto IA', icon: Brain },
    { step: 3, module: 'copywriting', name: 'Copywriting Persuasivo IA', icon: Sparkles },
    { step: 4, module: 'landing-page', name: 'Página de Vendas IA', icon: Rocket },
    { step: 5, module: 'video-creation', name: 'Vídeo de Vendas IA', icon: Zap },
    { step: 6, module: 'traffic-strategy', name: 'Estratégia de Tráfego IA', icon: Target },
    { step: 7, module: 'analytics-setup', name: 'Analytics e Métricas IA', icon: CheckCircle }
  ];

  const handleExecute = async () => {
    if (!formData.productType || !formData.targetAudience) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o tipo de produto e público-alvo.",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setExecutionSteps(executionPlan.map(step => ({ ...step, status: 'pending' })));
    setCurrentStep(0);

    try {
      const response = await fetch('/api/ai/pensamento-poderoso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to start Pensamento Poderoso execution');
      }

      const executionData = await response.json();
      
      if (executionData.success) {
        setEstimatedValue(executionData.estimatedValue);
        
        // Simulate real-time execution progress
        for (let i = 0; i < executionPlan.length; i++) {
          setCurrentStep(i);
          setExecutionSteps(prev => prev.map((step, index) => 
            index === i ? { ...step, status: 'executing' } : step
          ));

          // Simulate execution time
          await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

          const stepResult = executionData.results.find((r: any) => r.step === i + 1);
          
          setExecutionSteps(prev => prev.map((step, index) => 
            index === i ? { 
              ...step, 
              status: stepResult?.status === 'error' ? 'error' : 'completed',
              result: stepResult?.result,
              error: stepResult?.error,
              timestamp: new Date().toISOString()
            } : step
          ));

          toast({
            title: `${executionPlan[i].name} Concluído`,
            description: `Etapa ${i + 1} de ${executionPlan.length} finalizada com sucesso.`,
          });
        }

        onExecutionStart({
          executionId: executionData.executionId,
          results: executionData.results,
          estimatedValue: executionData.estimatedValue,
          nodes: executionPlan.map((step, index) => ({
            id: `auto-${step.module}`,
            type: step.module,
            title: step.name,
            content: executionData.results[index]?.result || {},
            position: { x: 100 + (index % 3) * 350, y: 100 + Math.floor(index / 3) * 250 },
            size: { width: 300, height: 200 },
            status: 'completed',
            progress: 100,
            connections: index > 0 ? [`auto-${executionPlan[index - 1].module}`] : []
          }))
        });

        toast({
          title: "Pensamento Poderoso™ Concluído!",
          description: `Projeto completo gerado. Valor estimado: ${executionData.estimatedValue}`,
        });

      } else {
        throw new Error(executionData.error || 'Execution failed');
      }

    } catch (error) {
      console.error('Pensamento Poderoso execution error:', error);
      toast({
        title: "Erro na Execução",
        description: "Não foi possível executar o Pensamento Poderoso. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'executing':
        return <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 via-black/95 to-blue-900/95 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl text-white">
            <Crown className="w-8 h-8 text-purple-400 mr-3" />
            Modo Pensamento Poderoso™
            <Badge className="ml-3 bg-purple-500/20 text-purple-300 border-purple-500/30">
              IA Automática
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isExecuting ? (
            <>
              {/* Configuration Form */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Configuração do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productType" className="text-gray-300">Tipo de Produto *</Label>
                      <Select value={formData.productType} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, productType: value }))
                      }>
                        <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                          <SelectValue placeholder="Selecione o tipo de produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="targetAudience" className="text-gray-300">Público-Alvo *</Label>
                      <Select value={formData.targetAudience} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, targetAudience: value }))
                      }>
                        <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                          <SelectValue placeholder="Selecione o público-alvo" />
                        </SelectTrigger>
                        <SelectContent>
                          {audiences.map(audience => (
                            <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-gray-300">Orçamento de Marketing</Label>
                      <Input
                        id="budget"
                        placeholder="Ex: R$ 5.000"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="niche" className="text-gray-300">Nicho Específico</Label>
                      <Input
                        id="niche"
                        placeholder="Ex: Marketing Digital"
                        value={formData.niche}
                        onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                        className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goals" className="text-gray-300">Objetivos do Projeto</Label>
                    <Textarea
                      id="goals"
                      placeholder="Descreva seus objetivos principais com este projeto..."
                      value={formData.goals}
                      onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                      className="bg-black/20 border-purple-500/30 text-white placeholder-gray-500 h-20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Execution Preview */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Plano de Execução Automática
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {executionPlan.map((step, index) => (
                      <div key={step.step} className="flex items-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {step.step}
                        </div>
                        <step.icon className="w-5 h-5 text-purple-400 mr-3" />
                        <span className="text-white font-medium">{step.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm">
                      ⚡ A IA executará todas as etapas automaticamente em aproximadamente {executionPlan.length * 2} minutos
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Execute Button */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleExecute}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  disabled={!formData.productType || !formData.targetAudience}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Iniciar Pensamento Poderoso™
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Execution Progress */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Executando Pensamento Poderoso™
                    </span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {Math.round(((currentStep + 1) / executionPlan.length) * 100)}% Concluído
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {executionSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-4 rounded-lg border ${
                        step.status === 'executing' 
                          ? 'bg-blue-500/20 border-blue-500/30' 
                          : step.status === 'completed'
                            ? 'bg-green-500/20 border-green-500/30'
                            : step.status === 'error'
                              ? 'bg-red-500/20 border-red-500/30'
                              : 'bg-gray-500/10 border-gray-500/20'
                      }`}
                    >
                      <div className="mr-4">
                        {getStepIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{step.name}</h4>
                        {step.status === 'executing' && (
                          <p className="text-blue-400 text-sm">Processando com IA...</p>
                        )}
                        {step.status === 'completed' && (
                          <p className="text-green-400 text-sm">✅ Concluído com sucesso</p>
                        )}
                        {step.status === 'error' && (
                          <p className="text-red-400 text-sm">❌ {step.error}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {estimatedValue && (
                    <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <h4 className="text-purple-300 font-medium mb-2">💰 Valor Estimado do Projeto:</h4>
                      <p className="text-2xl font-bold text-purple-400">{estimatedValue}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}