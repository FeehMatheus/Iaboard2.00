interface MailchimpSubscriber {
  email: string;
  first_name?: string;
  last_name?: string;
  tags?: string[];
  merge_fields?: Record<string, string>;
}

interface MailchimpResponse {
  success: boolean;
  subscriber_id?: string;
  email?: string;
  status?: string;
  error?: string;
}

export class MailchimpService {
  private apiKey: string;
  private serverPrefix: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MAILCHIMP_API_KEY || '';
    this.serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us17';
    this.baseUrl = `https://${this.serverPrefix}.api.mailchimp.com/3.0`;
  }

  async addSubscriber(email: string, listId: string, additionalData?: Partial<MailchimpSubscriber>): Promise<MailchimpResponse> {
    if (!this.apiKey) {
      throw new Error('Mailchimp API key not configured');
    }

    console.log(`📧 Adding subscriber to Mailchimp: ${email}`);

    try {
      const subscriberData = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: additionalData?.first_name || '',
          LNAME: additionalData?.last_name || '',
          ...additionalData?.merge_fields
        },
        tags: additionalData?.tags || []
      };

      const response = await fetch(`${this.baseUrl}/lists/${listId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriberData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.title === 'Member Exists') {
          return {
            success: true,
            subscriber_id: data.id,
            email: email,
            status: 'already_subscribed'
          };
        }
        throw new Error(`Mailchimp API error: ${response.status} - ${data.detail}`);
      }

      console.log(`✅ Subscriber added successfully: ${email}`);

      return {
        success: true,
        subscriber_id: data.id,
        email: data.email_address,
        status: data.status
      };

    } catch (error) {
      console.error(`❌ Mailchimp subscription failed:`, error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Mailchimp authentication failed. Please check API key.');
      }
      
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Mailchimp access denied. API key may be invalid or expired.');
      }
      
      throw error;
    }
  }

  async getLists(): Promise<Array<{id: string, name: string, member_count: number}>> {
    if (!this.apiKey) {
      throw new Error('Mailchimp API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/lists`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mailchimp API error: ${response.status} - ${errorData.detail}`);
      }

      const data = await response.json();
      
      return data.lists.map((list: any) => ({
        id: list.id,
        name: list.name,
        member_count: list.stats.member_count
      }));

    } catch (error) {
      console.error('Failed to fetch Mailchimp lists:', error);
      throw error;
    }
  }

  async createCampaign(listId: string, subject: string, content: string): Promise<{success: boolean, campaign_id?: string, error?: string}> {
    if (!this.apiKey) {
      throw new Error('Mailchimp API key not configured');
    }

    try {
      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: listId
        },
        settings: {
          subject_line: subject,
          from_name: 'IA Board',
          reply_to: 'noreply@ia-board.com'
        }
      };

      const response = await fetch(`${this.baseUrl}/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mailchimp API error: ${response.status} - ${errorData.detail}`);
      }

      const campaign = await response.json();

      // Set campaign content
      await fetch(`${this.baseUrl}/campaigns/${campaign.id}/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          html: content
        })
      });

      return {
        success: true,
        campaign_id: campaign.id
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async testConnection(): Promise<{success: boolean, lists_count: number, error?: string}> {
    try {
      const lists = await this.getLists();
      return {
        success: true,
        lists_count: lists.length
      };
    } catch (error) {
      return {
        success: false,
        lists_count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const mailchimpService = new MailchimpService();