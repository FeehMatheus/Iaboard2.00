import express from 'express';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { fileGenerationService } from './file-generation-service.js';
import { supremeFurionSystem } from './supreme-furion-system.js';
import fs from 'fs';
import path from 'path';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219

const router = express.Router();

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// Real AI execution function
async function executeRealAI(prompt: string, systemPrompt?: string): Promise<{ content: string; model: string; tokensUsed: number }> {
  try {
    // Prioritize OpenAI for reliability
    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt || 'Você é um especialista em marketing digital e criação de produtos. Responda em português com conteúdo prático e implementável.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
      });

      return {
        content: response.choices[0].message.content || '',
        model: 'gpt-4o',
        tokensUsed: response.usage?.total_tokens || 0
      };
    }

    if (anthropic) {
      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        system: systemPrompt || 'Você é um especialista em marketing digital e criação de produtos. Responda em português com conteúdo prático e implementável.'
      });

      const textContent = response.content.find((block: any) => block.type === 'text')?.text || '';
      return {
        content: textContent,
        model: 'claude-3-sonnet-20240229',
        tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0
      };
    }

    throw new Error('Nenhuma API de IA configurada');
  } catch (error) {
    console.error('Erro na API de IA:', error);
    throw error;
  }
}

// Copywriting module
router.post('/api/ia-copy/generate', async (req, res) => {
  try {
    const { prompt, niche, targetAudience, objective } = req.body;

    const systemPrompt = `Você é um copywriter especialista com 20 anos de experiência. Crie copy persuasivo e de alta conversão em português brasileiro.`;
    
    const fullPrompt = `
Crie um copy completo para:
- Nicho: ${niche}
- Público-alvo: ${targetAudience}
- Objetivo: ${objective}
- Prompt específico: ${prompt}

Inclua:
1. Headlines poderosos (5 variações)
2. Subheadlines explicativos
3. Bullets de benefícios
4. Prova social
5. Oferta irresistível
6. Calls-to-action (CTAs)
7. Senso de urgência/escassez
8. Garantia
9. FAQ antecipando objeções
10. Copy para email marketing (3 emails)

Use técnicas como AIDA, PAS, Before/After/Bridge, e storytelling.
`;

    const aiResult = await executeRealAI(fullPrompt, systemPrompt);
    
    // Generate downloadable files
    const files = await fileGenerationService.generateFiles({
      moduleType: 'ia-copy',
      prompt: fullPrompt,
      aiResponse: aiResult.content,
      format: 'html',
      purpose: 'Copy persuasivo completo'
    });

    res.json({
      success: true,
      data: {
        content: aiResult.content,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        files: files.map(f => ({ id: f.id, name: f.name, type: f.type, purpose: f.purpose, size: f.size })),
        executionTime: Date.now()
      }
    });
  } catch (error) {
    console.error('Erro no módulo de copy:', error);
    res.status(500).json({ success: false, error: 'Erro ao gerar copy' });
  }
});

// Product creation module
router.post('/api/ia-produto/generate', async (req, res) => {
  try {
    const { idea, market, budget, timeline } = req.body;

    const systemPrompt = `Você é um especialista em desenvolvimento de produtos digitais e strategy. Crie estratégias completas e implementáveis.`;
    
    const fullPrompt = `
Desenvolva uma estratégia completa de produto para:
- Ideia: ${idea}
- Mercado: ${market}
- Orçamento: ${budget}
- Timeline: ${timeline}

Inclua:
1. Análise de mercado detalhada
2. Pesquisa da concorrência
3. Proposta de valor única
4. MVP (Produto Mínimo Viável)
5. Roadmap de desenvolvimento
6. Estratégia de pricing
7. Canais de distribuição
8. Métricas de sucesso
9. Plano de lançamento
10. Análise de riscos e mitigação
11. Projeções financeiras
12. Estratégia de crescimento
`;

    const aiResult = await executeRealAI(fullPrompt, systemPrompt);
    
    const files = await fileGenerationService.generateFiles({
      moduleType: 'ia-produto',
      prompt: fullPrompt,
      aiResponse: aiResult.content,
      format: 'md',
      purpose: 'Estratégia completa de produto'
    });

    res.json({
      success: true,
      data: {
        content: aiResult.content,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        files: files.map(f => ({ id: f.id, name: f.name, type: f.type, purpose: f.purpose, size: f.size })),
        executionTime: Date.now()
      }
    });
  } catch (error) {
    console.error('Erro no módulo de produto:', error);
    res.status(500).json({ success: false, error: 'Erro ao gerar estratégia de produto' });
  }
});

// Traffic generation module
router.post('/api/ia-trafego/generate', async (req, res) => {
  try {
    const { business, budget, goals, platforms } = req.body;

    const systemPrompt = `Você é um especialista em tráfego pago e orgânico com expertise em todas as principais plataformas de marketing digital.`;
    
    const fullPrompt = `
Crie uma estratégia completa de tráfego para:
- Negócio: ${business}
- Orçamento: ${budget}
- Objetivos: ${goals}
- Plataformas: ${platforms}

Desenvolva:
1. Estratégia de tráfego pago (Google Ads, Facebook Ads, LinkedIn Ads)
2. Estratégia de tráfego orgânico (SEO, redes sociais, content marketing)
3. Segmentação detalhada de audiência
4. Copies para anúncios (múltiplas variações)
5. Landing pages otimizadas
6. Funnels de conversão
7. Remarketing e retargeting
8. Orçamento e distribuição
9. KPIs e métricas
10. Cronograma de execução
11. Testes A/B sugeridos
12. Estratégias de otimização
`;

    const aiResult = await executeRealAI(fullPrompt, systemPrompt);
    
    const files = await fileGenerationService.generateFiles({
      moduleType: 'ia-trafego',
      prompt: fullPrompt,
      aiResponse: aiResult.content,
      format: 'json',
      purpose: 'Estratégia completa de tráfego'
    });

    res.json({
      success: true,
      data: {
        content: aiResult.content,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        files: files.map(f => ({ id: f.id, name: f.name, type: f.type, purpose: f.purpose, size: f.size })),
        executionTime: Date.now()
      }
    });
  } catch (error) {
    console.error('Erro no módulo de tráfego:', error);
    res.status(500).json({ success: false, error: 'Erro ao gerar estratégia de tráfego' });
  }
});

