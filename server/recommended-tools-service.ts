interface RecommendedTool {
  name: string;
  category: 'ai' | 'automation' | 'analytics' | 'design' | 'development' | 'marketing';
  description: string;
  apiEndpoint?: string;
  pricing: 'free' | 'freemium' | 'paid';
  difficulty: 'easy' | 'medium' | 'advanced';
  integrationPotential: 'high' | 'medium' | 'low';
  benefits: string[];
  useCase: string;
}

export class RecommendedToolsService {
  
  getRecommendedTools(): RecommendedTool[] {
    return [
      // AI Services
      {
        name: 'Claude API (Anthropic)',
        category: 'ai',
        description: 'Advanced conversational AI with superior reasoning capabilities and safety features',
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        pricing: 'paid',
        difficulty: 'easy',
        integrationPotential: 'high',
        benefits: [
          'Superior text analysis and generation',
          'Enhanced safety and alignment',
          'Long context understanding',
          'Code generation and debugging'
        ],
        useCase: 'Complement Mistral AI for complex reasoning tasks and content analysis'
      },
      {
        name: 'OpenAI GPT-4 Vision',
        category: 'ai',
        description: 'Multimodal AI that can understand and analyze images alongside text',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        pricing: 'paid',
        difficulty: 'easy',
        integrationPotential: 'high',
        benefits: [
          'Image understanding and analysis',
          'Visual content description',
          'OCR capabilities',
          'Document analysis'
        ],
        useCase: 'Analyze uploaded images and documents for content generation'
      },
      {
        name: 'ElevenLabs Voice AI',
        category: 'ai',
        description: 'Advanced voice synthesis with custom voice cloning and natural speech',
        apiEndpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'high',
        benefits: [
          'Custom voice cloning',
          'Multiple languages support',
          'Emotional voice synthesis',
          'Real-time voice conversion'
        ],
        useCase: 'Enhance TTS capabilities with custom branded voices'
      },
      {
        name: 'Runway ML',
        category: 'ai',
        description: 'Advanced AI video generation and editing with motion and style transfer',
        apiEndpoint: 'https://api.runwayml.com/v1/generate',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'high',
        benefits: [
          'Text-to-video generation',
          'Image-to-video animation',
          'Style transfer',
          'Video editing automation'
        ],
        useCase: 'Enhance video generation beyond Stability AI capabilities'
      },

      // Automation Tools
      {
        name: 'Zapier API',
        category: 'automation',
        description: 'Connect and automate workflows between different applications',
        apiEndpoint: 'https://api.zapier.com/v1/zaps',
        pricing: 'freemium',
        difficulty: 'easy',
        integrationPotential: 'high',
        benefits: [
          'Connect 5000+ apps',
          'Automated workflows',
          'No-code integration',
          'Real-time triggers'
        ],
        useCase: 'Automate content distribution and workflow management'
      },
      {
        name: 'Make.com (Integromat)',
        category: 'automation',
        description: 'Visual automation platform for complex workflow scenarios',
        apiEndpoint: 'https://www.make.com/api/v2/scenarios',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'high',
        benefits: [
          'Visual workflow builder',
          'Complex logic handling',
          'Real-time processing',
          'Advanced data manipulation'
        ],
        useCase: 'Create sophisticated automated content workflows'
      },
      {
        name: 'Notion API',
        category: 'automation',
        description: 'Programmatic access to Notion databases and pages for content management',
        apiEndpoint: 'https://api.notion.com/v1/pages',
        pricing: 'free',
        difficulty: 'easy',
        integrationPotential: 'high',
        benefits: [
          'Content organization',
          'Database management',
          'Team collaboration',
          'Knowledge base creation'
        ],
        useCase: 'Store and organize generated content systematically'
      },

      // Analytics and Data
      {
        name: 'Mixpanel API',
        category: 'analytics',
        description: 'Advanced product analytics with user behavior tracking',
        apiEndpoint: 'https://api.mixpanel.com/track',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'high',
        benefits: [
          'User behavior analytics',
          'Event tracking',
          'Funnel analysis',
          'Cohort analysis'
        ],
        useCase: 'Track how users interact with generated content'
      },
      {
        name: 'Hotjar API',
        category: 'analytics',
        description: 'User experience analytics with heatmaps and session recordings',
        apiEndpoint: 'https://api.hotjar.com/v1/sites',
        pricing: 'freemium',
        difficulty: 'easy',
        integrationPotential: 'medium',
        benefits: [
          'Heatmap generation',
          'Session recordings',
          'User feedback collection',
          'Conversion optimization'
        ],
        useCase: 'Optimize content layout and user experience'
      },

      // Design and Visual
      {
        name: 'Figma API',
        category: 'design',
        description: 'Programmatic access to design files and collaborative design workflows',
        apiEndpoint: 'https://api.figma.com/v1/files',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'medium',
        benefits: [
          'Design automation',
          'Asset generation',
          'Design system management',
          'Collaborative workflows'
        ],
        useCase: 'Generate design assets programmatically for content'
      },
      {
        name: 'Canva API',
        category: 'design',
        description: 'Automated design creation with templates and brand consistency',
        apiEndpoint: 'https://api.canva.com/rest/v1/designs',
        pricing: 'paid',
        difficulty: 'easy',
        integrationPotential: 'high',
        benefits: [
          'Template-based design',
          'Brand consistency',
          'Bulk design generation',
          'Social media optimization'
        ],
        useCase: 'Create branded visual content automatically'
      },

      // Marketing Tools
      {
        name: 'Mailchimp API',
        category: 'marketing',
        description: 'Email marketing automation with audience segmentation',
        apiEndpoint: 'https://api.mailchimp.com/3.0/campaigns',
        pricing: 'freemium',
        difficulty: 'easy',
        integrationPotential: 'high',
        benefits: [
          'Email campaign automation',
          'Audience segmentation',
          'A/B testing',
          'Analytics integration'
        ],
        useCase: 'Distribute generated content via email campaigns'
      },
      {
        name: 'Buffer API',
        category: 'marketing',
        description: 'Social media scheduling and management across platforms',
        apiEndpoint: 'https://api.bufferapp.com/1/updates',
        pricing: 'freemium',
        difficulty: 'easy',
        integrationPotential: 'high',
        benefits: [
          'Multi-platform posting',
          'Content scheduling',
          'Analytics tracking',
          'Team collaboration'
        ],
        useCase: 'Automatically schedule and post generated content'
      },
      {
        name: 'HubSpot API',
        category: 'marketing',
        description: 'Complete CRM and marketing automation platform',
        apiEndpoint: 'https://api.hubapi.com/crm/v3/objects',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'high',
        benefits: [
          'Lead management',
          'Marketing automation',
          'Sales pipeline tracking',
          'Customer analytics'
        ],
        useCase: 'Integrate lead capture forms with full CRM workflow'
      },

      // Development Tools
      {
        name: 'GitHub API',
        category: 'development',
        description: 'Version control and collaboration for code and content',
        apiEndpoint: 'https://api.github.com/repos',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'medium',
        benefits: [
          'Version control',
          'Collaboration workflows',
          'Automated deployments',
          'Issue tracking'
        ],
        useCase: 'Version control for generated content and automation scripts'
      },
      {
        name: 'Vercel API',
        category: 'development',
        description: 'Serverless deployment platform with edge computing',
        apiEndpoint: 'https://api.vercel.com/v2/deployments',
        pricing: 'freemium',
        difficulty: 'medium',
        integrationPotential: 'medium',
        benefits: [
          'Instant deployments',
          'Edge computing',
          'Automatic scaling',
          'Performance optimization'
        ],
        useCase: 'Deploy and scale content generation applications'
      }
    ];
  }

