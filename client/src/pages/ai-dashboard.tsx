import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Download, Eye, BarChart3, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import FunnelGenerator from '@/components/FunnelGenerator';
import ContentGenerator from '@/components/ContentGenerator';
import Header from '@/components/Header';

export default function AIDashboard() {
  const [showFunnelGenerator, setShowFunnelGenerator] = useState(false);
  const [activeTab, setActiveTab] = useState('funnels');

  // Fetch user's funnels
  const { data: funnels = [], isLoading: funnelsLoading } = useQuery({
    queryKey: ['/api/funnels']
  });

  const handleFunnelComplete = (funnel: any) => {
    setShowFunnelGenerator(false);
    // Refresh funnels list
    window.location.reload();
  };

  const downloadFunnel = (funnelId: number, format: string) => {
    window.open(`/api/funnels/${funnelId}/download/${format}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            IA Board V2 - Dashboard
          </h1>
          <p className="text-gray-600">
            Plataforma completa de criação de funis com inteligência artificial
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="funnels">Meus Funis</TabsTrigger>
            <TabsTrigger value="generator">Gerador IA</TabsTrigger>
            <TabsTrigger value="content">Conteúdo IA</TabsTrigger>
            <TabsTrigger value="analytics" className="hidden lg:flex">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="funnels" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Funis Criados</h2>
              <Button onClick={() => setShowFunnelGenerator(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Funil IA
              </Button>
            </div>

            {funnelsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : funnels.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum funil criado ainda</h3>
                  <p className="text-gray-600 mb-4">
                    Comece criando seu primeiro funil com IA
                  </p>
                  <Button onClick={() => setShowFunnelGenerator(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Funil
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {funnels.map((funnel: any) => (
                  <Card key={funnel.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{funnel.name || funnel.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {funnel.productType}
                          </Badge>
                        </div>
                        <Badge variant={funnel.isCompleted ? "default" : "secondary"}>
                          {funnel.isCompleted ? "Completo" : `Etapa ${funnel.currentStep}`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {funnel.description || `Funil para ${funnel.productType}`}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadFunnel(funnel.id, 'html')}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Gerador de Funis IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Crie funis completos com IA
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Nossa inteligência artificial cria estratégias personalizadas para seu negócio
                  </p>
                  <Button onClick={() => setShowFunnelGenerator(true)} size="lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Iniciar Geração IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <ContentGenerator />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Funis Criados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {funnels.length}
                  </div>
                  <p className="text-sm text-gray-600">Total de funis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Funis Completos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {funnels.filter((f: any) => f.isCompleted).length}
                  </div>
                  <p className="text-sm text-gray-600">Finalizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    IA Utilizada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    100%
                  </div>
                  <p className="text-sm text-gray-600">Dos funis com IA</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FunnelGenerator
        isOpen={showFunnelGenerator}
        onClose={() => setShowFunnelGenerator(false)}
        onComplete={handleFunnelComplete}
      />
    </div>
  );
}