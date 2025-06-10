import { useState, useEffect } from 'react';
import SuperiorInfiniteCanvas from '@/components/SuperiorInfiniteCanvas';
import EnhancedHeader from '@/components/EnhancedHeader';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function CanvasPage() {
  const { toast } = useToast();
  const [isPowerfulAIMode, setIsPowerfulAIMode] = useState(false);

  useEffect(() => {
    // Detectar se foi acessado via modo "IA Pensamento Poderoso"
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'powerful-ai') {
      setIsPowerfulAIMode(true);
      toast({
        title: "IA Pensamento Poderoso Ativada",
        description: "Sistema inteligente que combina as melhores IAs do mundo para resultados superiores"
      });
    }
  }, []);

  const handleExport = async (canvasData: any) => {
    try {
      const response = await apiRequest('POST', '/api/export/complete-package', {
        workflowData: canvasData,
        productType: 'Canvas Workflow',
        completedSteps: canvasData.nodes?.map((n: any) => parseInt(n.id)).filter((id: number) => !isNaN(id)) || []
      });

      // Create ZIP file with all content
      const JSZip = (await import('jszip')).default;
      const zipFile = new JSZip();
      
      // Add all files from the response
      const responseData = response as any;
      if (responseData.files) {
        Object.entries(responseData.files).forEach(([filename, content]) => {
          zipFile.file(filename, content as string);
        });
      }
      
      // Generate ZIP blob
      const zipBlob = await zipFile.generateAsync({ type: 'blob' });
      
      // Download the ZIP file
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `produto-completo-ia-pensamento-poderoso-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Concluído",
        description: `Pacote completo com ${Object.keys(responseData.files || {}).length} arquivos baixado com sucesso`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erro na Exportação",
        description: "Falha ao gerar o pacote completo",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (canvasData: any) => {
    try {
      await apiRequest('POST', '/api/canvas/save', canvasData);
      toast({
        title: "Projeto Salvo",
        description: "Canvas salvo com sucesso"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Falha ao salvar o projeto",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      <SuperiorInfiniteCanvas 
        onExport={handleExport}
        onSave={handleSave}
        powerfulAIMode={isPowerfulAIMode}
      />
    </div>
  );
}