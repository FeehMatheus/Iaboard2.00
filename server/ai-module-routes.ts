import express from 'express';
import { freeAIProviders } from './free-ai-providers.js';
import { fileGenerationService } from './file-generation-service.js';

const router = express.Router();

// Utility function to generate files from AI content
async function generateDownloadableFiles(moduleType: string, content: string, prompt: string) {
  try {
    const files = await fileGenerationService.generateFiles({
      moduleType,
      prompt,
      aiResponse: content,
      format: 'html',
      purpose: `${moduleType} gerado por IA`
    });
    return files.map(f => ({ 
      name: f.name, 
      content: f.content, 
      type: f.type 
    }));
  } catch (error) {
    console.error('Erro ao gerar arquivos:', error);
    return [];
  }
}

// IA Copy Module
router.post('/api/ia-copy/generate', async (req, res) => {
  try {
    const { prompt, niche = 'marketing digital', targetAudience = 'empreendedores', objective = 'conversão' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt é obrigatório'
      });
    }

    const aiResult = await hybridAISystem.generateCopy(prompt, niche, targetAudience, objective);
    
    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: aiResult.error || 'Erro ao gerar copy'
      });
    }

    const files = await generateDownloadableFiles('ia-copy', aiResult.content, prompt);

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      files,
      metadata: {
        model: aiResult.model,
        provider: aiResult.provider,
        tokensUsed: aiResult.tokensUsed
      }
    });
  } catch (error) {
    console.error('Erro no módulo IA Copy:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// IA Product Module
router.post('/api/ia-produto/generate', async (req, res) => {
  try {
    const { idea, market = 'digital', budget = 'R$ 50.000', timeline = '3 meses' } = req.body;

    if (!idea) {
      return res.status(400).json({
        success: false,
        error: 'Ideia do produto é obrigatória'
      });
    }

    const aiResult = await hybridAISystem.generateProduct(idea, market, budget, timeline);
    
    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: aiResult.error || 'Erro ao gerar estratégia de produto'
      });
    }

    const files = await generateDownloadableFiles('ia-produto', aiResult.content, idea);

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      files,
      metadata: {
        model: aiResult.model,
        provider: aiResult.provider,
        tokensUsed: aiResult.tokensUsed
      }
    });
  } catch (error) {
    console.error('Erro no módulo IA Produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// IA Traffic Module
router.post('/api/ia-trafego/generate', async (req, res) => {
  try {
    const { 
      business, 
      budget = 'R$ 10.000/mês', 
      goals = 'gerar leads qualificados', 
      platforms = 'Google, Facebook, LinkedIn' 
    } = req.body;

    if (!business) {
      return res.status(400).json({
        success: false,
        error: 'Descrição do negócio é obrigatória'
      });
    }

    const aiResult = await hybridAISystem.generateTraffic(business, budget, goals, platforms);
    
    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: aiResult.error || 'Erro ao gerar estratégia de tráfego'
      });
    }

    const files = await generateDownloadableFiles('ia-trafego', aiResult.content, business);

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      files,
      metadata: {
        model: aiResult.model,
        provider: aiResult.provider,
        tokensUsed: aiResult.tokensUsed
      }
    });
  } catch (error) {
    console.error('Erro no módulo IA Tráfego:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// IA Video Module
router.post('/api/ia-video/generate', async (req, res) => {
  try {
    const { 
      concept, 
      duration = '5 minutos', 
      style = 'profissional', 
      objective = 'vendas' 
    } = req.body;

    if (!concept) {
      return res.status(400).json({
        success: false,
        error: 'Conceito do vídeo é obrigatório'
      });
    }

    const aiResult = await hybridAISystem.generateVideo(concept, duration, style, objective);
    
    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: aiResult.error || 'Erro ao gerar roteiro de vídeo'
      });
    }

    const files = await generateDownloadableFiles('ia-video', aiResult.content, concept);

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      files,
      metadata: {
        model: aiResult.model,
        provider: aiResult.provider,
        tokensUsed: aiResult.tokensUsed
      }
    });
  } catch (error) {
    console.error('Erro no módulo IA Vídeo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// IA Analytics Module
router.post('/api/ia-analytics/generate', async (req, res) => {
  try {
    const { 
      business, 
      metrics = 'conversões, ROI, CAC', 
      goals = 'otimizar performance', 
      platforms = 'Google Analytics, Facebook Pixel' 
    } = req.body;

    if (!business) {
      return res.status(400).json({
        success: false,
        error: 'Descrição do negócio é obrigatória'
      });
    }

    const aiResult = await hybridAISystem.generateAnalytics(business, metrics, goals, platforms);
    
    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: aiResult.error || 'Erro ao gerar estratégia de analytics'
      });
    }

    const files = await generateDownloadableFiles('ia-analytics', aiResult.content, business);

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      files,
      metadata: {
        model: aiResult.model,
        provider: aiResult.provider,
        tokensUsed: aiResult.tokensUsed
      }
    });
  } catch (error) {
    console.error('Erro no módulo IA Analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Health check endpoint
router.get('/api/ai/health', async (req, res) => {
  try {
    const providers = hybridAISystem.getProviderStatus();
    res.json({
      success: true,
      providers,
      totalProviders: providers.length,
      activeProviders: providers.filter(p => p.enabled).length
    });
  } catch (error) {
    console.error('Erro no health check:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar status dos provedores'
    });
  }
});

// Reset usage endpoint (for development)
router.post('/api/ai/reset-usage', async (req, res) => {
  try {
    hybridAISystem.resetUsage();
    res.json({
      success: true,
      message: 'Uso dos provedores resetado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao resetar uso:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao resetar uso dos provedores'
    });
  }
});

export default router;