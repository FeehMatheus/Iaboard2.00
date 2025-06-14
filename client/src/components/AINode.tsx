import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Settings, Play, Copy, Trash2, Maximize2, 
  MessageSquare, Zap, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';

export interface AINodeData {
  id: string;
  type: 'ai-node';
  position: { x: number; y: number };
  title: string;
  model: 'gpt-4o' | 'claude-3-sonnet-20240229' | 'gemini-1.5-pro';
  prompt: string;
  response: string;
  isProcessing: boolean;
  connected: boolean;
  connections: string[];
  settings: {
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
}

interface AINodeProps {
  data: AINodeData;
  onUpdate: (id: string, updates: Partial<AINodeData>) => void;
  onDelete: (id: string) => void;
  onConnect: (fromId: string, toId: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  scale: number;
}

const modelConfig = {
  'gpt-4o': {
    name: 'GPT-4o',
    color: 'bg-green-500',
    icon: '🤖',
    provider: 'OpenAI'
  },
  'claude-3-sonnet-20240229': {
    name: 'Claude 3 Sonnet',
    color: 'bg-purple-500',
    icon: '🧠',
    provider: 'Anthropic'
  },
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    color: 'bg-blue-500',
    icon: '✨',
    provider: 'Google'
  }
};

export default function AINode({ 
  data, 
  onUpdate, 
  onDelete, 
  onConnect, 
  isSelected, 
  onSelect,
  scale 
}: AINodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    onSelect(data.id);
    
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const canvas = document.querySelector('.infinite-canvas');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      const newX = (e.clientX - canvasRect.left - dragOffset.x) / scale;
      const newY = (e.clientY - canvasRect.top - dragOffset.y) / scale;
      
      onUpdate(data.id, {
        position: { x: newX, y: newY }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, scale, data.id, onUpdate]);

  const executeAI = async () => {
    if (!data.prompt.trim()) return;

    onUpdate(data.id, { isProcessing: true });

    try {
      const response = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: data.model,
          prompt: data.prompt,
          systemPrompt: data.settings.systemPrompt,
          temperature: data.settings.temperature,
          maxTokens: data.settings.maxTokens
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onUpdate(data.id, { 
          response: result.content,
          isProcessing: false,
          connected: true
        });
      } else {
        onUpdate(data.id, { 
          response: `Erro: ${result.error}`,
          isProcessing: false,
          connected: false
        });
      }
    } catch (error) {
      onUpdate(data.id, { 
        response: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        isProcessing: false,
        connected: false
      });
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(data.response);
  };

  const config = modelConfig[data.model];

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none transition-all duration-200 ${isDragging ? 'z-50' : 'z-10'} ${isSelected ? 'ring-2 ring-violet-400' : ''}`}
      style={{
        left: `${data.position.x}px`,
        top: `${data.position.y}px`,
        transform: `scale(${Math.max(0.5, Math.min(1.2, scale))})`
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className={`w-80 ${isExpanded ? 'h-auto' : 'h-48'} bg-gray-900/95 border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all cursor-move`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${config.color} ${data.connected ? 'animate-pulse' : 'opacity-50'}`} />
              <CardTitle className="text-sm font-medium text-gray-100">
                {data.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                {config.icon} {config.name}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(data.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {showSettings && (
            <div className="space-y-2 pt-2 border-t border-gray-700">
              <Select
                value={data.model}
                onValueChange={(value: any) => onUpdate(data.id, { model: value })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">🤖 GPT-4o</SelectItem>
                  <SelectItem value="claude-3-sonnet-20240229">🧠 Claude 3 Sonnet</SelectItem>
                  <SelectItem value="gemini-1.5-pro">✨ Gemini 1.5 Pro</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Temperature</label>
                  <Input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={data.settings.temperature}
                    onChange={(e) => onUpdate(data.id, {
                      settings: { ...data.settings, temperature: parseFloat(e.target.value) }
                    })}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Max Tokens</label>
                  <Input
                    type="number"
                    min="1"
                    max="4000"
                    value={data.settings.maxTokens}
                    onChange={(e) => onUpdate(data.id, {
                      settings: { ...data.settings, maxTokens: parseInt(e.target.value) }
                    })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          <div>
            <Input
              placeholder="Nome do nó..."
              value={data.title}
              onChange={(e) => onUpdate(data.id, { title: e.target.value })}
              className="bg-gray-800 border-gray-600 text-gray-100"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div>
            <Textarea
              placeholder="Digite seu prompt aqui..."
              value={data.prompt}
              onChange={(e) => onUpdate(data.id, { prompt: e.target.value })}
              className="bg-gray-800 border-gray-600 text-gray-100 min-h-[60px] resize-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                executeAI();
              }}
              disabled={data.isProcessing || !data.prompt.trim()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {data.isProcessing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3" />
              )}
              Executar
            </Button>
            
            {data.response && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  copyResponse();
                }}
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
          </div>

          {data.response && (
            <div className={`${isExpanded ? 'max-h-none' : 'max-h-20'} overflow-hidden`}>
              <div className="bg-gray-800 rounded p-2 text-xs text-gray-300 border border-gray-600">
                <div className="flex items-center gap-1 mb-1">
                  {data.connected ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-gray-400">Resposta:</span>
                </div>
                <div className="whitespace-pre-wrap">{data.response}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection points */}
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-violet-500 rounded-full border-2 border-gray-900 cursor-crosshair" 
           title="Saída de conexão" />
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 cursor-crosshair" 
           title="Entrada de conexão" />
    </div>
  );
}