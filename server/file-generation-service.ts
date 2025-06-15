import OpenAI from 'openai';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

interface GeneratedFile {
  id: string;
  name: string;
  type: string;
  content: string;
  purpose: string;
  size: number;
  createdAt: Date;
}

interface FileGenerationRequest {
  moduleType: string;
  prompt: string;
  aiResponse: string;
  format: 'html' | 'css' | 'js' | 'json' | 'txt' | 'md' | 'pdf';
  purpose: string;
}

export class FileGenerationService {
  private openai?: OpenAI;
  private filesDirectory: string;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    this.filesDirectory = path.join(process.cwd(), 'generated-files');
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(this.filesDirectory)) {
      fs.mkdirSync(this.filesDirectory, { recursive: true });
    }
  }

  async generateFiles(request: FileGenerationRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    switch (request.moduleType) {
      case 'ia-copy':
        files.push(...await this.generateCopyFiles(request));
        break;
      case 'ia-produto':
        files.push(...await this.generateProductFiles(request));
        break;
      case 'ia-trafego':
        files.push(...await this.generateTrafficFiles(request));
        break;
      case 'ia-video':
        files.push(...await this.generateVideoFiles(request));
        break;
      case 'ia-analytics':
        files.push(...await this.generateAnalyticsFiles(request));
        break;
      default:
        files.push(await this.generateGenericFile(request));
    }

    return files;
  }

  private async generateCopyFiles(request: FileGenerationRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate landing page
    const landingPagePrompt = `
Baseado nesta resposta de IA sobre copywriting: "${request.aiResponse}"

Crie uma landing page HTML completa e profissional com:
1. Header com logo e navegação
2. Hero section persuasivo
3. Seção de benefícios
4. Depoimentos/prova social
5. CTA principal
6. Footer

Use HTML5 semântico e classes CSS para estilização. Inclua meta tags SEO.
`;

    const landingPageContent = await this.callOpenAI(landingPagePrompt);
    files.push(this.createFile('landing-page.html', 'html', landingPageContent, 'Página de captura principal'));

    // Generate CSS
    const cssPrompt = `
Crie um arquivo CSS moderno e responsivo para a landing page gerada. Inclua:
1. Reset CSS básico
2. Tipografia profissional
3. Layout responsivo
4. Animações sutis
5. Botões chamativos
6. Gradientes modernos

Use variáveis CSS e design mobile-first.
`;

    const cssContent = await this.callOpenAI(cssPrompt);
    files.push(this.createFile('styles.css', 'css', cssContent, 'Estilos da landing page'));

    // Generate email sequence
    const emailPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie uma sequência de 5 emails de nurturing em formato JSON:
{
  "emailSequence": [
    {
      "day": 1,
      "subject": "Assunto do email",
      "content": "Conteúdo completo do email",
      "cta": "Call to action"
    }
  ]
}
`;

    const emailContent = await this.callOpenAI(emailPrompt);
    files.push(this.createFile('email-sequence.json', 'json', emailContent, 'Sequência de emails'));

    return files;
  }

  private async generateProductFiles(request: FileGenerationRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate product strategy document
    const strategyPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie um documento completo de estratégia de produto em formato Markdown incluindo:
1. Visão geral do produto
2. Análise de mercado
3. Proposta de valor
4. Roadmap de desenvolvimento
5. Estratégia de preços
6. Plano de lançamento
7. Métricas de sucesso
`;

    const strategyContent = await this.callOpenAI(strategyPrompt);
    files.push(this.createFile('product-strategy.md', 'md', strategyContent, 'Estratégia completa do produto'));

    // Generate sales page
    const salesPagePrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie uma página de vendas HTML completa com:
1. Headline poderoso
2. Subheadline explicativo
3. Vídeo de vendas embed
4. Benefícios em bullet points
5. Prova social (depoimentos)
6. Oferta com preço
7. Garantia
8. FAQ
9. Múltiplos CTAs

Use estrutura de vendas comprovada (AIDA, PAS, etc).
`;

    const salesPageContent = await this.callOpenAI(salesPagePrompt);
    files.push(this.createFile('sales-page.html', 'html', salesPageContent, 'Página de vendas'));

    // Generate business plan
    const businessPlanPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie um plano de negócios em JSON estruturado:
{
  "executiveSummary": "Resumo executivo",
  "marketAnalysis": "Análise de mercado",
  "competitorAnalysis": "Análise da concorrência",
  "marketingStrategy": "Estratégia de marketing",
  "financialProjections": "Projeções financeiras",
  "implementation": "Plano de implementação"
}
`;

    const businessPlanContent = await this.callOpenAI(businessPlanPrompt);
    files.push(this.createFile('business-plan.json', 'json', businessPlanContent, 'Plano de negócios'));

    return files;
  }

  private async generateTrafficFiles(request: FileGenerationRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate traffic strategy
    const trafficPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie um plano completo de tráfego em JSON:
{
  "paidTraffic": {
    "googleAds": "Estratégia Google Ads",
    "facebookAds": "Estratégia Facebook Ads",
    "linkedinAds": "Estratégia LinkedIn Ads"
  },
  "organicTraffic": {
    "seo": "Estratégia SEO",
    "contentMarketing": "Marketing de conteúdo",
    "socialMedia": "Redes sociais"
  },
  "budget": "Distribuição de orçamento",
  "kpis": "Métricas principais",
  "timeline": "Cronograma de execução"
}
`;

    const trafficContent = await this.callOpenAI(trafficPrompt);
    files.push(this.createFile('traffic-strategy.json', 'json', trafficContent, 'Estratégia de tráfego'));

    // Generate ad copies
    const adCopiesPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie múltiplas versões de anúncios para diferentes plataformas:

GOOGLE ADS:
- 10 headlines diferentes
- 5 descrições diferentes

FACEBOOK ADS:
- 5 textos primários
- 5 headlines
- 5 descrições

LINKEDIN ADS:
- 5 versões de copy profissional

Formato: texto simples, uma versão por linha.
`;

    const adCopiesContent = await this.callOpenAI(adCopiesPrompt);
    files.push(this.createFile('ad-copies.txt', 'txt', adCopiesContent, 'Copies para anúncios'));

    return files;
  }

  private async generateVideoFiles(request: FileGenerationRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate video script
    const scriptPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie um roteiro completo de vídeo de vendas (VSL) incluindo:
1. Hook (primeiros 5 segundos)
2. Apresentação do problema
3. Agitação da dor
4. Apresentação da solução
5. Demonstração/prova
6. Oferta
7. Urgência/escassez
8. Call to action

Inclua indicações de corte, tempo estimado e elementos visuais.
`;

    const scriptContent = await this.callOpenAI(scriptPrompt);
    files.push(this.createFile('video-script.txt', 'txt', scriptContent, 'Roteiro de vídeo de vendas'));

    // Generate video production guide
    const productionPrompt = `
Baseado no roteiro e resposta: "${request.aiResponse}"

Crie um guia de produção de vídeo em Markdown incluindo:
1. Equipamentos necessários
2. Setup de iluminação
3. Setup de áudio
4. Estrutura de cenas
5. Edição e pós-produção
6. Thumbnails sugeridos
7. Distribuição e otimização
`;

    const productionContent = await this.callOpenAI(productionPrompt);
    files.push(this.createFile('video-production-guide.md', 'md', productionContent, 'Guia de produção'));

    return files;
  }

  private async generateAnalyticsFiles(request: FileGenerationRequest): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate analytics dashboard config
    const dashboardPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie uma configuração completa de dashboard de analytics em JSON:
{
  "kpis": "KPIs principais",
  "metrics": "Métricas detalhadas",
  "reports": "Relatórios automáticos",
  "alerts": "Alertas e notificações",
  "integrations": "Integrações necessárias",
  "visualization": "Configurações de visualização"
}
`;

    const dashboardContent = await this.callOpenAI(dashboardPrompt);
    files.push(this.createFile('analytics-dashboard.json', 'json', dashboardContent, 'Configuração do dashboard'));

    // Generate tracking implementation
    const trackingPrompt = `
Baseado na resposta: "${request.aiResponse}"

Crie um código JavaScript para implementação de tracking:
1. Google Analytics 4
2. Facebook Pixel
3. LinkedIn Insight Tag
4. Custom events
5. Conversion tracking
6. E-commerce tracking

Inclua comentários explicativos.
`;

    const trackingContent = await this.callOpenAI(trackingPrompt);
    files.push(this.createFile('tracking-implementation.js', 'js', trackingContent, 'Implementação de tracking'));

    return files;
  }

  private async generateGenericFile(request: FileGenerationRequest): Promise<GeneratedFile> {
    const content = `# ${request.purpose}

${request.aiResponse}

---
Gerado automaticamente pelo sistema de IA
Data: ${new Date().toLocaleString('pt-BR')}
`;

    return this.createFile(`${request.moduleType}-output.md`, 'md', content, request.purpose);
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.openai) {
      return `Conteúdo gerado baseado no prompt: ${prompt.substring(0, 100)}...`;
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um especialista em criação de conteúdo digital. Gere conteúdo prático, profissional e implementável em português.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
      });

      return response.choices[0].message.content || 'Erro na geração de conteúdo';
    } catch (error) {
      console.error('Erro na geração de arquivo:', error);
      return `Conteúdo alternativo gerado para: ${prompt.substring(0, 100)}...`;
    }
  }

  private createFile(name: string, type: string, content: string, purpose: string): GeneratedFile {
    const id = nanoid();
    const filePath = path.join(this.filesDirectory, `${id}-${name}`);
    
    try {
      fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
    }

    return {
      id,
      name,
      type,
      content,
      purpose,
      size: Buffer.byteLength(content, 'utf8'),
      createdAt: new Date()
    };
  }

  getFile(id: string): GeneratedFile | null {
    const files = this.listFiles();
    return files.find(file => file.id === id) || null;
  }

  listFiles(): GeneratedFile[] {
    try {
      const fileNames = fs.readdirSync(this.filesDirectory);
      return fileNames.map(fileName => {
        const filePath = path.join(this.filesDirectory, fileName);
        const content = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        
        const [id, ...nameParts] = fileName.split('-');
        const name = nameParts.join('-');
        const extension = path.extname(name).substring(1);
        
        return {
          id,
          name,
          type: extension,
          content,
          purpose: `Arquivo gerado automaticamente`,
          size: stats.size,
          createdAt: stats.birthtime
        };
      });
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      return [];
    }
  }

  deleteFile(id: string): boolean {
    try {
      const files = fs.readdirSync(this.filesDirectory);
      const fileName = files.find(name => name.startsWith(id));
      
      if (fileName) {
        const filePath = path.join(this.filesDirectory, fileName);
        fs.unlinkSync(filePath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }
}

export const fileGenerationService = new FileGenerationService();