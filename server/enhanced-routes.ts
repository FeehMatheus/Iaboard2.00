import express from 'express';
import { supremeFurionSystem } from './supreme-furion-system';
import { youTubeRealTimeAnalyzer } from './youtube-real-time-analyzer';
import { aiEngineSupreme } from './ai-engine-supreme';
import { aiModuleExecutor } from './ai-module-executor';
import { advancedAIService } from './advanced-ai-service';

const router = express.Router();

// Supreme Furion Product Creation System
router.post('/api/supreme/create-product', async (req, res) => {
  try {
    const {
      productType,
      niche,
      targetAudience,
      timeframe = 30,
      marketingGoals,
      brandVoice,
      budget,
      competitorUrls
    } = req.body;

    if (!productType || !niche || !targetAudience) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: productType, niche, targetAudience'
      });
    }

    const result = await supremeFurionSystem.createCompleteProduct({
      productType,
      niche,
      targetAudience,
      timeframe,
      marketingGoals: marketingGoals || [],
      brandVoice: brandVoice || 'profissional',
      budget,
      competitorUrls
    });

    res.json({
      success: true,
      data: result,
      message: `Produto criado com sucesso em ${timeframe} minutos!`
    });
  } catch (error) {
    console.error('Erro na criação do produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// YouTube Live Analysis System
router.post('/api/youtube/analyze-live', async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        error: 'URL do vídeo é obrigatória'
      });
    }

    const analysis = await youTubeRealTimeAnalyzer.analyzeYouTubeLive(videoUrl);

    res.json({
      success: true,
      data: analysis,
      message: 'Análise completa realizada com sucesso!'
    });
  } catch (error) {
    console.error('Erro na análise do YouTube:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na análise do vídeo',
      details: error.message
    });
  }
});

// Advanced AI Content Generation
router.post('/api/ai/generate-advanced', async (req, res) => {
  try {
    const {
      type,
      prompt,
      context,
      parameters
    } = req.body;

    if (!type || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Tipo e prompt são obrigatórios'
      });
    }

    const result = await aiEngineSupreme.generateContent({
      type,
      prompt,
      context,
      parameters
    });

    res.json({
      success: true,
      data: result,
      message: 'Conteúdo gerado com sucesso!'
    });
  } catch (error) {
    console.error('Erro na geração de conteúdo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração de conteúdo',
      details: error.message
    });
  }
});

// AI Module Execution System
router.post('/api/ai/execute-module', async (req, res) => {
  try {
    const {
      moduleType,
      prompt,
      parameters
    } = req.body;

    if (!moduleType || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de módulo e prompt são obrigatórios'
      });
    }

    const result = await aiModuleExecutor.executeModule({
      moduleType,
      prompt,
      parameters
    });

    res.json({
      success: true,
      data: result,
      message: 'Módulo executado com sucesso!'
    });
  } catch (error) {
    console.error('Erro na execução do módulo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na execução do módulo',
      details: error.message
    });
  }
});

// Advanced AI Execution
router.post('/api/ai/execute-advanced', async (req, res) => {
  try {
    const {
      model,
      prompt,
      systemPrompt,
      temperature,
      maxTokens,
      context
    } = req.body;

    if (!model || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Model e prompt são obrigatórios'
      });
    }

    const result = await advancedAIService.executeAI({
      model,
      prompt,
      systemPrompt,
      temperature,
      maxTokens,
      context
    });

    res.json({
      success: true,
      data: result,
      message: 'IA executada com sucesso!'
    });
  } catch (error) {
    console.error('Erro na execução da IA:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na execução da IA',
      details: error.message
    });
  }
});

// Comprehensive Product Analysis
router.post('/api/analyze/comprehensive', async (req, res) => {
  try {
    const { productData, competitorUrls, marketData } = req.body;

    if (!productData) {
      return res.status(400).json({
        success: false,
        error: 'Dados do produto são obrigatórios'
      });
    }

    // Multi-layer analysis using all AI systems
    const [
      productAnalysis,
      competitorAnalysis,
      marketInsights,
      contentSuggestions
    ] = await Promise.all([
      advancedAIService.executeAI({
        model: 'claude-sonnet-4-20250514',
        prompt: `Analise este produto em detalhes: ${JSON.stringify(productData)}`,
        systemPrompt: 'Você é um especialista em análise de produtos digitais.'
      }),
      competitorUrls ? Promise.all(
        competitorUrls.map(url => 
          youTubeRealTimeAnalyzer.analyzeYouTubeLive(url).catch(() => null)
        )
      ) : Promise.resolve([]),
      aiEngineSupreme.generateContent({
        type: 'strategy',
        prompt: `Analise o mercado para: ${JSON.stringify(productData)}`,
        context: marketData
      }),
      aiModuleExecutor.executeModule({
        moduleType: 'ia-total',
        prompt: `Crie sugestões de conteúdo para: ${JSON.stringify(productData)}`
      })
    ]);

    res.json({
      success: true,
      data: {
        productAnalysis,
        competitorAnalysis: competitorAnalysis.filter(Boolean),
        marketInsights,
        contentSuggestions
      },
      message: 'Análise abrangente concluída!'
    });
  } catch (error) {
    console.error('Erro na análise abrangente:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na análise abrangente',
      details: error.message
    });
  }
});

