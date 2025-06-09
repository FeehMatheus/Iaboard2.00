import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Eye, Video, TrendingUp, FileText, Folder, Plus, LogOut, Settings, Crown, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { Tool, Funnel } from "@shared/schema";
import AnimatedBackground from "@/components/AnimatedBackground";
import Logo from "@/components/Logo";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const { data: tools = [] } = useQuery<Tool[]>({
    queryKey: ['/api/tools'],
    refetchOnWindowFocus: false,
  });

  const { data: funnels = [] } = useQuery<Funnel[]>({
    queryKey: ['/api/funnels'],
    refetchOnWindowFocus: false,
  });

  const iconMap: { [key: string]: any } = {
    Zap,
    Eye,
    Video,
    TrendingUp,
    FileText,
    Folder
  };

  const getToolIcon = (iconName: string) => {
    return iconMap[iconName] || Zap;
  };

  const getUserTools = (): Tool[] => {
    if (!user?.planLimits?.tools) return tools.filter((tool: Tool) => tool.planRequired === 'free');
    
    const planTools = user.planLimits.tools as string[];
    if (planTools.includes('all')) {
      return tools;
    }
    
    return tools.filter((tool: Tool) => 
      planTools.includes(tool.name) || tool.planRequired === 'free'
    );
  };

  // Fetch user funnels and tools
  const { data: userFunnels = [], isLoading: funnelsLoading } = useQuery({
    queryKey: ['/api/funnels']
  });

  const { data: userToolsData = [], isLoading: toolsLoading } = useQuery({
    queryKey: ['/api/tools']
  });

  const handleToolSelect = (tool: Tool) => {
    if (tool.name === "IA Board V2 - Criador de Funis") {
      // Navigate to funnel creator
      window.location.href = '/funnel';
    } else {
      setSelectedTool(tool);
      // Implement tool-specific functionality based on tool type
      switch (tool.name) {
        case "IA Espiã v2":
          // Start competitor analysis
          console.log("Starting IA Espiã v2 analysis...");
          break;
        case "VSL Automático":
          // Start VSL creation
          console.log("Starting VSL creation...");
          break;
        case "Copy Inteligente":
          // Start copy generation
          console.log("Starting copy generation...");
          break;
        default:
          console.log(`Launching ${tool.name}...`);
      }
    }
  };

  const handleCreateNewFunnel = () => {
    // Navigate to funnel creation page
    window.location.href = '/funnel';
  };

  const handleUpgradePlan = () => {
    // Show upgrade modal or navigate to pricing
    alert("Upgrade feature coming soon! Contact support for immediate upgrade.");
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getPlanBadgeColor = (plan: string) => {
    const colors = {
      free: "bg-gray-500",
      starter: "bg-blue-500",
      pro: "bg-purple-500",
      enterprise: "bg-gold-500"
    };
    return colors[plan as keyof typeof colors] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/';
    return null;
  }

  const userTools = getUserTools();

  return (
    <div className="font-inter bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="glass-effect rounded-2xl p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPlanBadgeColor(user.plan || 'free')} text-white border-0 text-xs`}>
                      {user.plan?.toUpperCase() || 'FREE'}
                    </Badge>
                    {user.plan !== 'enterprise' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-6 px-2 text-indigo-400 border-indigo-400 hover:bg-indigo-400 hover:text-white"
                        onClick={handleUpgradePlan}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="glass-effect hover:bg-white/20 transition-all duration-300 text-white border-white/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="glass-effect hover:bg-red-500/20 transition-all duration-300 text-white border-white/20 hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Bem-vindo de volta,</span>
            <br />
            <span className="gradient-text">{user.firstName}!</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Escolha uma ferramenta abaixo para começar a criar conteúdo inteligente 
            com o poder da inteligência artificial.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Funis Criados</CardTitle>
              <BarChart3 className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Array.isArray(userFunnels) ? userFunnels.length : 0}</div>
              <p className="text-xs text-gray-400">
                {user?.planLimits?.funnels === -1 ? 'Ilimitados' : `${user?.planLimits?.funnels || 3} disponíveis`}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Gerações de IA</CardTitle>
              <Zap className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-400">
                {user?.planLimits?.aiGenerations === -1 ? 'Ilimitadas' : `${user?.planLimits?.aiGenerations || 50} disponíveis`}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Ferramentas</CardTitle>
              <Users className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userTools.length}</div>
              <p className="text-xs text-gray-400">Ferramentas disponíveis</p>
            </CardContent>
          </Card>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <Zap className="w-6 h-6 mr-3 text-indigo-400" />
            Suas Ferramentas de IA
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTools.map((tool: Tool, index: number) => {
              const IconComponent = getToolIcon(tool.icon);
              const isLocked = user.planLimits?.tools && !user.planLimits.tools.includes(tool.name) && !user.planLimits.tools.includes('all') && tool.planRequired !== 'free';
              
              return (
                <Card 
                  key={tool.id}
                  className={`glass-effect border-white/20 hover:bg-white/15 transition-all duration-300 animate-fade-in cursor-pointer group ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => !isLocked && handleToolSelect(tool)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${getPlanBadgeColor(tool.planRequired || 'free')} text-white border-0 text-xs`}>
                        {tool.planRequired?.toUpperCase() || 'FREE'}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLocked ? (
                      <Button disabled className="w-full opacity-50">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Necessário
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all duration-300"
                      >
                        Usar Ferramenta
                        <Zap className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Funnels */}
        {funnels.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Folder className="w-6 h-6 mr-3 text-emerald-400" />
              Funis Recentes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funnels.slice(0, 6).map((funnel: Funnel, index: number) => (
                <Card 
                  key={funnel.id}
                  className="glass-effect border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{funnel.name}</CardTitle>
                      <Badge variant="outline" className="text-gray-300 border-gray-500">
                        {funnel.productType}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      Etapa {funnel.currentStep}/8 • {funnel.isCompleted ? 'Concluído' : 'Em andamento'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((funnel.currentStep || 0) / 8) * 100}%` }}
                      ></div>
                    </div>
                    <Button variant="outline" className="w-full text-white border-white/30 hover:bg-white/10">
                      Continuar Funil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="glass-effect rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Pronto para Começar?</h3>
          <p className="text-gray-300 mb-8">
            Crie seu primeiro funil inteligente ou explore nossas ferramentas avançadas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleToolSelect(userTools.find(t => t.name === "IA Board V2 - Criador de Funis") || userTools[0])}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 h-auto rounded-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Funil
            </Button>
            
            <Button 
              variant="outline"
              className="glass-effect hover:bg-white/10 text-white border-white/30 font-semibold px-8 py-4 h-auto rounded-xl transition-all duration-300"
            >
              <Eye className="w-5 h-5 mr-2" />
              Explorar Templates
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}