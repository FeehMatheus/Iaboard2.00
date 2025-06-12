import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/ActionButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Brain, MessageCircle, TrendingUp, Target, Clock, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CoachingResponse {
  answer: string;
  actionPlan: Array<{
    step: number;
    action: string;
    timeframe: string;
    difficulty: string;
  }>;
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  followUpQuestions: string[];
}

export function AICoach() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<CoachingResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const askCoach = async () => {
    try {
      const result = await apiRequest('/api/ai/coaching', {
        method: 'POST',
        body: {
          question,
          context: 'digital marketing',
          userLevel: 'intermediate'
        }
      });
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao consultar coach IA' 
      };
    }
  };

  const handleSuccess = (result: any) => {
    setResponse(result.data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Coach IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Coach IA Especialista
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Faça sua pergunta para o Coach IA
              </label>
              <Textarea
                placeholder="Ex: Como posso aumentar a conversão da minha landing page? Minha taxa atual é 2.5%..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <ActionButton
              label="Consultar Coach IA"
              loadingLabel="Analisando situação"
              successLabel="Análise concluída!"
              action={askCoach}
              onSuccess={handleSuccess}
              disabled={!question.trim()}
              className="w-full"
            />
          </div>

          {response && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Resposta do Coach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{response.answer}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Plano de Ação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {response.actionPlan.map((step) => (
                      <div key={step.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{step.action}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {step.timeframe}
                            </Badge>
                            <Badge 
                              variant={step.difficulty === 'Fácil' ? 'default' : 
                                     step.difficulty === 'Médio' ? 'secondary' : 'destructive'}
                            >
                              {step.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recursos Recomendados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {response.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{resource.title}</h4>
                          <Badge variant="outline" className="mt-1">
                            {resource.type}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Acessar
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perguntas para Aprofundar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {response.followUpQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 text-left"
                        onClick={() => setQuestion(question)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}