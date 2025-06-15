import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedFile {
  id: string;
  name: string;
  type: string;
  purpose: string;
  size: number;
  createdAt: string;
}

const FileDownloadManager: React.FC = () => {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files);
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar arquivos",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`);
      
      if (!response.ok) {
        throw new Error('Erro no download');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Concluído",
        description: `Arquivo ${fileName} baixado com sucesso`,
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no Download",
        description: "Erro ao baixar arquivo",
        variant: "destructive"
      });
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setFiles(files.filter(f => f.id !== fileId));
        toast({
          title: "Arquivo Deletado",
          description: "Arquivo removido com sucesso",
        });
      } else {
        throw new Error('Erro ao deletar');
      }
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar arquivo",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'html':
      case 'css':
      case 'js':
      case 'json':
        return <FileText className={`${iconClass} text-blue-500`} />;
      case 'md':
      case 'txt':
        return <FileText className={`${iconClass} text-green-500`} />;
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      default:
        return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const getFileTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'html': 'bg-orange-100 text-orange-800',
      'css': 'bg-blue-100 text-blue-800',
      'js': 'bg-yellow-100 text-yellow-800',
      'json': 'bg-purple-100 text-purple-800',
      'md': 'bg-green-100 text-green-800',
      'txt': 'bg-gray-100 text-gray-800',
      'pdf': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Arquivos Gerados pela IA
          </CardTitle>
          <Button
            onClick={fetchFiles}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Carregando arquivos...
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum arquivo gerado ainda</p>
            <p className="text-sm">Execute algum módulo de IA para gerar conteúdo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getFileTypeColor(file.type)}`}
                      >
                        {file.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{file.purpose}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {new Date(file.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => downloadFile(file.id, file.name)}
                    size="sm"
                    variant="outline"
                    className="h-8"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar
                  </Button>
                  <Button
                    onClick={() => deleteFile(file.id)}
                    size="sm"
                    variant="ghost"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {files.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{files.length} arquivo(s) disponível(eis)</span>
              <span>
                Total: {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileDownloadManager;