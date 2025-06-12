import React, { useState, useEffect } from 'react';
import { X, HelpCircle, Lightbulb, Target, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TooltipProps {
  id: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  category: 'feature' | 'tip' | 'warning' | 'success';
  targetSelector: string;
  onComplete?: () => void;
  onDismiss?: () => void;
}

export const GuidanceTooltip: React.FC<TooltipProps> = ({
  id,
  title,
  content,
  position,
  category,
  targetSelector,
  onComplete,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) return;

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 140;

      let newPosition = { top: 0, left: 0 };

      switch (position) {
        case 'top':
          newPosition = {
            top: rect.top - tooltipHeight - 12,
            left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
          };
          break;
        case 'bottom':
          newPosition = {
            top: rect.bottom + 12,
            left: rect.left + (rect.width / 2) - (tooltipWidth / 2)
          };
          break;
        case 'left':
          newPosition = {
            top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
            left: rect.left - tooltipWidth - 12
          };
          break;
        case 'right':
          newPosition = {
            top: rect.top + (rect.height / 2) - (tooltipHeight / 2),
            left: rect.right + 12
          };
          break;
      }

      // Keep tooltip within viewport
      newPosition.left = Math.max(12, Math.min(newPosition.left, window.innerWidth - tooltipWidth - 12));
      newPosition.top = Math.max(12, Math.min(newPosition.top, window.innerHeight - tooltipHeight - 12));

      setTooltipPosition(newPosition);
      setIsVisible(true);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetSelector, position]);

  const getCategoryIcon = () => {
    switch (category) {
      case 'feature': return <Zap className="w-4 h-4" />;
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      case 'warning': return <Target className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'feature': return 'from-purple-600 to-blue-600';
      case 'tip': return 'from-yellow-500 to-orange-500';
      case 'warning': return 'from-red-500 to-pink-500';
      case 'success': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
    >
      <Card className="w-80 bg-black/95 border-purple-500/50 backdrop-blur-md shadow-2xl pointer-events-auto animate-in fade-in duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getCategoryColor()} text-white`}>
                {getCategoryIcon()}
              </div>
              <h4 className="font-bold text-white text-sm">{title}</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryColor()}`}></div>
              <span className="text-xs text-gray-400 capitalize">{category}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-xs text-gray-400 hover:text-white h-7 px-3"
              >
                Depois
              </Button>
              <Button
                size="sm"
                onClick={handleComplete}
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
          position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2' :
          position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2' :
          position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2' :
          'left-[-6px] top-1/2 -translate-y-1/2'
        }`}
      />
    </div>
  );
};

export default GuidanceTooltip;