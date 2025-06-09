import { Download, FileText, Archive, Video, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExportOptions() {
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
        >
          <FileText className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">PDF</span>
          <span className="text-xs text-gray-400">Relatório completo</span>
        </Button>
        <Button 
          variant="ghost" 
          className="glass-dark hover:bg-white/10 transition-all duration-300 p-4 h-auto rounded-xl flex-col group"
        >
          <Archive className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">ZIP</span>
          <span className="text-xs text-gray-400">Arquivos do projeto</span>
        </Button>
        <Button 
          variant="ghost" 
          className="glass-dark hover:bg-white/10 transition-all duration-300 p-4 h-auto rounded-xl flex-col group"
        >
          <Video className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">MP4</span>
          <span className="text-xs text-gray-400">Apresentação em vídeo</span>
        </Button>
        <Button 
          variant="ghost" 
          className="glass-dark hover:bg-white/10 transition-all duration-300 p-4 h-auto rounded-xl flex-col group"
        >
          <Code className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-white font-semibold block">JSON</span>
          <span className="text-xs text-gray-400">Dados estruturados</span>
        </Button>
      </div>
    </div>
  );
}
