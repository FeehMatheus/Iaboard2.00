import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Target, 
  Clock, 
  Users, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Download,
  Play,
  Settings,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowChoreographyModuleProps {
  data: {
    goal?: string;
    preferences?: any;
  };
  isConnectable: boolean;
}

interface WorkflowRequest {
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

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    prompt?: string;
    parameters?: any;
    dependencies?: string[];
    outputs?: string[];
    executionOrder?: number;
    status?: string;
  };
}

interface WorkflowResult {
  nodes: WorkflowNode[];
  connections: any[];
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

export function WorkflowChoreographyModule({ data, isConnectable }: WorkflowChoreographyModuleProps) {
  const { toast } = useToast();
  const [workflowRequest, setWorkflowRequest] = useState<WorkflowRequest>({
    goal: data.goal || '',
    industry: '',
    targetAudience: '',
    budget: '',
    timeline: '',
    preferences: {
      complexity: 'intermediate',
      automation: 'moderate',
      outputs: []
    }
  });
  
  const [workflowResult, setWorkflowResult] = useState<WorkflowResult | null>(null);
  const [activeTab, setActiveTab] = useState('setup');

  // Goal analysis mutation
  const analyzeGoalMutation = useMutation({
    mutationFn: async (goal: string) => {
      const response = await fetch('/api/workflow-choreography/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });
      if (!response.ok) throw new Error('Failed to analyze goal');
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Goal Analysis Complete",
        description: `Identified as ${result.analysis.category} with ${result.analysis.complexity} complexity`,
      });
    }
  });

  // Workflow generation mutation
  const generateWorkflowMutation = useMutation({
    mutationFn: async (request: WorkflowRequest) => {
      const response = await fetch('/api/workflow-choreography/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Failed to generate workflow');
      return response.json();
    },
    onSuccess: (result) => {
      setWorkflowResult(result.workflow);
      setActiveTab('workflow');
      toast({
        title: "Intelligent Workflow Generated!",
        description: `Created optimized workflow with ${result.metadata.nodesCount} modules in ${result.metadata.phasesCount} phases`,
      });
    }
  });

