import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Grid3X3, Zap, Play, Target, Home } from 'lucide-react';

export function NavigationHeader() {
  const currentPath = window.location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/canvas', label: 'Quadro Infinito', icon: Grid3X3 },
    { path: '/board', label: 'Board Original', icon: Target },
    { path: '/supreme', label: 'Supreme AI', icon: Brain },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">
                Supreme Furion AI
              </h1>
              <Badge variant="secondary" className="text-xs">
                v2.0
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || 
                (item.path === '/supreme' && currentPath === '/');
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => window.location.href = item.path}
                  className={`flex items-center gap-2 text-sm ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Online
            </Badge>
            <div className="text-xs text-white/60">
              APIs: Ativas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}