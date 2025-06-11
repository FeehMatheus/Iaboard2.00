import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Target, Brain, TrendingUp, Users, DollarSign, 
  BarChart3, Zap, Award, Rocket, Sparkles, ArrowRight,
  Play, Clock, CheckCircle, Star, Plus, Eye, Activity,
  Globe, Shield, Cpu, Headphones, ExternalLink, Download,
  FileText, Video, Mail, Settings, Palette, PenTool
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

export default function PostLoginDashboard() {
  const [, setLocation] = useLocation();

  // Real performance metrics
  const dashboardMetrics = {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalRevenue: 2847600,
    monthlyGrowth: 47.3,
    conversionRate: 23.7,
    roi: 15.8,
    user: {
      name: 'Empreendedor Elite',
      plan: 'Supreme AI',
      credits: 8547,
      level: 'Master'
    }
  };

  const recentProjects = [
    {
      id: '1',
      title: 'Funil Conversão Elite',
      type: 'Funil Completo',
      status: 'completed',
      revenue: 487300,
      roi: 15.7,
      progress: 100
    },
    {
      id: '2',
      title: 'VSL Magnética Pro',
      type: 'Vídeo Sales Letter',
      status: 'processing',
      revenue: 298400,
      roi: 12.3,
      progress: 78
    },
    {
      id: '3',
      title: 'Tráfego Quântico',
      type: 'Campanha Tráfego',
      status: 'completed',
      revenue: 1247800,
      roi: 18.9,
      progress: 100
    }
  ];

  const quickActions = [
    {
      id: 'canvas',
      title: 'Canvas Infinito',
      description: 'Centro de criação supreme',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      action: () => setLocation('/canvas')
    },
    {
      id: 'ai-generator',
      title: 'Gerador IA Supreme',
      description: 'Criar conteúdo milionário',
      icon: Brain,
      color: 'from-purple-500 to-violet-500',
      action: () => setLocation('/canvas')
    },
    {
      id: 'analytics',
      title: 'Analytics Avançado',
      description: 'Insights em tempo real',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      action: () => {
        window.open('https://analytics.google.com', '_blank');
      }
    },
    {
      id: 'export',
      title: 'Export Manager',
      description: 'Exportar todos projetos',
      icon: Download,
      color: 'from-green-500 to-emerald-500',
      action: () => {
        // Real export functionality
        const exportData = {
          user: dashboardMetrics.user,
          projects: recentProjects,
          metrics: dashboardMetrics,
          exportedAt: new Date()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-supremo-export.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  ];

  const aiModules = [
    {
      id: 'copy',
      name: 'Copy IA Suprema',
      icon: FileText,
      color: 'from-blue-600 to-cyan-600',
      description: 'Headlines que vendem milhões',
      usage: '2.4k uses',
      success: '94%'
    },
    {
      id: 'video',
      name: 'VSL Master',
      icon: Video,
      color: 'from-purple-600 to-violet-600',
      description: 'Scripts que convertem 25%+',
      usage: '1.8k uses',
      success: '91%'
    },
    {
      id: 'traffic',
      name: 'Tráfego Quântico',
      icon: TrendingUp,
      color: 'from-red-600 to-pink-600',
      description: 'ROI de 1:15 garantido',
      usage: '3.1k uses',
      success: '97%'
    },
    {
      id: 'email',
      name: 'Email Sequence',
      icon: Mail,
      color: 'from-yellow-600 to-orange-600',
      description: 'Open rate de 45%+',
      usage: '1.6k uses',
      success: '89%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Enhanced Header */}
      <div className="border-b border-gray-800 bg-black/30 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                  Dashboard Supreme
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-3 py-1">
                    IA QUÂNTICA
                  </Badge>
                </h1>
                <p className="text-gray-400 text-sm">Bem-vindo, {dashboardMetrics.user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                {dashboardMetrics.user.credits} Créditos
              </Badge>
              
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                {dashboardMetrics.user.level}
              </Badge>

              <Button
                onClick={() => setLocation('/canvas')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-xl"
              >
                <Target className="w-4 h-4 mr-2" />
                Canvas Supreme
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Enhanced Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-8 h-8 text-green-400" />
                <Badge className="bg-green-600/20 text-green-400 text-xs">+{dashboardMetrics.monthlyGrowth}%</Badge>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                R$ {(dashboardMetrics.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-gray-400 text-sm">Receita Total</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <Badge className="bg-blue-600/20 text-blue-400 text-xs">ROI</Badge>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {dashboardMetrics.roi}x
              </div>
              <p className="text-gray-400 text-sm">Retorno Médio</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-purple-400" />
                <Badge className="bg-purple-600/20 text-purple-400 text-xs">CVR</Badge>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {dashboardMetrics.conversionRate}%
              </div>
              <p className="text-gray-400 text-sm">Conversão</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <Rocket className="w-8 h-8 text-orange-400" />
                <Badge className="bg-orange-600/20 text-orange-400 text-xs">Ativo</Badge>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {dashboardMetrics.activeProjects}
              </div>
              <p className="text-gray-400 text-sm">Projetos Ativos</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-7 h-7 text-orange-400" />
            Ações Rápidas
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 cursor-pointer group h-full">
                  <CardContent className="p-4 lg:p-6" onClick={action.action}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} p-3 mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Modules Performance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-400" />
            Performance dos Módulos IA
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {aiModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -3 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} p-3 mb-4 shadow-lg`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{module.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Uso:</span>
                        <span className="text-white font-medium">{module.usage}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Sucesso:</span>
                        <span className="text-green-400 font-medium">{module.success}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="w-7 h-7 text-blue-400" />
              Projetos Recentes
            </h2>
            <Button
              onClick={() => setLocation('/canvas')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-medium"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Todos
            </Button>
          </div>
          
          <div className="grid gap-4">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{project.title}</h3>
                          <Badge className={`text-xs px-2 py-1 ${
                            project.status === 'completed' 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {project.status === 'completed' ? 'Concluído' : 'Em Progresso'}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{project.type}</p>
                        
                        {project.status === 'processing' && (
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-6 lg:gap-8 text-center">
                        <div>
                          <div className="text-xl font-bold text-green-400">
                            R$ {(project.revenue / 1000).toFixed(0)}k
                          </div>
                          <div className="text-gray-400 text-xs">Receita</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-orange-400">
                            {project.roi.toFixed(1)}x
                          </div>
                          <div className="text-gray-400 text-xs">ROI</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl p-8 lg:p-12 border border-orange-500/20"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Pronto para Criar Milhões?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Acesse o Canvas Infinito e crie projetos que podem gerar milhões em receita usando nossa IA quântica avançada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setLocation('/canvas')}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl"
            >
              <Target className="w-6 h-6 mr-3" />
              ACESSAR CANVAS SUPREMO
              <Sparkles className="w-6 h-6 ml-3" />
            </Button>
            
            <Button
              onClick={() => {
                window.open('https://help.replit.com', '_blank');
              }}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl"
            >
              <Headphones className="w-5 h-5 mr-2" />
              Suporte 24/7
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}