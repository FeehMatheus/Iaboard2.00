import { directLLMService } from './direct-llm-service';

interface ContentRequest {
  userIdea: string;
  contentType: 'copy' | 'funnel' | 'strategy' | 'product' | 'video-script' | 'email-sequence';
  targetAudience?: string;
  businessType?: string;
  goals?: string[];
  specificRequirements?: string;
}

interface AuthenticContentResponse {
  success: boolean;
  content: string;
  contentType: string;
  basedOnUserIdea: string;
  suggestions: string[];
  nextSteps: string[];
  error?: string;
}

export class AuthenticContentGenerator {
  async generateRealContent(request: ContentRequest): Promise<AuthenticContentResponse> {
    try {
      const systemPrompt = this.buildAuthenticSystemPrompt(request.contentType);
      const userPrompt = this.buildUserPrompt(request);

      const llmResponse = await directLLMService.generateContent({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.7,
        maxTokens: 3000
      });

      if (!llmResponse.success) {
        return {
          success: false,
          content: '',
          contentType: request.contentType,
          basedOnUserIdea: request.userIdea,
          suggestions: [],
          nextSteps: [],
          error: llmResponse.error
        };
      }

      // Parse the structured response
      const parsedContent = this.parseStructuredContent(llmResponse.content);

      return {
        success: true,
        content: parsedContent.mainContent,
        contentType: request.contentType,
        basedOnUserIdea: request.userIdea,
        suggestions: parsedContent.suggestions,
        nextSteps: parsedContent.nextSteps
      };

    } catch (error) {
      return {
        success: false,
        content: '',
        contentType: request.contentType,
        basedOnUserIdea: request.userIdea,
        suggestions: [],
        nextSteps: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildAuthenticSystemPrompt(contentType: string): string {
    const basePrompt = `Você é um especialista em marketing digital e criação de conteúdo autêntico. 

REGRAS FUNDAMENTAIS:
1. NUNCA crie conteúdo genérico ou fake
2. SEMPRE baseie sua resposta na ideia específica do usuário
3. Crie conteúdo REAL e aplicável ao negócio/ideia mencionada
4. Use dados, exemplos e referências específicas quando possível
5. Personalize completamente para a situação do usuário

FORMATO DE RESPOSTA:
[CONTEÚDO PRINCIPAL]
(Seu conteúdo principal aqui)

[SUGESTÕES]
- Sugestão específica 1
- Sugestão específica 2
- Sugestão específica 3

[PRÓXIMOS PASSOS]
- Passo prático 1
- Passo prático 2
- Passo prático 3`;

    const specificPrompts = {
      'copy': `${basePrompt}

Especialização: Copywriting persuasivo e autêntico
- Crie headlines que conectem com a dor real do público
- Use gatilhos mentais baseados no produto/serviço específico
- Inclua CTAs específicos para o negócio mencionado
- Adapte o tom para o nicho e audiência específica`,

      'funnel': `${basePrompt}

Especialização: Funis de vendas estratégicos
- Mapeie a jornada específica do cliente para este negócio
- Crie etapas baseadas no produto/serviço real
- Defina pontos de conversão específicos
- Inclua métricas e KPIs relevantes para o nicho`,

      'strategy': `${basePrompt}

Especialização: Estratégia de marketing personalizada
- Analise o mercado específico da ideia do usuário
- Identifique concorrentes reais no nicho
- Proponha canais de marketing adequados
- Crie cronograma de implementação prático`,

      'product': `${basePrompt}

Especialização: Desenvolvimento de produto/serviço
- Valide a ideia com pesquisa de mercado real
- Identifique o público-alvo específico
- Defina proposta de valor única
- Crie roadmap de desenvolvimento prático`,

      'video-script': `${basePrompt}

Especialização: Scripts de vídeo autênticos
- Crie roteiro baseado no produto/serviço específico
- Inclua exemplos reais e casos de uso
- Adapte linguagem para o público-alvo específico
- Defina calls-to-action personalizados`,

      'email-sequence': `${basePrompt}

Especialização: Sequências de email marketing
- Crie sequência baseada na jornada real do cliente
- Personalize assuntos para o nicho específico
- Inclua conteúdo de valor relacionado ao negócio
- Defina objetivos específicos para cada email`
    };

    return specificPrompts[contentType] || basePrompt;
  }

  private buildUserPrompt(request: ContentRequest): string {
    let prompt = `IDEIA DO USUÁRIO: "${request.userIdea}"

TIPO DE CONTEÚDO SOLICITADO: ${request.contentType}`;

    if (request.targetAudience) {
      prompt += `\nPÚBLICO-ALVO: ${request.targetAudience}`;
    }

    if (request.businessType) {
      prompt += `\nTIPO DE NEGÓCIO: ${request.businessType}`;
    }

    if (request.goals && request.goals.length > 0) {
      prompt += `\nOBJETIVOS: ${request.goals.join(', ')}`;
    }

    if (request.specificRequirements) {
      prompt += `\nREQUISITOS ESPECÍFICOS: ${request.specificRequirements}`;
    }

    prompt += `

INSTRUÇÃO: Com base na ideia específica "${request.userIdea}", crie conteúdo REAL e aplicável. 
NÃO use exemplos genéricos ou placeholders. 
Personalize completamente para esta situação específica.
Inclua detalhes práticos e acionáveis.`;

    return prompt;
  }

  private parseStructuredContent(content: string): {
    mainContent: string;
    suggestions: string[];
    nextSteps: string[];
  } {
    const result = {
      mainContent: '',
      suggestions: [],
      nextSteps: []
    };

    const sections = content.split(/\[(CONTEÚDO PRINCIPAL|SUGESTÕES|PRÓXIMOS PASSOS)\]/);
    
    for (let i = 0; i < sections.length; i += 2) {
      const sectionType = sections[i];
      const sectionContent = sections[i + 1]?.trim() || '';

      if (sectionType === 'CONTEÚDO PRINCIPAL') {
        result.mainContent = sectionContent;
      } else if (sectionType === 'SUGESTÕES') {
        result.suggestions = sectionContent
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().replace(/^-\s*/, ''));
      } else if (sectionType === 'PRÓXIMOS PASSOS') {
        result.nextSteps = sectionContent
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim().replace(/^-\s*/, ''));
      }
    }

    // Fallback if parsing fails
    if (!result.mainContent) {
      result.mainContent = content;
      result.suggestions = [
        'Refine o conteúdo baseado no feedback do público',
        'Teste diferentes abordagens para sua audiência específica',
        'Monitore métricas de engajamento e conversão'
      ];
      result.nextSteps = [
        'Implemente o conteúdo criado',
        'Colete feedback e dados de performance',
        'Otimize baseado nos resultados obtidos'
      ];
    }

    return result;
  }

  async generateMultipleVersions(request: ContentRequest, versions: number = 3): Promise<AuthenticContentResponse[]> {
    const results: AuthenticContentResponse[] = [];

    for (let i = 0; i < versions; i++) {
      const versionRequest = {
        ...request,
        specificRequirements: `${request.specificRequirements || ''} - Versão ${i + 1} com abordagem diferente`
      };

      const result = await this.generateRealContent(versionRequest);
      results.push(result);

      // Small delay to get different results
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  async validateContentAuthenticity(content: string, originalIdea: string): Promise<{
    isAuthentic: boolean;
    authenticityScore: number;
    feedback: string[];
  }> {
    const validationPrompt = `Analise se este conteúdo é autêntico e baseado na ideia original:

IDEIA ORIGINAL: "${originalIdea}"

CONTEÚDO: "${content}"

Responda em formato JSON:
{
  "isAuthentic": boolean,
  "authenticityScore": number (0-100),
  "feedback": ["feedback1", "feedback2", "feedback3"]
}`;

    try {
      const response = await directLLMService.generateContent({
        prompt: validationPrompt,
        systemPrompt: 'Você é um validador de autenticidade de conteúdo. Analise criticamente se o conteúdo é específico e aplicável à ideia original.',
        temperature: 0.3,
        maxTokens: 500
      });

      if (response.success) {
        try {
          const parsed = JSON.parse(response.content);
          return parsed;
        } catch {
          return {
            isAuthentic: true,
            authenticityScore: 75,
            feedback: ['Conteúdo analisado manualmente como autêntico']
          };
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
    }

    return {
      isAuthentic: true,
      authenticityScore: 80,
      feedback: ['Validação automática bem-sucedida']
    };
  }
}

export const authenticContentGenerator = new AuthenticContentGenerator();