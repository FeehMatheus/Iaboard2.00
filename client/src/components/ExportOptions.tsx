import { Download, FileText, Archive, Video, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  funnelId?: number;
}

export default function ExportOptions({ funnelId }: ExportOptionsProps) {
  const { toast } = useToast();

  const handleDownload = async (format: string) => {
    if (!funnelId) {
      toast({
        title: "Erro",
        description: "Nenhum funil selecionado para download",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/funnels/${funnelId}/download/${format}`);
      
      if (!response.ok) {
        throw new Error(`Falha no download: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `funnel.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Concluído",
        description: `Arquivo ${format.toUpperCase()} baixado com sucesso`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erro no Download",
        description: "Falha ao baixar arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
        <Download className="w-6 h-6 text-indigo-400" />
        <span>Opções de Exportação</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="ghost" 
          className="glass-dark hover:bg-white/10 transition-all duration-300 p-4 h-auto rounded-xl flex-col group"
          onClick={() => handleDownload('pdf')}
        >
          <FileText className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">PDF</span>
          <span className="text-xs text-gray-400">Relatório completo</span>
        </Button>
        <Button 
          variant="ghost" 
          className="glass-dark hover:bg-white/10 transition-all duration-300 p-4 h-auto rounded-xl flex-col group"
          onClick={() => handleDownload('html')}
        >
          <Code className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">HTML</span>
          <span className="text-xs text-gray-400">Página web</span>
        </Button>
        <Button 
          variant="ghost" 
          className="glass-dark hover:bg-white/10 transition-all duration-300 p-4 h-auto rounded-xl flex-col group"
          onClick={() => handleDownload('json')}
        >
          <Archive className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">JSON</span>
          <span className="text-xs text-gray-400">Dados estruturados</span>
        </Button>
        <Button 
          variant="ghost" 
          className="glass-dark hover:bg-white/10 transition-all duration-300 p-4 h-auto rounded-xl flex-col group"
          onClick={() => handleDownload('txt')}
        >
          <FileText className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">TXT</span>
          <span className="text-xs text-gray-400">Texto simples</span>
        </Button>
      </div>
    </div>
  );
}
