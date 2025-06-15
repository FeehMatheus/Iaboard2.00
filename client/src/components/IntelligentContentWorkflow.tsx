import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Video, 
  Share2, 
  Mail, 
  Globe, 
  Mic,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Download,
  Settings,
  Zap,
  Target,
  Users,
  Calendar,
  TrendingUp,
  FileCheck,
  Eye,
  Sparkles
} from 'lucide-react';

interface ContentWorkflowRequest {
  project_name: string;
  content_type: 'blog_post' | 'video_script' | 'social_media_campaign' | 'email_sequence' | 'landing_page' | 'podcast_episode';
  target_audience: string;
  primary_goal: string;
  brand_guidelines?: {
    tone: string;
    voice: string;
    key_messages: string[];
    avoid_topics: string[];
  };
  distribution_channels: string[];
  deadline?: string;
  content_length?: string;
  seo_keywords?: string[];
  approval_workflow?: boolean;
}

interface WorkflowStage {
  stage_id: string;
  name: string;
  type: 'research' | 'ideation' | 'creation' | 'review' | 'optimization' | 'approval' | 'distribution';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'requires_input';
  dependencies: string[];
  estimated_duration: number;
  actual_duration?: number;
  output?: any;
  feedback?: string[];
  quality_score?: number;
  assigned_ai_provider?: string;
  execution_priority: number;
}

interface WorkflowExecution {
  workflow_id: string;
  project_name: string;
  current_stage: string;
  stages: WorkflowStage[];
  assets: any[];
  status: 'planning' | 'executing' | 'review' | 'completed' | 'failed';
  progress_percentage: number;
  created_at: string;
  estimated_completion: string;
  actual_completion?: string;
  quality_metrics: {
    overall_score: number;
    content_quality: number;
    seo_optimization: number;
    brand_alignment: number;
    audience_relevance: number;
  };
}

const contentTypeIcons = {
  blog_post: FileText,
  video_script: Video,
  social_media_campaign: Share2,
  email_sequence: Mail,
  landing_page: Globe,
  podcast_episode: Mic
};

const contentTypeLabels = {
  blog_post: 'Blog Post',
  video_script: 'Video Script',
  social_media_campaign: 'Social Media Campaign',
  email_sequence: 'Email Sequence',
  landing_page: 'Landing Page',
  podcast_episode: 'Podcast Episode'
};

const stageTypeIcons = {
  research: Eye,
  ideation: Sparkles,
  creation: FileText,
  review: FileCheck,
  optimization: TrendingUp,
  approval: CheckCircle,
  distribution: Share2
};

const statusColors = {
  pending: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  requires_input: 'bg-yellow-500'
};

