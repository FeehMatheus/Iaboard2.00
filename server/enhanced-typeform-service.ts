import fetch from 'node-fetch';

interface TypeformField {
  type: 'short_text' | 'long_text' | 'multiple_choice' | 'email' | 'number' | 'rating' | 'date' | 'file_upload';
  title: string;
  required?: boolean;
  choices?: string[];
  description?: string;
  validations?: any;
}

interface TypeformResponse {
  success: boolean;
  formId?: string;
  formUrl?: string;
  editUrl?: string;
  error?: string;
  metadata?: {
    title: string;
    fieldsCount: number;
    isPublic: boolean;
    responseCount?: number;
  };
}

interface FormAnalytics {
  totalResponses: number;
  completionRate: number;
  averageTime: number;
  topDropOffPoint: string;
  responsesByDay: Array<{ date: string; count: number }>;
}

export class EnhancedTypeformService {
  private apiKey: string;
  private baseURL = 'https://api.typeform.com';
  
  constructor() {
    this.apiKey = process.env.TYPEFORM_API_KEY || 'tfp_AdtBqVmwpmNj7YhHw7DhBEd2Yko3mDQ115dy2xL1B5sV_3pdYcugRXA7TDK';
  }

  async createAdvancedForm(config: {
    title: string;
    description?: string;
    fields: TypeformField[];
    branding?: {
      colors?: { primary?: string; background?: string; };
      logo?: string;
    };
    settings?: {
      redirectUrl?: string;
      notifications?: boolean;
      progressBar?: boolean;
      showQuestionNumber?: boolean;
    };
  }): Promise<TypeformResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Typeform API key not configured');
      }

      const formData = {
        title: config.title,
        type: 'form',
        settings: {
          is_public: true,
          progress_bar: config.settings?.progressBar !== false,
          show_progress_bar: config.settings?.progressBar !== false,
          show_typeform_branding: false,
          redirect_after_submit_url: config.settings?.redirectUrl || '',
          notifications: {
            self: {
              enabled: config.settings?.notifications || false
            }
          }
        },
        theme: {
          href: 'https://api.typeform.com/themes/6lPNE6'
        },
        fields: config.fields.map((field, index) => {
          const fieldData: any = {
            id: `field_${index + 1}`,
            title: field.title,
            type: field.type,
            required: field.required || false
          };

          if (field.description) {
            fieldData.description = field.description;
          }

          if (field.type === 'multiple_choice' && field.choices) {
            fieldData.properties = {
              choices: field.choices.map(choice => ({ label: choice }))
            };
          }

          if (field.type === 'rating') {
            fieldData.properties = {
              steps: 10,
              shape: 'star'
            };
          }

          if (field.validations) {
            fieldData.validations = field.validations;
          }

          return fieldData;
        })
      };

      if (config.description) {
        formData.welcome_screens = [{
          title: config.title,
          properties: {
            description: config.description,
            show_button: true,
            button_text: 'Começar'
          }
        }];
      }

      if (config.branding?.colors) {
        formData.theme = {
          href: 'https://api.typeform.com/themes/6lPNE6'
        };
      }

      console.log('📝 Typeform: Creating advanced form:', config.title);

      const response = await fetch(`${this.baseURL}/forms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Typeform API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json() as any;
      
      console.log('✅ Typeform: Advanced form created successfully');
      
      return {
        success: true,
        formId: data.id,
        formUrl: data._links.display,
        editUrl: data._links.self,
        metadata: {
          title: data.title,
          fieldsCount: data.fields?.length || 0,
          isPublic: data.settings?.is_public || false
        }
      };
      
    } catch (error) {
      console.error('❌ Typeform creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Form creation failed'
      };
    }
  }

  async createMarketResearchForm(product: string, targetAudience: string): Promise<TypeformResponse> {
    return this.createAdvancedForm({
      title: `Pesquisa de Mercado: ${product}`,
      description: `Ajude-nos a entender melhor as necessidades do mercado para ${product}. Suas respostas são confidenciais e nos ajudarão a criar soluções melhores.`,
      fields: [
        {
          type: 'short_text',
          title: 'Qual é sua idade?',
          required: true,
          validations: {
            required: true,
            max_length: 3
          }
        },
        {
          type: 'multiple_choice',
          title: 'Como você se identifica?',
          choices: ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não dizer'],
          required: true
        },
        {
          type: 'multiple_choice',
          title: 'Qual sua faixa de renda mensal?',
          choices: ['Até R$ 2.000', 'R$ 2.001-5.000', 'R$ 5.001-10.000', 'R$ 10.001-20.000', 'Acima de R$ 20.000'],
          required: false
        },
        {
          type: 'multiple_choice',
          title: `Você já utilizou produtos similares ao ${product}?`,
          choices: ['Sim, frequentemente', 'Sim, ocasionalmente', 'Raramente', 'Nunca'],
          required: true
        },
        {
          type: 'rating',
          title: `Em uma escala de 1 a 10, qual seu interesse em ${product}?`,
          required: true
        },
        {
          type: 'long_text',
          title: `Que características você consideraria mais importantes em ${product}?`,
          description: 'Descreva em detalhes suas necessidades e expectativas',
          required: false
        },
        {
          type: 'multiple_choice',
          title: 'Qual faixa de preço estaria disposto a pagar?',
          choices: ['Até R$ 50', 'R$ 51-100', 'R$ 101-200', 'R$ 201-500', 'Acima de R$ 500'],
          required: true
        },
        {
          type: 'multiple_choice',
          title: 'Onde prefere comprar produtos online?',
          choices: ['Site oficial da marca', 'Marketplaces (Amazon, ML)', 'Redes sociais', 'Lojas físicas', 'Outros'],
          required: false
        },
        {
          type: 'email',
          title: 'Deixe seu email para receber atualizações sobre o produto (opcional)',
          required: false
        }
      ],
      settings: {
        progressBar: true,
        showQuestionNumber: true,
        notifications: true
      }
    });
  }

  async createCustomerFeedbackForm(service: string, company: string): Promise<TypeformResponse> {
    return this.createAdvancedForm({
      title: `Avalie sua experiência com ${service}`,
      description: `Sua opinião é fundamental para melhorarmos nossos serviços na ${company}!`,
      fields: [
        {
          type: 'rating',
          title: `Como você avalia sua experiência geral com ${service}?`,
          required: true
        },
        {
          type: 'multiple_choice',
          title: 'Você recomendaria nosso serviço para amigos/colegas?',
          choices: ['Definitivamente sim', 'Provavelmente sim', 'Talvez', 'Provavelmente não', 'Definitivamente não'],
          required: true
        },
        {
          type: 'rating',
          title: 'Como avalia a qualidade do atendimento?',
          required: true
        },
        {
          type: 'rating',
          title: 'Como avalia a facilidade de uso?',
          required: true
        },
        {
          type: 'rating',
          title: 'Como avalia o custo-benefício?',
          required: true
        },
        {
          type: 'long_text',
          title: 'O que mais gostou em nosso serviço?',
          description: 'Conte-nos os pontos positivos da sua experiência',
          required: false
        },
        {
          type: 'long_text',
          title: 'Como podemos melhorar nosso serviço?',
          description: 'Suas sugestões são muito importantes para nós',
          required: false
        },
        {
          type: 'multiple_choice',
          title: 'Qual recurso considera mais importante?',
          choices: ['Velocidade', 'Qualidade', 'Preço', 'Suporte', 'Facilidade de uso'],
          required: false
        },
        {
          type: 'multiple_choice',
          title: 'Como conheceu nosso serviço?',
          choices: ['Redes sociais', 'Indicação de amigos', 'Busca no Google', 'Publicidade online', 'Eventos', 'Outros'],
          required: false
        }
      ],
      settings: {
        progressBar: true,
        notifications: true,
        redirectUrl: `https://obrigado.${company.toLowerCase()}.com`
      }
    });
  }

  async createLeadCaptureForm(offer: string, incentive: string): Promise<TypeformResponse> {
    return this.createAdvancedForm({
      title: `Ganhe ${incentive}!`,
      description: `Preencha o formulário abaixo e ganhe ${incentive} para ${offer}`,
      fields: [
        {
          type: 'short_text',
          title: 'Qual é seu nome?',
          required: true
        },
        {
          type: 'email',
          title: 'Qual é seu melhor email?',
          required: true,
          validations: {
            required: true
          }
        },
        {
          type: 'short_text',
          title: 'Qual é seu WhatsApp? (com DDD)',
          required: true,
          description: 'Ex: (11) 99999-9999'
        },
        {
          type: 'multiple_choice',
          title: `Qual seu principal interesse em ${offer}?`,
          choices: ['Uso pessoal', 'Uso profissional', 'Para minha empresa', 'Para revender', 'Apenas curiosidade'],
          required: true
        },
        {
          type: 'multiple_choice',
          title: 'Quando pretende adquirir?',
          choices: ['Imediatamente', 'Em até 30 dias', 'Em até 3 meses', 'Em até 6 meses', 'Ainda não sei'],
          required: false
        },
        {
          type: 'long_text',
          title: 'Tem alguma dúvida específica que gostaria de esclarecer?',
          required: false
        }
      ],
      settings: {
        progressBar: false,
        notifications: true
      }
    });
  }

  async getFormResponses(formId: string, limit: number = 25): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${formId}/responses?page_size=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch responses: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.items || [];
      
    } catch (error) {
      console.error('Error fetching form responses:', error);
      return [];
    }
  }

  async getFormAnalytics(formId: string): Promise<FormAnalytics | null> {
    try {
      const responses = await this.getFormResponses(formId, 1000);
      
      if (responses.length === 0) {
        return {
          totalResponses: 0,
          completionRate: 0,
          averageTime: 0,
          topDropOffPoint: 'No data',
          responsesByDay: []
        };
      }

      const completedResponses = responses.filter(r => r.submitted_at);
      const completionRate = (completedResponses.length / responses.length) * 100;
      
      const durations = completedResponses
        .filter(r => r.submitted_at && r.landed_at)
        .map(r => new Date(r.submitted_at).getTime() - new Date(r.landed_at).getTime());
      
      const averageTime = durations.length > 0 
        ? durations.reduce((a, b) => a + b, 0) / durations.length / 1000 
        : 0;

      // Group responses by day
      const responsesByDay = completedResponses.reduce((acc: any, response) => {
        const date = new Date(response.submitted_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const formattedResponsesByDay = Object.entries(responsesByDay).map(([date, count]) => ({
        date,
        count: count as number
      }));

      return {
        totalResponses: responses.length,
        completionRate: Math.round(completionRate),
        averageTime: Math.round(averageTime),
        topDropOffPoint: 'Field analysis needed',
        responsesByDay: formattedResponsesByDay
      };
      
    } catch (error) {
      console.error('Error getting form analytics:', error);
      return null;
    }
  }

  async duplicateForm(formId: string, newTitle: string): Promise<TypeformResponse> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${formId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch form: ${response.status}`);
      }

      const originalForm = await response.json() as any;
      
      const duplicateData = {
        ...originalForm,
        title: newTitle,
        id: undefined,
        _links: undefined
      };

      return this.createAdvancedForm({
        title: newTitle,
        description: originalForm.welcome_screens?.[0]?.properties?.description,
        fields: originalForm.fields?.map((field: any) => ({
          type: field.type,
          title: field.title,
          required: field.required,
          choices: field.properties?.choices?.map((c: any) => c.label),
          description: field.description
        })) || []
      });
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Form duplication failed'
      };
    }
  }
}

export const enhancedTypeformService = new EnhancedTypeformService();