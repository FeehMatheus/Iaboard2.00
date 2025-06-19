interface HierarchyFolder {
  id: string;
  name: string;
  parentId?: string;
  children: HierarchyFolder[];
  boards: any[];
  color: string;
  icon?: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  permissions: FolderPermissions;
  metadata: FolderMetadata;
}

interface FolderPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canAddBoards: boolean;
  canAddSubfolders: boolean;
  isProtected: boolean;
}

interface FolderMetadata {
  totalBoards: number;
  totalSubfolders: number;
  lastAccessed?: number;
  tags: string[];
  archived: boolean;
  favorite: boolean;
  sortOrder: number;
}

interface FolderOperation {
  type: 'create' | 'move' | 'rename' | 'delete' | 'reorder';
  targetId: string;
  payload: any;
  timestamp: number;
  userId?: string;
}

interface FolderSearchResult {
  folder?: HierarchyFolder;
  boards: any[];
  path: string[];
  relevanceScore: number;
}

export class AdvancedFolderHierarchy {
  private folders: Map<string, HierarchyFolder> = new Map();
  private operationHistory: FolderOperation[] = [];
  
  constructor() {
    this.initializeDefaultStructure();
  }

  private initializeDefaultStructure() {
    const defaultFolder: HierarchyFolder = {
      id: 'root',
      name: 'Workspace',
      children: [],
      boards: [],
      color: '#3b82f6',
      icon: '🏠',
      description: 'Workspace principal',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      permissions: {
        canEdit: false,
        canDelete: false,
        canAddBoards: true,
        canAddSubfolders: true,
        isProtected: true
      },
      metadata: {
        totalBoards: 0,
        totalSubfolders: 0,
        tags: ['workspace'],
        archived: false,
        favorite: true,
        sortOrder: 0
      }
    };
    
    this.folders.set('root', defaultFolder);
  }

  // Folder Management
  createFolder(parentId: string, folderData: Partial<HierarchyFolder>): HierarchyFolder {
    const parent = this.folders.get(parentId);
    if (!parent) {
      throw new Error('Pasta pai não encontrada');
    }

    if (!parent.permissions.canAddSubfolders) {
      throw new Error('Sem permissão para criar subpastas');
    }

    const newFolder: HierarchyFolder = {
      id: this.generateId(),
      name: folderData.name || 'Nova Pasta',
      parentId,
      children: [],
      boards: [],
      color: folderData.color || '#6366f1',
      icon: folderData.icon || '📁',
      description: folderData.description || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      permissions: {
        canEdit: true,
        canDelete: true,
        canAddBoards: true,
        canAddSubfolders: true,
        isProtected: false
      },
      metadata: {
        totalBoards: 0,
        totalSubfolders: 0,
        tags: folderData.metadata?.tags || [],
        archived: false,
        favorite: false,
        sortOrder: parent.children.length
      }
    };

    this.folders.set(newFolder.id, newFolder);
    parent.children.push(newFolder);
    this.updateFolderMetadata(parentId);
    
    this.recordOperation({
      type: 'create',
      targetId: newFolder.id,
      payload: { parentId, folderData },
      timestamp: Date.now()
    });

    return newFolder;
  }

  moveFolder(folderId: string, newParentId: string): boolean {
    const folder = this.folders.get(folderId);
    const newParent = this.folders.get(newParentId);
    
    if (!folder || !newParent) {
      throw new Error('Pasta não encontrada');
    }

    if (folder.permissions.isProtected) {
      throw new Error('Pasta protegida não pode ser movida');
    }

    if (this.wouldCreateCircularDependency(folderId, newParentId)) {
      throw new Error('Operação criaria dependência circular');
    }

    // Remove from old parent
    if (folder.parentId) {
      const oldParent = this.folders.get(folder.parentId);
      if (oldParent) {
        oldParent.children = oldParent.children.filter(child => child.id !== folderId);
        this.updateFolderMetadata(oldParent.id);
      }
    }

    // Add to new parent
    folder.parentId = newParentId;
    folder.updatedAt = Date.now();
    folder.metadata.sortOrder = newParent.children.length;
    
    newParent.children.push(folder);
    this.updateFolderMetadata(newParentId);

    this.recordOperation({
      type: 'move',
      targetId: folderId,
      payload: { newParentId },
      timestamp: Date.now()
    });

    return true;
  }

