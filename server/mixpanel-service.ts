interface MixpanelEvent {
  event: string;
  properties: Record<string, any>;
  distinct_id?: string;
  time?: number;
}

interface MixpanelResponse {
  success: boolean;
  events_tracked?: number;
  error?: string;
}

export class MixpanelService {
  private token: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.token = process.env.MIXPANEL_TOKEN || '';
    this.apiKey = process.env.MIXPANEL_API_KEY || '';
    this.apiSecret = process.env.MIXPANEL_API_SECRET || '';
  }

  async trackEvent(event: string, properties: Record<string, any> = {}, distinctId?: string): Promise<MixpanelResponse> {
    if (!this.token) {
      throw new Error('Mixpanel token not configured');
    }

    console.log(`📊 Tracking Mixpanel event: ${event}`);

    try {
      const eventData: MixpanelEvent = {
        event,
        properties: {
          token: this.token,
          time: Math.floor(Date.now() / 1000),
          ...properties
        },
        distinct_id: distinctId || `user_${Date.now()}`
      };

      const encodedData = Buffer.from(JSON.stringify(eventData)).toString('base64');

      const response = await fetch('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodedData}`
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mixpanel API error: ${response.status} - ${errorText}`);
      }

      const result = await response.text();
      
      if (result !== '1') {
        throw new Error(`Mixpanel tracking failed: ${result}`);
      }

      console.log(`✅ Mixpanel event tracked: ${event}`);

      return {
        success: true,
        events_tracked: 1
      };

    } catch (error) {
      console.error(`❌ Mixpanel tracking failed:`, error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Mixpanel authentication failed. Please check token.');
      }
      
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Mixpanel access denied. Token may be invalid or expired.');
      }
      
      throw error;
    }
  }

  async trackVideoGeneration(prompt: string, model: string, duration: number): Promise<MixpanelResponse> {
    return this.trackEvent('Video Generated', {
      prompt_length: prompt.length,
      model_used: model,
      video_duration: duration,
      source: 'IA Board',
      timestamp: new Date().toISOString()
    });
  }

  async trackLeadCapture(email: string, source: string): Promise<MixpanelResponse> {
    return this.trackEvent('Lead Captured', {
      email_domain: email.split('@')[1] || 'unknown',
      lead_source: source,
      source: 'IA Board',
      timestamp: new Date().toISOString()
    });
  }

  async trackAIGeneration(type: string, model: string, tokensUsed: number): Promise<MixpanelResponse> {
    return this.trackEvent('AI Content Generated', {
      content_type: type,
      model_used: model,
      tokens_used: tokensUsed,
      source: 'IA Board',
      timestamp: new Date().toISOString()
    });
  }

  async trackFormCreation(formType: string, fieldsCount: number): Promise<MixpanelResponse> {
    return this.trackEvent('Form Created', {
      form_type: formType,
      fields_count: fieldsCount,
      source: 'IA Board',
      timestamp: new Date().toISOString()
    });
  }

  async getEventStats(): Promise<{success: boolean, total_events?: number, error?: string}> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Mixpanel API credentials not configured');
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const params = new URLSearchParams({
        from_date: today,
        to_date: today,
        event: '["Video Generated", "Lead Captured", "AI Content Generated"]'
      });

      const response = await fetch(`https://mixpanel.com/api/2.0/events/top/?${params}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mixpanel API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      const totalEvents = Object.values(data.data || {}).reduce((sum: number, eventData: any) => {
        return sum + Object.values(eventData || {}).reduce((daySum: number, count: any) => daySum + (count || 0), 0);
      }, 0) as number;

      return {
        success: true,
        total_events: totalEvents
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async testConnection(): Promise<{success: boolean, error?: string}> {
    try {
      const testResult = await this.trackEvent('Test Connection', {
        test: true,
        source: 'IA Board Health Check'
      });
      
      return {
        success: testResult.success
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const mixpanelService = new MixpanelService();