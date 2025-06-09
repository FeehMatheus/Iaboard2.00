// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219

interface AIGenerationParams {
  step: number;
  prompt: string;
  aiProvider: 'openai' | 'anthropic' | 'google';
  productType: string;
  previousSteps?: any;
}

interface AIResponse {
  content: string;
  provider: string;
  step: number;
  metadata?: any;
}

const stepPrompts = {
  1: (productType: string) => `Como especialista em marketing digital, analise o tipo de produto "${productType}" e defina o nicho mais lucrativo. Considere:
- Tendências de mercado atuais
- Concorrência
- Público-alvo potencial
- Oportunidades de monetização
- Dificuldades comuns do mercado

Retorne em formato JSON com: {"nicho": "nome do nicho", "analise": "análise detalhada", "oportunidades": ["oportunidade1", "oportunidade2"], "publico_tamanho": "estimativa", "concorrencia": "nível de concorrência"}`,

  2: (productType: string, nicho: any) => `Com base no nicho "${nicho?.nicho || 'definido anteriormente'}", crie um avatar detalhado do cliente ideal para um ${productType}. Inclua:
- Demografia (idade, gênero, localização, renda)
- Psicografia (valores, interesses, medos, desejos)
- Comportamento online
- Dores e necessidades específicas
- Jornada do cliente
- Canais de comunicação preferidos

Retorne em formato JSON com todas essas informações estruturadas.`,

  3: (productType: string, avatar: any) => `Baseado no avatar "${avatar?.nome || 'definido anteriormente'}", crie uma oferta irresistível para um ${productType}. A oferta deve incluir:
- Produto principal
- Bônus agregados
- Garantias
- Urgência e escassez
- Preço estratégico
- Proposta de valor única
- Objeções antecipadas e respostas

Retorne em formato JSON estruturado com todos os elementos da oferta.`,

  4: (productType: string, oferta: any) => `Crie a estrutura completa de uma página de vendas otimizada para a oferta "${oferta?.produto_principal || 'definida anteriormente'}". Inclua:
- Headline principal e sub-headlines
- Estrutura de copywriting (AIDA, PAS, etc.)
- Seções da página (problema, solução, benefícios, social proof, etc.)
- CTAs estratégicos
- Design e layout sugeridos
- Elementos de conversão

Retorne em formato JSON com a estrutura completa da página.`,

  5: (productType: string, oferta: any) => `Estruture detalhadamente o ${productType} baseado na oferta "${oferta?.produto_principal || 'definida anteriormente'}". Inclua:
- Módulos/capítulos/componentes
- Conteúdo de cada seção
- Formato de entrega
- Cronograma de desenvolvimento
- Recursos necessários
- Especificações técnicas
- Estratégia de entrega

Retorne em formato JSON com a estrutura completa do produto.`,

  6: (productType: string, oferta: any) => `Crie copy persuasivo e headlines de alta conversão para "${oferta?.produto_principal || 'produto definido anteriormente'}". Inclua:
- 10 headlines principais variadas
- 5 sub-headlines complementares
- Copy para diferentes seções (abertura, benefícios, objeções, fechamento)
- CTAs variados
- Textos para anúncios
- E-mail sequences (pelo menos 5 e-mails)

Retorne em formato JSON organizado por tipo de copy.`,

  7: (productType: string, oferta: any) => `Desenvolva um roteiro completo de vídeo para apresentar "${oferta?.produto_principal || 'produto definido anteriormente'}". Inclua:
- Gancho inicial (primeiros 15 segundos)
- Estrutura narrativa completa
- Pontos de dor e agitação
- Apresentação da solução
- Social proof e depoimentos
- Oferta e call-to-action
- Duração sugerida e timing
- Orientações de produção

Retorne em formato JSON com roteiro detalhado por seções.`,

  8: (productType: string, oferta: any) => `Crie uma estratégia completa de tráfego para "${oferta?.produto_principal || 'produto definido anteriormente'}". Inclua:
- Canais de tráfego recomendados
- Orçamento sugerido por canal
- Segmentação detalhada
- Criativos e anúncios
- Funil de remarketing
- KPIs e métricas de acompanhamento
- Cronograma de lançamento
- Estratégias de escala

Retorne em formato JSON com estratégia completa de tráfego.`
};

export async function generateAIContent(params: AIGenerationParams): Promise<AIResponse> {
  const { step, aiProvider, productType, previousSteps } = params;
  
  // Get the appropriate prompt for the step
  const promptGenerator = stepPrompts[step as keyof typeof stepPrompts];
  if (!promptGenerator) {
    throw new Error(`No prompt defined for step ${step}`);
  }

  // Get previous step data for context
  const previousStepData = previousSteps?.[step - 1] || {};
  const prompt = promptGenerator(productType, previousStepData);

  try {
    let response: AIResponse;

    switch (aiProvider) {
      case 'openai':
        response = await generateWithOpenAI(prompt, step);
        break;
      case 'anthropic':
        response = await generateWithAnthropic(prompt, step);
        break;
      case 'google':
        response = await generateWithGoogle(prompt, step);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }

    return response;
  } catch (error) {
    console.error(`Error generating content with ${aiProvider}:`, error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

async function generateWithOpenAI(prompt: string, step: number): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em marketing digital e criação de funis de vendas. Sempre responda em português brasileiro com conteúdo prático e acionável.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    provider: 'openai',
    step,
    metadata: {
      model: 'gpt-4o',
      usage: data.usage
    }
  };
}

async function generateWithAnthropic(prompt: string, step: number): Promise<AIResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY_ENV_VAR || "default_key",
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: 'Você é um especialista em marketing digital e criação de funis de vendas. Sempre responda em português brasileiro com conteúdo prático e acionável em formato JSON.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.content[0].text,
    provider: 'anthropic',
    step,
    metadata: {
      model: 'claude-sonnet-4-20250514',
      usage: data.usage
    }
  };
}

async function generateWithGoogle(prompt: string, step: number): Promise<AIResponse> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_KEY || process.env.GOOGLE_AI_KEY_ENV_VAR || "default_key"}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${prompt}\n\nIMPORTANTE: Responda em português brasileiro e sempre em formato JSON válido.`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Google AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    content: data.candidates[0].content.parts[0].text,
    provider: 'google',
    step,
    metadata: {
      model: 'gemini-pro',
      usage: data.usageMetadata
    }
  };
}

export function selectBestAIProvider(step: number): 'openai' | 'anthropic' | 'google' {
  // AI Pensamento Poderoso™ - Intelligent provider selection based on step
  const providerStrategy = {
    1: 'google',    // Market analysis - Gemini excels at data analysis
    2: 'anthropic', // Avatar creation - Claude excels at detailed persona creation
    3: 'openai',    // Offer creation - GPT excels at creative and persuasive content
    4: 'openai',    // Sales page - GPT excels at conversion copywriting
    5: 'anthropic', // Product structure - Claude excels at detailed structuring
    6: 'openai',    // Copy & headlines - GPT excels at persuasive writing
    7: 'anthropic', // Video script - Claude excels at narrative structure
    8: 'google',    // Traffic campaign - Gemini excels at analytical strategies
  };

  return (providerStrategy[step as keyof typeof providerStrategy] || 'openai') as 'openai' | 'anthropic' | 'google';
}
