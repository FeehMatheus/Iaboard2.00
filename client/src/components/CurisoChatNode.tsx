import { useCallback, useState, useEffect, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Loader2, Copy, Check, Settings, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Message, ChatNodeData } from '@/lib/store';
import { useStore } from '@/lib/store';
import { SUPPORTED_MODELS, MODEL_PROVIDERS, BRAND_CONFIG } from '@/lib/constants';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const CurisoChatNode = memo(({ id, data: initialData }: NodeProps<ChatNodeData>) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialData?.messages || []);
  const [model, setModel] = useState(initialData?.model || 'gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { settings, setSettings } = useStore();
  const { getNode, setNodes } = useReactFlow();
  const { toast } = useToast();
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
    const currentBoard = settings.boards.find(b => b.id === settings.currentBoardId);
    if (!currentBoard) return;

    const newSettings = {
      ...settings,
      boards: settings.boards.map(board =>
        board.id === settings.currentBoardId
          ? {
              ...board,
              nodes: board.nodes.map(node =>
                node.id === id
                  ? { ...node, data: { ...node.data, messages, model } }
                  : node
              ),
            }
          : board
      ),
    };
    setSettings(newSettings);
  }, [messages, model, id, settings, setSettings]);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [messageId]: false }));
      }, 2000);
      toast({
        title: "Copiado!",
        description: "Mensagem copiada para a área de transferência.",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Erro",
        description: "Falha ao copiar mensagem.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: input.trim(),
          systemPrompt: `Você é um assistente IA do ${BRAND_CONFIG.name}. Forneça respostas úteis e precisas.`,
          temperature: 0.7,
          maxTokens: 1000,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const assistantMessage: Message = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: result.content,
          timestamp: Date.now(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        toast({
          title: "Sucesso!",
          description: `Resposta gerada usando ${model}`,
        });
      } else {
        throw new Error(result.error || 'Falha ao executar IA');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
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
      title: "Limpo!",
      description: "Todas as mensagens foram removidas.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentProvider = MODEL_PROVIDERS[model as keyof typeof MODEL_PROVIDERS] || 'unknown';

  return (
    <div className={`relative ${isResizing ? 'select-none' : ''}`}>
      <NodeResizer
        color="#8b5cf6"
        isVisible={true}
        minWidth={320}
        minHeight={200}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={() => setIsResizing(false)}
      />
      
      <Card className={`w-full h-full bg-gray-900/95 border-gray-700 backdrop-blur-sm transition-all duration-200 ${
        isExpanded ? 'min-h-[600px]' : 'min-h-[400px]'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse" />
              <h3 className="text-sm font-medium text-gray-100">
                Nó IA {id.slice(-4)}
              </h3>
              <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {currentProvider}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={deleteNode}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-8 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {SUPPORTED_MODELS.map(modelOption => (
                <SelectItem key={modelOption} value={modelOption}>
                  {modelOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-1 p-4 space-y-3">
          {/* Messages Display */}
          <div className={`overflow-y-auto space-y-3 ${
            isExpanded ? 'max-h-96' : 'max-h-48'
          }`}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">🤖</div>
                <p className="text-sm">Envie uma mensagem para começar</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-violet-600/20 border border-violet-500/30 ml-8'
                      : 'bg-gray-800/50 border border-gray-600/30 mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        message.role === 'user' ? 'bg-violet-500' : 'bg-green-500'
                      }`} />
                      <span className="text-xs text-gray-400 font-medium">
                        {message.role === 'user' ? 'Você' : 'IA'}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
                    >
                      {copiedStates[message.id] ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="text-sm text-gray-200 prose prose-sm prose-invert max-w-none">
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
                Limpar Chat
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
              placeholder={`Digite sua mensagem para ${model}...`}
              className="flex-1 min-h-[2.5rem] max-h-32 resize-none bg-gray-800 border-gray-600 text-gray-100"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 self-end"
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
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-violet-500 border-2 border-white"
      />
    </div>
  );
});

CurisoChatNode.displayName = 'CurisoChatNode';