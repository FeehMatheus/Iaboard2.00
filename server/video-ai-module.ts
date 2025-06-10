import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface VideoGenerationRequest {
  produto: string;
  avatar: string;
  oferta: string;
  nicho: string;
  objetivo: 'engajamento' | 'autoridade' | 'venda_direta';
  formato: 'reels' | 'shorts' | 'anuncio_youtube' | 'meta_ads';
  duracao: '15s' | '30s' | '60s' | '90s';
}

interface VideoContent {
  titulo: string;
  gancho: string;
  roteiro: {
    cena: number;
    tempo: string;
    naracao: string;
    visual: string;
    legenda: string;
  }[];
  cta: string;
  encerramento: string;
  trilhaSonora: string;
  estiloVisual: string;
  adaptacoes: {
    plataforma: string;
    ajustes: string;
  }[];
}

export class VideoAIModule {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateVideoContent(request: VideoGenerationRequest): Promise<VideoContent> {
    const prompt = `
🎬 IMMERSIVE VIDEO AI™ - Geração de Roteiro Publicitário

DADOS DO PROJETO:
- Produto: ${request.produto}
- Avatar: ${request.avatar}
- Oferta: ${request.oferta}
- Nicho: ${request.nicho}
- Objetivo: ${request.objetivo}
- Formato: ${request.formato}
- Duração: ${request.duracao}

MISSÃO: Crie um roteiro de vídeo publicitário de alta conversão seguindo a estrutura PASTOR (Problem, Amplify, Story, Transformation, Offer, Response).

ESTRUTURA OBRIGATÓRIA:
1. TÍTULO MAGNÉTICO (máximo 8 palavras, com números ou estatísticas)
2. GANCHO PODEROSO (primeiros 3 segundos que prendem atenção)
3. ROTEIRO DETALHADO com:
   - Tempo exato de cada cena
   - Narração palavra por palavra
   - Descrição visual específica
   - Legendas animadas sugeridas
4. CTA IRRESISTÍVEL
5. ENCERRAMENTO PERSUASIVO

REQUISITOS ESPECÍFICOS:
- Use gatilhos mentais: escassez, prova social, autoridade
- Linguagem emocional e persuasiva
- Adaptado para ${request.formato}
- Foque em ${request.objetivo}
- Inclua dados e estatísticas reais do nicho
- Sugira trilha sonora adequada
- Defina estilo visual (cores, tipografia, animações)

ADAPTAÇÕES POR PLATAFORMA:
- Instagram/TikTok: Visual dinâmico, texto grande, cores vibrantes
- YouTube: Storytelling mais elaborado, autoridade técnica
- Meta Ads: Foco na oferta, benefícios claros, CTA direto

RESULTADO: Retorne em formato JSON estruturado com todos os elementos solicitados.
`;

    try {
      // Use OpenAI for video content generation
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em criação de vídeos publicitários com mais de 10 anos de experiência. Seus vídeos já geraram mais de R$ 100 milhões em vendas. Responda sempre em JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 3000
      });

