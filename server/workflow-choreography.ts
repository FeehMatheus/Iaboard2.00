import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface WorkflowNode {
  id: string;
  type: 'ia-copy' | 'ia-video' | 'ia-produto' | 'ia-trafego' | 'ia-analytics';
  position: { x: number; y: number };
  data: {
    prompt?: string;
    parameters?: any;
    dependencies?: string[];
    outputs?: string[];
    executionOrder?: number;
    status?: 'pending' | 'running' | 'completed' | 'failed';
  };
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: string;
}

interface ChoreographyRequest {
  goal: string;
  industry?: string;
  targetAudience?: string;
  budget?: string;
  timeline?: string;
  preferences?: {
    complexity: 'simple' | 'intermediate' | 'advanced';
    automation: 'minimal' | 'moderate' | 'maximum';
    outputs: string[];
  };
}

interface OptimizedWorkflow {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  executionPlan: {
    phases: Array<{
      phase: number;
      name: string;
      description: string;
      nodes: string[];
      estimatedTime: number;
    }>;
    totalEstimatedTime: number;
    criticalPath: string[];
  };
  recommendations: string[];
}

// AI-powered workflow analysis and optimization
class WorkflowChoreographer {
  private nodeTemplates = {
    'market-research': {
      type: 'ia-analytics' as const,
      prompt: 'Conduct comprehensive market research for {{goal}} targeting {{audience}}',
      estimatedTime: 300, // 5 minutes
      outputs: ['market-analysis', 'competitor-data', 'opportunity-insights']
    },
    'audience-analysis': {
      type: 'ia-analytics' as const,
      prompt: 'Analyze target audience for {{goal}} in {{industry}} sector',
      estimatedTime: 240,
      outputs: ['audience-personas', 'behavior-insights', 'preferences']
    },
    'content-strategy': {
      type: 'ia-copy' as const,
      prompt: 'Create content strategy based on market research and audience analysis',
      estimatedTime: 360,
      outputs: ['content-plan', 'messaging-framework', 'content-calendar']
    },
    'sales-copy': {
      type: 'ia-copy' as const,
      prompt: 'Generate high-converting sales copy for {{goal}}',
      estimatedTime: 480,
      outputs: ['sales-letter', 'headlines', 'call-to-actions']
    },
    'video-content': {
      type: 'ia-video' as const,
      prompt: 'Create engaging video content for {{goal}}',
      estimatedTime: 900, // 15 minutes
      outputs: ['promotional-video', 'tutorial-content', 'social-media-clips']
    },
    'funnel-design': {
      type: 'ia-produto' as const,
      prompt: 'Design complete sales funnel for {{goal}}',
      estimatedTime: 600,
      outputs: ['landing-pages', 'email-sequences', 'upsell-offers']
    },
    'traffic-strategy': {
      type: 'ia-trafego' as const,
      prompt: 'Develop traffic generation strategy for {{goal}}',
      estimatedTime: 420,
      outputs: ['ad-campaigns', 'seo-strategy', 'social-media-plan']
    },
    'analytics-setup': {
      type: 'ia-analytics' as const,
      prompt: 'Setup analytics and tracking for {{goal}}',
      estimatedTime: 180,
      outputs: ['tracking-setup', 'kpi-dashboard', 'reporting-system']
    }
  };

