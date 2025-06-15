import express from 'express';
import { smartLLM } from './smart-llm-system.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Fast Copy Generation - Optimized for speed
router.post('/api/fast/copy', async (req, res) => {
  try {
    const { prompt, niche = 'geral', targetAudience = 'público geral', objective = 'conversão' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt é obrigatório'
      });
    }

    // Quick AI generation with minimal tokens
    const aiResult = await smartLLM.smartLLM({
      prompt: `Copy para: ${prompt}. Nicho: ${niche}. Público: ${targetAudience}. Objetivo: ${objective}`,
      systemPrompt: 'Crie copy persuasivo conciso em português.',
      maxTokens: 150,
      temperature: 0.7
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar copy'
      });
    }

    // Generate HTML file
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copy Gerado - IA Board</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #ff0000; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .content { line-height: 1.6; }
        .meta { color: #666; font-size: 0.9em; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Copy Persuasivo Gerado</h1>
        <p>IA Board by Filippe™</p>
    </div>
    <div class="content">
        ${aiResult.content.replace(/\n/g, '<br>')}
    </div>
    <div class="meta">
        <p><strong>Nicho:</strong> ${niche}</p>
        <p><strong>Público:</strong> ${targetAudience}</p>
        <p><strong>Objetivo:</strong> ${objective}</p>
        <p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <p><strong>Provider:</strong> ${aiResult.provider}</p>
        <p><strong>Tokens:</strong> ${aiResult.tokensUsed}</p>
    </div>
</body>
</html>`;

    const fileName = `copy-${Date.now()}.html`;
    const filePath = path.join(downloadsDir, fileName);
    fs.writeFileSync(filePath, htmlContent);

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      file: {
        name: fileName,
        url: `/downloads/${fileName}`,
        type: 'html'
      },
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        latency: aiResult.latency,
        tokensUsed: aiResult.tokensUsed
      }
    });

  } catch (error) {
    console.error('Erro no fast copy:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Fast Product Generation
router.post('/api/fast/product', async (req, res) => {
  try {
    const { idea, market = 'digital', budget = 'R$ 50.000', timeline = '3 meses' } = req.body;

    if (!idea) {
      return res.status(400).json({
        success: false,
        error: 'Ideia do produto é obrigatória'
      });
    }

    const aiResult = await smartLLM.smartLLM({
      prompt: `Produto: ${idea}. Mercado: ${market}. Orçamento: ${budget}. Timeline: ${timeline}`,
      systemPrompt: 'Crie estratégia de produto concisa e implementável.',
      maxTokens: 300,
      temperature: 0.7
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar estratégia'
      });
    }

    const fileName = `produto-${Date.now()}.html`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Estratégia de Produto - IA Board</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #ff0000; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .content { line-height: 1.6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Estratégia de Produto</h1>
        <p>IA Board by Filippe™</p>
    </div>
    <div class="content">
        ${aiResult.content.replace(/\n/g, '<br>')}
    </div>
</body>
</html>`;

    const filePath = path.join(downloadsDir, fileName);
    fs.writeFileSync(filePath, htmlContent);

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      file: {
        name: fileName,
        url: `/downloads/${fileName}`,
        type: 'html'
      },
      metadata: {
        provider: aiResult.provider,
        tokensUsed: aiResult.tokensUsed
      }
    });

  } catch (error) {
    console.error('Erro no fast product:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Fast Video Script Generation
router.post('/api/fast/video', async (req, res) => {
  try {
    const { concept, duration = '5 minutos', style = 'profissional' } = req.body;

    if (!concept) {
      return res.status(400).json({
        success: false,
        error: 'Conceito do vídeo é obrigatório'
      });
    }

    const aiResult = await smartLLM.smartLLM({
      prompt: `Roteiro para vídeo: ${concept}. Duração: ${duration}. Estilo: ${style}`,
      systemPrompt: 'Crie roteiro de vídeo conciso e envolvente.',
      maxTokens: 300,
      temperature: 0.7
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar roteiro'
      });
    }

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      metadata: {
        provider: aiResult.provider,
        tokensUsed: aiResult.tokensUsed
      }
    });

  } catch (error) {
    console.error('Erro no fast video:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Health Check Endpoint
router.get('/api/fast/health', async (req, res) => {
  try {
    const categories = [
      { name: 'Chat', available: !!process.env.MISTRAL_API_KEY || !!process.env.OPENROUTER_API_KEY },
      { name: 'Video', available: !!process.env.STABILITY_API_KEY },
      { name: 'TTS', available: !!process.env.ELEVENLABS_API_KEY },
      { name: 'Storage', available: !!process.env.NOTION_API_KEY },
      { name: 'Automation', available: !!process.env.ZAPIER_WEBHOOK_URL }
    ];

    const available = categories.filter(c => c.available).length;
    const total = categories.length;

    res.json({
      success: true,
      status: `${available}/${total} sistemas operacionais`,
      categories,
      allOperational: available === total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro no health check'
    });
  }
});

export default router;