  deleteFolder(folderId: string, force: boolean = false): boolean {
    const folder = this.folders.get(folderId);
    if (!folder) {
      throw new Error('Pasta não encontrada');
    }

    if (folder.permissions.isProtected && !force) {
      throw new Error('Pasta protegida não pode ser excluída');
    }

    if (!folder.permissions.canDelete && !force) {
      throw new Error('Sem permissão para excluir esta pasta');
    }

    // Check for children
    if (folder.children.length > 0 && !force) {
      throw new Error('Pasta contém subpastas. Use force=true para excluir');
    }

    if (folder.boards.length > 0 && !force) {
      throw new Error('Pasta contém funis. Use force=true para excluir');
    }

    // Recursively delete children if force
    if (force) {
      [...folder.children].forEach(child => {
        this.deleteFolder(child.id, true);
      });
    }

    // Remove from parent
    if (folder.parentId) {
      const parent = this.folders.get(folder.parentId);
      if (parent) {
        parent.children = parent.children.filter(child => child.id !== folderId);
        this.updateFolderMetadata(parent.id);
      }
    }

    this.folders.delete(folderId);

    this.recordOperation({
      type: 'delete',
      targetId: folderId,
      payload: { force },
      timestamp: Date.now()
    });

    return true;
  }

  // Board Management
  addBoardToFolder(folderId: string, board: any): boolean {
    const folder = this.folders.get(folderId);
    if (!folder) {
      throw new Error('Pasta não encontrada');
    }

    if (!folder.permissions.canAddBoards) {
      throw new Error('Sem permissão para adicionar funis');
    }

    // Remove from old folder if exists
    this.removeBoardFromAllFolders(board.id);

    // Add to new folder
    folder.boards.push(board);
    folder.updatedAt = Date.now();
    this.updateFolderMetadata(folderId);

    return true;
  }

  removeBoardFromFolder(folderId: string, boardId: string): boolean {
    const folder = this.folders.get(folderId);
    if (!folder) {
      throw new Error('Pasta não encontrada');
    }

    folder.boards = folder.boards.filter(board => board.id !== boardId);
    folder.updatedAt = Date.now();
    this.updateFolderMetadata(folderId);

    return true;
  }

  private removeBoardFromAllFolders(boardId: string): void {
    this.folders.forEach(folder => {
      folder.boards = folder.boards.filter(board => board.id !== boardId);
    });
  }