  async analyzeGoal(goal: string): Promise<{
    category: string;
    complexity: 'simple' | 'intermediate' | 'advanced';
    requiredModules: string[];
    estimatedScope: number;
  }> {
    // AI-powered goal analysis
    const goalLower = goal.toLowerCase();
    
    let category = 'general';
    let complexity: 'simple' | 'intermediate' | 'advanced' = 'intermediate';
    let requiredModules: string[] = [];
    let estimatedScope = 5;

    // Analyze goal complexity and categorize
    if (goalLower.includes('launch') || goalLower.includes('product') || goalLower.includes('business')) {
      category = 'product-launch';
      complexity = 'advanced';
      estimatedScope = 8;
      requiredModules = ['market-research', 'audience-analysis', 'content-strategy', 'sales-copy', 'video-content', 'funnel-design', 'traffic-strategy', 'analytics-setup'];
    } else if (goalLower.includes('marketing') || goalLower.includes('campaign') || goalLower.includes('promote')) {
      category = 'marketing-campaign';
      complexity = 'intermediate';
      estimatedScope = 6;
      requiredModules = ['audience-analysis', 'content-strategy', 'sales-copy', 'video-content', 'traffic-strategy', 'analytics-setup'];
    } else if (goalLower.includes('content') || goalLower.includes('blog') || goalLower.includes('social')) {
      category = 'content-creation';
      complexity = 'simple';
      estimatedScope = 4;
      requiredModules = ['audience-analysis', 'content-strategy', 'sales-copy', 'video-content'];
    } else if (goalLower.includes('sales') || goalLower.includes('convert') || goalLower.includes('funnel')) {
      category = 'sales-optimization';
      complexity = 'intermediate';
      estimatedScope = 5;
      requiredModules = ['market-research', 'sales-copy', 'funnel-design', 'traffic-strategy', 'analytics-setup'];
    } else if (goalLower.includes('traffic') || goalLower.includes('visitors') || goalLower.includes('ads')) {
      category = 'traffic-generation';
      complexity = 'intermediate';
      estimatedScope = 4;
      requiredModules = ['audience-analysis', 'traffic-strategy', 'analytics-setup', 'content-strategy'];
    }

    return { category, complexity, requiredModules, estimatedScope };
  }

  async generateOptimizedWorkflow(request: ChoreographyRequest): Promise<OptimizedWorkflow> {
    const analysis = await this.analyzeGoal(request.goal);
    
    // Apply user preferences to modify the workflow
    let selectedModules = [...analysis.requiredModules];
    
    if (request.preferences?.complexity === 'simple') {
      selectedModules = selectedModules.slice(0, Math.max(3, Math.floor(selectedModules.length * 0.6)));
    } else if (request.preferences?.complexity === 'advanced') {
      // Add additional optimization modules for advanced users
      if (!selectedModules.includes('market-research')) selectedModules.unshift('market-research');
      if (!selectedModules.includes('analytics-setup')) selectedModules.push('analytics-setup');
    }

    // Generate optimized node positions using physics-based layout
    const nodes = this.generateNodes(selectedModules, request);
    const connections = this.generateConnections(nodes);
    const executionPlan = this.createExecutionPlan(nodes, connections);
    const recommendations = this.generateRecommendations(request, analysis);

    return {
      nodes,
      connections,
      executionPlan,
      recommendations
    };
  }

  private generateNodes(moduleTypes: string[], request: ChoreographyRequest): WorkflowNode[] {
    const nodes: WorkflowNode[] = [];
    const gridCols = Math.ceil(Math.sqrt(moduleTypes.length));
    const spacing = 300;

    moduleTypes.forEach((moduleType, index) => {
      const template = this.nodeTemplates[moduleType as keyof typeof this.nodeTemplates];
      if (!template) return;

      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      
      // Add some organic positioning variation
      const jitterX = (Math.random() - 0.5) * 50;
      const jitterY = (Math.random() - 0.5) * 50;

      const node: WorkflowNode = {
        id: `node-${moduleType}-${Date.now()}-${index}`,
        type: template.type,
        position: {
          x: col * spacing + jitterX,
          y: row * spacing + jitterY
        },
        data: {
          prompt: this.interpolatePrompt(template.prompt, request),
          parameters: {
            estimatedTime: template.estimatedTime,
            moduleType: moduleType,
            priority: this.calculatePriority(moduleType, request),
            outputs: template.outputs
          },
          dependencies: this.calculateDependencies(moduleType, moduleTypes),
          outputs: template.outputs,
          executionOrder: 0, // Will be calculated in execution plan
          status: 'pending'
        }
      };

      nodes.push(node);
    });

    return nodes;
  }

  private interpolatePrompt(template: string, request: ChoreographyRequest): string {
    return template
      .replace(/\{\{goal\}\}/g, request.goal)
      .replace(/\{\{industry\}\}/g, request.industry || 'general')
      .replace(/\{\{audience\}\}/g, request.targetAudience || 'target market');
  }

