import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatNodeData {
  id: string;
  messages: Message[];
  model: string;
  selectedDocuments?: string[];
  selectedWebsites?: string[];
}

export interface Board {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  viewport: { x: number; y: number; zoom: number };
  createdAt: number;
  updatedAt: number;
  description?: string;
  folderId?: string;
  tags?: string[];
  color?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  parentId?: string;
}

export interface CustomModel {
  id: string;
  name: string;
  provider: string;
  endpoint?: string;
  apiKey?: string;
}

export interface GlobalSettings {
  currentBoardId: string;
  boards: Board[];
  folders: Folder[];
  customModels: CustomModel[];
  primaryColor: string;
  apiKeys: {
    openai?: string;
    anthropic?: string;
    google?: string;
  };
  rag: {
    documents: any[];
    websites?: any[];
  };
}

interface StoreState {
  settings: GlobalSettings;
  setSettings: (settings: GlobalSettings) => void;
  updateCustomModels: (models: CustomModel[]) => void;
}

const defaultBoard: Board = {
  id: 'default',
  name: 'Main Board',
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 }
};

const defaultSettings: GlobalSettings = {
  boards: [
    {
      id: 'default',
      name: 'Funil Principal',
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      description: 'Seu primeiro funil de vendas',
      folderId: 'default-folder',
      color: '#10b981'
    },
  ],
  folders: [
    {
      id: 'default-folder',
      name: 'Meus Funis',
      color: '#3b82f6',
      createdAt: Date.now()
    }
  ],
  currentBoardId: 'default',
  customModels: [],
  primaryColor: '#00d9ff',
  apiKeys: {},
  rag: {
    documents: [],
    websites: []
  }
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setSettings: (settings) => set({ settings }),
      updateCustomModels: (models) => 
        set((state) => ({
          settings: {
            ...state.settings,
            customModels: models
          }
        }))
    }),
    {
      name: 'ia-board-storage'
    }
  )
);