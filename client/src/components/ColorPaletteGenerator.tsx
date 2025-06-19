import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Palette, 
  Shuffle, 
  Download, 
  Copy, 
  Sparkles,
  Eye,
  Heart,
  Zap,
  RefreshCw,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  mood: 'energetic' | 'calm' | 'professional' | 'creative' | 'trustworthy';
  usage: string[];
}

interface ColorPaletteGeneratorProps {
  onPaletteSelect?: (palette: ColorPalette) => void;
  currentTheme?: string;
}

export const ColorPaletteGenerator: React.FC<ColorPaletteGeneratorProps> = ({
  onPaletteSelect,
  currentTheme = 'dark'
}) => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [generationParams, setGenerationParams] = useState({
    mood: 'professional',
    brightness: 50,
    saturation: 70,
    contrast: 60,
    baseColor: '#3b82f6'
  });
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  // Load saved palettes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('color-palettes');
    if (saved) {
      setSavedPalettes(JSON.parse(saved));
    }
  }, []);

  // Save palettes to localStorage
  useEffect(() => {
    localStorage.setItem('color-palettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const generateAIPalette = async () => {
    setIsGenerating(true);

    try {
      // Simulate AI-powered color generation
      const baseHue = hexToHsl(generationParams.baseColor).h;
      const brightness = generationParams.brightness / 100;
      const saturation = generationParams.saturation / 100;
      const contrast = generationParams.contrast / 100;

      // Generate harmonious colors based on color theory
      const colors = {
        primary: generationParams.baseColor,
        secondary: hslToHex((baseHue + 60) % 360, saturation * 0.8, brightness * 0.9),
        accent: hslToHex((baseHue + 180) % 360, saturation * 1.2, brightness * 0.7),
        background: currentTheme === 'dark' 
          ? hslToHex(baseHue, saturation * 0.1, 0.05 + brightness * 0.1)
          : hslToHex(baseHue, saturation * 0.1, 0.95 - brightness * 0.1),
        surface: currentTheme === 'dark'
          ? hslToHex(baseHue, saturation * 0.2, 0.1 + brightness * 0.15)
          : hslToHex(baseHue, saturation * 0.2, 0.9 - brightness * 0.15),
        text: currentTheme === 'dark'
          ? hslToHex(baseHue, saturation * 0.1, 0.9 + contrast * 0.1)
          : hslToHex(baseHue, saturation * 0.1, 0.1 - contrast * 0.05)
      };

      // Generate palette metadata based on parameters
      const moodDescriptions = {
        energetic: 'Cores vibrantes que transmitem energia e dinamismo',
        calm: 'Tons suaves que promovem tranquilidade e foco',
        professional: 'Palette equilibrada para ambientes corporativos',
        creative: 'Combinação ousada que estimula a criatividade',
        trustworthy: 'Cores que inspiram confiança e credibilidade'
      };

      const usageMap = {
        energetic: ['Marketing', 'Startups', 'Fitness', 'Gaming'],
        calm: ['Saúde', 'Educação', 'Wellness', 'Meditação'],
        professional: ['Negócios', 'Finanças', 'Consultoria', 'Tecnologia'],
        creative: ['Design', 'Arte', 'Publicidade', 'Moda'],
        trustworthy: ['Bancos', 'Seguros', 'Governo', 'Saúde']
      };

      const palette: ColorPalette = {
        id: 'palette-' + Date.now(),
        name: `Palette ${generationParams.mood} IA`,
        description: moodDescriptions[generationParams.mood as keyof typeof moodDescriptions],
        colors,
        mood: generationParams.mood as ColorPalette['mood'],
        usage: usageMap[generationParams.mood as keyof typeof usageMap]
      };

      setCurrentPalette(palette);

      toast({
        title: "Palette gerada",
        description: `Nova combinação ${generationParams.mood} criada com IA`,
      });

    } catch (error) {
      console.error('Error generating palette:', error);
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar a palette",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePalette = () => {
    if (!currentPalette) return;
    
    if (savedPalettes.find(p => p.id === currentPalette.id)) {
      toast({
        title: "Palette já salva",
        description: "Esta palette já está na sua coleção",
        variant: "destructive"
      });
      return;
    }

    setSavedPalettes(prev => [...prev, currentPalette]);
    toast({
      title: "Palette salva",
      description: "Adicionada à sua coleção",
    });
  };

  const applyPalette = (palette: ColorPalette) => {
    if (onPaletteSelect) {
      onPaletteSelect(palette);
    }

    // Apply to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', palette.colors.primary);
    root.style.setProperty('--secondary', palette.colors.secondary);
    root.style.setProperty('--accent', palette.colors.accent);

    toast({
      title: "Palette aplicada",
      description: `Tema ${palette.name} ativado`,
    });
  };

  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
      
      toast({
        title: "Cor copiada",
        description: `${color} copiado para área de transferência`,
      });
    } catch (error) {
      console.error('Failed to copy color:', error);
    }
  };

  const exportPalette = () => {
    if (!currentPalette) return;

    const exportData = {
      ...currentPalette,
      exportedAt: new Date().toISOString(),
      css: Object.entries(currentPalette.colors).map(([key, value]) => 
        `--${key}: ${value};`
      ).join('\n')
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${currentPalette.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Color utility functions
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s, l };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'energetic': return <Zap className="h-4 w-4" />;
      case 'calm': return <Heart className="h-4 w-4" />;
      case 'creative': return <Sparkles className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Gerador de Palettes IA</h3>
              <p className="text-sm text-gray-600">Cores inteligentes para seu projeto</p>
            </div>
          </div>
          <Button
            onClick={generateAIPalette}
            disabled={isGenerating}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Palette
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Generation Parameters */}
        <div className="bg-white rounded-lg p-4 border border-pink-100">
          <h4 className="font-medium text-gray-800 mb-4">Parâmetros de Geração</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Mood</label>
              <div className="flex gap-2 flex-wrap">
                {['energetic', 'calm', 'professional', 'creative', 'trustworthy'].map((mood) => (
                  <Button
                    key={mood}
                    size="sm"
                    variant={generationParams.mood === mood ? 'default' : 'outline'}
                    onClick={() => setGenerationParams(prev => ({ ...prev, mood }))}
                    className="text-xs"
                  >
                    {getMoodIcon(mood)}
                    <span className="ml-1 capitalize">{mood}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">Cor Base</label>
              <Input
                type="color"
                value={generationParams.baseColor}
                onChange={(e) => setGenerationParams(prev => ({ ...prev, baseColor: e.target.value }))}
                className="w-full h-10"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Brilho: {generationParams.brightness}%
              </label>
              <Slider
                value={[generationParams.brightness]}
                onValueChange={([value]) => setGenerationParams(prev => ({ ...prev, brightness: value }))}
                max={100}
                min={0}
                step={5}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Saturação: {generationParams.saturation}%
              </label>
              <Slider
                value={[generationParams.saturation]}
                onValueChange={([value]) => setGenerationParams(prev => ({ ...prev, saturation: value }))}
                max={100}
                min={0}
                step={5}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Contraste: {generationParams.contrast}%
              </label>
              <Slider
                value={[generationParams.contrast]}
                onValueChange={([value]) => setGenerationParams(prev => ({ ...prev, contrast: value }))}
                max={100}
                min={0}
                step={5}
              />
            </div>
          </div>
        </div>

        {/* Current Palette */}
        {currentPalette && (
          <div className="bg-white rounded-lg p-4 border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-800">{currentPalette.name}</h4>
                <p className="text-sm text-gray-600">{currentPalette.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-pink-100 text-pink-700">
                  {getMoodIcon(currentPalette.mood)}
                  <span className="ml-1 capitalize">{currentPalette.mood}</span>
                </Badge>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {Object.entries(currentPalette.colors).map(([name, color]) => (
                <div key={name} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border-2 border-gray-200 cursor-pointer transition-transform hover:scale-105 relative"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                  >
                    {copiedColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 capitalize">{name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color}</p>
                </div>
              ))}
            </div>

            {/* Usage Tags */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Ideal para:</p>
              <div className="flex gap-2 flex-wrap">
                {currentPalette.usage.map((use, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {use}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => applyPalette(currentPalette)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
              <Button
                onClick={savePalette}
                variant="outline"
                className="flex-1"
              >
                <Heart className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                onClick={exportPalette}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        )}

        {/* Saved Palettes */}
        {savedPalettes.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-pink-100">
            <h4 className="font-medium text-gray-800 mb-3">
              Palettes Salvas ({savedPalettes.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedPalettes.slice(-4).map((palette) => (
                <div
                  key={palette.id}
                  className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => applyPalette(palette)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium">{palette.name}</h5>
                    <Badge variant="outline" className="text-xs">
                      {palette.mood}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {Object.values(palette.colors).slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!currentPalette && (
          <div className="text-center py-8">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              Gere sua primeira palette
            </h4>
            <p className="text-gray-500 mb-4">
              Configure os parâmetros e clique em "Gerar Palette" para criar cores inteligentes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};