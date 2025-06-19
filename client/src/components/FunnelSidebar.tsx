import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FunnelOptimizer } from '@/components/FunnelOptimizer';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { Plus, Folder, FolderOpen, Edit3, Copy, Trash2, MoreVertical, ChevronDown, ChevronRight, Star, Archive, Settings, Brain, BarChart3 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { IntelligentTooltip, generateContextTooltip } from '@/components/IntelligentTooltip';
import { useTooltipContext } from '@/hooks/useTooltipContext';

interface FunnelSidebarProps {
  sidebarOpen: boolean;
  settings: any;
  setSettings: (settings: any) => void;
  currentBoard: any;
  switchToBoard: (boardId: string) => void;
  expandedFolders: Set<string>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const FunnelSidebar: React.FC<FunnelSidebarProps> = ({
  sidebarOpen,
  settings,
  setSettings,
  currentBoard,
  switchToBoard,
  expandedFolders,
  setExpandedFolders
}) => {
  const { toast } = useToast();
  const { trackFeatureInteraction, getAdaptiveDelay } = useTooltipContext();
  const [newItemDialog, setNewItemDialog] = useState<{type: 'board' | 'folder', parentId?: string} | null>(null);
  const [newItemForm, setNewItemForm] = useState({name: '', description: '', color: '#3b82f6'});
  const [editingItem, setEditingItem] = useState<{type: 'board' | 'folder', id: string} | null>(null);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const createNewFolder = () => {
    const folderId = nanoid();
    const newFolder = {
      id: folderId,
      name: newItemForm.name || 'Nova Pasta',
      color: newItemForm.color,
      createdAt: Date.now(),
      parentId: newItemDialog?.parentId
    };

    setSettings({
      ...settings,
      folders: [...(settings.folders || []), newFolder]
    });

    setExpandedFolders(prev => new Set([...prev, folderId]));
    toast({
      title: "✅ Pasta criada",
      description: `${newFolder.name} foi adicionada`,
    });
    closeDialog();
  };

  const createNewBoard = () => {
    const boardId = nanoid();
    const newBoard = {
      id: boardId,
      name: newItemForm.name || `Funil ${settings.boards.length + 1}`,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      description: newItemForm.description,
      folderId: newItemDialog?.parentId || 'default-folder',
      color: newItemForm.color
    };

    setSettings({
      ...settings,
      boards: [...settings.boards, newBoard],
      currentBoardId: boardId
    });

    toast({
      title: "🚀 Funil criado",
      description: `${newBoard.name} está ativo`,
    });
    closeDialog();
  };

  const closeDialog = () => {
    setNewItemDialog(null);
    setNewItemForm({name: '', description: '', color: '#3b82f6'});
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getBoardsByFolder = (folderId: string) => {
    return settings.boards?.filter((board: any) => board.folderId === folderId) || [];
  };

  const getSubFolders = (parentId?: string) => {
    return settings.folders?.filter((folder: any) => folder.parentId === parentId) || [];
  };

  const duplicateBoard = (boardId: string) => {
    const originalBoard = settings.boards.find((b: any) => b.id === boardId);
    if (!originalBoard) return;

    const newBoardId = nanoid();
    const duplicatedBoard = {
      ...originalBoard,
      id: newBoardId,
      name: `${originalBoard.name} (Cópia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSettings({
      ...settings,
      boards: [...(settings.boards || []), duplicatedBoard]
    });

    toast({
      title: "📋 Funil duplicado",
      description: `${duplicatedBoard.name} foi criado`,
    });
  };

  const deleteBoard = (boardId: string) => {
    const board = settings.boards.find((b: any) => b.id === boardId);
    if (!board) return;

    if (confirm(`Excluir funil "${board.name}"?`)) {
      const newBoards = (settings.boards || []).filter((b: any) => b.id !== boardId);
      let newCurrentId = settings.currentBoardId;

      if (boardId === settings.currentBoardId && newBoards.length > 0) {
        newCurrentId = newBoards[0].id;
      }

      setSettings({
        ...settings,
        boards: newBoards,
        currentBoardId: newCurrentId
      });

      toast({
        title: "🗑️ Funil excluído",
        description: `${board.name} foi removido`,
        variant: "destructive"
      });
    }
  };

  const renderFolder = (folder: any, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const subFolders = getSubFolders(folder.id);
    const boards = getBoardsByFolder(folder.id);

    return (
      <div key={folder.id} style={{ marginLeft: level * 16 }}>
        <div className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-slate-700/50 group cursor-pointer">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFolder(folder.id)}
            className="h-5 w-5 p-0"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
          
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: folder.color }}
          />
          
          {isExpanded ? <FolderOpen className="h-4 w-4 text-slate-400" /> : <Folder className="h-4 w-4 text-slate-400" />}
          
          <span className="flex-1 text-sm text-slate-200 font-medium">{folder.name}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewItemDialog({type: 'board', parentId: folder.id})}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewItemDialog({type: 'folder', parentId: folder.id})}
              className="h-6 w-6 p-0"
            >
              <Folder className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="ml-4">
            {subFolders.map(subFolder => renderFolder(subFolder, level + 1))}
            {boards.map((board: any) => (
              <div
                key={board.id}
                className={`p-3 my-1 rounded-lg transition-all duration-200 cursor-pointer group ${
                  board.id === settings.currentBoardId 
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30' 
                    : 'bg-slate-800/30 hover:bg-slate-700/50 border border-slate-600/20'
                }`}
                onClick={() => switchToBoard(board.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: board.color }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${
                      board.id === settings.currentBoardId ? 'text-emerald-300' : 'text-slate-200'
                    }`}>
                      {board.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {board.nodes.length} módulos • {new Date(board.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {board.id === settings.currentBoardId && (
                    <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded font-medium">
                      Ativo
                    </span>
                  )}

                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateBoard(board.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoard(board.id);
                      }}
                      className="h-6 w-6 p-0 text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 z-40 shadow-2xl ${
        sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="p-6 space-y-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Folder className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Gerenciador de Funis
              </h2>
              <p className="text-xs text-slate-400">
                {settings.boards?.length || 0} funis • {settings.folders?.length || 0} pastas
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Dialog open={newItemDialog?.type === 'folder'} onOpenChange={(open) => !open && closeDialog()}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setNewItemDialog({type: 'folder'})}
                size="sm"
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300"
              >
                <Folder className="h-4 w-4 mr-2" />
                Nova Pasta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-100">Criar Nova Pasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Nome da pasta</Label>
                  <Input
                    value={newItemForm.name}
                    onChange={(e) => setNewItemForm({...newItemForm, name: e.target.value})}
                    placeholder="Ex: Projetos 2024"
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Cor</Label>
                  <div className="flex gap-2 mt-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewItemForm({...newItemForm, color})}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newItemForm.color === color ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={closeDialog} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={createNewFolder} className="flex-1">
                    Criar Pasta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={newItemDialog?.type === 'board'} onOpenChange={(open) => !open && closeDialog()}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setNewItemDialog({type: 'board'})}
                size="sm"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Funil
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-100">Criar Novo Funil</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Nome do funil</Label>
                  <Input
                    value={newItemForm.name}
                    onChange={(e) => setNewItemForm({...newItemForm, name: e.target.value})}
                    placeholder="Ex: Funil de Vendas Q1"
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Descrição</Label>
                  <Textarea
                    value={newItemForm.description}
                    onChange={(e) => setNewItemForm({...newItemForm, description: e.target.value})}
                    placeholder="Descreva o objetivo deste funil..."
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Cor</Label>
                  <div className="flex gap-2 mt-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewItemForm({...newItemForm, color})}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newItemForm.color === color ? 'border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={closeDialog} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={createNewBoard} className="flex-1">
                    Criar Funil
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Folder Structure */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {getSubFolders().map(folder => renderFolder(folder))}
          </div>
        </div>

        {/* AI Tools */}
        <div className="pt-4 border-t border-slate-700/50">
          <div className="space-y-2">
            <IntelligentTooltip
              content={generateContextTooltip('funnel-optimizer')}
              trigger="hover"
              delay={getAdaptiveDelay('funnel-optimizer')}
              placement="right"
            >
              <Button
                onClick={() => {
                  setShowOptimizer(!showOptimizer);
                  trackFeatureInteraction('funnel-optimizer');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                {showOptimizer ? 'Ocultar Otimizador' : 'Otimizador IA'}
              </Button>
            </IntelligentTooltip>
            
            <IntelligentTooltip
              content={{
                title: 'Analytics Avançados',
                description: 'Análise detalhada de performance com insights, tendências e benchmarks da indústria.',
                type: 'feature',
                category: 'Analytics',
                examples: [
                  'Heatmap de engajamento',
                  'Análise de tendências',
                  'Comparação com benchmarks'
                ],
                relatedFeatures: ['Performance Tracking', 'AI Insights']
              }}
              trigger="hover"
              delay={getAdaptiveDelay('advanced-analytics')}
              placement="right"
            >
              <Button
                onClick={() => {
                  setShowAnalytics(!showAnalytics);
                  trackFeatureInteraction('advanced-analytics');
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showAnalytics ? 'Ocultar Analytics' : 'Analytics Avançados'}
              </Button>
            </IntelligentTooltip>
          </div>
          
          {showOptimizer && (
            <div className="mt-4">
              <FunnelOptimizer currentBoard={currentBoard} />
            </div>
          )}
          
          {showAnalytics && (
            <div className="mt-4">
              <AdvancedAnalytics currentBoard={currentBoard} />
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="pt-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Estatísticas do Workspace</h4>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Funis Ativos:</span>
                <span className="text-emerald-400 font-medium">{settings.boards?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Módulos Totais:</span>
                <span className="text-emerald-400 font-medium">
                  {(settings.boards || []).reduce((sum: number, board: any) => sum + (board.nodes?.length || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Funil Atual:</span>
                <span className="text-emerald-400 font-medium truncate w-24">
                  {currentBoard?.name || 'Nenhum'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};