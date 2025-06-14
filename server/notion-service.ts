interface NotionPage {
  title: string;
  content?: string;
  database_id?: string;
  properties?: Record<string, any>;
}

interface NotionResponse {
  success: boolean;
  page_id?: string;
  url?: string;
  error?: string;
}

export class NotionService {
  private apiKey: string;
  private baseUrl = 'https://api.notion.com/v1';

  constructor() {
    this.apiKey = process.env.NOTION_API_KEY || '';
  }

  async createPage(data: NotionPage): Promise<NotionResponse> {
    if (!this.apiKey) {
      throw new Error('Notion API key not configured');
    }

    console.log(`📝 Creating Notion page: ${data.title}`);

    try {
      const pageData = {
        parent: data.database_id ? 
          { database_id: data.database_id } : 
          { page_id: await this.getDefaultParentPage() },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: data.title
                }
              }
            ]
          },
          ...data.properties
        },
        children: data.content ? [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: data.content
                  }
                }
              ]
            }
          }
        ] : []
      };

      const response = await fetch(`${this.baseUrl}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(pageData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Notion API error: ${response.status} - ${errorData.message}`);
      }

      const result = await response.json();
      console.log(`✅ Notion page created: ${data.title}`);

      return {
        success: true,
        page_id: result.id,
        url: result.url
      };

    } catch (error) {
      console.error(`❌ Notion page creation failed:`, error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Notion authentication failed. Please check API key.');
      }
      
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Notion access denied. API key may be invalid or expired.');
      }
      
      throw error;
    }
  }

  async saveAIResult(type: string, prompt: string, result: string, metadata?: Record<string, any>): Promise<NotionResponse> {
    return this.createPage({
      title: `IA ${type} - ${new Date().toLocaleDateString()}`,
      content: `Prompt: ${prompt}\n\nResultado:\n${result}`,
      properties: {
        'Tipo': {
          select: {
            name: type
          }
        },
        'Data': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        },
        'Tokens': metadata?.tokens ? {
          number: metadata.tokens
        } : undefined,
        'Modelo': metadata?.model ? {
          rich_text: [
            {
              text: {
                content: metadata.model
              }
            }
          ]
        } : undefined
      }
    });
  }

  async saveVideoResult(prompt: string, videoUrl: string, metadata?: Record<string, any>): Promise<NotionResponse> {
    return this.createPage({
      title: `Vídeo IA - ${new Date().toLocaleDateString()}`,
      content: `Prompt: ${prompt}\n\nVídeo URL: ${videoUrl}\n\nMetadata: ${JSON.stringify(metadata, null, 2)}`,
      properties: {
        'Tipo': {
          select: {
            name: 'Vídeo'
          }
        },
        'Data': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        },
        'Duração': metadata?.duration ? {
          number: metadata.duration
        } : undefined,
        'URL': {
          url: videoUrl
        }
      }
    });
  }

  async saveFormResult(formType: string, formUrl: string, formId: string): Promise<NotionResponse> {
    return this.createPage({
      title: `Formulário ${formType} - ${new Date().toLocaleDateString()}`,
      content: `Tipo: ${formType}\n\nURL: ${formUrl}\n\nID: ${formId}`,
      properties: {
        'Tipo': {
          select: {
            name: 'Formulário'
          }
        },
        'Data': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        },
        'Form ID': {
          rich_text: [
            {
              text: {
                content: formId
              }
            }
          ]
        },
        'URL': {
          url: formUrl
        }
      }
    });
  }

  private async getDefaultParentPage(): Promise<string> {
    // Try to get the first available page as parent
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          filter: {
            property: 'object',
            value: 'page'
          },
          page_size: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].id;
        }
      }
    } catch (error) {
      console.error('Failed to get default parent page:', error);
    }
    
    // Fallback: create in root
    throw new Error('No accessible parent page found. Please provide a database_id.');
  }

  async testConnection(): Promise<{success: boolean, pages_count?: number, error?: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          page_size: 10
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Notion API error: ${response.status} - ${errorData.message}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        pages_count: data.results.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const notionService = new NotionService();