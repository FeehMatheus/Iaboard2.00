import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface FormRequest {
  title: string;
  fields: FormField[];
}

interface FormField {
  type: 'short_text' | 'long_text' | 'email' | 'multiple_choice' | 'rating';
  title: string;
  required?: boolean;
  choices?: string[];
}

interface FormResponse {
  success: boolean;
  formId?: string;
  formUrl?: string;
  error?: string;
  metadata?: any;
}

export class TypeformService {
  private logPath: string;

  constructor() {
    this.logPath = path.join(process.cwd(), 'logs', 'webhook.log');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(path.dirname(this.logPath))) {
      fs.mkdirSync(path.dirname(this.logPath), { recursive: true });
    }
  }

  async createForm(request: FormRequest): Promise<FormResponse> {
    const startTime = Date.now();

    try {
      console.log('📋 Creating Typeform:', request.title);

      const response = await fetch('https://api.typeform.com/forms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TYPEFORM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: request.title,
          type: 'form',
          workspace: {
            href: 'https://api.typeform.com/workspaces/default'
          },
          fields: request.fields.map((field, index) => ({
            title: field.title,
            type: field.type,
            properties: {
              description: `Campo ${index + 1} do formulário ${request.title}`,
              required: field.required || false,
              ...(field.choices && { choices: field.choices.map(choice => ({ label: choice })) })
            }
          })),
          settings: {
            language: 'pt',
            progress_bar: 'proportion',
            meta: {
              allow_indexing: false
            }
          },
          theme: {
            href: 'https://api.typeform.com/themes/6lPNE6'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Typeform API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;
      
      if (data.id) {
        const finalResponse: FormResponse = {
          success: true,
          formId: data.id,
          formUrl: data._links.display,
          metadata: {
            title: request.title,
            fieldCount: request.fields.length,
            provider: 'Typeform',
            createdAt: new Date().toISOString(),
            processingTime: Date.now() - startTime
          }
        };

        this.logFormCreation(request, finalResponse, Date.now() - startTime);
        return finalResponse;
      }

      throw new Error('Invalid response from Typeform');

    } catch (error) {
      console.error('❌ Typeform creation failed:', error);
      
      const errorResponse: FormResponse = {
        success: false,
        error: (error as Error).message
      };

      this.logFormCreation(request, errorResponse, Date.now() - startTime);
      return errorResponse;
    }
  }

  async getFormResponses(formId: string): Promise<{ success: boolean; responses: any[]; error?: string }> {
    try {
      const response = await fetch(`https://api.typeform.com/forms/${formId}/responses`, {
        headers: {
          'Authorization': `Bearer ${process.env.TYPEFORM_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get responses: ${response.status}`);
      }

      const data = await response.json() as any;
      
      return {
        success: true,
        responses: data.items || []
      };
    } catch (error) {
      return {
        success: false,
        responses: [],
        error: (error as Error).message
      };
    }
  }

  private logFormCreation(request: FormRequest, response: FormResponse, duration: number) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      service: 'typeform',
      title: request.title,
      fieldCount: request.fields.length,
      success: response.success,
      duration: duration,
      error: response.error,
      formId: response.formId,
      formUrl: response.formUrl
    };

    fs.appendFileSync(this.logPath, JSON.stringify(logEntry) + '\n');
  }

  async healthCheck(): Promise<{ success: boolean; message: string; formUrl?: string }> {
    try {
      const result = await this.createForm({
        title: 'Feedback IA Board',
        fields: [
          {
            type: 'short_text',
            title: 'Nome',
            required: true
          },
          {
            type: 'long_text',
            title: 'Opinião sobre o IA Board',
            required: true
          }
        ]
      });

      if (result.success && result.formUrl) {
        return {
          success: true,
          message: 'Typeform integration working',
          formUrl: result.formUrl
        };
      }

      return {
        success: false,
        message: result.error || 'Form creation failed'
      };
    } catch (error) {
      return {
        success: false,
        message: `Health check failed: ${(error as Error).message}`
      };
    }
  }
}

export const typeformService = new TypeformService();