  getToolsByCategory(category: string): RecommendedTool[] {
    return this.getRecommendedTools().filter(tool => tool.category === category);
  }

  getHighPriorityTools(): RecommendedTool[] {
    return this.getRecommendedTools().filter(tool => 
      tool.integrationPotential === 'high' && 
      (tool.pricing === 'free' || tool.pricing === 'freemium')
    );
  }

  getToolRecommendations(userNeeds: string[]): RecommendedTool[] {
    const allTools = this.getRecommendedTools();
    
    // Simple scoring based on user needs
    const scoredTools = allTools.map(tool => {
      let score = 0;
      
      userNeeds.forEach(need => {
        if (tool.description.toLowerCase().includes(need.toLowerCase()) ||
            tool.benefits.some(benefit => benefit.toLowerCase().includes(need.toLowerCase()))) {
          score += 1;
        }
      });
      
      // Bonus for integration potential
      if (tool.integrationPotential === 'high') score += 2;
      if (tool.integrationPotential === 'medium') score += 1;
      
      // Bonus for pricing
      if (tool.pricing === 'free') score += 2;
      if (tool.pricing === 'freemium') score += 1;
      
      return { ...tool, score };
    });
    
    return scoredTools
      .filter(tool => tool.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  getIntegrationGuide(toolName: string): string {
    const tool = this.getRecommendedTools().find(t => t.name === toolName);
    if (!tool) return 'Tool not found';
    
    return `
# Integração: ${tool.name}

## Visão Geral
${tool.description}

## Endpoint da API
${tool.apiEndpoint || 'Consultar documentação oficial'}

## Caso de Uso no IA Board
${tool.useCase}

## Benefícios da Integração
${tool.benefits.map(benefit => `- ${benefit}`).join('\n')}

## Nível de Dificuldade
${tool.difficulty === 'easy' ? 'Fácil - Implementação direta' : 
  tool.difficulty === 'medium' ? 'Médio - Requer configuração adicional' : 
  'Avançado - Implementação complexa'}

## Modelo de Preços
${tool.pricing === 'free' ? 'Gratuito' : 
  tool.pricing === 'freemium' ? 'Freemium - Plano gratuito disponível' : 
  'Pago - Requer assinatura'}

## Próximos Passos
1. Criar conta no serviço
2. Obter API key
3. Implementar autenticação
4. Desenvolver integração
5. Testar funcionalidades
6. Documentar uso
    `;
  }
}

export const recommendedToolsService = new RecommendedToolsService();