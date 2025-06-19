import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">IA Board by Filippe</span>
        </div>
        
        <div className="text-8xl font-bold text-orange-400 mb-4">404</div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Página não encontrada
        </h1>
        
        <p className="text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          
          <div>
            <Button variant="ghost" onClick={() => window.history.back()} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Página anterior
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}