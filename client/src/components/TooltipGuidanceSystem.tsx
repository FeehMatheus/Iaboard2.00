import React, { useState, useEffect, useRef } from 'react';
import { X, HelpCircle, Lightbulb, Target, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TooltipConfig {
  id: string;
  selector: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'auto';
  priority: 'low' | 'medium' | 'high';
  category: 'feature' | 'tip' | 'warning' | 'success';
  showOnce?: boolean;
  delay?: number;
  conditions?: {
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    context?: string;
    timeSpent?: number;
  };
}

interface TooltipGuidanceProps {
  context: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onComplete?: (tooltipId: string) => void;
}

const TOOLTIP_CONFIGS: TooltipConfig[] = [
  {
    id: 'infinite-canvas-intro',
    selector: '.infinite-canvas',
    title: 'Quadro Infinito IA',
    content: 'Use o quadro infinito para criar e conectar ideias. Clique com o botão direito para adicionar novos módulos de IA.',
    position: 'top',
    trigger: 'auto',
    priority: 'high',
    category: 'feature',
    showOnce: true,
    delay: 2000,
    conditions: { userLevel: 'beginner', context: 'board' }
  },
  {
    id: 'ai-modules-tip',
    selector: '.ai-module-card',
    title: 'Módulos de IA Especializados',
    content: 'Cada módulo usa IA real para gerar conteúdo específico. Experimente diferentes combinações para resultados únicos.',
    position: 'right',
    trigger: 'hover',
    priority: 'medium',
    category: 'tip',
    conditions: { context: 'board' }
  },
  {
    id: 'video-generation-guide',
    selector: '.video-generator-btn',
    title: 'Geração de Vídeo com IA',
    content: 'Crie vídeos promocionais reais com narração profissional e visuais cinematográficos usando nossa IA avançada.',
    position: 'bottom',
    trigger: 'hover',
    priority: 'high',
    category: 'feature',
    conditions: { context: 'landing' }
  },
  {
    id: 'export-system-tip',
    selector: '.export-btn',
    title: 'Sistema de Exportação Completa',
    content: 'Exporte todos os seus projetos em um pacote completo com arquivos HTML, scripts e guias de implementação.',
    position: 'left',
    trigger: 'hover',
    priority: 'medium',
    category: 'tip',
    conditions: { context: 'dashboard' }
  },
  {
    id: 'modo-pensamento-poderoso',
    selector: '.modo-pensamento',
    title: 'Modo Pensamento Poderoso',
    content: 'Ativa múltiplas IAs simultaneamente para análises mais profundas e resultados extraordinários.',
    position: 'top',
    trigger: 'hover',
    priority: 'high',
    category: 'feature',
    conditions: { context: 'board' }
  },
  {
    id: 'node-connections',
    selector: '.node-connector',
    title: 'Conexões Inteligentes',
    content: 'Conecte diferentes módulos para criar fluxos de trabalho automatizados. As IAs compartilham contexto entre si.',
    position: 'right',
    trigger: 'click',
    priority: 'medium',
    category: 'tip',
    conditions: { userLevel: 'intermediate', context: 'board' }
  },
  {
    id: 'performance-optimization',
    selector: '.performance-metrics',
    title: 'Otimização de Performance',
    content: 'Monitore o desempenho dos seus projetos e receba sugestões de otimização baseadas em IA.',
    position: 'bottom',
    trigger: 'auto',
    priority: 'low',
    category: 'tip',
    delay: 5000,
    conditions: { userLevel: 'advanced', timeSpent: 300 }
  }
];

export const TooltipGuidanceSystem: React.FC<TooltipGuidanceProps> = ({
  context,
  userLevel,
  onComplete
}) => {
  const [activeTooltips, setActiveTooltips] = useState<Set<string>>(new Set());
  const [completedTooltips, setCompletedTooltips] = useState<Set<string>>(new Set());
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [clickedElement, setClickedElement] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Track time spent in context
    intervalRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Load completed tooltips from localStorage
    const saved = localStorage.getItem('tooltip-guidance-completed');
    if (saved) {
      setCompletedTooltips(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    // Auto-trigger tooltips based on conditions
    const relevantTooltips = TOOLTIP_CONFIGS.filter(tooltip => {
      if (!tooltip.conditions) return true;
      
      const { userLevel: reqLevel, context: reqContext, timeSpent: reqTime } = tooltip.conditions;
      
      if (reqLevel && reqLevel !== userLevel) return false;
      if (reqContext && reqContext !== context) return false;
      if (reqTime && timeSpent < reqTime) return false;
      
      return true;
    });

    relevantTooltips.forEach(tooltip => {
      if (tooltip.trigger === 'auto' && !completedTooltips.has(tooltip.id)) {
        const delay = tooltip.delay || 1000;
        setTimeout(() => {
          setActiveTooltips(prev => new Set(Array.from(prev).concat([tooltip.id])));
        }, delay);
      }
    });
  }, [context, userLevel, timeSpent, completedTooltips]);

  useEffect(() => {
    // Set up hover and click listeners
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tooltip = TOOLTIP_CONFIGS.find(t => 
        target.matches(t.selector) && 
        t.trigger === 'hover' &&
        !completedTooltips.has(t.id)
      );
      
      if (tooltip && shouldShowTooltip(tooltip)) {
        setHoveredElement(tooltip.id);
        setActiveTooltips(prev => new Set(Array.from(prev).concat([tooltip.id])));
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tooltip = TOOLTIP_CONFIGS.find(t => 
        target.matches(t.selector) && 
        t.trigger === 'hover'
      );
      
      if (tooltip) {
        setHoveredElement(null);
        setActiveTooltips(prev => {
          const newSet = new Set(prev);
          newSet.delete(tooltip.id);
          return newSet;
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tooltip = TOOLTIP_CONFIGS.find(t => 
        target.matches(t.selector) && 
        t.trigger === 'click' &&
        !completedTooltips.has(t.id)
      );
      
      if (tooltip && shouldShowTooltip(tooltip)) {
        setClickedElement(tooltip.id);
        setActiveTooltips(prev => new Set(Array.from(prev).concat([tooltip.id])));
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [completedTooltips, context, userLevel, timeSpent]);

  const shouldShowTooltip = (tooltip: TooltipConfig): boolean => {
    if (tooltip.showOnce && completedTooltips.has(tooltip.id)) {
      return false;
    }

    if (tooltip.conditions) {
      const { userLevel: reqLevel, context: reqContext, timeSpent: reqTime } = tooltip.conditions;
      
      if (reqLevel && reqLevel !== userLevel) return false;
      if (reqContext && reqContext !== context) return false;
      if (reqTime && timeSpent < reqTime) return false;
    }

    return true;
  };

  const handleTooltipComplete = (tooltipId: string) => {
    setCompletedTooltips(prev => {
      const newSet = new Set(Array.from(prev).concat([tooltipId]));
      localStorage.setItem('tooltip-guidance-completed', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
    
    setActiveTooltips(prev => {
      const newSet = new Set(prev);
      newSet.delete(tooltipId);
      return newSet;
    });

    onComplete?.(tooltipId);
  };

  const handleTooltipDismiss = (tooltipId: string) => {
    setActiveTooltips(prev => {
      const newSet = new Set(prev);
      newSet.delete(tooltipId);
      return newSet;
    });
  };

  const getTooltipPosition = (tooltip: TooltipConfig, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 300;
    const tooltipHeight = 120;

    switch (tooltip.position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - 10,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
        };
      case 'bottom':
        return {
          top: rect.bottom + 10,
          left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
        };
      case 'left':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.left - tooltipWidth - 10
        };
      case 'right':
        return {
          top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
          left: rect.right + 10
        };
      default:
        return { top: rect.bottom + 10, left: rect.left };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return <Zap className="w-4 h-4" />;
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      case 'warning': return <Target className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'from-purple-600 to-blue-600';
      case 'tip': return 'from-yellow-500 to-orange-500';
      case 'warning': return 'from-red-500 to-pink-500';
      case 'success': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <>
      {Array.from(activeTooltips).map(tooltipId => {
        const tooltip = TOOLTIP_CONFIGS.find(t => t.id === tooltipId);
        if (!tooltip) return null;

        const targetElement = document.querySelector(tooltip.selector) as HTMLElement;
        if (!targetElement) return null;

        const position = getTooltipPosition(tooltip, targetElement);

        return (
          <div
            key={tooltip.id}
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: position.top,
              left: position.left
            }}
          >
            <Card className="w-80 bg-black/95 border-purple-500/50 backdrop-blur-md shadow-2xl pointer-events-auto">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getCategoryColor(tooltip.category)} text-white`}>
                      {getCategoryIcon(tooltip.category)}
                    </div>
                    <h4 className="font-bold text-white text-sm">{tooltip.title}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTooltipDismiss(tooltip.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {tooltip.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryColor(tooltip.category)}`}></div>
                    <span className="text-xs text-gray-400 capitalize">{tooltip.category}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTooltipDismiss(tooltip.id)}
                      className="text-xs text-gray-400 hover:text-white h-7 px-3"
                    >
                      Depois
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleTooltipComplete(tooltip.id)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-7 px-3 text-xs"
                    >
                      Entendi
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Arrow indicator */}
            <div 
              className={`absolute w-3 h-3 bg-black/95 border-purple-500/50 border-t border-l transform rotate-45 ${
                tooltip.position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2' :
                tooltip.position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2' :
                tooltip.position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2' :
                'left-[-6px] top-1/2 -translate-y-1/2'
              }`}
            />
          </div>
        );
      })}
    </>
  );
};

export default TooltipGuidanceSystem;