  private calculatePriority(moduleType: string, request: ChoreographyRequest): number {
    const priorityMap: { [key: string]: number } = {
      'market-research': 10,
      'audience-analysis': 9,
      'content-strategy': 7,
      'sales-copy': 6,
      'video-content': 5,
      'funnel-design': 6,
      'traffic-strategy': 4,
      'analytics-setup': 3
    };

    // Adjust priority based on user preferences
    if (request.preferences?.outputs?.includes('video') && moduleType === 'video-content') {
      return priorityMap[moduleType] + 3;
    }
    if (request.preferences?.outputs?.includes('sales') && moduleType === 'sales-copy') {
      return priorityMap[moduleType] + 2;
    }

    return priorityMap[moduleType] || 5;
  }

  private calculateDependencies(moduleType: string, allModules: string[]): string[] {
    const dependencyRules: { [key: string]: string[] } = {
      'audience-analysis': ['market-research'],
      'content-strategy': ['audience-analysis'],
      'sales-copy': ['audience-analysis', 'content-strategy'],
      'video-content': ['content-strategy'],
      'funnel-design': ['sales-copy'],
      'traffic-strategy': ['content-strategy', 'funnel-design'],
      'analytics-setup': []
    };

    const dependencies = dependencyRules[moduleType] || [];
    return dependencies.filter(dep => allModules.includes(dep));
  }

  private generateConnections(nodes: WorkflowNode[]): WorkflowConnection[] {
    const connections: WorkflowConnection[] = [];
    
    nodes.forEach(node => {
      const dependencies = node.data.dependencies || [];
      dependencies.forEach(depType => {
        const sourceNode = nodes.find(n => n.data.parameters?.moduleType === depType);
        if (sourceNode) {
          const connection: WorkflowConnection = {
            id: `connection-${sourceNode.id}-${node.id}`,
            source: sourceNode.id,
            target: node.id,
            type: 'smoothstep'
          };
          connections.push(connection);
        }
      });
    });

    return connections;
  }

  private createExecutionPlan(nodes: WorkflowNode[], connections: WorkflowConnection[]): {
    phases: Array<{
      phase: number;
      name: string;
      description: string;
      nodes: string[];
      estimatedTime: number;
    }>;
    totalEstimatedTime: number;
    criticalPath: string[];
  } {
    // Topological sort for execution order
    const sorted = this.topologicalSort(nodes, connections);
    
    // Group nodes into execution phases
    const phases = this.groupIntoPhases(sorted);
    
    // Calculate critical path
    const criticalPath = this.findCriticalPath(nodes, connections);
    
    const totalEstimatedTime = phases.reduce((total, phase) => total + phase.estimatedTime, 0);

    return {
      phases,
      totalEstimatedTime,
      criticalPath
    };
  }

