import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Target, Brain, TrendingUp, Users, DollarSign, 
  BarChart3, Zap, Award, Rocket, Sparkles, ArrowRight,
  Play, Clock, CheckCircle, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { SupremeNotificationSystem } from '@/components/ui/supreme-notification-system';
import { AdvancedCTAModal, QuickActionCTA } from '@/components/ui/advanced-cta-system';

export default function PostLoginDashboard() {
  const [, setLocation] = useLocation();
  const [showNotification, setShowNotification] = useState(true);
  const [showCTAModal, setShowCTAModal] = useState(false);
  const [userName, setUserName] = useState('Empreendedor');

  // Mock data with realistic values
  const dashboardData = {
    totalProjects: 8,
    completedProjects: 5,
    activeProjects: 3,
    totalRevenue: 'R$ 47.300',
    conversionRate: '12.7%',
    user: {
      name: 'Empreendedor',
      email: 'usuario@email.com'
    }
  };

  const quickActions = [
    {
      title: 'Canvas Infinito',
      description: 'Crie projetos ilimitados',
      icon: Target,
      path: '/canvas',
      color: 'from-blue-500 to-purple-600',
      stats: '∞ Projetos'
    },
    {
      title: 'IA Suprema',
      description: 'Sistema de IA avançado',
      icon: Brain,
      path: '/platform',
      color: 'from-purple-500 to-pink-600',
      stats: 'Claude + GPT-4'
    },
    {
      title: 'Tráfego Ultra',
      description: 'Campanhas otimizadas',
      icon: TrendingUp,
      path: '/supreme',
      color: 'from-green-500 to-teal-600',
      stats: 'ROI 12.7x'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Funil de Conversão Premium',
      type: 'Funil',
      status: 'Ativo',
      revenue: 'R$ 18.500',
      progress: 95
    },
    {
      id: 2,
      title: 'Campanha VSL Suprema',
      type: 'Vídeo',
      status: 'Processando',
      revenue: 'R$ 12.800',
      progress: 67
    },
    {
      id: 3,
      title: 'Landing Page Ultra',
      type: 'Copy',
      status: 'Concluído',
      revenue: 'R$ 16.000',
      progress: 100
    }
  ];

  const metrics = [
    {
      title: 'Projetos Ativos',
      value: dashboardData.activeProjects.toString(),
      change: '+2 esta semana',
      icon: Target,
      color: 'text-blue-400'
    },
    {
      title: 'Faturamento Total',
      value: dashboardData.totalRevenue,
      change: '+23% este mês',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Taxa Conversão',
      value: dashboardData.conversionRate,
      change: '+5.2% este mês',
      icon: TrendingUp,
      color: 'text-orange-400'
    },
    {
      title: 'Projetos Concluídos',
      value: dashboardData.completedProjects.toString(),
      change: 'Total acumulado',
      icon: CheckCircle,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Supremo</h1>
                <p className="text-gray-400">Bem-vindo, {dashboardData.user.name}</p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Sistema Ativo
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                      <p className="text-xs text-gray-500">{metric.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setLocation(action.path)}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} p-3 mb-4`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-400 mb-4">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                        {action.stats}
                      </span>
                      <ArrowRight className="w-5 h-5 text-orange-400" />
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
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Projetos Recentes</h2>
            <Button
              onClick={() => setLocation('/canvas')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          <div className="grid gap-4">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                          <Badge className={`text-xs px-2 py-1 ${
                            project.status === 'Ativo' ? 'bg-green-600' :
                            project.status === 'Processando' ? 'bg-yellow-600' :
                            'bg-blue-600'
                          }`}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{project.type}</p>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{project.progress}% concluído</p>
                      </div>
                      
                      <div className="text-right ml-6">
                        <p className="text-lg font-bold text-green-400">{project.revenue}</p>
                        <p className="text-xs text-gray-500">Faturamento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <Button
            onClick={() => setShowCTAModal(true)}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 text-lg rounded-xl"
          >
            <Rocket className="w-5 h-5 mr-3" />
            EXPLORAR TODAS AS FUNCIONALIDADES
            <Sparkles className="w-5 h-5 ml-3" />
          </Button>
        </motion.div>
      </div>

      {/* Notification System */}
      <SupremeNotificationSystem
        isVisible={showNotification}
        onComplete={() => setShowNotification(false)}
        type="success"
      />

      {/* Advanced CTA Modal */}
      <AdvancedCTAModal
        isOpen={showCTAModal}
        onClose={() => setShowCTAModal(false)}
        onNavigate={(path) => setLocation(path)}
      />

      {/* Quick Action CTA */}
      <QuickActionCTA onOpenModal={() => setShowCTAModal(true)} />
    </div>
  );
}