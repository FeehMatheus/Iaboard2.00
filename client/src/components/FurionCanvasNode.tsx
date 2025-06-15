import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Settings, 
  BarChart3,
  Brain,
  FileText,
  Target,
  Zap,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { FurionVisualInterface } from './FurionVisualInterface';

interface FurionNodeData {
  label?: string;
  productIdea?: string;
  status?: 'idle' | 'creating' | 'completed';
  progress?: number;
  currentTask?: string;
  results?: any;
  showInterface?: boolean;
}

function FurionCanvasNode({ data, selected }: NodeProps<FurionNodeData>) {
  const [showFullInterface, setShowFullInterface] = useState(data.showInterface || false);
  const [isMinimized, setIsMinimized] = useState(false);

  const getStatusColor = () => {
    switch (data.status) {
      case 'creating': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-purple-500';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'creating': return <Clock className="w-4 h-4 text-white" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-white" />;
      default: return <Sparkles className="w-4 h-4 text-white" />;
    }
  };

  if (showFullInterface) {
    return (
      <div className="relative">
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
        
        <div className="relative">
          <Button
            onClick={() => setShowFullInterface(false)}
            className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <FurionVisualInterface 
            onNodeAdd={(nodeData) => {
              // This would typically communicate back to the canvas
              console.log('New node created:', nodeData);
            }}
          />
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="relative">
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
        
        <div 
          className={`w-16 h-16 rounded-full ${getStatusColor()} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg`}
          onClick={() => setIsMinimized(false)}
        >
          {getStatusIcon()}
        </div>
        
        {data.status === 'creating' && data.progress && (
          <div className="absolute -bottom-2 left-0 right-0">
            <Progress value={data.progress} className="h-1" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <Card className={`w-80 ${selected ? 'ring-2 ring-blue-500' : ''} shadow-lg`}>
        <CardHeader className={`${getStatusColor()} text-white rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {getStatusIcon()}
              Furion AI
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 bg-white bg-opacity-20 hover:bg-opacity-30"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </div>
          {data.productIdea && (
            <p className="text-sm text-white text-opacity-90 mt-1">
              {data.productIdea.length > 50 ? `${data.productIdea.substring(0, 50)}...` : data.productIdea}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="p-4 space-y-3">
          {data.status === 'idle' && (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">Pronto para criar seu produto</p>
              <Button 
                onClick={() => setShowFullInterface(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Criação
              </Button>
            </div>
          )}

          {data.status === 'creating' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Criando...
                </Badge>
                <span className="text-xs text-gray-500">{data.progress || 0}%</span>
              </div>
              
              {data.currentTask && (
                <p className="text-sm text-gray-600">{data.currentTask}</p>
              )}
              
              <Progress value={data.progress || 0} className="w-full" />
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pause className="w-3 h-3 mr-1" />
                  Pausar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reiniciar
                </Button>
              </div>
            </div>
          )}

          {data.status === 'completed' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Concluído
                </Badge>
                <span className="text-xs text-gray-500">100%</span>
              </div>
              
              {data.results && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <BarChart3 className="w-3 h-3 mb-1" />
                      <div className="font-medium">Análise</div>
                      <div className="text-gray-600">Completa</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <FileText className="w-3 h-3 mb-1" />
                      <div className="font-medium">Copy</div>
                      <div className="text-gray-600">Gerado</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <Target className="w-3 h-3 mb-1" />
                      <div className="font-medium">Funil</div>
                      <div className="text-gray-600">Criado</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <Zap className="w-3 h-3 mb-1" />
                      <div className="font-medium">Automação</div>
                      <div className="text-gray-600">Ativa</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button 
                  onClick={() => setShowFullInterface(true)}
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Ver Detalhes
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // Reset to create new product
                  console.log('Creating new product');
                }}
              >
                <Brain className="w-3 h-3 mr-1" />
                Criar Novo Produto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default memo(FurionCanvasNode);