  // Workflow execution mutation
  const executeWorkflowMutation = useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await fetch('/api/workflow-choreography/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      });
      if (!response.ok) throw new Error('Failed to execute workflow');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workflow Execution Started",
        description: "Your intelligent workflow is now running automatically",
      });
    }
  });

  const handleGenerateWorkflow = () => {
    if (!workflowRequest.goal.trim()) {
      toast({
        title: "Goal Required",
        description: "Please enter your business goal to generate a workflow",
        variant: "destructive"
      });
      return;
    }
    
    generateWorkflowMutation.mutate(workflowRequest);
  };

  const handleAnalyzeGoal = () => {
    if (!workflowRequest.goal.trim()) return;
    analyzeGoalMutation.mutate(workflowRequest.goal);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getModuleTypeIcon = (type: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'ia-analytics': <BarChart3 className="w-4 h-4" />,
      'ia-copy': <Target className="w-4 h-4" />,
      'ia-video': <Play className="w-4 h-4" />,
      'ia-produto': <Settings className="w-4 h-4" />,
      'ia-trafego': <TrendingUp className="w-4 h-4" />
    };
    return iconMap[type] || <Zap className="w-4 h-4" />;
  };

  const getModuleTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      'ia-analytics': 'bg-blue-100 text-blue-800',
      'ia-copy': 'bg-green-100 text-green-800',
      'ia-video': 'bg-purple-100 text-purple-800',
      'ia-produto': 'bg-orange-100 text-orange-800',
      'ia-trafego': 'bg-red-100 text-red-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Intelligent Workflow Choreography
        </CardTitle>
        <p className="text-purple-100">
          AI-powered workflow optimization that automatically creates and orchestrates the perfect sequence of AI modules for your goals
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup & Goal Analysis</TabsTrigger>
            <TabsTrigger value="workflow">Generated Workflow</TabsTrigger>
            <TabsTrigger value="execution">Execution & Results</TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Business Goal *
                  </Label>
                  <Textarea
                    id="goal"
                    placeholder="e.g., Launch a new SaaS product targeting small businesses..."
                    value={workflowRequest.goal}
                    onChange={(e) => setWorkflowRequest(prev => ({ 
                      ...prev, 
                      goal: e.target.value 
                    }))}
                    className="mt-2"
                    rows={3}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleAnalyzeGoal}
                    disabled={!workflowRequest.goal.trim() || analyzeGoalMutation.isPending}
                  >
                    {analyzeGoalMutation.isPending ? (
                      "Analyzing..."
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1" />
                        AI Analyze Goal
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={workflowRequest.industry} 
                    onValueChange={(value) => setWorkflowRequest(prev => ({ 
                      ...prev, 
                      industry: value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS / Software</SelectItem>
                      <SelectItem value="e-commerce">E-commerce</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing Agency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Small business owners, 25-45 years old"
                    value={workflowRequest.targetAudience}
                    onChange={(e) => setWorkflowRequest(prev => ({ 
                      ...prev, 
                      targetAudience: e.target.value 
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Select 
                    value={workflowRequest.budget} 
                    onValueChange={(value) => setWorkflowRequest(prev => ({ 
                      ...prev, 
                      budget: value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low ($0 - $1,000)</SelectItem>
                      <SelectItem value="medium">Medium ($1,000 - $10,000)</SelectItem>
                      <SelectItem value="high">High ($10,000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select 
                    value={workflowRequest.timeline} 
                    onValueChange={(value) => setWorkflowRequest(prev => ({ 
                      ...prev, 
                      timeline: value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                      <SelectItem value="normal">Normal (1-2 months)</SelectItem>
                      <SelectItem value="extended">Extended (3+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Workflow Complexity</Label>
                  <Select 
                    value={workflowRequest.preferences?.complexity} 
                    onValueChange={(value: 'simple' | 'intermediate' | 'advanced') => 
                      setWorkflowRequest(prev => ({ 
                        ...prev, 
                        preferences: { 
                          ...prev.preferences!, 
                          complexity: value 
                        }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple (3-4 modules)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (5-6 modules)</SelectItem>
                      <SelectItem value="advanced">Advanced (7+ modules)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleGenerateWorkflow}
                disabled={!workflowRequest.goal.trim() || generateWorkflowMutation.isPending}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {generateWorkflowMutation.isPending ? (
                  "Generating Intelligent Workflow..."
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Optimized Workflow
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6 mt-6">
            {workflowResult ? (
              <>
                {/* Workflow Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {workflowResult.nodes.length}
                      </div>
                      <div className="text-sm text-gray-600">AI Modules</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {workflowResult.executionPlan.phases.length}
                      </div>
                      <div className="text-sm text-gray-600">Execution Phases</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatTime(workflowResult.executionPlan.totalEstimatedTime)}
                      </div>
                      <div className="text-sm text-gray-600">Estimated Time</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Execution Phases */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Execution Plan
                  </h3>
                  <div className="space-y-4">
                    {workflowResult.executionPlan.phases.map((phase, index) => (
                      <Card key={phase.phase} className="border-l-4 border-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Phase {phase.phase}</Badge>
                              <span className="font-medium">{phase.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {formatTime(phase.estimatedTime)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {phase.nodes.map((nodeId) => {
                              const node = workflowResult.nodes.find(n => n.id === nodeId);
                              if (!node) return null;
                              return (
                                <Badge 
                                  key={nodeId} 
                                  className={getModuleTypeColor(node.type)}
                                >
                                  {getModuleTypeIcon(node.type)}
                                  <span className="ml-1">
                                    {node.data.parameters?.moduleType || node.type}
                                  </span>
                                </Badge>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Critical Path */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Critical Path Analysis
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        The critical path represents the longest sequence of dependent tasks that determines the minimum project duration.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {workflowResult.executionPlan.criticalPath.map((nodeId, index) => {
                          const node = workflowResult.nodes.find(n => n.id === nodeId);
                          if (!node) return null;
                          return (
                            <div key={nodeId} className="flex items-center">
                              <Badge className="bg-red-100 text-red-800">
                                {getModuleTypeIcon(node.type)}
                                <span className="ml-1">
                                  {node.data.parameters?.moduleType || node.type}
                                </span>
                              </Badge>
                              {index < workflowResult.executionPlan.criticalPath.length - 1 && (
                                <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Recommendations
                  </h3>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {workflowResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-800">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Generate a workflow in the Setup tab to see the intelligent choreography here
                </p>
              </div>
            )}
          </TabsContent>

          {/* Execution Tab */}
          <TabsContent value="execution" className="space-y-6 mt-6">
            {workflowResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Workflow Execution</h3>
                  <Button 
                    onClick={() => executeWorkflowMutation.mutate('workflow-id')}
                    disabled={executeWorkflowMutation.isPending}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    {executeWorkflowMutation.isPending ? (
                      "Starting Execution..."
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Workflow
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Execution Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                        <div className="text-xs text-gray-500">
                          Ready to begin execution
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Current Phase</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <div className="text-lg font-medium text-gray-600">Awaiting Start</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Click "Execute Workflow" to begin
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Execution Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="text-sm text-gray-500 italic">
                        Execution log will appear here once the workflow starts running...
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Generate and configure a workflow first to begin execution
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}