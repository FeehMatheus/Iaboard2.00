import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Lightbulb, 
  Zap, 
  Target, 
  Clock, 
  ChevronRight,
  X,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface TooltipContent {
  title: string;
  description: string;
  type: 'info' | 'tip' | 'warning' | 'feature' | 'shortcut';
  category?: string;
  quickActions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  }>;
  examples?: string[];
  relatedFeatures?: string[];
  shortcuts?: Array<{
    keys: string[];
    description: string;
  }>;
}

interface IntelligentTooltipProps {
  children: React.ReactNode;
  content: TooltipContent;
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  showArrow?: boolean;
  interactive?: boolean;
  contextAware?: boolean;
}

export const IntelligentTooltip: React.FC<IntelligentTooltipProps> = ({
  children,
  content,
  trigger = 'hover',
  delay = 300,
  placement = 'auto',
  showArrow = true,
  interactive = true,
  contextAware = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'warning': return <Target className="h-4 w-4 text-orange-500" />;
      case 'feature': return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'shortcut': return <Zap className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tip': return 'border-yellow-200 bg-yellow-50';
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'feature': return 'border-purple-200 bg-purple-50';
      case 'shortcut': return 'border-blue-200 bg-blue-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 320;
    const tooltipHeight = 200; // Estimated height
    const gap = 12;

    let x = 0;
    let y = 0;
    let finalPlacement = placement;

    // Auto placement logic
    if (placement === 'auto') {
      const spaceRight = viewportWidth - triggerRect.right;
      const spaceLeft = triggerRect.left;
      const spaceTop = triggerRect.top;
      const spaceBottom = viewportHeight - triggerRect.bottom;

      if (spaceRight >= tooltipWidth) finalPlacement = 'right';
      else if (spaceLeft >= tooltipWidth) finalPlacement = 'left';
      else if (spaceBottom >= tooltipHeight) finalPlacement = 'bottom';
      else finalPlacement = 'top';
    }

    switch (finalPlacement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.top - tooltipHeight - gap;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.bottom + gap;
        break;
      case 'left':
        x = triggerRect.left - tooltipWidth - gap;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        x = triggerRect.right + gap;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    x = Math.max(10, Math.min(x, viewportWidth - tooltipWidth - 10));
    y = Math.max(10, Math.min(y, viewportHeight - tooltipHeight - 10));

    setPosition({ x, y });
    setActualPlacement(finalPlacement);
  };

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !interactive) hideTooltip();
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) hideTooltip();
      else showTooltip();
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') showTooltip();
  };

  const handleBlur = () => {
    if (trigger === 'focus') hideTooltip();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) calculatePosition();
    };

    const handleResize = () => {
      if (isVisible) calculatePosition();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={`fixed z-50 w-80 transition-all duration-200 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseEnter={() => interactive && trigger === 'hover' && setIsVisible(true)}
      onMouseLeave={() => interactive && trigger === 'hover' && hideTooltip()}
    >
      <Card className={`border-2 shadow-xl ${getTypeColor(content.type)}`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getTypeIcon(content.type)}
              <div>
                <h4 className="font-semibold text-slate-800">{content.title}</h4>
                {content.category && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {content.category}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={hideTooltip}
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-3">{content.description}</p>

          {/* Examples */}
          {content.examples && content.examples.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-slate-700 mb-1">Exemplos:</h5>
              <ul className="text-xs text-slate-600 space-y-1">
                {content.examples.map((example, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shortcuts */}
          {content.shortcuts && content.shortcuts.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-slate-700 mb-2">Atalhos:</h5>
              <div className="space-y-1">
                {content.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-mono"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {content.quickActions && content.quickActions.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-slate-700 mb-2">Ações Rápidas:</h5>
              <div className="space-y-1">
                {content.quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="w-full justify-start text-xs h-8"
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Related Features */}
          {content.relatedFeatures && content.relatedFeatures.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-slate-700 mb-1">Relacionado:</h5>
              <div className="flex flex-wrap gap-1">
                {content.relatedFeatures.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Arrow */}
      {showArrow && (
        <div
          className={`absolute w-3 h-3 ${getTypeColor(content.type)} border-2 rotate-45 ${
            actualPlacement === 'top' ? '-bottom-2 left-1/2 -translate-x-1/2 border-b-0 border-r-0' :
            actualPlacement === 'bottom' ? '-top-2 left-1/2 -translate-x-1/2 border-t-0 border-l-0' :
            actualPlacement === 'left' ? '-right-2 top-1/2 -translate-y-1/2 border-t-0 border-r-0' :
            '-left-2 top-1/2 -translate-y-1/2 border-b-0 border-l-0'
          }`}
        />
      )}
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="inline-block"
      >
        {children}
      </div>
      
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
};

// Context-aware tooltip content generator
export const generateContextTooltip = (elementType: string, context?: any): TooltipContent => {
  const tooltips: Record<string, TooltipContent> = {
    'chat-node': {
      title: 'Módulo de Chat IA',
      description: 'Converse com diferentes modelos de IA para gerar conteúdo, resolver problemas ou obter insights.',
      type: 'feature',
      category: 'IA',
      examples: [
        'Gerar copy para produtos',
        'Criar scripts de vendas',
        'Análise de mercado'
      ],
      shortcuts: [
        { keys: ['Ctrl', 'N'], description: 'Novo módulo' },
        { keys: ['Enter'], description: 'Enviar mensagem' }
      ],
      quickActions: [
        {
          label: 'Trocar modelo IA',
          action: () => console.log('Switch model'),
          icon: <Zap className="h-3 w-3" />
        }
      ],
      relatedFeatures: ['Performance Metrics', 'Model Switcher']
    },
    
    'funnel-optimizer': {
      title: 'Otimizador IA de Funis',
      description: 'Analisa seu funil de vendas e fornece sugestões inteligentes para melhorar a conversão.',
      type: 'tip',
      category: 'Otimização',
      examples: [
        'Identificar gargalos no fluxo',
        'Sugerir melhorias de conteúdo',
        'Otimizar estrutura do funil'
      ],
      shortcuts: [
        { keys: ['Ctrl', 'A'], description: 'Analisar funil' }
      ],
      relatedFeatures: ['Analytics', 'Performance Tracking']
    },
    
    'sidebar-toggle': {
      title: 'Menu Lateral',
      description: 'Acesse o gerenciador de funis, ferramentas de IA e configurações do workspace.',
      type: 'info',
      category: 'Navegação',
      examples: [
        'Criar novo funil',
        'Organizar em pastas',
        'Acessar ferramentas IA'
      ],
      shortcuts: [
        { keys: ['Ctrl', 'B'], description: 'Alternar sidebar' }
      ],
      relatedFeatures: ['Folder Management', 'AI Tools']
    },
    
    'context-menu': {
      title: 'Menu Contextual',
      description: 'Clique com botão direito em qualquer área para acessar ações específicas do contexto.',
      type: 'shortcut',
      category: 'Produtividade',
      examples: [
        'Adicionar módulos específicos',
        'Duplicar elementos',
        'Exportar canvas'
      ],
      shortcuts: [
        { keys: ['Right Click'], description: 'Abrir menu' },
        { keys: ['Esc'], description: 'Fechar menu' }
      ]
    },

    'performance-metrics': {
      title: 'Métricas de Performance',
      description: 'Monitore o desempenho dos modelos de IA em tempo real para otimizar sua experiência.',
      type: 'feature',
      category: 'Analytics',
      examples: [
        'Taxa de sucesso por modelo',
        'Tempo médio de resposta',
        'Recomendações automáticas'
      ],
      relatedFeatures: ['Model Switcher', 'AI Analytics']
    }
  };

  return tooltips[elementType] || {
    title: 'Funcionalidade',
    description: 'Recurso do IA Board para melhorar sua produtividade.',
    type: 'info'
  };
};