      const videoContent = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        titulo: videoContent.titulo || `${request.produto} - Transformação Garantida`,
        gancho: videoContent.gancho || `Atenção ${request.avatar}! Descobri o segredo que está transformando vidas...`,
        roteiro: videoContent.roteiro || this.generateFallbackRoteiro(request),
        cta: videoContent.cta || 'CLIQUE AGORA E TRANSFORME SUA VIDA!',
        encerramento: videoContent.encerramento || 'Não perca essa oportunidade única. Sua transformação começa hoje!',
        trilhaSonora: videoContent.trilhaSonora || 'Música motivacional e energética',
        estiloVisual: videoContent.estiloVisual || 'Moderno, dinâmico, cores vibrantes',
        adaptacoes: videoContent.adaptacoes || this.generatePlatformAdaptations(request)
      };

    } catch (error) {
      console.error('Erro na geração de vídeo:', error);
      return this.generateFallbackVideoContent(request);
    }
  }

  async generateVideoVariations(baseContent: VideoContent, count: number = 3): Promise<VideoContent[]> {
    const variations: VideoContent[] = [];
    
    for (let i = 0; i < count; i++) {
      const prompt = `
Crie uma variação do seguinte vídeo para teste A/B:

VÍDEO ORIGINAL:
Título: ${baseContent.titulo}
Gancho: ${baseContent.gancho}
CTA: ${baseContent.cta}

INSTRUÇÕES:
- Mantenha a mesma estrutura e duração
- Altere o gancho para uma abordagem diferente (problema vs. benefício vs. prova social)
- Varie o CTA mantendo a urgência
- Ajuste o tom (mais emocional, mais racional, mais urgente)
- Retorne em JSON válido

VARIAÇÃO ${i + 1}:
`;

      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Crie variações de vídeos publicitários para testes A/B otimizados para conversão.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.9,
          max_tokens: 2000
        });

        const variation = JSON.parse(response.choices[0].message.content || '{}');
        variations.push({
          ...baseContent,
          titulo: variation.titulo || baseContent.titulo,
          gancho: variation.gancho || baseContent.gancho,
          cta: variation.cta || baseContent.cta
        });

      } catch (error) {
        console.error(`Erro na variação ${i + 1}:`, error);
        variations.push(baseContent);
      }
    }

    return variations;
  }

  async analyzeCompetitorVideos(nicho: string, produto: string): Promise<any> {
    const prompt = `
🕵️ IA ESPIÃ DE VÍDEOS - Análise de Concorrência

NICHO: ${nicho}
PRODUTO: ${produto}

Analise os padrões de vídeos de alta conversão neste nicho e forneça:

1. ESTRUTURAS MAIS EFICAZES:
   - Duração ideal dos vídeos
   - Padrões de abertura que funcionam
   - Tipos de gancho mais utilizados

2. ELEMENTOS VISUAIS DOMINANTES:
   - Cores predominantes
   - Tipografia preferida
   - Estilo de animação

3. GATILHOS MENTAIS RECORRENTES:
   - Palavras-chave de conversão
   - Provas sociais utilizadas
   - Ofertas padrão

4. OPORTUNIDADES IDENTIFICADAS:
   - Lacunas no mercado
   - Abordagens não exploradas
   - Melhorias possíveis

5. RECOMENDAÇÕES ESTRATÉGICAS:
   - Diferenciação sugerida
   - Posicionamento único
   - Vantagem competitiva

Retorne dados específicos e acionáveis em JSON.
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514', // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      });

      const analysisText = response.content[0].type === 'text' ? response.content[0].text : '';
      
      try {
        return JSON.parse(analysisText);
      } catch {
        return {
          estruturas: ['Hook + Problema + Solução + CTA'],
          elementosVisuais: { cores: ['azul', 'vermelho'], tipografia: 'bold', animacao: 'dinamica' },
          gatilhosMentais: ['urgência', 'escassez', 'prova social'],
          oportunidades: ['Abordagem mais personalizada'],
          recomendacoes: ['Foque na diferenciação visual']
        };
      }

    } catch (error) {
      console.error('Erro na análise de concorrentes:', error);
      return {
        erro: 'Análise temporariamente indisponível',
        fallback: 'Use estruturas tradicionais de vídeo'
      };
    }
  }

  private generateFallbackRoteiro(request: VideoGenerationRequest) {
    return [
      {
        cena: 1,
        tempo: '0-3s',
        naracao: `Atenção ${request.avatar}! Você está perdendo dinheiro todos os dias...`,
        visual: 'Close no rosto expressivo, fundo desfocado',
        legenda: 'PARE TUDO!'
      },
      {
        cena: 2,
        tempo: '3-8s',
        naracao: `Enquanto você continua fazendo do jeito antigo, outros estão lucrando com ${request.produto}`,
        visual: 'Gráfico de crescimento animado',
        legenda: 'Outros já estão lucrando'
      },
      {
        cena: 3,
        tempo: '8-15s',
        naracao: `Descobri o método que pode transformar sua vida em apenas 30 dias`,
        visual: 'Transição dinâmica para o produto',
        legenda: 'MÉTODO REVOLUCIONÁRIO'
      }
    ];
  }

  private generatePlatformAdaptations(request: VideoGenerationRequest) {
    return [
      {
        plataforma: 'Instagram Reels',
        ajustes: 'Formato vertical 9:16, texto grande, cores vibrantes, música trending'
      },
      {
        plataforma: 'YouTube Shorts',
        ajustes: 'Thumbnail atrativo, início impactante, call-to-action verbal'
      },
      {
        plataforma: 'Meta Ads',
        ajustes: 'Legenda automática, foco na oferta, botão CTA visível'
      }
    ];
  }

  private generateFallbackVideoContent(request: VideoGenerationRequest): VideoContent {
    return {
      titulo: `${request.produto} - Transformação Garantida`,
      gancho: `Atenção ${request.avatar}! Descobri o segredo...`,
      roteiro: this.generateFallbackRoteiro(request),
      cta: 'CLIQUE AGORA E TRANSFORME SUA VIDA!',
      encerramento: 'Não perca essa oportunidade única!',
      trilhaSonora: 'Música motivacional',
      estiloVisual: 'Moderno e dinâmico',
      adaptacoes: this.generatePlatformAdaptations(request)
    };
  }
}

export const videoAIModule = new VideoAIModule();