export default function IntelligentContentWorkflow() {
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState<ContentWorkflowRequest>({
    project_name: '',
    content_type: 'blog_post',
    target_audience: '',
    primary_goal: '',
    distribution_channels: [],
    seo_keywords: []
  });
  const [workflows, setWorkflows] = useState<WorkflowExecution[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowExecution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    loadSystemStatus();
    loadWorkflows();
  }, []);

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/content-workflow/system-status');
      const data = await response.json();
      if (data.success) {
        setSystemStatus(data);
      }
    } catch (error) {
      console.error('Failed to load system status:', error);
    }
  };

  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/content-workflow/list');
      const data = await response.json();
      if (data.success) {
        setWorkflows(data.workflows);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandGuidelinesChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      brand_guidelines: {
        ...prev.brand_guidelines,
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const createWorkflow = async () => {
    if (!formData.project_name || !formData.target_audience || !formData.primary_goal) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/content-workflow/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setSelectedWorkflow(data.workflow);
        setActiveTab('monitor');
        loadWorkflows();
      } else {
        alert('Failed to create workflow: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
      alert('Failed to create workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch('/api/content-workflow/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workflow_id: workflowId })
      });

      const data = await response.json();
      if (data.success) {
        // Start polling for updates
        pollWorkflowStatus(workflowId);
      } else {
        alert('Failed to execute workflow: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      alert('Failed to execute workflow');
    }
  };

  const pollWorkflowStatus = (workflowId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/content-workflow/status/${workflowId}`);
        const data = await response.json();
        
        if (data.success) {
          setSelectedWorkflow(data.workflow);
          
          if (data.workflow.status === 'completed' || data.workflow.status === 'failed') {
            clearInterval(interval);
            loadWorkflows();
          }
        }
      } catch (error) {
        console.error('Failed to poll workflow status:', error);
        clearInterval(interval);
      }
    }, 2000);

    return interval;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Play className="w-4 h-4 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'requires_input': return <Pause className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Intelligent Content Workflow
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            AI-powered content creation and management system
          </p>
        </div>
        
        {systemStatus && (
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {systemStatus.status}
            </Badge>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              v{systemStatus.version}
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="create" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Create</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span>Create New Content Workflow</span>
              </CardTitle>
              <CardDescription>
                Configure your content creation workflow with AI-powered optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project_name">Project Name *</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      placeholder="e.g., Q4 Marketing Campaign"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content_type">Content Type *</Label>
                    <Select 
                      value={formData.content_type} 
                      onValueChange={(value) => handleInputChange('content_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(contentTypeLabels).map(([key, label]) => {
                          const Icon = contentTypeIcons[key as keyof typeof contentTypeIcons];
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target_audience">Target Audience *</Label>
                    <Input
                      id="target_audience"
                      value={formData.target_audience}
                      onChange={(e) => handleInputChange('target_audience', e.target.value)}
                      placeholder="e.g., B2B SaaS decision makers, 30-50 years old"
                    />
                  </div>

                  <div>
                    <Label htmlFor="primary_goal">Primary Goal *</Label>
                    <Input
                      id="primary_goal"
                      value={formData.primary_goal}
                      onChange={(e) => handleInputChange('primary_goal', e.target.value)}
                      placeholder="e.g., Generate leads, increase brand awareness"
                    />
                  </div>

                  <div>
                    <Label htmlFor="distribution_channels">Distribution Channels</Label>
                    <Input
                      id="distribution_channels"
                      value={formData.distribution_channels.join(', ')}
                      onChange={(e) => handleArrayInputChange('distribution_channels', e.target.value)}
                      placeholder="e.g., LinkedIn, Twitter, Email, Website"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="content_length">Content Length</Label>
                    <Select 
                      value={formData.content_length || ''} 
                      onValueChange={(value) => handleInputChange('content_length', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (500-1000 words)</SelectItem>
                        <SelectItem value="medium">Medium (1000-2000 words)</SelectItem>
                        <SelectItem value="long">Long (2000+ words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={formData.deadline || ''}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="seo_keywords">SEO Keywords</Label>
                    <Input
                      id="seo_keywords"
                      value={formData.seo_keywords?.join(', ') || ''}
                      onChange={(e) => handleArrayInputChange('seo_keywords', e.target.value)}
                      placeholder="e.g., content marketing, AI tools, automation"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="approval_workflow"
                      checked={formData.approval_workflow || false}
                      onCheckedChange={(checked) => handleInputChange('approval_workflow', checked)}
                    />
                    <Label htmlFor="approval_workflow">Require approval workflow</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Brand Guidelines (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tone">Brand Tone</Label>
                    <Input
                      id="tone"
                      value={formData.brand_guidelines?.tone || ''}
                      onChange={(e) => handleBrandGuidelinesChange('tone', e.target.value)}
                      placeholder="e.g., Professional, Friendly, Authoritative"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="voice">Brand Voice</Label>
                    <Input
                      id="voice"
                      value={formData.brand_guidelines?.voice || ''}
                      onChange={(e) => handleBrandGuidelinesChange('voice', e.target.value)}
                      placeholder="e.g., Expert, Conversational, Inspiring"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="key_messages">Key Messages</Label>
                  <Textarea
                    id="key_messages"
                    value={formData.brand_guidelines?.key_messages?.join('\n') || ''}
                    onChange={(e) => handleBrandGuidelinesChange('key_messages', e.target.value.split('\n').filter(Boolean))}
                    placeholder="Enter key messages (one per line)"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={createWorkflow} 
                  disabled={isLoading}
                  className="px-8"
                >
                  {isLoading ? 'Creating...' : 'Create Workflow'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="mt-6">
          {selectedWorkflow ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        {React.createElement(contentTypeIcons[selectedWorkflow.project_name ? 'blog_post' : 'blog_post'], { className: "w-5 h-5" })}
                        <span>{selectedWorkflow.project_name}</span>
                      </CardTitle>
                      <CardDescription>
                        {contentTypeLabels[selectedWorkflow.stages[0]?.type as keyof typeof contentTypeLabels] || 'Content Workflow'}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant={selectedWorkflow.status === 'completed' ? 'default' : 'secondary'}>
                        {selectedWorkflow.status}
                      </Badge>
                      
                      {selectedWorkflow.status === 'planning' && (
                        <Button onClick={() => executeWorkflow(selectedWorkflow.workflow_id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Start Execution
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-gray-600">{selectedWorkflow.progress_percentage}%</span>
                      </div>
                      <Progress value={selectedWorkflow.progress_percentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedWorkflow.quality_metrics.overall_score}</div>
                        <div className="text-sm text-gray-600">Overall Quality</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedWorkflow.stages.filter(s => s.status === 'completed').length}</div>
                        <div className="text-sm text-gray-600">Completed Stages</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedWorkflow.assets.length}</div>
                        <div className="text-sm text-gray-600">Assets Created</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedWorkflow.stages.reduce((sum, s) => sum + (s.estimated_duration || 0), 0) / 60}m
                        </div>
                        <div className="text-sm text-gray-600">Est. Duration</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workflow Stages</CardTitle>
                  <CardDescription>Track the progress of each workflow stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {selectedWorkflow.stages.map((stage, index) => {
                        const StageIcon = stageTypeIcons[stage.type] || FileText;
                        return (
                          <div key={stage.stage_id} className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusColors[stage.status]}`}>
                                <StageIcon className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {stage.name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(stage.status)}
                                  {stage.quality_score && (
                                    <Badge variant="outline">{stage.quality_score}%</Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                <span>Type: {stage.type}</span>
                                <span>Est: {formatDuration(stage.estimated_duration)}</span>
                                {stage.actual_duration && (
                                  <span>Actual: {formatDuration(Math.floor(stage.actual_duration / 1000))}</span>
                                )}
                                {stage.assigned_ai_provider && (
                                  <span>AI: {stage.assigned_ai_provider}</span>
                                )}
                              </div>
                              
                              {stage.feedback && stage.feedback.length > 0 && (
                                <div className="mt-2 text-sm text-orange-600">
                                  {stage.feedback[0]}
                                </div>
                              )}
                              
                              {stage.output && (
                                <div className="mt-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Output
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Workflow Selected
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create a new workflow or select an existing one to monitor its progress
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  Create New Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {systemStatus && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {systemStatus.statistics.total_workflows}
                        </div>
                        <div className="text-sm text-gray-600">Total Workflows</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {systemStatus.statistics.active_workflows}
                        </div>
                        <div className="text-sm text-gray-600">Active Workflows</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {systemStatus.statistics.average_quality_score}%
                      </div>
                      <div className="text-sm text-gray-600">Average Quality Score</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                {systemStatus && (
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {systemStatus.capabilities.map((capability: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Supported Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                {systemStatus && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {systemStatus.supported_content_types.map((type: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Workflow History</span>
                <Button variant="outline" onClick={loadWorkflows}>
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workflows.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {workflows.map((workflow) => (
                      <div 
                        key={workflow.workflow_id} 
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          setActiveTab('monitor');
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${statusColors[workflow.status]}`} />
                          <div>
                            <h4 className="font-medium">{workflow.project_name}</h4>
                            <p className="text-sm text-gray-600">
                              Created: {new Date(workflow.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">{workflow.progress_percentage}%</Badge>
                          <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                            {workflow.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Workflows Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Create your first content workflow to get started
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    Create Workflow
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}