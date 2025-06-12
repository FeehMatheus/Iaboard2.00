import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, Zap, Crown, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeedbackState {
  id: string;
  type: 'loading' | 'success' | 'error' | 'processing';
  message: string;
  progress?: number;
  data?: any;
}

interface InteractiveFeedbackProps {
  nodeId: string;
  nodeType: string;
  onFeedback?: (feedback: FeedbackState) => void;
}

export function InteractiveFeedback({ nodeId, nodeType, onFeedback }: InteractiveFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackState[]>([]);

  const addFeedback = (feedback: Omit<FeedbackState, 'id'>) => {
    const newFeedback = {
      ...feedback,
      id: `${nodeId}-${Date.now()}`
    };
    
    setFeedbacks(prev => [...prev, newFeedback]);
    onFeedback?.(newFeedback);

    // Auto-remove after 5 seconds for success/error
    if (feedback.type === 'success' || feedback.type === 'error') {
      setTimeout(() => {
        setFeedbacks(prev => prev.filter(f => f.id !== newFeedback.id));
      }, 5000);
    }
  };

  const removeFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  // Expose methods globally for direct button interactions
  useEffect(() => {
    (window as any).addInteractiveFeedback = addFeedback;
    return () => {
      delete (window as any).addInteractiveFeedback;
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'loading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <X className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'loading':
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      <AnimatePresence>
        {feedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Card className={`${getColor(feedback.type)} border-none shadow-lg`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(feedback.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-white/20 text-white">
                        {nodeType}
                      </Badge>
                      {feedback.type === 'success' && (
                        <Crown className="h-3 w-3" />
                      )}
                    </div>
                    <p className="text-sm font-medium">{feedback.message}</p>
                    
                    {feedback.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progresso</span>
                          <span>{feedback.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <motion.div
                            className="bg-white h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${feedback.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {feedback.data && (
                      <div className="mt-2 text-xs opacity-90">
                        {typeof feedback.data === 'object' ? (
                          <div className="space-y-1">
                            {Object.entries(feedback.data).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{String(feedback.data)}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeFeedback(feedback.id)}
                    className="flex-shrink-0 text-white/70 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Global function to add feedback from anywhere in the app
export const addGlobalFeedback = (
  nodeId: string,
  nodeType: string,
  type: 'loading' | 'success' | 'error' | 'processing',
  message: string,
  progress?: number,
  data?: any
) => {
  if ((window as any).addInteractiveFeedback) {
    (window as any).addInteractiveFeedback({
      type,
      message,
      progress,
      data
    });
  }
};

// Enhanced button wrapper with real-time feedback
export function FeedbackButton({
  children,
  onClick,
  nodeId,
  nodeType,
  actionName,
  className = "",
  disabled = false
}: {
  children: React.ReactNode;
  onClick: () => Promise<any>;
  nodeId: string;
  nodeType: string;
  actionName: string;
  className?: string;
  disabled?: boolean;
}) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleClick = async () => {
    if (isExecuting || disabled) return;

    setIsExecuting(true);
    
    // Start feedback
    addGlobalFeedback(nodeId, nodeType, 'loading', `Iniciando ${actionName}...`, 0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        const progress = Math.min(Math.random() * 30 + 20, 90);
        addGlobalFeedback(nodeId, nodeType, 'processing', `Executando ${actionName}...`, progress);
      }, 800);

      // Execute the actual function
      const result = await onClick();

      clearInterval(progressInterval);

      if (result?.success !== false) {
        addGlobalFeedback(
          nodeId, 
          nodeType, 
          'success', 
          `${actionName} concluído com sucesso!`, 
          100,
          result?.data
        );
      } else {
        throw new Error(result?.error || 'Erro desconhecido');
      }
    } catch (error) {
      addGlobalFeedback(
        nodeId,
        nodeType,
        'error',
        `Erro ao executar ${actionName}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isExecuting || disabled}
      className={`${className} ${isExecuting ? 'opacity-75 cursor-wait' : ''} transition-all duration-200`}
    >
      {children}
    </button>
  );
}