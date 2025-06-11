import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, Pause, Download, Share2, Zap, Brain, Target, 
  TrendingUp, Eye, Link, Settings, Maximize2, Minimize2,
  Copy, Video, Mail, FileText, BarChart3, Sparkles,
  Rocket, Crown, Star, Lightning, Flame, Award
} from 'lucide-react';

interface CanvasProject {
  id: string;
  type: 'copy' | 'vsl' | 'funnel' | 'ads' | 'email' | 'landing' | 'analysis' | 'strategy' | 'quantum' | 'neural' | 'fusion';
  title: string;
  status: 'processing' | 'completed' | 'failed' | 'draft' | 'quantum' | 'supreme';
  progress: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: any;
  createdAt: string;
  isExpanded: boolean;
  videoUrl?: string;
  links: Array<{ id: string; url: string; title: string; type: 'cta' | 'reference' | 'resource' }>;
  connections: string[];
  zIndex: number;
  aiPower?: number;
  quantumLevel?: number;
  supremeMode?: boolean;
}

interface AdvancedCanvasProps {
  projects: CanvasProject[];
  onCreateProject: (type: string, position: { x: number; y: number }) => void;
  onUpdateProject: (id: string, updates: Partial<CanvasProject>) => void;
  onDeleteProject: (id: string) => void;
}

const projectTypeIcons = {
  copy: Copy,
  vsl: Video,
  funnel: TrendingUp,
  ads: Target,
  email: Mail,
  landing: FileText,
  analysis: BarChart3,
  strategy: Brain,
  quantum: Sparkles,
  neural: Lightning,
  fusion: Flame
};

const statusColors = {
  draft: 'bg-gray-500',
  processing: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  quantum: 'bg-purple-500',
  supreme: 'bg-gradient-to-r from-yellow-400 to-orange-500'
};

