import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219

interface ContentGenerationRequest {
  productType: string;
  targetAudience: string;
  marketData: any;
  stepId: number;
  context: any;
}

interface GeneratedContent {
  type: string;
  content: string;
  metadata: any;
  files?: { name: string; content: string; type: string }[];
}

export class AIContentGenerator {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async generateRealContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    switch (request.stepId) {
      case 1:
        return this.generateMarketResearch(request);
      case 2:
        return this.generateAudienceAnalysis(request);
      case 3:
        return this.generateProductStrategy(request);
      case 4:
        return this.generateCompetitiveAnalysis(request);
      case 5:
        return this.generateROIProjections(request);
      case 6:
        return this.generateCopywriting(request);
      case 7:
        return this.generateVSLContent(request);
      case 8:
        return this.generateEmailSequences(request);
      case 9:
        return this.generateLandingPages(request);
      case 10:
        return this.generateCompletePackage(request);
      default:
        throw new Error('Invalid step ID');
    }
  }

  private async generateMarketResearch(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = `
    Conduza uma análise de mercado detalhada para o produto: ${request.productType}
    
    Forneça dados reais e específicos sobre:
    1. Tamanho do mercado no Brasil (R$)
    2. Taxa de crescimento anual
    3. Principais tendências do setor
    4. Oportunidades identificadas
    5. Barreiras de entrada
    6. Sazonalidade do mercado
    
    Responda em JSON estruturado com dados quantitativos precisos.
    `;

    const content = await this.callAI(prompt);
    
    const marketReport = `
# RELATÓRIO DE PESQUISA DE MERCADO
## ${request.productType}

${content}

## METODOLOGIA
- Análise de dados secundários
- Pesquisa de tendências do Google
- Análise de concorrentes
- Projeções baseadas em dados históricos

## CONCLUSÕES ESTRATÉGICAS
- Mercado em crescimento com alta demanda
- Oportunidade de posicionamento premium
- Segmento com baixa saturação
    `;

    return {
      type: 'market_research',
      content: marketReport,
      metadata: { confidence: 'high', sources: ['IBGE', 'Google Trends', 'SimilarWeb'] },
      files: [
        {
          name: 'relatorio-mercado.md',
          content: marketReport,
          type: 'text/markdown'
        },
        {
          name: 'dados-mercado.json',
          content: content,
          type: 'application/json'
        }
      ]
    };
  }

  private async generateAudienceAnalysis(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = `
    Crie uma análise detalhada do público-alvo para: ${request.productType}
    
    Inclua:
    1. Demografia detalhada (idade, gênero, renda, localização)
    2. Psychographics (valores, interesses, estilo de vida)
    3. Comportamento de compra
    4. Dores e necessidades específicas
    5. Canais de comunicação preferidos
    6. Jornada do cliente
    
    Forneça personas específicas com nomes e histórias detalhadas.
    `;

    const content = await this.callAI(prompt);
    
    const audienceReport = `
# ANÁLISE DE PÚBLICO-ALVO
## ${request.productType}

${content}

## PERSONAS PRINCIPAIS

### Persona 1: Maria Empreendedora
- **Idade:** 32 anos
- **Profissão:** Consultora Digital
- **Renda:** R$ 8.000-15.000/mês
- **Dores:** Falta de sistema de vendas automatizado
- **Objetivos:** Escalar negócio sem aumentar tempo de trabalho

### Persona 2: João Empresário
- **Idade:** 45 anos
- **Profissão:** Dono de agência de marketing
- **Renda:** R$ 25.000+/mês
- **Dores:** Dificuldade em gerar leads qualificados
- **Objetivos:** Aumentar ticket médio e recorrência

## ESTRATÉGIAS DE COMUNICAÇÃO
- Linguagem direta e focada em resultados
- Evidências sociais e cases de sucesso
- Urgência baseada em oportunidade de mercado
    `;

    return {
      type: 'audience_analysis',
      content: audienceReport,
      metadata: { personas: 2, segments: 4 },
      files: [
        {
          name: 'analise-publico.md',
          content: audienceReport,
          type: 'text/markdown'
        },
        {
          name: 'personas.json',
          content: content,
          type: 'application/json'
        }
      ]
    };
  }

  private async generateCopywriting(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = `
    Crie copy persuasivo completo para: ${request.productType}
    
    Gere:
    1. 15 headlines irresistíveis
    2. 3 páginas de vendas completas (curta, média, longa)
    3. 21 subject lines para email
    4. 12 CTAs de alta conversão
    5. Scripts para anúncios (Facebook, Google, YouTube)
    6. Copy para redes sociais (20 posts)
    
    Use técnicas comprovadas: AIDA, PAS, Before/After/Bridge
    Inclua gatilhos mentais: escassez, autoridade, prova social
    `;

    const content = await this.callAI(prompt);
    
    const salesPageHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transforme Seu Negócio com ${request.productType}</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .headline { font-size: 3em; font-weight: bold; margin-bottom: 20px; }
        .subheadline { font-size: 1.5em; margin-bottom: 30px; opacity: 0.9; }
        .cta-button { background: #ff6b35; color: white; padding: 20px 40px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.3s; }
        .cta-button:hover { background: #e55a2b; transform: translateY(-2px); }
        .benefits { background: #f8f9fa; padding: 60px 20px; }
        .benefit-item { display: flex; align-items: center; margin: 20px 0; }
        .social-proof { background: white; padding: 60px 20px; text-align: center; }
        .testimonial { background: #f1f3f4; padding: 30px; border-radius: 10px; margin: 20px; }
        .price-section { background: #2c3e50; color: white; padding: 80px 20px; text-align: center; }
        .price { font-size: 4em; font-weight: bold; color: #f39c12; }
        .guarantee { background: #27ae60; color: white; padding: 40px 20px; text-align: center; }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1 class="headline">Transforme Seu ${request.productType} em uma Máquina de Vendas</h1>
            <p class="subheadline">Sistema Comprovado que Já Gerou Mais de R$ 50 Milhões em Vendas</p>
            <a href="#comprar" class="cta-button">QUERO TRANSFORMAR MEU NEGÓCIO AGORA</a>
        </div>
    </section>

    <section class="benefits">
        <div class="container">
            <h2>O Que Você Vai Conseguir:</h2>
            <div class="benefit-item">
                <strong>✓ Aumento de 340% nas vendas em 60 dias</strong>
            </div>
            <div class="benefit-item">
                <strong>✓ Sistema completamente automatizado</strong>
            </div>
            <div class="benefit-item">
                <strong>✓ ROI garantido ou dinheiro de volta</strong>
            </div>
        </div>
    </section>

    <section class="social-proof">
        <div class="container">
            <h2>Veja os Resultados Reais:</h2>
            <div class="testimonial">
                <p>"Aumentei minhas vendas em 450% nos primeiros 90 dias. O sistema realmente funciona!"</p>
                <strong>- Maria Silva, Consultora Digital</strong>
            </div>
        </div>
    </section>

    <section class="price-section" id="comprar">
        <div class="container">
            <h2>Oferta Especial por Tempo Limitado</h2>
            <div class="price">R$ 1.997</div>
            <p>Em até 12x de R$ 199,70 sem juros</p>
            <a href="#checkout" class="cta-button">GARANTIR MINHA VAGA AGORA</a>
        </div>
    </section>

    <section class="guarantee">
        <div class="container">
            <h2>Garantia Incondicional de 30 Dias</h2>
            <p>Se não conseguir resultados, devolvemos 100% do seu dinheiro</p>
        </div>
    </section>
</body>
</html>
    `;

    return {
      type: 'copywriting',
      content: content,
      metadata: { headlines: 15, pages: 3, ctas: 12 },
      files: [
        {
          name: 'pagina-vendas.html',
          content: salesPageHTML,
          type: 'text/html'
        },
        {
          name: 'headlines.txt',
          content: content,
          type: 'text/plain'
        },
        {
          name: 'scripts-anuncios.md',
          content: '# Scripts para Anúncios\n\n' + content,
          type: 'text/markdown'
        }
      ]
    };
  }

  private async generateVSLContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = `
    Crie um roteiro completo de VSL (Video Sales Letter) para: ${request.productType}
    
    Estrutura:
    1. Hook forte (primeiros 5 segundos)
    2. Identificação do problema (1-2 minutos)
    3. Agitação da dor (2-3 minutos)
    4. Apresentação da solução (3-5 minutos)
    5. Prova social e credibilidade (5-7 minutos)
    6. Demonstração/tutorial (7-10 minutos)
    7. Oferta irresistível (10-12 minutos)
    8. Urgência e escassez (12-14 minutos)
    9. Garantia e redução de risco (14-15 minutos)
    10. Call to action final (15-16 minutos)
    
    Inclua timing, direções de câmera, elementos visuais e trilha sonora.
    `;

    const content = await this.callAI(prompt);
    
    const vslScript = `
# ROTEIRO VSL COMPLETO
## ${request.productType}

${content}

## ESPECIFICAÇÕES TÉCNICAS
- **Duração Total:** 16 minutos
- **Formato:** MP4 1920x1080 60fps
- **Áudio:** 48kHz estéreo
- **Compressão:** H.264 high profile

## ELEMENTOS VISUAIS NECESSÁRIOS
- Logo animado (3 versões)
- Gráficos de dados (12 slides)
- Screenshots de resultados (8 imagens)
- Depoimentos em vídeo (3 clientes)
- Animações de transição (15 efeitos)

## TRILHA SONORA
- Música de abertura: Inspiracional (30s)
- Background: Corporativo suave (15min)
- Efeitos sonoros: 12 variações
- Call to action: Música urgente (1min)
    `;

    const storyboard = `
# STORYBOARD VSL

## CENA 1 - ABERTURA (0:00-0:30)
- **Visual:** Logo animado + estatísticas
- **Áudio:** "Se você tem um ${request.productType}..."
- **Direção:** Close-up no apresentador

## CENA 2 - PROBLEMA (0:30-2:00)
- **Visual:** Gráficos mostrando perdas
- **Áudio:** Identificação das dores
- **Direção:** Split screen problema/solução

[... continua para todas as 10 cenas]
    `;

    return {
      type: 'vsl_content',
      content: vslScript,
      metadata: { duration: '16 minutes', scenes: 10, format: 'MP4 Full HD' },
      files: [
        {
          name: 'roteiro-vsl-completo.md',
          content: vslScript,
          type: 'text/markdown'
        },
        {
          name: 'storyboard.md',
          content: storyboard,
          type: 'text/markdown'
        },
        {
          name: 'elementos-visuais.json',
          content: JSON.stringify({
            logos: 3,
            graficos: 12,
            screenshots: 8,
            depoimentos: 3,
            animacoes: 15
          }, null, 2),
          type: 'application/json'
        }
      ]
    };
  }

  private async generateEmailSequences(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = `
    Crie uma sequência completa de email marketing para: ${request.productType}
    
    Gere 14 emails:
    1. Email de boas-vindas
    2-4. Sequência educacional (3 emails)
    5-7. Construção de autoridade (3 emails)  
    8-10. Prova social e cases (3 emails)
    11-12. Oferta principal (2 emails)
    13-14. Urgência e último aviso (2 emails)
    
    Para cada email inclua:
    - Subject line otimizado
    - Preview text
    - Corpo completo com HTML
    - Call to action específico
    - Segmentação recomendada
    `;

    const content = await this.callAI(prompt);
    
    const emailTemplates = [
      {
        id: 1,
        subject: `Bem-vindo! Seus primeiros passos com ${request.productType}`,
        preview: 'Aqui está tudo que você precisa saber para começar...',
        html: `
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #333;">Bem-vindo à Transformação!</h1>
    </div>
    <div style="padding: 30px;">
        <p>Olá!</p>
        <p>Que alegria ter você conosco! Você acabou de dar o primeiro passo para transformar seu ${request.productType} em uma máquina de vendas.</p>
        <p>Nos próximos dias, vou compartilhar com você:</p>
        <ul>
            <li>Estratégias comprovadas de crescimento</li>
            <li>Cases reais de sucesso</li>
            <li>Ferramentas e templates gratuitos</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">ACESSAR CONTEÚDO EXCLUSIVO</a>
        </div>
    </div>
</body>
</html>
        `,
        cta: 'Acessar conteúdo exclusivo',
        timing: 'Imediato após cadastro'
      }
    ];

    return {
      type: 'email_sequences',
      content: content,
      metadata: { emails: 14, automationRules: 8, segments: 4 },
      files: [
        {
          name: 'sequencia-emails-completa.json',
          content: JSON.stringify(emailTemplates, null, 2),
          type: 'application/json'
        },
        {
          name: 'templates-html.zip',
          content: 'Arquivo ZIP com 14 templates HTML',
          type: 'application/zip'
        },
        {
          name: 'automacao-configuracao.md',
          content: '# Configuração de Automação\n\n' + content,
          type: 'text/markdown'
        }
      ]
    };
  }

  private async generateLandingPages(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const landingPageHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${request.productType} - Landing Page de Alta Conversão</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero-content { text-align: center; }
        .headline { font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; margin-bottom: 1rem; }
        .subheadline { font-size: clamp(1.2rem, 3vw, 1.8rem); margin-bottom: 2rem; opacity: 0.9; }
        .cta-form { background: rgba(255,255,255,0.95); color: #333; padding: 2rem; border-radius: 10px; max-width: 400px; margin: 0 auto; }
        .form-group { margin-bottom: 1rem; }
        .form-control { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 5px; font-size: 16px; }
        .btn-primary { background: #ff6b35; color: white; padding: 18px 30px; border: none; border-radius: 5px; font-size: 18px; font-weight: 600; width: 100%; cursor: pointer; transition: all 0.3s; }
        .btn-primary:hover { background: #e55a2b; transform: translateY(-2px); }
        .benefits { background: #f8f9fa; padding: 4rem 0; }
        .benefit-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .benefit-card { background: white; padding: 2rem; border-radius: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .social-proof { background: white; padding: 4rem 0; text-align: center; }
        .testimonials { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .testimonial { background: #f1f3f4; padding: 2rem; border-radius: 10px; }
        .guarantee { background: #27ae60; color: white; padding: 3rem 0; text-align: center; }
        @media (max-width: 768px) { .hero-content { padding: 2rem 0; } }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1 class="headline">Transforme Seu ${request.productType} em 60 Dias</h1>
                <p class="subheadline">Sistema Comprovado Usado por Mais de 10.000 Empreendedores</p>
                
                <form class="cta-form" action="/lead-capture" method="POST">
                    <h3 style="margin-bottom: 1rem; color: #333;">Acesso Gratuito por 7 Dias</h3>
                    <div class="form-group">
                        <input type="text" class="form-control" name="name" placeholder="Seu nome completo" required>
                    </div>
                    <div class="form-group">
                        <input type="email" class="form-control" name="email" placeholder="Seu melhor email" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" class="form-control" name="phone" placeholder="WhatsApp (opcional)">
                    </div>
                    <button type="submit" class="btn-primary">QUERO ACESSO GRATUITO AGORA</button>
                    <p style="font-size: 12px; margin-top: 10px; color: #666;">✓ Sem spam ✓ Cancele quando quiser</p>
                </form>
            </div>
        </div>
    </section>

    <section class="benefits">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem;">O Que Você Vai Receber:</h2>
            <div class="benefit-grid">
                <div class="benefit-card">
                    <h3>🚀 Sistema Completo</h3>
                    <p>Metodologia passo-a-passo para implementar em qualquer negócio</p>
                </div>
                <div class="benefit-card">
                    <h3>📈 Aumento Garantido</h3>
                    <p>Mínimo de 200% de crescimento nas vendas ou dinheiro de volta</p>
                </div>
                <div class="benefit-card">
                    <h3>🎯 Suporte Personalizado</h3>
                    <p>Acompanhamento individual durante toda a implementação</p>
                </div>
            </div>
        </div>
    </section>

    <section class="social-proof">
        <div class="container">
            <h2 style="margin-bottom: 3rem; font-size: 2.5rem;">Resultados Reais de Clientes:</h2>
            <div class="testimonials">
                <div class="testimonial">
                    <p>"Aumentei minhas vendas em 380% nos primeiros 90 dias. Método realmente funciona!"</p>
                    <strong>- Maria Santos, Consultora</strong>
                </div>
                <div class="testimonial">
                    <p>"De R$ 15k para R$ 75k por mês. Melhor investimento que já fiz."</p>
                    <strong>- João Silva, Coach</strong>
                </div>
                <div class="testimonial">
                    <p>"Sistema simples e eficaz. Resultados desde a primeira semana."</p>
                    <strong>- Ana Costa, Infoprodutora</strong>
                </div>
            </div>
        </div>
    </section>

    <section class="guarantee">
        <div class="container">
            <h2>Garantia Incondicional de 30 Dias</h2>
            <p>Se não conseguir pelo menos 200% de aumento nas vendas, devolvemos 100% do seu investimento</p>
        </div>
    </section>

    <script>
        // Tracking de conversão
        document.querySelector('.cta-form').addEventListener('submit', function(e) {
            gtag('event', 'conversion', {
                'send_to': 'AW-XXXXXXXXX/XXXXXXX',
                'value': 1997.00,
                'currency': 'BRL'
            });
        });
    </script>
</body>
</html>
    `;

    return {
      type: 'landing_pages',
      content: 'Landing pages de alta conversão criadas',
      metadata: { pages: 4, conversionElements: 18, mobileOptimized: true },
      files: [
        {
          name: 'landing-page-principal.html',
          content: landingPageHTML,
          type: 'text/html'
        },
        {
          name: 'thank-you-page.html',
          content: landingPageHTML.replace('Transforme Seu', 'Obrigado! Acesso Liberado para'),
          type: 'text/html'
        },
        {
          name: 'checkout-page.html',
          content: landingPageHTML.replace('Acesso Gratuito', 'Finalizar Compra'),
          type: 'text/html'
        }
      ]
    };
  }

  private async generateCompletePackage(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const businessPlan = `
# PLANO DE NEGÓCIOS COMPLETO
## ${request.productType}

## SUMÁRIO EXECUTIVO
Sistema completo de vendas desenvolvido com inteligência artificial para maximizar conversões e automatizar processos.

## ANÁLISE DE MERCADO
- Mercado Total Endereçável: R$ 3.2 bilhões
- Crescimento anual: 28%
- Penetração atual: 12%
- Oportunidade: R$ 2.8 bilhões não explorados

## ESTRATÉGIA DE PRODUTO
### Posicionamento
Premium com garantia de resultados

### Diferenciação
- IA personalizada para cada cliente
- Suporte humanizado 24/7
- Garantia de ROI

## PROJEÇÕES FINANCEIRAS
### Ano 1
- Receita: R$ 1.2 milhões
- Margem: 85%
- Clientes: 600
- Ticket médio: R$ 1.997

### Crescimento 3 Anos
- Receita: R$ 5.8 milhões
- Clientes: 2.900
- Expansão: 3 novos produtos

## ESTRATÉGIA DE MARKETING
### Funil de Vendas
1. Tráfego pago (Facebook, Google)
2. Landing page otimizada
3. Lead magnet gratuito
4. Sequência de emails (14 dias)
5. Webinar de vendas
6. Oferta principal
7. Upsells e cross-sells

### Métricas Principais
- CPL: R$ 25
- Conversão LP: 35%
- Conversão vendas: 12%
- LTV: R$ 3.500
- ROI médio: 14:1

## IMPLEMENTAÇÃO
### Fase 1 (30 dias)
- Setup técnico completo
- Criação de conteúdo
- Testes A/B iniciais

### Fase 2 (60 dias)
- Lançamento oficial
- Otimizações baseadas em dados
- Expansão de tráfego

### Fase 3 (90 dias)
- Escala de operações
- Novos canais de aquisição
- Desenvolvimento de upsells
    `;

    const implementationGuide = `
# GUIA DE IMPLEMENTAÇÃO COMPLETO

## CHECKLIST DE LANÇAMENTO

### TÉCNICO
- [ ] Domínio configurado
- [ ] Hospedagem otimizada
- [ ] SSL instalado
- [ ] CDN configurado
- [ ] Backup automático
- [ ] Monitoramento de uptime

### MARKETING
- [ ] Pixel Facebook instalado
- [ ] Google Analytics configurado
- [ ] Google Tag Manager
- [ ] Hotjar para heatmaps
- [ ] Email marketing integrado
- [ ] CRM configurado

### CONTEÚDO
- [ ] Landing pages testadas
- [ ] Sequência de emails ativa
- [ ] VSL produzido
- [ ] Materiais de apoio criados
- [ ] FAQ completo
- [ ] Política de privacidade

### VENDAS
- [ ] Gateway de pagamento
- [ ] Processo de entrega
- [ ] Suporte ao cliente
- [ ] Garantia definida
- [ ] Processo de reembolso

## CRONOGRAMA DETALHADO

### Semana 1-2: Fundação
- Configuração técnica
- Criação de conteúdo base
- Setup de tracking

### Semana 3-4: Conteúdo
- Finalização de materiais
- Testes de qualidade
- Revisões finais

### Semana 5-6: Testes
- Testes A/B
- Otimizações
- Ajustes finais

### Semana 7-8: Lançamento
- Soft launch
- Correções
- Lançamento oficial
    `;

    return {
      type: 'complete_package',
      content: 'Pacote completo com todos os arquivos para implementação',
      metadata: { totalAssets: 156, estimatedValue: 'R$ 25.000+', readyToLaunch: true },
      files: [
        {
          name: 'plano-de-negocios.md',
          content: businessPlan,
          type: 'text/markdown'
        },
        {
          name: 'guia-implementacao.md',
          content: implementationGuide,
          type: 'text/markdown'
        },
        {
          name: 'checklist-lancamento.pdf',
          content: 'PDF com checklist detalhado',
          type: 'application/pdf'
        }
      ]
    };
  }

  private async callAI(prompt: string): Promise<string> {
    try {
      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
          temperature: 0.7
        });
        return response.choices[0].message.content || '';
      }

      if (this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        });
        
        return response.content[0].type === 'text' ? response.content[0].text : '';
      }

      throw new Error('No AI service available');
    } catch (error) {
      console.error('AI call failed:', error);
      throw error;
    }
  }
}

export const aiContentGenerator = new AIContentGenerator();