// Video creation module
router.post('/api/ia-video/generate', async (req, res) => {
  try {
    const { concept, duration, style, objective } = req.body;

    const systemPrompt = `Você é um especialista em criação de vídeos de vendas, roteiros e produção audiovisual para marketing digital.`;
    
    const fullPrompt = `
Crie um projeto completo de vídeo para:
- Conceito: ${concept}
- Duração: ${duration}
- Estilo: ${style}
- Objetivo: ${objective}

Desenvolva:
1. Roteiro completo (hook, problema, solução, prova, oferta, CTA)
2. Storyboard detalhado
3. Indicações de câmera e cortes
4. Elementos visuais necessários
5. Trilha sonora sugerida
6. Guia de produção
7. Setup técnico
8. Pós-produção e edição
9. Thumbnails otimizados
10. Títulos e descrições para distribuição
11. Estratégia de lançamento
12. Métricas de performance
`;

    const aiResult = await executeRealAI(fullPrompt, systemPrompt);
    
    const files = await fileGenerationService.generateFiles({
      moduleType: 'ia-video',
      prompt: fullPrompt,
      aiResponse: aiResult.content,
      format: 'txt',
      purpose: 'Projeto completo de vídeo'
    });

    res.json({
      success: true,
      data: {
        content: aiResult.content,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        files: files.map(f => ({ id: f.id, name: f.name, type: f.type, purpose: f.purpose, size: f.size })),
        executionTime: Date.now()
      }
    });
  } catch (error) {
    console.error('Erro no módulo de vídeo:', error);
    res.status(500).json({ success: false, error: 'Erro ao gerar projeto de vídeo' });
  }
});

// Analytics module
router.post('/api/ia-analytics/generate', async (req, res) => {
  try {
    const { business, metrics, goals, platforms } = req.body;

    const systemPrompt = `Você é um especialista em analytics, métricas de performance e business intelligence para marketing digital.`;
    
    const fullPrompt = `
Crie um sistema completo de analytics para:
- Negócio: ${business}
- Métricas: ${metrics}
- Objetivos: ${goals}
- Plataformas: ${platforms}

Desenvolva:
1. Dashboard customizado
2. KPIs principais e secundários
3. Métricas de funil completo
4. Configuração do Google Analytics 4
5. Configuração do Facebook Pixel
6. Tracking de conversões
7. Relatórios automatizados
8. Alertas e notificações
9. Análise de ROI/ROAS
10. Attribution modeling
11. Cohort analysis
12. Preditive analytics
13. Data visualization
14. Implementação técnica (códigos)
`;

    const aiResult = await executeRealAI(fullPrompt, systemPrompt);
    
    const files = await fileGenerationService.generateFiles({
      moduleType: 'ia-analytics',
      prompt: fullPrompt,
      aiResponse: aiResult.content,
      format: 'js',
      purpose: 'Sistema completo de analytics'
    });

    res.json({
      success: true,
      data: {
        content: aiResult.content,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        files: files.map(f => ({ id: f.id, name: f.name, type: f.type, purpose: f.purpose, size: f.size })),
        executionTime: Date.now()
      }
    });
  } catch (error) {
    console.error('Erro no módulo de analytics:', error);
    res.status(500).json({ success: false, error: 'Erro ao gerar sistema de analytics' });
  }
});

// Supreme Furion system
router.post('/api/supreme/create-product', async (req, res) => {
  try {
    const result = await supremeFurionSystem.createCompleteProduct(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Erro no sistema Furion:', error);
    res.status(500).json({ success: false, error: 'Erro ao criar produto' });
  }
});

// File download endpoints
router.get('/api/files', (req, res) => {
  try {
    const files = fileGenerationService.listFiles();
    res.json({ success: true, files });
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ success: false, error: 'Erro ao listar arquivos' });
  }
});

router.get('/api/files/:id', (req, res) => {
  try {
    const file = fileGenerationService.getFile(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: 'Arquivo não encontrado' });
    }
    res.json({ success: true, file });
  } catch (error) {
    console.error('Erro ao buscar arquivo:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar arquivo' });
  }
});

router.get('/api/files/:id/download', (req, res) => {
  try {
    const file = fileGenerationService.getFile(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: 'Arquivo não encontrado' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', getContentType(file.type));
    res.send(file.content);
  } catch (error) {
    console.error('Erro no download:', error);
    res.status(500).json({ success: false, error: 'Erro no download' });
  }
});

router.delete('/api/files/:id', (req, res) => {
  try {
    const success = fileGenerationService.deleteFile(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Arquivo não encontrado' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ success: false, error: 'Erro ao deletar arquivo' });
  }
});

// Health check
router.get('/api/health', (req, res) => {
  res.json({
    success: true,
    apis: {
      openai: !!openai,
      anthropic: !!anthropic
    },
    timestamp: new Date().toISOString()
  });
});

function getContentType(fileType: string): string {
  const types: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'txt': 'text/plain',
    'md': 'text/markdown',
    'pdf': 'application/pdf'
  };
  return types[fileType] || 'application/octet-stream';
}

export default router;