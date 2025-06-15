import express from 'express';
import { smartLLM } from './smart-llm-system.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// IA Copy Module - Headlines and persuasive copy
router.post('/api/ia-copy/generate', async (req, res) => {
  try {
    const { prompt, niche = 'marketing digital', targetAudience = 'empreendedores', objective = 'conversão' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt é obrigatório'
      });
    }

    const aiResult = await smartLLM.smartLLM({
      prompt: `Crie copy persuasivo completo para: ${prompt}. 
      Nicho: ${niche}
      Público: ${targetAudience}
      Objetivo: ${objective}
      
      Inclua: headlines magnéticos, bullets irresistíveis, prova social, CTAs poderosos, ofertas irresistíveis com urgência e escassez.`,
      systemPrompt: 'Você é um copywriter mundial especialista em vendas com 20 anos de experiência. Crie copy persuasivo de alta conversão em português brasileiro.',
      maxTokens: 1500
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar copy'
      });
    }

    // Generate downloadable file
    const fileName = `copy-${Date.now()}.html`;
    const filePath = path.join(downloadsDir, fileName);
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copy Persuasivo - IA Board</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: #FF1639; color: white; padding: 20px; border-radius: 10px; }
        .content { margin: 20px 0; line-height: 1.6; }
        .cta { background: #FF1639; color: white; padding: 15px 30px; text-align: center; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Copy Gerado por IA Board</h1>
        <p>Criado em ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    <div class="content">
        ${aiResult.content.replace(/\n/g, '<br>')}
    </div>
    <div class="cta">
        <strong>Gerado por IA Board - A revolução do marketing digital</strong>
    </div>
</body>
</html>`;
    
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
    console.error('Erro no módulo IA Copy:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// IA Produto Module - Product strategy and features
router.post('/api/ia-produto/generate', async (req, res) => {
  try {
    const { idea, market = 'digital', budget = 'R$ 50.000', timeline = '3 meses' } = req.body;

    if (!idea) {
      return res.status(400).json({
        success: false,
        error: 'Ideia do produto é obrigatória'
      });
    }

    const aiResult = await smartLLM.smartLLM({
      prompt: `Crie ficha técnica completa do produto: ${idea}
      Mercado: ${market}
      Orçamento: ${budget}
      Timeline: ${timeline}
      
      Inclua: análise de mercado, especificações técnicas, diferenciais competitivos, estratégia de preços, plano de lançamento, projeções financeiras.`,
      systemPrompt: 'Você é um consultor de produtos digitais com 15 anos de experiência em lançamentos de sucesso. Crie estratégias detalhadas e implementáveis.',
      maxTokens: 1500
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar estratégia de produto'
      });
    }

    // Save to Notion if configured
    if (process.env.NOTION_API_KEY) {
      try {
        await saveToNotion({
          title: `Produto: ${idea}`,
          type: 'Estratégia de Produto',
          content: aiResult.content,
          userId: String(req.headers['x-user-id'] || 'anonymous')
        });
      } catch (notionError) {
        console.error('Erro ao salvar no Notion:', notionError);
      }
    }

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        latency: aiResult.latency,
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

// IA Vídeo Module - Video generation with Stability AI
router.post('/api/ia-video/generate', async (req, res) => {
  try {
    const { concept, duration = '5 segundos', style = 'profissional', objective = 'vendas' } = req.body;

    if (!concept) {
      return res.status(400).json({
        success: false,
        error: 'Conceito do vídeo é obrigatório'
      });
    }

    // First generate the video script with AI
    const scriptResult = await smartLLM.smartLLM({
      prompt: `Crie roteiro detalhado para vídeo: ${concept}
      Duração: ${duration}
      Estilo: ${style}
      Objetivo: ${objective}
      
      Inclua: hook inicial, desenvolvimento, call-to-action, descrições visuais, timing.`,
      systemPrompt: 'Você é um roteirista especialista em vídeos virais e de conversão. Crie roteiros envolventes e detalhados.',
      maxTokens: 1500
    });

    let videoUrl = null;
    let videoGenerated = false;

    // Try to generate actual video with Stability AI
    if (process.env.STABILITY_API_KEY) {
      try {
        const videoResponse = await fetch('https://api.stability.ai/v2alpha/generation/video', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: concept,
            duration: 5,
            aspect_ratio: "16:9",
            seed: Math.floor(Math.random() * 1000000)
          })
        });

        if (videoResponse.ok) {
          const videoData = await videoResponse.arrayBuffer();
          const fileName = `video-${Date.now()}.mp4`;
          const filePath = path.join(downloadsDir, fileName);
          fs.writeFileSync(filePath, Buffer.from(videoData));
          videoUrl = `/downloads/${fileName}`;
          videoGenerated = true;
        }
      } catch (videoError) {
        console.error('Erro na geração de vídeo:', videoError);
      }
    }

    // Fallback to Runway Studio link if video generation fails
    if (!videoGenerated) {
      const runwayPrompt = encodeURIComponent(concept);
      videoUrl = `https://app.runwayml.com/video-tools/teams/user/ai-tools/gen-2?prompt=${runwayPrompt}`;
    }

    res.json({
      success: true,
      result: scriptResult.content,
      content: scriptResult.content,
      video: {
        url: videoUrl,
        generated: videoGenerated,
        type: videoGenerated ? 'mp4' : 'runway_link'
      },
      metadata: {
        provider: scriptResult.provider,
        model: scriptResult.model,
        latency: scriptResult.latency,
        tokensUsed: scriptResult.tokensUsed
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

// IA Voz Module - Text-to-speech with ElevenLabs
router.post('/api/ia-voz/generate', async (req, res) => {
  try {
    const { text, voice = 'SpTO7r4hF4G4xLRJ9Mug' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Texto é obrigatório'
      });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'ElevenLabs API key não configurada'
      });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const fileName = `audio-${Date.now()}.mp3`;
    const filePath = path.join(downloadsDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(audioBuffer));

    res.json({
      success: true,
      result: 'Áudio gerado com sucesso',
      content: text,
      audio: {
        url: `/downloads/${fileName}`,
        filename: fileName,
        type: 'mp3'
      }
    });

  } catch (error) {
    console.error('Erro no módulo IA Voz:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    });
  }
});

// IA Tráfego Module - Paid traffic strategies
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

    const aiResult = await smartLLM.smartLLM({
      prompt: `Crie estratégia completa de tráfego pago para: ${business}
      Orçamento: ${budget}
      Objetivos: ${goals}
      Plataformas: ${platforms}
      
      Inclua: segmentação detalhada, distribuição de orçamento, criativos vencedores, KPIs, cronograma de execução, estratégias de remarketing.`,
      systemPrompt: 'Você é um especialista em tráfego pago com certificações Google e Meta, especializado em ROI e performance marketing.',
      maxTokens: 3000
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Erro ao gerar estratégia de tráfego'
      });
    }

    res.json({
      success: true,
      result: aiResult.content,
      content: aiResult.content,
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        latency: aiResult.latency,
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

// IA Documento Module - Save to Notion
router.post('/api/ia-documento/save', async (req, res) => {
  try {
    const { title, content, type = 'Documento IA' } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Título e conteúdo são obrigatórios'
      });
    }

    if (!process.env.NOTION_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'Notion API key não configurada'
      });
    }

    const result = await saveToNotion({
      title,
      type,
      content,
      userId: String(req.headers['x-user-id'] || 'anonymous')
    });

    res.json({
      success: true,
      result: 'Documento salvo no Notion com sucesso',
      notion: result
    });

  } catch (error) {
    console.error('Erro no módulo IA Documento:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    });
  }
});

