import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import AnimatedBackground from '@/components/AnimatedBackground';
import CompetitorAnalysis from '@/components/CompetitorAnalysis';

export default function CompetitorAnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="glass-effect rounded-2xl p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
            
            <Badge className="bg-orange-500/20 text-orange-300">
              ANÁLISE COMPETITIVA
            </Badge>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <CompetitorAnalysis />
      </main>
    </div>
  );
}