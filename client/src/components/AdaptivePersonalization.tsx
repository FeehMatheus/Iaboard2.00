import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  User, 
  Settings, 
  Zap, 
  Eye, 
  Clock, 
  Brain,
  Palette,
  Layout,
  MousePointer,
  Bell,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    animations: boolean;
    tooltips: boolean;
    autoSave: boolean;
    compactMode: boolean;
    shortcuts: boolean;
  };
  behavior: {
    sessionsCount: number;
    avgSessionTime: number;
    featuresUsed: string[];
    errorRate: number;
    lastActive: number;
  };
  adaptations: {
    interfaceComplexity: 'simple' | 'standard' | 'advanced';
    helpLevel: 'verbose' | 'standard' | 'minimal';
    automationLevel: number; // 0-100
  };
}

interface AdaptivePersonalizationProps {
  onProfileUpdate?: (profile: UserProfile) => void;
}

export const AdaptivePersonalization: React.FC<AdaptivePersonalizationProps> = ({
  onProfileUpdate
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user-profile');
    return saved ? JSON.parse(saved) : {
      id: 'user-' + Date.now(),
      level: 'beginner',
      preferences: {
        theme: 'dark',
        animations: true,
        tooltips: true,
        autoSave: true,
        compactMode: false,
        shortcuts: true
      },
      behavior: {
        sessionsCount: 1,
        avgSessionTime: 0,
        featuresUsed: [],
        errorRate: 0,
        lastActive: Date.now()
      },
      adaptations: {
        interfaceComplexity: 'simple',
        helpLevel: 'verbose',
        automationLevel: 70
      }
    };
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user-profile', JSON.stringify(profile));
    if (onProfileUpdate) {
      onProfileUpdate(profile);
    }
  }, [profile, onProfileUpdate]);

  // Analyze user behavior and suggest adaptations
  const analyzeAndAdapt = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate behavior analysis
      const sessionData = {
        currentSession: Date.now() - profile.behavior.lastActive,
        recentErrors: Math.floor(Math.random() * 3),
        featuresInteracted: ['chat', 'optimizer', 'analytics'],
        efficiency: Math.random() * 100
      };

      // Determine user level based on behavior
      let newLevel = profile.level;
      const { sessionsCount, featuresUsed } = profile.behavior;
      
      if (sessionsCount > 10 && featuresUsed.length > 15) {
        newLevel = 'advanced';
      } else if (sessionsCount > 3 && featuresUsed.length > 5) {
        newLevel = 'intermediate';
      }

      // Adapt interface complexity
      let interfaceComplexity: 'simple' | 'standard' | 'advanced' = 'simple';
      if (newLevel === 'advanced') interfaceComplexity = 'advanced';
      else if (newLevel === 'intermediate') interfaceComplexity = 'standard';

      // Adapt help level
      let helpLevel: 'verbose' | 'standard' | 'minimal' = 'verbose';
      if (newLevel === 'advanced') helpLevel = 'minimal';
      else if (newLevel === 'intermediate') helpLevel = 'standard';

      // Adapt automation level based on efficiency
      let automationLevel = profile.adaptations.automationLevel;
      if (sessionData.efficiency > 80) {
        automationLevel = Math.min(100, automationLevel + 10);
      } else if (sessionData.efficiency < 40) {
        automationLevel = Math.max(30, automationLevel - 10);
      }

      const updatedProfile = {
        ...profile,
        level: newLevel,
        behavior: {
          ...profile.behavior,
          sessionsCount: profile.behavior.sessionsCount + 1,
          featuresUsed: [...new Set([...profile.behavior.featuresUsed, ...sessionData.featuresInteracted])],
          errorRate: (profile.behavior.errorRate + sessionData.recentErrors) / 2,
          lastActive: Date.now()
        },
        adaptations: {
          interfaceComplexity,
          helpLevel,
          automationLevel
        }
      };

      setProfile(updatedProfile);

      toast({
        title: "Personalização atualizada",
        description: `Interface adaptada para usuário ${newLevel}`,
      });

    } catch (error) {
      console.error('Error analyzing behavior:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar o comportamento",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updatePreference = (key: keyof UserProfile['preferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const updateAdaptation = (key: keyof UserProfile['adaptations'], value: any) => {
    setProfile(prev => ({
      ...prev,
      adaptations: {
        ...prev.adaptations,
        [key]: value
      }
    }));
  };

  const resetProfile = () => {
    const defaultProfile: UserProfile = {
      id: 'user-' + Date.now(),
      level: 'beginner',
      preferences: {
        theme: 'dark',
        animations: true,
        tooltips: true,
        autoSave: true,
        compactMode: false,
        shortcuts: true
      },
      behavior: {
        sessionsCount: 1,
        avgSessionTime: 0,
        featuresUsed: [],
        errorRate: 0,
        lastActive: Date.now()
      },
      adaptations: {
        interfaceComplexity: 'simple',
        helpLevel: 'verbose',
        automationLevel: 70
      }
    };

    setProfile(defaultProfile);
    toast({
      title: "Perfil resetado",
      description: "Configurações voltaram ao padrão",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'bg-purple-100 text-purple-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'advanced': return <Brain className="h-4 w-4" />;
      case 'intermediate': return <Zap className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Personalização Adaptativa</h3>
              <p className="text-sm text-gray-600">Experiência personalizada baseada no seu uso</p>
            </div>
          </div>
          <Button
            onClick={analyzeAndAdapt}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Analisando...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analisar & Adaptar
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Level */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Nível do Usuário</h4>
            <Badge className={getLevelColor(profile.level)}>
              {getLevelIcon(profile.level)}
              <span className="ml-1 capitalize">{profile.level}</span>
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sessões:</span>
              <span className="font-medium ml-2">{profile.behavior.sessionsCount}</span>
            </div>
            <div>
              <span className="text-gray-600">Recursos usados:</span>
              <span className="font-medium ml-2">{profile.behavior.featuresUsed.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Taxa de erro:</span>
              <span className="font-medium ml-2">{profile.behavior.errorRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-purple-500" />
            Preferências
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Animações</span>
              </div>
              <Switch
                checked={profile.preferences.animations}
                onCheckedChange={(checked) => updatePreference('animations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Tooltips</span>
              </div>
              <Switch
                checked={profile.preferences.tooltips}
                onCheckedChange={(checked) => updatePreference('tooltips', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Auto-save</span>
              </div>
              <Switch
                checked={profile.preferences.autoSave}
                onCheckedChange={(checked) => updatePreference('autoSave', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Modo compacto</span>
              </div>
              <Switch
                checked={profile.preferences.compactMode}
                onCheckedChange={(checked) => updatePreference('compactMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Atalhos</span>
              </div>
              <Switch
                checked={profile.preferences.shortcuts}
                onCheckedChange={(checked) => updatePreference('shortcuts', checked)}
              />
            </div>
          </div>
        </div>

        {/* Adaptations */}
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            Adaptações Inteligentes
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Complexidade da Interface</span>
                <Badge variant="outline" className="text-xs">
                  {profile.adaptations.interfaceComplexity}
                </Badge>
              </div>
              <div className="flex gap-2">
                {['simple', 'standard', 'advanced'].map((level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={profile.adaptations.interfaceComplexity === level ? 'default' : 'outline'}
                    onClick={() => updateAdaptation('interfaceComplexity', level)}
                    className="flex-1 text-xs"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Nível de Ajuda</span>
                <Badge variant="outline" className="text-xs">
                  {profile.adaptations.helpLevel}
                </Badge>
              </div>
              <div className="flex gap-2">
                {['minimal', 'standard', 'verbose'].map((level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={profile.adaptations.helpLevel === level ? 'default' : 'outline'}
                    onClick={() => updateAdaptation('helpLevel', level)}
                    className="flex-1 text-xs"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Automação</span>
                <span className="text-sm font-medium">{profile.adaptations.automationLevel}%</span>
              </div>
              <Slider
                value={[profile.adaptations.automationLevel]}
                onValueChange={(value) => updateAdaptation('automationLevel', value[0])}
                max={100}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={resetProfile}
            variant="outline"
            className="flex-1"
          >
            <Shield className="h-4 w-4 mr-2" />
            Resetar Perfil
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
              toast({
                title: "Perfil copiado",
                description: "Dados do perfil copiados para área de transferência",
              });
            }}
            variant="outline"
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Usage Tips based on level */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 border border-purple-200">
          <h5 className="font-medium text-purple-800 mb-2">💡 Dica personalizada</h5>
          <p className="text-sm text-purple-700">
            {profile.level === 'beginner' && "Explore os tooltips para aprender sobre cada funcionalidade. Use Ctrl+N para adicionar novos módulos rapidamente."}
            {profile.level === 'intermediate' && "Experimente os atalhos de teclado para trabalhar mais rápido. Use o otimizador IA para melhorar seus funis."}
            {profile.level === 'advanced' && "Configure automações personalizadas e use a análise avançada para insights profundos. Considere modo compacto para mais espaço."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};