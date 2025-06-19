import { useCallback, useState, useEffect, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Loader2, Copy, Check, X, BarChart3, Zap, Clock, Target } from 'lucide-react';
import { IntelligentTooltip, generateContextTooltip } from '@/components/IntelligentTooltip';
import { useTooltipContext } from '@/hooks/useTooltipContext';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Message } from '@/lib/store';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const availableModels = [
  { id: 'gpt-4o', name: '🚀 GPT-4o (Mais Inteligente)', provider: 'openai' },
  { id: 'gpt-4o-mini', name: '⚡ GPT-4o Mini (Mais Rápido)', provider: 'openai' },
  { id: 'claude-3-5-sonnet-20241022', name: '🧠 Claude 3.5 Sonnet (Analítico)', provider: 'anthropic' },
  { id: 'claude-3-5-haiku-20241022', name: '📝 Claude 3.5 Haiku (Criativo)', provider: 'anthropic' },
];

interface ModelStats {
  modelId: string;
  totalCalls: number;
  successRate: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  lastUsed: number;
}

interface PerformanceData {
  modelStats: ModelStats[];
  bestPerformingModel: string | null;
  recentMetrics: any[];
  totalCalls: number;
}

export const CurisoChatNodeOriginal = memo(({ id, data }: NodeProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(data?.messages || []);
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [showMetrics, setShowMetrics] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [lastResponseTime, setLastResponseTime] = useState<number | null>(null);
  
  const { getNode, getEdges, setNodes } = useReactFlow();
  const { toast } = useToast();
  const { trackFeatureInteraction, getAdaptiveDelay } = useTooltipContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Update node data when messages change
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                messages,
                model,
              },
            }
          : node
      )
    );
  }, [messages, model, id, setNodes]);

  // Fetch performance data
  const fetchPerformanceData = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/models/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPerformanceData(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  }, []);

  // Auto-refresh performance data
  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [fetchPerformanceData]);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [messageId]: false }));
      }, 2000);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy message.",
        variant: "destructive",
      });
    }
  };

  const getContextFromSourceNodes = useCallback(() => {
    const edges = getEdges();
    const contextMessages: Message[] = [];
    const visited = new Set<string>();

    const getMessagesFromNode = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = getNode(nodeId);
      if (!node?.data?.messages) return;

      contextMessages.push(...node.data.messages);

      const sourceEdges = edges.filter(edge => edge.target === nodeId);
      sourceEdges.forEach(edge => {
        if (edge.source && !visited.has(edge.source)) {
          getMessagesFromNode(edge.source);
        }
      });
    };

    const sourceEdges = edges.filter(edge => edge.target === id);
    sourceEdges.forEach(edge => {
      if (edge.source) {
        getMessagesFromNode(edge.source);
      }
    });

    return contextMessages;
  }, [getEdges, getNode, id]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const contextMessages = getContextFromSourceNodes();
    const allMessages = [...contextMessages, ...messages, userMessage];

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `${Date.now()}-typing`,
      role: 'assistant',
      content: '⌨️ Digitando...',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      console.log(`[Chat Node] Enviando mensagem para modelo: ${model}`);
      
      const response = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: currentInput,
          systemPrompt: 'Você é um assistente de IA especializado, útil e inteligente. Responda de forma clara, detalhada e profissional.',
          context: allMessages.slice(-8), // Last 8 messages for context
          temperature: 0.7,
          maxTokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`[Chat Node] Resposta recebida:`, result);

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));

      if (result.success && result.content) {
        const assistantMessage: Message = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: result.content,
          timestamp: Date.now(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setLastResponseTime(result.processingTime);
        
        // Refresh performance data after successful response
        fetchPerformanceData();
        
        toast({
          title: "✅ Resposta gerada",
          description: `Modelo: ${selectedModel?.name} (${result.processingTime}ms)`,
        });
      } else {
        throw new Error(result.error || 'Falha ao gerar resposta');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Remove typing indicator on error
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      
      // Add error message
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: `❌ **Erro**: ${error instanceof Error ? error.message : 'Falha na comunicação'}\n\nTente novamente ou verifique sua conexão.`,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "❌ Erro no Chat",
        description: error instanceof Error ? error.message : "Falha ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNode = () => {
    setNodes(nodes => nodes.filter(node => node.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
    toast({
      title: "Cleared",
      description: "All messages have been removed.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedModel = availableModels.find(m => m.id === model);
  const currentModelStats = performanceData?.modelStats.find(s => s.modelId === model);

  const getModelRecommendation = () => {
    if (!performanceData || performanceData.modelStats.length === 0) return null;
    
    const currentStats = performanceData.modelStats.find(s => s.modelId === model);
    const bestModel = performanceData.bestPerformingModel;
    
    if (bestModel && bestModel !== model) {
      const bestStats = performanceData.modelStats.find(s => s.modelId === bestModel);
      if (bestStats && currentStats) {
        const improvement = bestStats.averageResponseTime < currentStats.averageResponseTime;
        return {
          modelId: bestModel,
          reason: improvement ? 'melhor performance' : 'maior confiabilidade',
          modelName: availableModels.find(m => m.id === bestModel)?.name || bestModel
        };
      }
    }
    return null;
  };

  const recommendation = getModelRecommendation();

  return (
    <div className={`relative ${isResizing ? 'select-none' : ''}`}>
      <NodeResizer
        color="#3b82f6"
        isVisible={true}
        minWidth={280}
        minHeight={300}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
      
      <Card className="w-full h-full bg-card border-border shadow-lg">
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-sm font-medium text-muted-foreground">
                💬 Chat IA {isLoading ? '(Processando...)' : '(Pronto)'}
              </span>
              {lastResponseTime && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {lastResponseTime}ms
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <IntelligentTooltip
                content={generateContextTooltip('performance-metrics')}
                trigger="hover"
                delay={getAdaptiveDelay('performance-metrics')}
                placement="bottom"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowMetrics(!showMetrics);
                    trackFeatureInteraction('performance-metrics');
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                >
                  <BarChart3 className="h-3 w-3" />
                </Button>
              </IntelligentTooltip>
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteNode}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(modelOption => {
                const stats = performanceData?.modelStats.find(s => s.modelId === modelOption.id);
                const isBest = performanceData?.bestPerformingModel === modelOption.id;
                return (
                  <SelectItem key={modelOption.id} value={modelOption.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{modelOption.name}</span>
                      {isBest && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          ⚡ Melhor
                        </span>
                      )}
                      {stats && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {Math.round(stats.averageResponseTime)}ms
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Performance Recommendation */}
          {recommendation && (
            <div className="text-xs bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Target className="h-3 w-3 text-blue-500" />
                <span className="font-medium text-blue-700">Recomendação</span>
              </div>
              <p className="text-blue-600">
                {recommendation.modelName} oferece {recommendation.reason}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModel(recommendation.modelId)}
                className="mt-1 h-6 text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                Trocar Modelo
              </Button>
            </div>
          )}

          {/* Performance Metrics Panel */}
          {showMetrics && performanceData && (
            <div className="text-xs bg-muted rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <BarChart3 className="h-3 w-3" />
                <span className="font-medium">Métricas de Performance</span>
              </div>
              
              {currentModelStats ? (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Taxa de Sucesso:</span>
                    <span className="font-medium">{Math.round(currentModelStats.successRate)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo Médio:</span>
                    <span className="font-medium">{Math.round(currentModelStats.averageResponseTime)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Chamadas:</span>
                    <span className="font-medium">{currentModelStats.totalCalls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tokens Usados:</span>
                    <span className="font-medium">{currentModelStats.totalTokensUsed.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum dado disponível para este modelo</p>
              )}

              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Geral:</span>
                  <span>{performanceData.totalCalls} chamadas</span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-4 space-y-3">
          {/* Messages Display */}
          <div className="overflow-y-auto space-y-3 max-h-64">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <div className="text-2xl mb-3">🤖</div>
                <p className="text-sm font-medium">Converse com IA em tempo real</p>
                <p className="text-xs mt-1">Digite sua mensagem para começar</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border ${
                    message.role === 'user'
                      ? 'bg-primary/10 border-primary/20 ml-6'
                      : 'bg-muted border-border mr-6'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        message.role === 'user' ? 'bg-primary' : 'bg-green-500'
                      }`} />
                      <span className="text-xs text-muted-foreground font-medium">
                        {message.role === 'user' ? 'You' : selectedModel?.name || 'AI'}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      {copiedStates[message.id] ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))
            )}
          </div>

          {messages.length > 0 && (
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={clearMessages}
                className="text-xs h-7"
              >
                Clear
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${selectedModel?.name || 'AI'}...`}
              className="flex-1 min-h-[2.5rem] max-h-32 resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 border-2 border-background"
      />
    </div>
  );
});

CurisoChatNodeOriginal.displayName = 'CurisoChatNodeOriginal';