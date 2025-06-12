import React, { useState, useEffect } from 'react';
import { X, Lightbulb, Zap, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GuidanceTooltip {
  id: string;
  title: string;
  content: string;
  category: 'feature' | 'tip' | 'warning' | 'success';
  targetElement: string;
  context: string;
  priority: number;
  showOnce?: boolean;
}

const GUIDANCE_TOOLTIPS: GuidanceTooltip[] = [
  {
    id: 'canvas-intro',
    title: 'Quadro Infinito IA',
    content: 'Use o quadro infinito para criar e conectar ideias. Clique com o botão direito para adicionar novos módulos de IA.',
    category: 'feature',
    targetElement: '.infinite-canvas',
    context: 'board',
    priority: 10,
    showOnce: true
  },
  {
    id: 'video-generation',
    title: 'Geração de Vídeo com IA',
    content: 'Crie vídeos promocionais reais com narração profissional e visuais cinematográficos usando nossa IA avançada.',
    category: 'feature',
    targetElement: '.video-generator-btn',
    context: 'landing',
    priority: 8
  },
  {
    id: 'ai-modules',
    title: 'Módulos de IA Especializados',
    content: 'Cada módulo usa IA real para gerar conteúdo específico. Experimente diferentes combinações para resultados únicos.',
    category: 'tip',
    targetElement: '.ai-module-card',
    context: 'board',
    priority: 7
  },
  {
    id: 'modo-pensamento',
    title: 'Modo Pensamento Poderoso',
    content: 'Ativa múltiplas IAs simultaneamente para análises mais profundas e resultados extraordinários.',
    category: 'feature',
    targetElement: '.modo-pensamento',
    context: 'board',
    priority: 9
  }
];

interface SmartGuidanceProps {
  currentContext: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export const SmartGuidance: React.FC<SmartGuidanceProps> = ({ 
  currentContext, 
  userLevel = 'beginner' 
}) => {
  const [activeTooltip, setActiveTooltip] = useState<GuidanceTooltip | null>(null);
  const [completedTooltips, setCompletedTooltips] = useState<Set<string>>(new Set());
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const completed = localStorage.getItem('guidance-completed');
    if (completed) {
      setCompletedTooltips(new Set(JSON.parse(completed)));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      showNextTooltip();
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentContext, completedTooltips]);

  const showNextTooltip = () => {
    const contextTooltips = GUIDANCE_TOOLTIPS
      .filter(t => t.context === currentContext)
      .filter(t => !completedTooltips.has(t.id))
      .sort((a, b) => b.priority - a.priority);

    for (const tooltip of contextTooltips) {
      const element = document.querySelector(tooltip.targetElement);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left + (rect.width / 2) - 160
        });
        setActiveTooltip(tooltip);
        break;
      }
    }
  };

  const handleComplete = () => {
    if (activeTooltip) {
      const newCompleted = new Set(Array.from(completedTooltips).concat([activeTooltip.id]));
      setCompletedTooltips(newCompleted);
      localStorage.setItem('guidance-completed', JSON.stringify(Array.from(newCompleted)));
    }
    setActiveTooltip(null);
  };

  const handleDismiss = () => {
    setActiveTooltip(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return <Zap className="w-4 h-4" />;
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      case 'warning': return <Target className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'from-purple-600 to-blue-600';
      case 'tip': return 'from-yellow-500 to-orange-500';
      case 'warning': return 'from-red-500 to-pink-500';
      case 'success': return 'from-green-500 to-emerald-500';
    }
  };

  if (!activeTooltip) return null;

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ 
        top: Math.max(10, position.top), 
        left: Math.max(10, Math.min(position.left, window.innerWidth - 330))
      }}
    >
      <Card className="w-80 bg-black/95 border-purple-500/50 backdrop-blur-md shadow-2xl pointer-events-auto animate-in fade-in duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getCategoryColor(activeTooltip.category)} text-white`}>
                {getCategoryIcon(activeTooltip.category)}
              </div>
              <h4 className="font-bold text-white text-sm">{activeTooltip.title}</h4>
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
            {activeTooltip.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getCategoryColor(activeTooltip.category)}`}></div>
              <span className="text-xs text-gray-400 capitalize">{activeTooltip.category}</span>
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
    </div>
  );
};

export default SmartGuidance;