import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Video, Music, Trash2, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface DownloadFile {
  id: string;
  name: string;
  type: 'html' | 'pdf' | 'mp4' | 'mp3' | 'txt';
  size: number;
  url: string;
  createdAt: string;
  module: string;
}

export default function Downloads() {
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ['/api/downloads'],
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/downloads/${fileId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erro ao deletar arquivo');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
    }
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/downloads/clear', {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erro ao limpar downloads');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
    }
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'html':
      case 'pdf':
      case 'txt':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'mp4':
        return <Video className="w-8 h-8 text-red-500" />;
      case 'mp3':
        return <Music className="w-8 h-8 text-green-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando downloads...</div>
      </div>
    );
  }

  const downloadFiles: DownloadFile[] = Array.isArray((files as any)?.files) ? (files as any).files : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Central de Downloads
          </h1>
          <p className="text-gray-600 mt-2">
            Todos os arquivos gerados pela IA ficam disponíveis aqui
          </p>
        </div>
        
        {downloadFiles.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => clearAllMutation.mutate()}
            disabled={clearAllMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Tudo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {downloadFiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Download className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Nenhum download disponível</h3>
              <p className="text-gray-600">
                Os arquivos gerados pelos módulos de IA aparecerão aqui automaticamente
              </p>
            </CardContent>
          </Card>
        ) : (
          downloadFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{file.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          {file.module}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(file.createdAt)}
                        </span>
                        <span>{formatFileSize(file.size)}</span>
                        <span className="uppercase font-medium">{file.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      asChild
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <a href={file.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(file.id)}
                      disabled={deleteMutation.isPending}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {downloadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Estatísticas dos Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{downloadFiles.length}</div>
                <div className="text-sm text-gray-600">Total de Arquivos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {formatFileSize(downloadFiles.reduce((total, file) => total + file.size, 0))}
                </div>
                <div className="text-sm text-gray-600">Tamanho Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Array.from(new Set(downloadFiles.map(f => f.module))).length}
                </div>
                <div className="text-sm text-gray-600">Módulos Utilizados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}