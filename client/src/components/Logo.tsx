import { Brain, Zap } from "lucide-react";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizes = {
    sm: { logo: 'w-8 h-8', text: 'text-lg', container: 'space-x-2' },
    md: { logo: 'w-10 h-10', text: 'text-xl', container: 'space-x-3' },
    lg: { logo: 'w-12 h-12', text: 'text-2xl', container: 'space-x-3' },
    xl: { logo: 'w-16 h-16', text: 'text-3xl', container: 'space-x-4' }
  };

  const sizeClasses = sizes[size];

  if (variant === 'icon') {
    return (
      <div className={`relative ${sizeClasses.logo} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl"></div>
        </div>
        <div className="relative flex items-center justify-center h-full">
          <Brain className="w-1/2 h-1/2 text-white drop-shadow-lg" />
          <Zap className="absolute bottom-0 right-0 w-1/3 h-1/3 text-yellow-300 drop-shadow-md" />
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={className}>
        <h1 className={`${sizeClasses.text} font-bold`}>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            IA Board V2
          </span>
        </h1>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${sizeClasses.container} ${className}`}>
      <div className={`relative ${sizeClasses.logo}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 rounded-2xl shadow-2xl transform rotate-3">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-2xl"></div>
        </div>
        <div className="relative flex items-center justify-center h-full">
          <Brain className="w-1/2 h-1/2 text-white drop-shadow-lg" />
          <Zap className="absolute bottom-1 right-1 w-1/3 h-1/3 text-yellow-300 drop-shadow-md animate-pulse" />
        </div>
      </div>
      <div>
        <h1 className={`${sizeClasses.text} font-bold leading-tight`}>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            IA Board V2
          </span>
        </h1>
        <p className="text-xs text-gray-400 font-medium">by FILIPPE</p>
      </div>
    </div>
  );
}