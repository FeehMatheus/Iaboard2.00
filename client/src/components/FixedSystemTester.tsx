import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Zap, Video, Edit, Brain } from 'lucide-react';

interface TestResult {
  success: boolean;
  content?: string;
  error?: string;
  provider?: string;
  tokens?: number;
  videoUrl?: string;
  suggestions?: string[];
  nextSteps?: string[];
}

export function FixedSystemTester() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [userIdea, setUserIdea] = useState('Criar um curso online de programação Python para iniciantes que querem mudar de carreira');
  const [videoPrompt, setVideoPrompt] = useState('Programador experiente explicando conceitos básicos de Python de forma didática');
  const [contentType, setContentType] = useState('copy');

  const runTest = async (testName: string, endpoint: string, payload: any) => {
    setActiveTest(testName);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      setResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        } 
      }));
    }
    setActiveTest(null);
  };

  const testDirectLLM = () => {
    runTest('directLLM', '/api/direct-llm/generate', {
      prompt: 'Crie uma estratégia de marketing para cursos online de programação',
      model: 'mistral-large',
      maxTokens: 200
    });
  };

  const testAuthenticContent = () => {
    runTest('authenticContent', '/api/content/authentic', {
      userIdea,
      contentType,
      targetAudience: 'pessoas que querem mudar de carreira',
      businessType: 'educação online',
      goals: ['aumentar vendas', 'engajar audiência'],
      specificRequirements: 'Foco em resultados práticos e transformação de carreira'
    });
  };

  const testRealVideo = () => {
    runTest('realVideo', '/api/video/generate-real', {
      prompt: videoPrompt,
      aspectRatio: '16:9',
      duration: 5,
      style: 'realistic'
    });
  };

  const testIAModule = () => {
    runTest('iaModule', '/api/ia-modules-authentic/ia-copy', {
      userIdea,
      prompt: 'Crie copy persuasivo baseado na ideia do usuário',
      parameters: {
        audience: 'profissionais que querem transição de carreira',
        businessType: 'educação online'
      }
    });
  };

  const getStatusIcon = (testName: string) => {
    if (activeTest === testName) return <Clock className="w-4 h-4 animate-spin" />;
    const result = results[testName];
    if (!result) return null;
    return result.success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getResultBadge = (testName: string) => {
    const result = results[testName];
    if (!result) return null;
    return (
      <Badge variant={result.success ? "default" : "destructive"}>
        {result.success ? "FUNCIONANDO" : "ERRO"}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Testes do Sistema IA Board Corrigido</h1>
        <p className="text-gray-300">Validação dos três problemas principais resolvidos</p>
      </div>

      {/* Configurações de Teste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Configuração de Conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Sua Ideia de Negócio:</label>
              <Textarea
                value={userIdea}
                onChange={(e) => setUserIdea(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm">Tipo de Conteúdo:</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copy">Copywriting</SelectItem>
                  <SelectItem value="strategy">Estratégia</SelectItem>
                  <SelectItem value="product">Produto</SelectItem>
                  <SelectItem value="video-script">Roteiro de Vídeo</SelectItem>
                  <SelectItem value="funnel">Funil de Vendas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Configuração de Vídeo</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-gray-300 text-sm">Prompt do Vídeo:</label>
              <Textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testes dos Problemas Corrigidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Problema 1: Alternativa ao OpenRouter */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Problema 1: LLM Direto (Sem OpenRouter)
              {getResultBadge('directLLM')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Sistema usando Mistral AI diretamente, evitando problemas de créditos do OpenRouter.
            </p>
            <Button 
              onClick={testDirectLLM}
              disabled={activeTest === 'directLLM'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {getStatusIcon('directLLM')}
              Testar LLM Direto
            </Button>
            {results.directLLM && (
              <Alert className="bg-gray-700 border-gray-600">
                <AlertDescription className="text-gray-300">
                  {results.directLLM.success ? (
                    <div>
                      <strong>Sucesso!</strong> Gerou {results.directLLM.tokens} tokens via {results.directLLM.provider}
                      <br />
                      <span className="text-xs">{results.directLLM.content?.substring(0, 100)}...</span>
                    </div>
                  ) : (
                    <span className="text-red-400">{results.directLLM.error}</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Problema 2: Geração de Vídeo Real */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-green-400" />
              Problema 2: Vídeo IA Funcional
              {getResultBadge('realVideo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Geração real de vídeos usando Stability AI com polling automático.
            </p>
            <Button 
              onClick={testRealVideo}
              disabled={activeTest === 'realVideo'}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {getStatusIcon('realVideo')}
              Testar Geração de Vídeo
            </Button>
            {results.realVideo && (
              <Alert className="bg-gray-700 border-gray-600">
                <AlertDescription className="text-gray-300">
                  {results.realVideo.success ? (
                    <div>
                      <strong>Sucesso!</strong> 
                      {results.realVideo.videoUrl ? (
                        <div>
                          Vídeo gerado: <a href={results.realVideo.videoUrl} className="text-blue-400 underline">Ver vídeo</a>
                        </div>
                      ) : (
                        'Processando vídeo...'
                      )}
                    </div>
                  ) : (
                    <span className="text-red-400">{results.realVideo.error}</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Problema 3: Conteúdo Autêntico */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-purple-400" />
              Problema 3: Conteúdo Baseado na Sua Ideia
              {getResultBadge('authenticContent')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Geração de conteúdo real e específico baseado na sua ideia, não genérico.
            </p>
            <Button 
              onClick={testAuthenticContent}
              disabled={activeTest === 'authenticContent'}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {getStatusIcon('authenticContent')}
              Testar Conteúdo Autêntico
            </Button>
            {results.authenticContent && (
              <Alert className="bg-gray-700 border-gray-600">
                <AlertDescription className="text-gray-300">
                  {results.authenticContent.success ? (
                    <div>
                      <strong>Sucesso!</strong> Conteúdo baseado em: "{results.authenticContent.basedOnIdea?.substring(0, 50)}..."
                      <br />
                      <span className="text-xs">{results.authenticContent.content?.substring(0, 100)}...</span>
                      {results.authenticContent.suggestions && results.authenticContent.suggestions.length > 0 && (
                        <div className="mt-2">
                          <strong>Sugestões:</strong> {results.authenticContent.suggestions.slice(0, 2).join(', ')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-red-400">{results.authenticContent.error}</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Módulo IA Integrado */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-400" />
              Módulo IA Integrado
              {getResultBadge('iaModule')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Teste do módulo IA Copy usando os sistemas corrigidos.
            </p>
            <Button 
              onClick={testIAModule}
              disabled={activeTest === 'iaModule'}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {getStatusIcon('iaModule')}
              Testar Módulo IA
            </Button>
            {results.iaModule && (
              <Alert className="bg-gray-700 border-gray-600">
                <AlertDescription className="text-gray-300">
                  {results.iaModule.success ? (
                    <div>
                      <strong>Sucesso!</strong> Módulo {results.iaModule.moduleType} executado
                      <br />
                      <span className="text-xs">{results.iaModule.result?.substring(0, 100)}...</span>
                    </div>
                  ) : (
                    <span className="text-red-400">{results.iaModule.error}</span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo dos Testes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Status dos Problemas Corrigidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'directLLM', name: 'LLM Direto', problem: 'OpenRouter sem créditos' },
              { key: 'realVideo', name: 'Vídeo Real', problem: 'Geração não funcionava' },
              { key: 'authenticContent', name: 'Conteúdo Autêntico', problem: 'Conteúdo fake/genérico' },
              { key: 'iaModule', name: 'Módulo Integrado', problem: 'Execução com erros' }
            ].map(test => (
              <div key={test.key} className="text-center space-y-2">
                <div className="text-2xl">
                  {getStatusIcon(test.key) || <Clock className="w-8 h-8 text-gray-500 mx-auto" />}
                </div>
                <h3 className="text-white font-medium">{test.name}</h3>
                <p className="text-gray-400 text-xs">{test.problem}</p>
                {getResultBadge(test.key)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}