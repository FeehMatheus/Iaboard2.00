import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Video, Music, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface DownloadFile {
  id: string;
  name: string;
  type: 'html' | 'pdf' | 'mp4' | 'mp3' | 'txt' | 'css' | 'js' | 'md';
  size: number;
  url: string;
  createdAt: string;
  module: string;
  status: 'ready' | 'generating' | 'failed';
}

interface DownloadsModuleProps {
  data: {
    files?: DownloadFile[];
    title?: string;
  };
  isConnectable: boolean;
}

export function DownloadsModule({ data, isConnectable }: DownloadsModuleProps) {
  const queryClient = useQueryClient();
  const [isMinimized, setIsMinimized] = useState(false);

  const { data: downloads, isLoading, refetch } = useQuery({
    queryKey: ['/api/downloads'],
    refetchInterval: 2000, // Auto-refresh every 2 seconds
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'mp4':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'mp3':
        return <Music className="w-4 h-4 text-green-500" />;
      case 'pdf':
      case 'html':
      case 'txt':
      case 'md':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const downloadFiles: DownloadFile[] = Array.isArray((downloads as any)?.files) ? (downloads as any).files : [];
  const totalFiles = downloadFiles.length;
  const totalSize = downloadFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-red-500"
      />
      
      <Card className={`bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl transition-all duration-300 ${
        isMinimized ? 'w-64 h-16' : 'w-80 h-96'
      }`}>
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
          <CardTitle className="flex items-center justify-between text-sm font-bold">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              DOWNLOADS ({totalFiles})
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  refetch();
                }}
                className="text-white hover:bg-red-700 h-6 w-6 p-0"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
              <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                {formatFileSize(totalSize)}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-3 pt-0">
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-center text-white/70 text-sm py-4">
                    Carregando downloads...
                  </div>
                ) : downloadFiles.length === 0 ? (
                  <div className="text-center text-white/70 text-sm py-8">
                    <Download className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhum arquivo disponível
                  </div>
                ) : (
                  downloadFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 transition-all hover:bg-white/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                                {file.module}
                              </Badge>
                              <span className="text-xs text-white/70">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          {file.status === 'ready' && (
                            <Button
                              asChild
                              size="sm"
                              className="bg-white/20 hover:bg-white/30 text-white h-7 w-7 p-0"
                            >
                              <a href={file.url} download target="_blank" rel="noopener noreferrer">
                                <Download className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(file.id)}
                            disabled={deleteMutation.isPending}
                            className="text-white hover:bg-red-700 h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {file.status === 'generating' && (
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <div className="animate-spin w-3 h-3 border border-white/30 border-t-white rounded-full"></div>
                          Gerando arquivo...
                        </div>
                      )}
                      
                      {file.status === 'ready' && (
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <CheckCircle className="w-3 h-3 text-green-300" />
                          Pronto para download
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        )}
      </Card>
      
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-red-500"
      />
    </div>
  );
}