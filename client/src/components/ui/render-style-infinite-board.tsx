import React, { useState, useRef, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Play, Pause, MoreHorizontal } from 'lucide-react';

interface BoardNode {
  id: string;
  title: string;
  type: 'service' | 'database' | 'api' | 'frontend';
  status: 'running' | 'stopped' | 'building' | 'error';
  position: { x: number; y: number };
  connections: string[];
}

const initialNodes: BoardNode[] = [
  {
    id: '1',
    title: 'Frontend App',
    type: 'frontend',
    status: 'running',
    position: { x: 100, y: 100 },
    connections: ['2']
  },
  {
    id: '2',
    title: 'API Gateway',
    type: 'api',
    status: 'running',
    position: { x: 400, y: 100 },
    connections: ['3']
  },
  {
    id: '3',
    title: 'Database',
    type: 'database',
    status: 'running',
    position: { x: 700, y: 100 },
    connections: []
  }
];

export function RenderStyleInfiniteBoard() {
  const [nodes, setNodes] = useState<BoardNode[]>(initialNodes);
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleViewportDrag = useCallback((event: MouseEvent, info: PanInfo) => {
    setViewportPosition(prev => ({
      x: prev.x + info.delta.x,
      y: prev.y + info.delta.y
    }));
  }, []);

  const handleNodeDrag = useCallback((nodeId: string, info: PanInfo) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            position: { 
              x: node.position.x + info.delta.x, 
              y: node.position.y + info.delta.y 
            } 
          }
        : node
    ));
  }, []);

  const addNewNode = useCallback(() => {
    const newNode: BoardNode = {
      id: Date.now().toString(),
      title: 'New Service',
      type: 'service',
      status: 'stopped',
      position: { x: 200, y: 200 },
      connections: []
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-gray-500';
      case 'building': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'frontend': return '🌐';
      case 'api': return '⚡';
      case 'database': return '🗄️';
      case 'service': return '⚙️';
      default: return '📦';
    }
  };

  return (
    <div className="h-screen w-full bg-gray-950 overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Render Board</h1>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {nodes.filter(n => n.status === 'running').length} Running
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={addNewNode} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Infinite Canvas */}
      <motion.div
        ref={boardRef}
        className="absolute inset-0 pt-20 cursor-grab active:cursor-grabbing"
        drag
        dragMomentum={false}
        onDrag={handleViewportDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          transform: `translate(${viewportPosition.x}px, ${viewportPosition.y}px)`,
        }}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            transform: `translate(${viewportPosition.x % 20}px, ${viewportPosition.y % 20}px)`
          }}
        />

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none">
          {nodes.map(node => 
            node.connections.map(targetId => {
              const target = nodes.find(n => n.id === targetId);
              if (!target) return null;
              
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.position.x + 150}
                  y1={node.position.y + 75}
                  x2={target.position.x + 150}
                  y2={target.position.y + 75}
                  stroke="rgba(59, 130, 246, 0.6)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer"
            style={{
              left: node.position.x,
              top: node.position.y,
            }}
            drag
            dragMomentum={false}
            onDrag={(event, info) => handleNodeDrag(node.id, info)}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1, zIndex: 100 }}
          >
            <Card className="w-80 bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getTypeIcon(node.type)}</div>
                    <div>
                      <CardTitle className="text-white text-lg">{node.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`} />
                        <span className="text-sm text-gray-400 capitalize">{node.status}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {node.type}
                    </Badge>
                    {node.connections.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {node.connections.length} connections
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    {node.status === 'running' ? (
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Pause className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Minimap */}
      <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-900 border border-gray-700 rounded-lg p-2">
        <div className="text-xs text-gray-400 mb-2">Minimap</div>
        <div className="relative w-full h-full bg-gray-800 rounded overflow-hidden">
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute w-2 h-2 rounded-full ${getStatusColor(node.status)}`}
              style={{
                left: `${(node.position.x / 1000) * 100}%`,
                top: `${(node.position.y / 600) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}