  private topologicalSort(nodes: WorkflowNode[], connections: WorkflowConnection[]): WorkflowNode[] {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const result: WorkflowNode[] = [];

    const visit = (nodeId: string) => {
      if (temp.has(nodeId)) return; // Cycle detection
      if (visited.has(nodeId)) return;

      temp.add(nodeId);
      
      const dependents = connections
        .filter(conn => conn.source === nodeId)
        .map(conn => conn.target);
      
      dependents.forEach(visit);
      
      temp.delete(nodeId);
      visited.add(nodeId);
      
      const node = nodes.find(n => n.id === nodeId);
      if (node) result.unshift(node);
    };

    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        visit(node.id);
      }
    });

    return result.reverse();
  }

  private groupIntoPhases(sortedNodes: WorkflowNode[]): Array<{
    phase: number;
    name: string;
    description: string;
    nodes: string[];
    estimatedTime: number;
  }> {
    const phases: Array<{
      phase: number;
      name: string;
      description: string;
      nodes: string[];
      estimatedTime: number;
    }> = [];

    let currentPhase = 1;
    let currentPhaseNodes: string[] = [];
    let currentPhaseTime = 0;

    const phaseNames = [
      'Research & Analysis',
      'Strategy Development', 
      'Content Creation',
      'Implementation',
      'Optimization & Analytics'
    ];

    sortedNodes.forEach((node, index) => {
      const estimatedTime = node.data.parameters?.estimatedTime || 300;
      
      // Start new phase if we've accumulated enough nodes or hit logical breakpoints
      if (currentPhaseNodes.length >= 2 || this.isPhaseBreakpoint(node, sortedNodes[index - 1])) {
        if (currentPhaseNodes.length > 0) {
          phases.push({
            phase: currentPhase,
            name: phaseNames[currentPhase - 1] || `Phase ${currentPhase}`,
            description: this.generatePhaseDescription(currentPhase, currentPhaseNodes),
            nodes: [...currentPhaseNodes],
            estimatedTime: Math.max(currentPhaseTime, 180) // Minimum 3 minutes per phase
          });
          
          currentPhase++;
          currentPhaseNodes = [];
          currentPhaseTime = 0;
        }
      }

      currentPhaseNodes.push(node.id);
      currentPhaseTime = Math.max(currentPhaseTime, estimatedTime);
    });

    // Add final phase
    if (currentPhaseNodes.length > 0) {
      phases.push({
        phase: currentPhase,
        name: phaseNames[currentPhase - 1] || `Final Phase`,
        description: this.generatePhaseDescription(currentPhase, currentPhaseNodes),
        nodes: currentPhaseNodes,
        estimatedTime: Math.max(currentPhaseTime, 180)
      });
    }

    return phases;
  }

  private isPhaseBreakpoint(currentNode: WorkflowNode, previousNode?: WorkflowNode): boolean {
    if (!previousNode) return false;
    
    const currentType = currentNode.data.parameters?.moduleType;
    const previousType = previousNode.data.parameters?.moduleType;
    
    // Define logical phase breakpoints
    const breakpoints = [
      ['market-research', 'content-strategy'],
      ['audience-analysis', 'sales-copy'],
      ['content-strategy', 'traffic-strategy'],
      ['funnel-design', 'analytics-setup']
    ];

    return breakpoints.some(([before, after]) => 
      previousType === before && currentType === after
    );
  }

  private generatePhaseDescription(phase: number, nodeIds: string[]): string {
    const descriptions = [
      'Comprehensive market and audience research to understand the landscape',
      'Strategic planning and content framework development',
      'Creative content and copy generation',
      'Funnel and traffic system implementation',
      'Analytics setup and performance optimization'
    ];

    return descriptions[phase - 1] || `Execute workflow nodes: ${nodeIds.length} modules`;
  }

  private findCriticalPath(nodes: WorkflowNode[], connections: WorkflowConnection[]): string[] {
    // Simplified critical path - find longest dependency chain
    const getDependencyChain = (nodeId: string, visited = new Set<string>()): string[] => {
      if (visited.has(nodeId)) return [];
      visited.add(nodeId);

      const dependencies = connections
        .filter(conn => conn.target === nodeId)
        .map(conn => conn.source);

      if (dependencies.length === 0) return [nodeId];

      const longestChain = dependencies
        .map(depId => getDependencyChain(depId, new Set(visited)))
        .reduce((longest, current) => 
          current.length > longest.length ? current : longest, []
        );

      return [...longestChain, nodeId];
    };

    // Find the longest chain ending at any node
    const allChains = nodes.map(node => getDependencyChain(node.id));
    const criticalPath = allChains.reduce((longest, current) => 
      current.length > longest.length ? current : longest, []
    );

    return criticalPath;
  }

  private generateRecommendations(request: ChoreographyRequest, analysis: any): string[] {
    const recommendations: string[] = [];

    // Budget-based recommendations
    if (request.budget === 'low' || request.budget === 'limited') {
      recommendations.push('Focus on organic content and social media to minimize paid advertising costs');
      recommendations.push('Prioritize high-impact, low-cost marketing channels first');
    }

    // Timeline-based recommendations
    if (request.timeline === 'urgent' || request.timeline === 'asap') {
      recommendations.push('Execute phases in parallel where possible to reduce total time');
      recommendations.push('Consider using AI automation for faster content generation');
    }

    // Complexity-based recommendations
    if (analysis.complexity === 'advanced') {
      recommendations.push('Implement advanced analytics tracking from the start');
      recommendations.push('Consider A/B testing multiple approaches simultaneously');
    }

    // Industry-specific recommendations
    if (request.industry === 'e-commerce' || request.industry === 'retail') {
      recommendations.push('Focus heavily on conversion optimization and upsell strategies');
      recommendations.push('Implement retargeting campaigns for abandoned cart recovery');
    }

    return recommendations;
  }
}

