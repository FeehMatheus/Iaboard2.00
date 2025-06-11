import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfiniteCanvasFixed } from '@/components/ui/infinite-canvas-fixed';
import { 
  Home, Settings, User, LogOut, Crown, Zap, 
  BarChart3, Target, Sparkles 
} from 'lucide-react';

export default function AIPlatformFixed() {
  const handleProjectCreate = (project: any) => {
    console.log('Novo projeto criado:', project);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Máquina Milionária</h1>
          </div>
          <Badge className="bg-orange-600 text-white">Canvas IA Infinito</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Link href="/supreme">
              <Sparkles className="w-4 h-4 mr-2" />
              Supremo
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <InfiniteCanvasFixed onProjectCreate={handleProjectCreate} />
      </div>

      {/* Bottom Toolbar */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-600 text-white">
              <Zap className="w-3 h-3 mr-1" />
              1.250 Créditos
            </Badge>
            <Badge className="bg-purple-600 text-white">
              <Target className="w-3 h-3 mr-1" />
              Mode Supremo Ativo
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>Canvas responsivo com IA integrada</span>
          </div>
        </div>
      </div>
    </div>
  );
}