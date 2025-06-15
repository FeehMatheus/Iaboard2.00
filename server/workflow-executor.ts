import express from 'express';
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

const router = express.Router();

interface ExecutionStatus {
  workflowId: string;
  currentPhase: number;
  completedNodes: string[];
  failedNodes: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  estimatedCompletion?: Date;
  progress: number;
}

class WorkflowExecutor extends EventEmitter {
  private activeExecutions = new Map<string, ExecutionStatus>();
  private executionResults = new Map<string, Map<string, any>>();

  async executeWorkflow(workflowId: string, workflowData: any): Promise<void> {
    console.log(`[EXECUTOR] Starting workflow execution: ${workflowId}`);
    
    const execution: ExecutionStatus = {
      workflowId,
      currentPhase: 1,
      completedNodes: [],
      failedNodes: [],
      status: 'running',
      startTime: new Date(),
      progress: 0
    };

    this.activeExecutions.set(workflowId, execution);
    this.executionResults.set(workflowId, new Map());

    try {
      // Execute phases sequentially
      for (const phase of workflowData.executionPlan.phases) {
        console.log(`[EXECUTOR] Executing Phase ${phase.phase}: ${phase.name}`);
        
        execution.currentPhase = phase.phase;
        this.activeExecutions.set(workflowId, execution);
        
        // Execute nodes in parallel within phase
        const phasePromises = phase.nodes.map(nodeId => 
          this.executeNode(workflowId, nodeId, workflowData)
        );

        const phaseResults = await Promise.allSettled(phasePromises);
        
        // Process phase results
        phaseResults.forEach((result, index) => {
          const nodeId = phase.nodes[index];
          if (result.status === 'fulfilled') {
            execution.completedNodes.push(nodeId);
            this.executionResults.get(workflowId)?.set(nodeId, result.value);
          } else {
            execution.failedNodes.push(nodeId);
            console.error(`[EXECUTOR] Node ${nodeId} failed:`, result.reason);
          }
        });

        // Update progress
        execution.progress = (execution.completedNodes.length / workflowData.nodes.length) * 100;
        this.activeExecutions.set(workflowId, execution);
        
        // Emit progress event
        this.emit('progress', {
          workflowId,
          phase: phase.phase,
          progress: execution.progress,
          completedNodes: execution.completedNodes.length,
          totalNodes: workflowData.nodes.length
        });

        // Small delay between phases
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      execution.status = 'completed';
      execution.progress = 100;
      this.activeExecutions.set(workflowId, execution);
      
      console.log(`[EXECUTOR] Workflow ${workflowId} completed successfully`);
      this.emit('completed', { workflowId, results: this.executionResults.get(workflowId) });

    } catch (error) {
      console.error(`[EXECUTOR] Workflow ${workflowId} failed:`, error);
      execution.status = 'failed';
      this.activeExecutions.set(workflowId, execution);
      this.emit('failed', { workflowId, error: error.message });
    }
  }

  private async executeNode(workflowId: string, nodeId: string, workflowData: any): Promise<any> {
    const node = workflowData.nodes.find(n => n.id === nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found in workflow`);
    }

    console.log(`[EXECUTOR] Executing node: ${node.data.parameters?.moduleType || node.type}`);

    // Simulate AI module execution with realistic processing
    const moduleType = node.data.parameters?.moduleType || node.type;
    const estimatedTime = node.data.parameters?.estimatedTime || 300;
    
    // Simulate realistic processing time (scaled down for demo)
    const processingTime = Math.min(estimatedTime / 10, 5000); // Max 5 seconds per node
    
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Generate realistic results based on module type
    const result = await this.generateModuleResult(moduleType, node.data.prompt);
    
    console.log(`[EXECUTOR] Node ${nodeId} completed in ${processingTime}ms`);
    return result;
  }

  private async generateModuleResult(moduleType: string, prompt: string): Promise<any> {
    const results = {
      'market-research': {
        marketSize: `$${(Math.random() * 100 + 50).toFixed(1)}B`,
        competitorCount: Math.floor(Math.random() * 50 + 10),
        growthRate: `${(Math.random() * 20 + 5).toFixed(1)}%`,
        keyInsights: [
          'High demand for automation solutions',
          'Underserved SMB market segment',
          'Price sensitivity in target market'
        ],
        opportunities: [
          'Integration partnerships',
          'Freemium model potential',
          'Mobile-first approach'
        ]
      },
      'audience-analysis': {
        primaryPersona: {
          age: '35-45',
          role: 'Small Business Owner',
          painPoints: ['Time management', 'Limited resources', 'Tech complexity'],
          goals: ['Efficiency', 'Growth', 'Cost reduction']
        },
        channelPreferences: ['Email', 'LinkedIn', 'Industry publications'],
        buyingBehavior: 'Research-heavy, price-conscious, referral-driven',
        segments: ['Established SMBs', 'Growing startups', 'Solo entrepreneurs']
      },
      'content-strategy': {
        contentPillars: ['Educational', 'Problem-solving', 'Success stories', 'Industry insights'],
        contentTypes: ['Blog posts', 'Video tutorials', 'Case studies', 'Webinars'],
        publishingSchedule: '3x per week',
        keyMessages: [
          'Simplify your business operations',
          'Grow without growing pains',
          'Affordable enterprise solutions'
        ]
      },
      'sales-copy': {
        headline: 'Transform Your Small Business Into a Growth Machine',
        subheadline: 'The all-in-one SaaS platform that automates your operations so you can focus on what matters most',
        valueProposition: 'Save 20+ hours per week while increasing efficiency by 40%',
        callToAction: 'Start Your Free 14-Day Trial',
        keyBenefits: [
          'Automated workflow management',
          'Real-time analytics dashboard',
          'Seamless integrations',
          '24/7 customer support'
        ]
      },
      'video-content': {
        scriptOutline: [
          'Hook: Are you drowning in daily tasks?',
          'Problem: Small businesses waste 60% of time on manual work',
          'Solution: Our platform automates everything',
          'Demo: Show key features in action',
          'Social proof: Customer testimonials',
          'CTA: Get started today'
        ],
        duration: '2-3 minutes',
        style: 'Professional with friendly tone',
        visualElements: ['Screen recordings', 'Customer interviews', 'Data visualizations']
      },
      'funnel-design': {
        stages: [
          { name: 'Awareness', tactics: ['Content marketing', 'SEO', 'Social media'] },
          { name: 'Interest', tactics: ['Lead magnets', 'Webinars', 'Free tools'] },
          { name: 'Consideration', tactics: ['Free trial', 'Product demos', 'Case studies'] },
          { name: 'Purchase', tactics: ['Limited offers', 'Consultations', 'Testimonials'] },
          { name: 'Retention', tactics: ['Onboarding', 'Success programs', 'Upsells'] }
        ],
        conversionRates: {
          awarenessToInterest: '15%',
          interestToConsideration: '25%',
          considerationToPurchase: '8%',
          purchaseToRetention: '85%'
        }
      },
      'traffic-strategy': {
        channels: [
          { channel: 'Google Ads', budget: '40%', expectedCPC: '$2.50', expectedCTR: '3.2%' },
          { channel: 'Facebook Ads', budget: '30%', expectedCPC: '$1.80', expectedCTR: '2.8%' },
          { channel: 'LinkedIn Ads', budget: '20%', expectedCPC: '$4.20', expectedCTR: '1.9%' },
          { channel: 'Content SEO', budget: '10%', expectedTraffic: '2,500/month' }
        ],
        targetCPA: '$45',
        expectedROAS: '3.2x',
        monthlyBudget: '$8,000'
      },
      'analytics-setup': {
        kpis: [
          'Monthly Recurring Revenue (MRR)',
          'Customer Acquisition Cost (CAC)',
          'Lifetime Value (LTV)',
          'Churn Rate',
          'Net Promoter Score (NPS)'
        ],
        trackingSetup: [
          'Google Analytics 4 with enhanced ecommerce',
          'Mixpanel for product analytics',
          'HubSpot for marketing attribution',
          'Custom dashboard for executive reporting'
        ],
        reportingSchedule: 'Daily dashboards, weekly reports, monthly reviews'
      }
    };

    return results[moduleType] || {
      result: `Generated content for ${moduleType}`,
      prompt: prompt,
      timestamp: new Date().toISOString()
    };
  }

  getExecutionStatus(workflowId: string): ExecutionStatus | undefined {
    return this.activeExecutions.get(workflowId);
  }

  getExecutionResults(workflowId: string): Map<string, any> | undefined {
    return this.executionResults.get(workflowId);
  }

  pauseExecution(workflowId: string): boolean {
    const execution = this.activeExecutions.get(workflowId);
    if (execution && execution.status === 'running') {
      execution.status = 'paused';
      this.activeExecutions.set(workflowId, execution);
      return true;
    }
    return false;
  }

  resumeExecution(workflowId: string): boolean {
    const execution = this.activeExecutions.get(workflowId);
    if (execution && execution.status === 'paused') {
      execution.status = 'running';
      this.activeExecutions.set(workflowId, execution);
      return true;
    }
    return false;
  }
}

const executor = new WorkflowExecutor();

// Execute workflow endpoint
router.post('/api/workflow-executor/execute', async (req, res) => {
  try {
    const { workflowId } = req.body;
    
    if (!workflowId) {
      return res.status(400).json({
        success: false,
        error: 'Workflow ID is required'
      });
    }

    // Load workflow definition
    const workflowPath = path.join(process.cwd(), 'public', 'downloads', `${workflowId}.json`);
    
    if (!fs.existsSync(workflowPath)) {
      return res.status(404).json({
        success: false,
        error: 'Workflow definition not found'
      });
    }

    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    
    // Start execution asynchronously
    executor.executeWorkflow(workflowId, workflowData).catch(error => {
      console.error(`[EXECUTOR] Workflow execution error:`, error);
    });

    res.json({
      success: true,
      message: 'Workflow execution started',
      workflowId,
      status: 'running'
    });

  } catch (error: any) {
    console.error('[EXECUTOR] Execute error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start workflow execution',
      details: error.message
    });
  }
});

// Get execution status endpoint
router.get('/api/workflow-executor/status/:workflowId', (req, res) => {
  try {
    const { workflowId } = req.params;
    const status = executor.getExecutionStatus(workflowId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Execution not found'
      });
    }

    res.json({
      success: true,
      status
    });

  } catch (error: any) {
    console.error('[EXECUTOR] Status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get execution status',
      details: error.message
    });
  }
});

// Get execution results endpoint
router.get('/api/workflow-executor/results/:workflowId', (req, res) => {
  try {
    const { workflowId } = req.params;
    const results = executor.getExecutionResults(workflowId);
    
    if (!results) {
      return res.status(404).json({
        success: false,
        error: 'Execution results not found'
      });
    }

    // Convert Map to object for JSON serialization
    const resultsObj = Object.fromEntries(results);

    res.json({
      success: true,
      workflowId,
      results: resultsObj,
      completedNodes: Object.keys(resultsObj).length
    });

  } catch (error: any) {
    console.error('[EXECUTOR] Results error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get execution results',
      details: error.message
    });
  }
});

// Control execution endpoint (pause/resume)
router.post('/api/workflow-executor/control', (req, res) => {
  try {
    const { workflowId, action } = req.body;
    
    if (!workflowId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Workflow ID and action are required'
      });
    }

    let success = false;
    
    switch (action) {
      case 'pause':
        success = executor.pauseExecution(workflowId);
        break;
      case 'resume':
        success = executor.resumeExecution(workflowId);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Use "pause" or "resume"'
        });
    }

    res.json({
      success,
      message: success ? `Workflow ${action}d successfully` : `Failed to ${action} workflow`,
      workflowId,
      action
    });

  } catch (error: any) {
    console.error('[EXECUTOR] Control error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to control workflow execution',
      details: error.message
    });
  }
});

export default router;