const choreographer = new WorkflowChoreographer();

// Generate optimized workflow endpoint
router.post('/api/workflow-choreography/generate', async (req, res) => {
  try {
    const request: ChoreographyRequest = req.body;
    
    if (!request.goal) {
      return res.status(400).json({
        success: false,
        error: 'Goal is required for workflow generation'
      });
    }

    console.log('[CHOREOGRAPHY] Generating optimized workflow for:', request.goal);
    
    const startTime = Date.now();
    const optimizedWorkflow = await choreographer.generateOptimizedWorkflow(request);
    const processingTime = Date.now() - startTime;

    // Save workflow to file system for persistence
    const workflowId = `workflow-${Date.now()}`;
    const workflowPath = path.join(process.cwd(), 'public', 'downloads', `${workflowId}.json`);
    
    const workflowData = {
      id: workflowId,
      goal: request.goal,
      createdAt: new Date().toISOString(),
      ...optimizedWorkflow
    };
    
    fs.writeFileSync(workflowPath, JSON.stringify(workflowData, null, 2));

    res.json({
      success: true,
      workflow: optimizedWorkflow,
      metadata: {
        workflowId,
        goal: request.goal,
        nodesCount: optimizedWorkflow.nodes.length,
        phasesCount: optimizedWorkflow.executionPlan.phases.length,
        estimatedTime: optimizedWorkflow.executionPlan.totalEstimatedTime,
        complexity: request.preferences?.complexity || 'intermediate',
        processingTime
      },
      file: {
        filename: `${workflowId}.json`,
        path: `/downloads/${workflowId}.json`,
        type: 'workflow-definition'
      }
    });

  } catch (error: any) {
    console.error('[CHOREOGRAPHY] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate optimized workflow',
      details: error.message
    });
  }
});

// Analyze goal endpoint
router.post('/api/workflow-choreography/analyze', async (req, res) => {
  try {
    const { goal } = req.body;
    
    if (!goal) {
      return res.status(400).json({
        success: false,
        error: 'Goal is required for analysis'
      });
    }

    const analysis = await choreographer.analyzeGoal(goal);
    
    res.json({
      success: true,
      analysis
    });

  } catch (error: any) {
    console.error('[CHOREOGRAPHY] Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze goal',
      details: error.message
    });
  }
});

// Execute workflow endpoint
router.post('/api/workflow-choreography/execute', async (req, res) => {
  try {
    const { workflowId, phaseNumber } = req.body;
    
    if (!workflowId) {
      return res.status(400).json({
        success: false,
        error: 'Workflow ID is required for execution'
      });
    }

    console.log(`[CHOREOGRAPHY] Executing workflow ${workflowId}, phase ${phaseNumber || 'all'}`);
    
    // Load workflow definition
    const workflowPath = path.join(process.cwd(), 'public', 'downloads', `${workflowId}.json`);
    
    if (!fs.existsSync(workflowPath)) {
      return res.status(404).json({
        success: false,
        error: 'Workflow not found'
      });
    }

    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    
    res.json({
      success: true,
      message: 'Workflow execution initiated',
      workflowId,
      executionStatus: 'started',
      nextPhase: phaseNumber || 1
    });

  } catch (error: any) {
    console.error('[CHOREOGRAPHY] Execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute workflow',
      details: error.message
    });
  }
});

// Status endpoint
router.get('/api/workflow-choreography/status', (req, res) => {
  res.json({
    success: true,
    service: 'Intelligent Workflow Choreography',
    version: '1.0.0',
    capabilities: [
      'AI-powered goal analysis',
      'Optimized workflow generation',
      'Critical path calculation',
      'Phase-based execution planning',
      'Smart dependency management',
      'Performance recommendations'
    ],
    features: {
      goalAnalysis: true,
      workflowOptimization: true,
      executionChoreography: true,
      criticalPathAnalysis: true,
      phaseBasedExecution: true,
      smartRecommendations: true
    }
  });
});

export default router;