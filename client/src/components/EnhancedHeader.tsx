import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Sparkles, 
  Brain, 
  Settings, 
  User, 
  LogOut, 
  Menu,
  Zap,
  Star,
  Crown,
  Rocket,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedHeaderProps {
  currentPage?: string;
  showAIStatus?: boolean;
  aiProgress?: number;
  currentStep?: string;
}

export default function EnhancedHeader({ 
  currentPage = 'Canvas', 
  showAIStatus = false, 
  aiProgress = 0,
  currentStep = ''
}: EnhancedHeaderProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Canvas IA', href: '/canvas', icon: <Sparkles className="w-4 h-4" />, active: currentPage === 'Canvas' },
    { name: 'Dashboard', href: '/dashboard', icon: <Globe className="w-4 h-4" />, active: currentPage === 'Dashboard' },
    { name: 'IA Superior', href: '/ai-dashboard', icon: <Brain className="w-4 h-4" />, active: currentPage === 'AI' },
  ];

  return (
    <motion.header 
      className="relative z-50 bg-gradient-to-r from-slate-950/95 via-purple-950/95 to-slate-950/95 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10 animate-pulse" />
      
      <div className="relative flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl blur-lg opacity-30" />
            <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              IA Board Superior
            </h1>
            <p className="text-xs text-gray-400">Versão Final Profissional</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navigationItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                item.active 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 text-cyan-400' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
              {item.active && (
                <motion.div
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
            </motion.a>
          ))}
        </nav>

        {/* AI Status Panel */}
        {showAIStatus && (
          <motion.div 
            className="flex items-center space-x-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 px-4 py-2 rounded-xl border border-purple-400/30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-5 h-5 text-cyan-400" />
              </motion.div>
              <div>
                <Badge variant="outline" className="border-cyan-400 text-cyan-400 text-xs">
                  IA Processando
                </Badge>
                <p className="text-xs text-gray-300 mt-1">{currentStep}</p>
              </div>
            </div>
            
            <div className="w-24">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progresso</span>
                <span>{aiProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${aiProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* Premium Badge */}
          <motion.div
            className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-yellow-400/30"
            whileHover={{ scale: 1.05 }}
          >
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">PREMIUM</span>
          </motion.div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/20">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-gray-900/95 backdrop-blur-xl border border-white/20" 
              align="end"
            >
              <div className="flex items-center space-x-3 p-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{user?.firstName || user?.username || 'Usuário'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'email@exemplo.com'}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                <Rocket className="mr-2 h-4 w-4" />
                <span>Upgrade Premium</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  item.active 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 text-cyan-400' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </nav>
        </motion.div>
      )}

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.header>
  );
}