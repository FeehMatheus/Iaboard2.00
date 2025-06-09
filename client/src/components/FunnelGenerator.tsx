import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, Sparkles, Target, TrendingUp } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FunnelGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (funnel: any) => void;
}

export default function FunnelGenerator({ isOpen, onClose, onComplete }: FunnelGeneratorProps) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFunnel, setGeneratedFunnel] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productType: '',
    targetAudience: '',
    mainGoal: '',
    budget: '',
    timeline: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateFunnel = async () => {
    if (!formData.productType || !formData.targetAudience || !formData.mainGoal) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha produto, público-alvo e objetivo principal",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setStep(2);

    try {
      const response = await apiRequest('POST', '/api/funnels/generate', formData);
      const data = await response.json();
      
      setGeneratedFunnel(data.generatedContent);
      setStep(3);
      
      toast({
        title: "Funil gerado com sucesso!",
        description: "Sua estratégia completa está pronta"
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Erro na geração",
        description: "Tente novamente em alguns segundos",
        variant: "destructive"
      });
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFunnel = async (format: string) => {
    if (!generatedFunnel) return;

    try {
      const response = await fetch(`/api/funnels/${generatedFunnel.id}/download/${format}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedFunnel.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download concluído",
        description: `Funil baixado como ${format.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    if (generatedFunnel) {
      onComplete(generatedFunnel);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50 p-6 border shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Gerador de Funis IA
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productType">Tipo de Produto/Serviço *</Label>
                <Input
                  id="productType"
                  placeholder="Ex: Curso online, Consultoria, E-book..."
                  value={formData.productType}
                  onChange={(e) => handleInputChange('productType', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="targetAudience">Público-alvo *</Label>
                <Input
                  id="targetAudience"
                  placeholder="Ex: Empreendedores, Estudantes..."
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mainGoal">Objetivo Principal *</Label>
              <Textarea
                id="mainGoal"
                placeholder="Ex: Aumentar vendas do meu curso de marketing digital..."
                value={formData.mainGoal}
                onChange={(e) => handleInputChange('mainGoal', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Orçamento (opcional)</Label>
                <Input
                  id="budget"
                  placeholder="Ex: R$ 5.000 - R$ 20.000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="timeline">Prazo (opcional)</Label>
                <Input
                  id="timeline"
                  placeholder="Ex: 30 dias, 3 meses..."
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                />
              </div>
            </div>

            <Button onClick={generateFunnel} className="w-full" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Funil com IA
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            <h3 className="text-xl font-semibold">Gerando seu funil...</h3>
            <p className="text-muted-foreground text-center">
              Nossa IA está criando uma estratégia personalizada para {formData.productType}
            </p>
          </div>
        )}

        {step === 3 && generatedFunnel && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-green-600">Funil Gerado com Sucesso!</h3>
              <p className="text-muted-foreground">
                Sua estratégia completa está pronta para uso
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {generatedFunnel.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{generatedFunnel.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Etapas do Funil:</h4>
                    <div className="grid gap-2">
                      {generatedFunnel.steps?.map((step: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Badge variant="outline">{step.stepNumber}</Badge>
                          <span className="font-medium">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      Conversão estimada: <strong>{generatedFunnel.estimatedConversion}</strong>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => downloadFunnel('html')} 
                variant="outline" 
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar HTML
              </Button>
              <Button 
                onClick={handleComplete} 
                className="flex-1"
              >
                Usar Funil
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}