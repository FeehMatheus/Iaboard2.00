import { useCallback, useState, useEffect, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Trash2, Loader2, Copy, Check, X } from 'lucide-react';
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
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
];

export const CurisoChatNodeOriginal = memo(({ id, data }: NodeProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(data?.messages || []);
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  
  const { getNode, getEdges, setNodes } = useReactFlow();
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
          systemPrompt: 'You are a helpful AI assistant.',
          context: allMessages.slice(-10), // Last 10 messages for context
          temperature: 0.7,
          maxTokens: 2000,
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
          title: "Response generated",
          description: `Using ${model}`,
        });
      } else {
        throw new Error(result.error || 'Failed to generate response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
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
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                Chat Node
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={deleteNode}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(modelOption => (
                <SelectItem key={modelOption.id} value={modelOption.id}>
                  {modelOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-1 p-4 space-y-3">
          {/* Messages Display */}
          <div className="overflow-y-auto space-y-3 max-h-64">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <div className="text-lg mb-2">💬</div>
                <p className="text-sm">Start a conversation</p>
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