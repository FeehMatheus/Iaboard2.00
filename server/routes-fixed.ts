import express from 'express';
import { directLLMService } from './direct-llm-service';
import { realVideoService } from './real-video-service';
import { authenticContentGenerator } from './authentic-content-generator';

const router = express.Router();

// Direct LLM generation (replaces OpenRouter)
router.post('/api/direct-llm/generate', async (req, res) => {
  try {
    const { prompt, model, systemPrompt, temperature, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
    }

    const result = await directLLMService.generateContent({
      prompt,
      model,
      systemPrompt,
      temperature,
      maxTokens
    });

    res.json(result);
  } catch (error) {
    console.error('Direct LLM error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    });
  }
});

// Real video generation (fixed)
router.post('/api/video/generate-real', async (req, res) => {
  try {
    const { prompt, aspectRatio, duration, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt é obrigatório para gerar vídeo' });
    }

    const result = await realVideoService.generateVideo({
      prompt,
      aspectRatio: aspectRatio || '16:9',
      duration: duration || 5,
      style: style || 'realistic'
    });

    res.json(result);
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro na geração de vídeo'
    });
  }
});

// Check video status
router.get('/api/video/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await realVideoService.checkVideoStatus(jobId);
    res.json(result);
  } catch (error) {
    console.error('Video status error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar status do vídeo'
    });
  }
});

// Authentic content generation
router.post('/api/content/authentic', async (req, res) => {
  try {
    const { userIdea, contentType, targetAudience, businessType, goals, specificRequirements } = req.body;

    if (!userIdea) {
      return res.status(400).json({ success: false, error: 'Ideia do usuário é obrigatória' });
    }

    if (!contentType) {
      return res.status(400).json({ success: false, error: 'Tipo de conteúdo é obrigatório' });
    }

    const result = await authenticContentGenerator.generateRealContent({
      userIdea,
      contentType,
      targetAudience,
      businessType,
      goals,
      specificRequirements
    });

    res.json(result);
  } catch (error) {
    console.error('Authentic content error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro na geração de conteúdo autêntico'
    });
  }
});

// Generate multiple content versions
router.post('/api/content/versions', async (req, res) => {
  try {
    const { userIdea, contentType, targetAudience, businessType, goals, specificRequirements, versions } = req.body;

    if (!userIdea || !contentType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ideia do usuário e tipo de conteúdo são obrigatórios' 
      });
    }

    const results = await authenticContentGenerator.generateMultipleVersions({
      userIdea,
      contentType,
      targetAudience,
      businessType,
      goals,
      specificRequirements
    }, versions || 3);

    res.json({
      success: true,
      versions: results,
      totalGenerated: results.length
    });
  } catch (error) {
    console.error('Multiple versions error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro na geração de múltiplas versões'
    });
  }
});

// Validate content authenticity
router.post('/api/content/validate', async (req, res) => {
  try {
    const { content, originalIdea } = req.body;

    if (!content || !originalIdea) {
      return res.status(400).json({ 
        success: false, 
        error: 'Conteúdo e ideia original são obrigatórios' 
      });
    }

    const result = await authenticContentGenerator.validateContentAuthenticity(content, originalIdea);

    res.json({
      success: true,
      validation: result
    });
  } catch (error) {
    console.error('Content validation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro na validação de autenticidade'
    });
  }
});

// Health check for new services
router.get('/api/health/direct-services', async (req, res) => {
  try {
    const llmHealth = await directLLMService.healthCheck();
    const videoHealth = await realVideoService.healthCheck();

    const results = {
      directLLM: llmHealth,
      realVideo: videoHealth,
      timestamp: new Date().toISOString(),
      summary: {
        totalServices: llmHealth.length + 1,
        operationalLLM: llmHealth.filter(service => service.available).length,
        operationalVideo: videoHealth.success ? 1 : 0
      }
    };

    res.json({
      success: true,
      health: results
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro no health check'
    });
  }
});

// IA Module execution with authentic content
router.post('/api/ia-modules/:moduleType', async (req, res) => {
  try {
    const { moduleType } = req.params;
    const { userIdea, prompt, parameters } = req.body;

    if (!userIdea) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ideia do usuário é obrigatória para gerar conteúdo autêntico' 
      });
    }

    // Map module types to content types
    const moduleContentMap: Record<string, string> = {
      'ia-copy': 'copy',
      'ia-produto': 'product',
      'ia-trafego': 'strategy',
      'ia-video': 'video-script',
      'ia-total': 'funnel'
    };

    const contentType = moduleContentMap[moduleType] || 'strategy';

    const result = await authenticContentGenerator.generateRealContent({
      userIdea,
      contentType,
      targetAudience: parameters?.audience,
      businessType: parameters?.businessType,
      goals: parameters?.goals,
      specificRequirements: prompt
    });

    res.json({
      success: result.success,
      result: result.content,
      moduleType,
      basedOnIdea: result.basedOnUserIdea,
      suggestions: result.suggestions,
      nextSteps: result.nextSteps,
      metadata: {
        contentType,
        authentic: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('IA Module error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro no módulo IA'
    });
  }
});

// Test endpoint for all new services
router.post('/api/test/all-fixed', async (req, res) => {
  try {
    const results = [];

    // Test Direct LLM
    try {
      const llmTest = await directLLMService.generateContent({
        prompt: 'Teste de funcionalidade do sistema IA Board',
        maxTokens: 50
      });
      results.push({
        service: 'Direct LLM',
        success: llmTest.success,
        provider: llmTest.provider,
        tokens: llmTest.tokensUsed
      });
    } catch (error) {
      results.push({
        service: 'Direct LLM',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test Real Video
    try {
      const videoHealth = await realVideoService.healthCheck();
      results.push({
        service: 'Real Video',
        success: videoHealth.success,
        message: videoHealth.message
      });
    } catch (error) {
      results.push({
        service: 'Real Video',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test Authentic Content
    try {
      const contentTest = await authenticContentGenerator.generateRealContent({
        userIdea: 'Venda de cursos online de programação',
        contentType: 'copy'
      });
      results.push({
        service: 'Authentic Content',
        success: contentTest.success,
        contentLength: contentTest.content.length
      });
    } catch (error) {
      results.push({
        service: 'Authentic Content',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      summary: `${successCount}/${results.length} serviços operacionais`,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test all error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro no teste geral'
    });
  }
});

export default router;