// Real-time Performance Optimization
router.post('/api/optimize/performance', async (req, res) => {
  try {
    const { currentMetrics, goals, constraints } = req.body;

    if (!currentMetrics || !goals) {
      return res.status(400).json({
        success: false,
        error: 'Métricas atuais e objetivos são obrigatórios'
      });
    }

    const optimizationPlan = await advancedAIService.executeAI({
      model: 'gpt-4o',
      prompt: `
      Analise estas métricas e crie um plano de otimização:
      
      Métricas Atuais: ${JSON.stringify(currentMetrics)}
      Objetivos: ${JSON.stringify(goals)}
      Restrições: ${JSON.stringify(constraints || {})}
      
      Forneça:
      1. Diagnóstico detalhado
      2. Oportunidades identificadas
      3. Plano de ação priorizado
      4. Métricas para acompanhar
      5. Timeline de implementação
      `,
      systemPrompt: 'Você é um especialista em otimização de performance e growth hacking.'
    });

    res.json({
      success: true,
      data: optimizationPlan,
      message: 'Plano de otimização criado!'
    });
  } catch (error) {
    console.error('Erro na otimização:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na otimização de performance',
      details: error.message
    });
  }
});

// Multi-AI Consensus Generation
router.post('/api/ai/consensus', async (req, res) => {
  try {
    const { question, context, models } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Pergunta é obrigatória'
      });
    }

    const selectedModels = models || ['gpt-4o', 'claude-sonnet-4-20250514'];
    
    // Get responses from multiple AI models
    const responses = await Promise.all(
      selectedModels.map(async (model) => {
        try {
          const result = await advancedAIService.executeAI({
            model,
            prompt: question,
            context
          });
          return { model, response: result.content, success: true };
        } catch (error) {
          return { model, error: error.message, success: false };
        }
      })
    );

    // Generate consensus
    const consensusPrompt = `
    Analise estas respostas de diferentes modelos de IA e crie um consenso:
    
    ${responses.map(r => r.success ? 
      `${r.model}: ${r.response}` : 
      `${r.model}: ERRO - ${r.error}`
    ).join('\n\n')}
    
    Forneça:
    1. Consenso principal
    2. Pontos de concordância
    3. Pontos de divergência
    4. Recomendação final
    `;

    const consensus = await advancedAIService.executeAI({
      model: 'claude-sonnet-4-20250514',
      prompt: consensusPrompt,
      systemPrompt: 'Você é um especialista em análise comparativa e síntese de informações.'
    });

    res.json({
      success: true,
      data: {
        individual_responses: responses,
        consensus: consensus.content
      },
      message: 'Consenso multi-IA gerado!'
    });
  } catch (error) {
    console.error('Erro no consenso multi-IA:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração de consenso',
      details: error.message
    });
  }
});

// Workflow Optimization Suggestions
router.post('/api/suggest/workflow', async (req, res) => {
  try {
    const { currentWorkflow, objectives, constraints } = req.body;

    if (!currentWorkflow || !objectives) {
      return res.status(400).json({
        success: false,
        error: 'Workflow atual e objetivos são obrigatórios'
      });
    }

    const suggestions = await advancedAIService.generateNodeSuggestions(
      JSON.stringify({ currentWorkflow, objectives, constraints })
    );

    const optimizedWorkflow = await advancedAIService.generateWorkflowFromNodes(
      suggestions.map(suggestion => ({ type: 'suggestion', content: suggestion }))
    );

    res.json({
      success: true,
      data: {
        suggestions,
        optimizedWorkflow
      },
      message: 'Sugestões de workflow geradas!'
    });
  } catch (error) {
    console.error('Erro nas sugestões de workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração de sugestões',
      details: error.message
    });
  }
});

// Prompt Optimization
router.post('/api/optimize/prompt', async (req, res) => {
  try {
    const { originalPrompt, objective, targetModel } = req.body;

    if (!originalPrompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt original é obrigatório'
      });
    }

    const optimizedPrompt = await advancedAIService.optimizePrompt(originalPrompt);

    // Test both prompts if target model is specified
    let comparison = null;
    if (targetModel) {
      try {
        const [originalResult, optimizedResult] = await Promise.all([
          advancedAIService.executeAI({
            model: targetModel,
            prompt: originalPrompt
          }),
          advancedAIService.executeAI({
            model: targetModel,
            prompt: optimizedPrompt
          })
        ]);

        comparison = {
          original: originalResult,
          optimized: optimizedResult
        };
      } catch (error) {
        console.log('Erro na comparação:', error.message);
      }
    }

    res.json({
      success: true,
      data: {
        originalPrompt,
        optimizedPrompt,
        comparison
      },
      message: 'Prompt otimizado com sucesso!'
    });
  } catch (error) {
    console.error('Erro na otimização do prompt:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na otimização do prompt',
      details: error.message
    });
  }
});

export default router;