// IA Automação Module - Zapier webhook trigger
router.post('/api/ia-automacao/trigger', async (req, res) => {
  try {
    const { event_type, data } = req.body;

    if (!event_type) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de evento é obrigatório'
      });
    }

    const webhookPayload = {
      event_type,
      data,
      timestamp: new Date().toISOString(),
      source: 'IA Board',
      user_id: String(req.headers['x-user-id'] || 'anonymous')
    };

    // Send to Zapier webhook
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookPayload)
        });

        if (webhookResponse.ok) {
          res.json({
            success: true,
            result: 'Automação disparada com sucesso',
            webhook: {
              status: 'sent',
              event_type
            }
          });
        } else {
          throw new Error(`Webhook failed: ${webhookResponse.status}`);
        }
      } catch (webhookError) {
        console.error('Erro no webhook:', webhookError);
        res.status(500).json({
          success: false,
          error: 'Erro ao disparar webhook'
        });
      }
    } else {
      res.json({
        success: true,
        result: 'Webhook URL não configurada - evento registrado localmente',
        webhook: {
          status: 'logged',
          event_type
        }
      });
    }

  } catch (error) {
    console.error('Erro no módulo IA Automação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Helper function to save content to Notion
async function saveToNotion(data: { title: string; type: string; content: string; userId: string }) {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { 
        type: 'database_id',
        database_id: process.env.NOTION_DATABASE_ID || 'default-database-id'
      },
      properties: {
        'Título': { 
          title: [{ text: { content: data.title } }] 
        },
        'Tipo': { 
          select: { name: data.type } 
        },
        'Usuário': { 
          rich_text: [{ text: { content: String(data.userId) } }] 
        },
        'Data': { 
          date: { start: new Date().toISOString() } 
        }
      },
      children: [{
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ 
            type: 'text', 
            text: { content: data.content.substring(0, 2000) } // Notion limit
          }]
        }
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${error}`);
  }

  return response.json();
}

// Downloads endpoint
router.get('/api/downloads', async (req, res) => {
  try {
    const files = fs.readdirSync(downloadsDir);
    const fileList = files.map(file => {
      const filePath = path.join(downloadsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        url: `/downloads/${file}`,
        size: stats.size,
        created: stats.birthtime,
        type: path.extname(file).substring(1)
      };
    });

    res.json({
      success: true,
      files: fileList
    });
  } catch (error) {
    console.error('Erro ao listar downloads:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar arquivos'
    });
  }
});

export default router;