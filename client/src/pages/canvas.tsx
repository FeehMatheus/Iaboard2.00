import { useState } from 'react';
import InfiniteCanvas from '@/components/InfiniteCanvas';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function CanvasPage() {
  const { toast } = useToast();

  const handleExport = async (canvasData: any) => {
    try {
      const response = await apiRequest('POST', '/api/export/complete-package', {
        workflowData: canvasData,
        productType: 'Canvas Workflow',
        completedSteps: canvasData.nodes?.map((n: any) => parseInt(n.id)).filter((id: number) => !isNaN(id)) || []
      });

      // Create download blob
      const blob = new Blob([JSON.stringify(response.package, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `produto-completo-canvas-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Exportação Concluída",
        description: `Pacote com ${response.fileCount} arquivos baixado com sucesso`
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
    <div className="h-screen">
      <InfiniteCanvas 
        onExport={handleExport}
        onSave={handleSave}
      />
    </div>
  );
}