  // Search and Query
  searchFolders(query: string): FolderSearchResult[] {
    const results: FolderSearchResult[] = [];
    const normalizedQuery = query.toLowerCase();

    this.folders.forEach(folder => {
      let relevanceScore = 0;
      
      // Name match
      if (folder.name.toLowerCase().includes(normalizedQuery)) {
        relevanceScore += 10;
      }

      // Description match
      if (folder.description?.toLowerCase().includes(normalizedQuery)) {
        relevanceScore += 5;
      }

      // Tag match
      folder.metadata.tags.forEach(tag => {
        if (tag.toLowerCase().includes(normalizedQuery)) {
          relevanceScore += 3;
        }
      });

      // Board search within folder
      const matchingBoards = folder.boards.filter(board => 
        board.name.toLowerCase().includes(normalizedQuery) ||
        board.description?.toLowerCase().includes(normalizedQuery)
      );

      if (matchingBoards.length > 0) {
        relevanceScore += matchingBoards.length * 2;
      }

      if (relevanceScore > 0) {
        results.push({
          folder,
          boards: matchingBoards,
          path: this.getFolderPath(folder.id),
          relevanceScore
        });
      }
    });

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  getFolderPath(folderId: string): string[] {
    const path: string[] = [];
    let currentFolder = this.folders.get(folderId);

    while (currentFolder) {
      path.unshift(currentFolder.name);
      if (currentFolder.parentId) {
        currentFolder = this.folders.get(currentFolder.parentId);
      } else {
        break;
      }
    }

    return path;
  }

  // Hierarchy Operations
  getFolderHierarchy(rootId: string = 'root'): HierarchyFolder | null {
    const root = this.folders.get(rootId);
    if (!root) return null;

    return this.buildHierarchyTree(root);
  }

  private buildHierarchyTree(folder: HierarchyFolder): HierarchyFolder {
    const tree = { ...folder };
    tree.children = folder.children
      .sort((a, b) => a.metadata.sortOrder - b.metadata.sortOrder)
      .map(child => this.buildHierarchyTree(child));
    
    return tree;
  }

  getFolderStats(folderId: string): any {
    const folder = this.folders.get(folderId);
    if (!folder) return null;

    const stats = {
      totalBoards: folder.boards.length,
      totalSubfolders: folder.children.length,
      totalDescendantBoards: this.countDescendantBoards(folder),
      totalDescendantFolders: this.countDescendantFolders(folder),
      depth: this.getFolderDepth(folderId),
      lastModified: folder.updatedAt,
      permissions: folder.permissions,
      metadata: folder.metadata
    };

    return stats;
  }

  private countDescendantBoards(folder: HierarchyFolder): number {
    let count = folder.boards.length;
    folder.children.forEach(child => {
      count += this.countDescendantBoards(child);
    });
    return count;
  }

  private countDescendantFolders(folder: HierarchyFolder): number {
    let count = folder.children.length;
    folder.children.forEach(child => {
      count += this.countDescendantFolders(child);
    });
    return count;
  }

  private getFolderDepth(folderId: string): number {
    let depth = 0;
    let currentFolder = this.folders.get(folderId);

    while (currentFolder?.parentId) {
      depth++;
      currentFolder = this.folders.get(currentFolder.parentId);
    }

    return depth;
  }

  // Utility Methods
  private wouldCreateCircularDependency(folderId: string, newParentId: string): boolean {
    let currentId = newParentId;
    
    while (currentId) {
      if (currentId === folderId) return true;
      
      const folder = this.folders.get(currentId);
      currentId = folder?.parentId || null;
    }
    
    return false;
  }

  private updateFolderMetadata(folderId: string): void {
    const folder = this.folders.get(folderId);
    if (!folder) return;

    folder.metadata.totalBoards = folder.boards.length;
    folder.metadata.totalSubfolders = folder.children.length;
    folder.updatedAt = Date.now();
  }

  private recordOperation(operation: FolderOperation): void {
    this.operationHistory.push(operation);
    
    // Keep only last 100 operations
    if (this.operationHistory.length > 100) {
      this.operationHistory.shift();
    }
  }

  private generateId(): string {
    return `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Bulk Operations
  reorderFolders(parentId: string, folderIds: string[]): boolean {
    const parent = this.folders.get(parentId);
    if (!parent) return false;

    folderIds.forEach((folderId, index) => {
      const folder = this.folders.get(folderId);
      if (folder && folder.parentId === parentId) {
        folder.metadata.sortOrder = index;
        folder.updatedAt = Date.now();
      }
    });

    // Re-sort children
    parent.children.sort((a, b) => a.metadata.sortOrder - b.metadata.sortOrder);

    this.recordOperation({
      type: 'reorder',
      targetId: parentId,
      payload: { folderIds },
      timestamp: Date.now()
    });

    return true;
  }

  toggleFolderFavorite(folderId: string): boolean {
    const folder = this.folders.get(folderId);
    if (!folder) return false;

    folder.metadata.favorite = !folder.metadata.favorite;
    folder.updatedAt = Date.now();

    return true;
  }

  archiveFolder(folderId: string): boolean {
    const folder = this.folders.get(folderId);
    if (!folder || folder.permissions.isProtected) return false;

    folder.metadata.archived = true;
    folder.updatedAt = Date.now();

    return true;
  }

  getOperationHistory(): FolderOperation[] {
    return [...this.operationHistory].reverse();
  }
}

export const folderHierarchy = new AdvancedFolderHierarchy();