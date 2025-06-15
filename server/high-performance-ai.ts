import express from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Initialize high-performance providers
const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const perplexity = new OpenAI({
  baseURL: 'https://api.perplexity.ai',
  apiKey: process.env.PERPLEXITY_API_KEY,
});

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Helper function to save generated content
const saveToDownloads = (content: string, filename: string, type: string) => {
  const filePath = path.join(downloadsDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  return {
    filename,
    path: `/downloads/${filename}`,
    size: Buffer.byteLength(content, 'utf8'),
    type
  };
};

// Ultra-fast content generation with GROQ (14,400 tokens/min)
router.post('/api/groq/generate', async (req, res) => {
  try {
    const { prompt, type = 'copy', format = 'text' } = req.body;
    
    const startTime = Date.now();
    
    const optimizedPrompt = `${prompt}

IMPORTANTE: Gere conteúdo profissional e prático de alta qualidade. Seja específico, detalhado e útil.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em marketing digital e criação de conteúdo. Gere conteúdo profissional, prático e de alta conversão.'
        },
        { role: 'user', content: optimizedPrompt }
      ],
      model: 'llama3-8b-8192', // Ultra-fast model
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const processingTime = Date.now() - startTime;

    // Save to downloads if requested
    let savedFile = null;
    if (format === 'file') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `groq-${type}-${timestamp}.txt`;
      savedFile = saveToDownloads(content, filename, 'Conteúdo GROQ');
    }

    res.json({
      success: true,
      content,
      model: 'Llama-3-8B (GROQ)',
      tokens: completion.usage?.total_tokens || 0,
      processingTime,
      provider: 'groq',
      limits: '14,400 tokens/minuto',
      file: savedFile
    });

  } catch (error) {
    console.error('Erro GROQ:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração com GROQ',
      details: error.message
    });
  }
});

// Real-time research with Perplexity
router.post('/api/perplexity/research', async (req, res) => {
  try {
    const { query, format = 'text' } = req.body;
    
    const startTime = Date.now();
    
    const completion = await perplexity.chat.completions.create({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Você é um pesquisador especializado. Forneça informações atualizadas, precisas e bem estruturadas com fontes confiáveis.'
        },
        { role: 'user', content: query }
      ],
      temperature: 0.2,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const processingTime = Date.now() - startTime;

    // Save research to downloads if requested
    let savedFile = null;
    if (format === 'file') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `pesquisa-${timestamp}.md`;
      const markdownContent = `# Pesquisa de Mercado\n\n**Query:** ${query}\n\n**Data:** ${new Date().toLocaleDateString('pt-BR')}\n\n---\n\n${content}`;
      savedFile = saveToDownloads(markdownContent, filename, 'Pesquisa Perplexity');
    }

    res.json({
      success: true,
      content,
      model: 'Llama-3.1-Sonar',
      tokens: completion.usage?.total_tokens || 0,
      processingTime,
      provider: 'perplexity',
      features: 'Pesquisa em tempo real',
      file: savedFile
    });

  } catch (error) {
    console.error('Erro Perplexity:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na pesquisa com Perplexity',
      details: error.message
    });
  }
});

// HuggingFace AI models
router.post('/api/huggingface/generate', async (req, res) => {
  try {
    const { prompt, model = 'microsoft/DialoGPT-medium', format = 'text' } = req.body;
    
    const startTime = Date.now();
    
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const result = await response.json();
    const content = Array.isArray(result) ? result[0]?.generated_text : result.generated_text || '';
    const processingTime = Date.now() - startTime;

    // Save to downloads if requested
    let savedFile = null;
    if (format === 'file') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `huggingface-${timestamp}.txt`;
      savedFile = saveToDownloads(content, filename, 'Conteúdo HuggingFace');
    }

    res.json({
      success: true,
      content,
      model,
      processingTime,
      provider: 'huggingface',
      features: 'Centenas de modelos gratuitos',
      file: savedFile
    });

  } catch (error) {
    console.error('Erro HuggingFace:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração com HuggingFace',
      details: error.message
    });
  }
});

// Smart business content generator combining all providers
router.post('/api/smart-business/generate', async (req, res) => {
  try {
    const { productType, targetAudience, contentType = 'complete-package' } = req.body;
    
    const startTime = Date.now();
    
    // Step 1: Market research with Perplexity
    const researchQuery = `Análise de mercado atual para ${productType} direcionado para ${targetAudience}. Incluir tendências, concorrentes e oportunidades 2024-2025.`;
    
    const researchResponse = await perplexity.chat.completions.create({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        { role: 'user', content: researchQuery }
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const marketResearch = researchResponse.choices[0]?.message?.content || '';

    // Step 2: Generate sales copy with GROQ
    const copyPrompt = `Com base nesta pesquisa de mercado:

${marketResearch}

Crie um copy de vendas persuasivo para ${productType} direcionado para ${targetAudience}. Inclua:
- Headline impactante
- Problemas do público
- Solução oferecida
- Benefícios específicos
- Call-to-action irresistível
- Prova social`;

    const copyResponse = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um copywriter especialista em vendas online. Crie copies que convertem.'
        },
        { role: 'user', content: copyPrompt }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.8,
      max_tokens: 2000,
    });

    const salesCopy = copyResponse.choices[0]?.message?.content || '';

    // Step 3: Create complete business package
    const completePackage = `# PACOTE COMPLETO DE NEGÓCIO
## ${productType.toUpperCase()} - ${targetAudience}

**Gerado em:** ${new Date().toLocaleString('pt-BR')}

---

## 📊 PESQUISA DE MERCADO

${marketResearch}

---

## 🎯 COPY DE VENDAS

${salesCopy}

---

## 📈 ESTRATÉGIA DE LANÇAMENTO

### Fase 1: Pré-lançamento (7 dias)
- Teaser nas redes sociais
- Lista de espera
- Webinar gratuito

### Fase 2: Lançamento (3 dias)
- Email marketing intensivo
- Promoção limitada
- Urgência e escassez

### Fase 3: Pós-lançamento
- Follow-up com compradores
- Coleta de depoimentos
- Otimização baseada em resultados

---

## 💰 PRECIFICAÇÃO SUGERIDA

### Preço Psicológico: R$ 197
### Preço Premium: R$ 497
### Pacote VIP: R$ 997

---

## 🎬 ROTEIRO PARA VSL (60 segundos)

1. **Gancho (0-10s):** "Você sabia que 97% das pessoas que tentam [problema] falham?"
2. **Problema (10-25s):** Apresentar as 3 maiores dores
3. **Solução (25-45s):** Mostrar o produto como única saída
4. **Prova (45-55s):** Resultado real de cliente
5. **CTA (55-60s):** "Clique agora antes que seja tarde"

---

*Gerado pela IA SUPREMA - Máquina Milionária*`;

    const processingTime = Date.now() - startTime;

    // Save complete package
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `pacote-completo-${productType.replace(/\s+/g, '-')}-${timestamp}.md`;
    const savedFile = saveToDownloads(completePackage, filename, 'Pacote Completo');

    res.json({
      success: true,
      marketResearch,
      salesCopy,
      completePackage,
      processingTime,
      providers: ['Perplexity', 'GROQ'],
      totalTokens: (researchResponse.usage?.total_tokens || 0) + (copyResponse.usage?.total_tokens || 0),
      file: savedFile
    });

  } catch (error) {
    console.error('Erro Smart Business:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração do pacote completo',
      details: error.message
    });
  }
});

export default router;