export function AdvancedCanvas({ projects, onCreateProject, onUpdateProject, onDeleteProject }: AdvancedCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showQuantumMode, setShowQuantumMode] = useState(false);
  const [supremeAI, setSupremeAI] = useState(false);
  const [neuralNetwork, setNeuralNetwork] = useState(false);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;
      
      // Create new project at click position
      const projectTypes = supremeAI ? 
        ['quantum', 'neural', 'fusion', 'copy', 'vsl', 'strategy'] :
        ['copy', 'vsl', 'funnel', 'ads', 'email', 'landing', 'analysis', 'strategy'];
      
      const randomType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
      onCreateProject(randomType, { x, y });
    }
  }, [offset, scale, onCreateProject, supremeAI]);

  const handleProjectDrag = useCallback((projectId: string, deltaX: number, deltaY: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      onUpdateProject(projectId, {
        position: {
          x: project.position.x + deltaX / scale,
          y: project.position.y + deltaY / scale
        }
      });
    }
  }, [projects, onUpdateProject, scale]);

  const activateQuantumMode = () => {
    setShowQuantumMode(true);
    projects.forEach(project => {
      onUpdateProject(project.id, {
        quantumLevel: Math.floor(Math.random() * 100) + 1,
        aiPower: Math.floor(Math.random() * 1000) + 500
      });
    });
  };

  const activateSupremeAI = () => {
    setSupremeAI(true);
    projects.forEach(project => {
      onUpdateProject(project.id, {
        supremeMode: true,
        status: 'supreme',
        aiPower: 9999,
        quantumLevel: 100
      });
    });
  };

  const activateNeuralNetwork = () => {
    setNeuralNetwork(true);
    // Create neural connections between projects
    projects.forEach((project, index) => {
      const connections = projects
        .filter((_, i) => i !== index)
        .map(p => p.id)
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      onUpdateProject(project.id, {
        connections,
        aiPower: (project.aiPower || 0) + 500
      });
    });
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Quantum Grid Background */}
      {showQuantumMode && (
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #ff6b6b 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #4ecdc4 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, #45b7d1 0%, transparent 50%)
            `,
            backgroundSize: '200px 200px',
            animation: 'quantum-pulse 3s ease-in-out infinite'
          }} />
        </div>
      )}

      {/* Supreme AI Particles */}
      {supremeAI && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Advanced Control Panel */}
      <div className="absolute top-4 left-4 z-50 space-y-2">
        <Card className="bg-black/80 border-purple-500/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Máquina Suprema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={activateQuantumMode}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={showQuantumMode}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Modo Quantum
            </Button>
            
            <Button
              onClick={activateSupremeAI}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold"
              disabled={supremeAI}
            >
              <Crown className="w-4 h-4 mr-2" />
              IA Suprema
            </Button>
            
            <Button
              onClick={activateNeuralNetwork}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={neuralNetwork}
            >
              <Lightning className="w-4 h-4 mr-2" />
              Rede Neural
            </Button>
          </CardContent>
        </Card>

        {/* AI Power Meter */}
        <Card className="bg-black/80 border-purple-500/50 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-white text-sm mb-2">Poder da IA</div>
            <Progress 
              value={Math.min(100, projects.reduce((sum, p) => sum + (p.aiPower || 0), 0) / 100)} 
              className="h-2"
            />
            <div className="text-yellow-400 text-xs mt-1">
              {projects.reduce((sum, p) => sum + (p.aiPower || 0), 0).toLocaleString()} watts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        style={{
          transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Neural Network Connections */}
        {neuralNetwork && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {projects.map(project => 
              project.connections?.map(connectionId => {
                const targetProject = projects.find(p => p.id === connectionId);
                if (!targetProject) return null;
                
                return (
                  <line
                    key={`${project.id}-${connectionId}`}
                    x1={project.position.x + project.size.width / 2}
                    y1={project.position.y + project.size.height / 2}
                    x2={targetProject.position.x + targetProject.size.width / 2}
                    y2={targetProject.position.y + targetProject.size.height / 2}
                    stroke="url(#neural-gradient)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                );
              })
            )}
            <defs>
              <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f5ff" />
                <stop offset="50%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#00f5ff" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Projects */}
        {projects.map(project => {
          const IconComponent = projectTypeIcons[project.type] || FileText;
          const isSupreme = project.supremeMode || project.status === 'supreme';
          
          return (
            <Card
              key={project.id}
              className={`absolute transition-all duration-300 cursor-move ${
                isSupreme 
                  ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400 shadow-2xl shadow-yellow-400/50' 
                  : 'bg-gray-900/90 border-gray-700 hover:border-purple-500'
              } backdrop-blur-sm`}
              style={{
                left: project.position.x,
                top: project.position.y,
                width: project.size.width,
                height: project.size.height,
                zIndex: project.zIndex,
                transform: isSupreme ? 'scale(1.05)' : 'scale(1)',
                animation: isSupreme ? 'supreme-glow 2s ease-in-out infinite' : undefined
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                setDragStart({ x: e.clientX, y: e.clientY });
                setSelectedProject(project.id);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${isSupreme ? 'text-yellow-400' : 'text-white'}`} />
                    <CardTitle className={`text-sm ${isSupreme ? 'text-yellow-400' : 'text-white'}`}>
                      {project.title}
                    </CardTitle>
                    {isSupreme && <Crown className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <Badge className={`${statusColors[project.status]} text-white text-xs`}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2">
                {project.progress > 0 && (
                  <Progress 
                    value={project.progress} 
                    className={`h-1 ${isSupreme ? 'bg-yellow-400/20' : ''}`}
                  />
                )}
                
                {/* Quantum Level Display */}
                {showQuantumMode && project.quantumLevel && (
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-400">Quantum: {project.quantumLevel}%</span>
                  </div>
                )}
                
                {/* AI Power Display */}
                {project.aiPower && (
                  <div className="flex items-center gap-2 text-xs">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400">{project.aiPower} watts</span>
                  </div>
                )}
                
                {/* Links */}
                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.links.slice(0, 3).map(link => (
                      <Button
                        key={link.id}
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs bg-blue-600/20 border-blue-500 text-blue-400 hover:bg-blue-600/40"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <Link className="w-3 h-3 mr-1" />
                        {link.title}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Video Preview */}
                {project.videoUrl && (
                  <div className="bg-gray-800 rounded p-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Video className="w-3 h-3" />
                      Vídeo integrado
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Action Menu */}
      <div className="absolute bottom-6 right-6 space-y-2">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          onClick={() => onCreateProject('quantum', { x: 200, y: 200 })}
        >
          <Rocket className="w-6 h-6" />
        </Button>
        
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg text-black"
          onClick={() => onCreateProject('neural', { x: 300, y: 200 })}
        >
          <Brain className="w-6 h-6" />
        </Button>
        
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg"
          onClick={() => onCreateProject('fusion', { x: 400, y: 200 })}
        >
          <Flame className="w-6 h-6" />
        </Button>
      </div>

      <style jsx>{`
        @keyframes quantum-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        
        @keyframes supreme-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
        }
      `}</style>
    </div>
  );
}