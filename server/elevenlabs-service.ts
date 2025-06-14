interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  language: string;
  description: string;
  preview_url?: string;
}

interface TTSRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

interface TTSResponse {
  success: boolean;
  audio_url?: string;
  audio_base64?: string;
  voice_info?: ElevenLabsVoice;
  metadata?: {
    character_count: number;
    request_id: string;
    processing_time: number;
  };
  error?: string;
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
  }

  async synthesizeSpeech(request: TTSRequest): Promise<TTSResponse> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const startTime = Date.now();
    console.log(`🔊 Starting ElevenLabs TTS synthesis: ${request.text.substring(0, 50)}...`);

    try {
      // Use default Portuguese voice if none specified
      const voiceId = request.voice_id || await this.getPortugueseVoice();
      
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: request.text,
          model_id: request.model_id || 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
            ...request.voice_settings
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');
      const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

      const processingTime = Date.now() - startTime;
      console.log(`✅ ElevenLabs TTS completed in ${processingTime}ms`);

      return {
        success: true,
        audio_url: audioUrl,
        audio_base64: audioBase64,
        voice_info: await this.getVoiceInfo(voiceId),
        metadata: {
          character_count: request.text.length,
          request_id: `el_${Date.now()}`,
          processing_time: processingTime
        }
      };

    } catch (error) {
      console.error(`❌ ElevenLabs TTS failed:`, error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('ElevenLabs authentication failed. Please check API key.');
      }
      
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('ElevenLabs access denied. API key may be invalid or expired.');
      }
      
      if (error instanceof Error && error.message.includes('quota')) {
        throw new Error('ElevenLabs quota exceeded. Please upgrade your plan.');
      }
      
      throw error;
    }
  }

  async getAvailableVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      return data.voices.map((voice: any) => ({
        voice_id: voice.voice_id,
        name: voice.name,
        language: voice.language || 'en',
        description: voice.description || '',
        preview_url: voice.preview_url
      }));

    } catch (error) {
      console.error('Failed to fetch ElevenLabs voices:', error);
      throw error;
    }
  }

  async getPortugueseVoice(): Promise<string> {
    try {
      const voices = await this.getAvailableVoices();
      
      // Look for Portuguese voices
      const portugueseVoice = voices.find(voice => 
        voice.language?.includes('pt') || 
        voice.name.toLowerCase().includes('antonio') ||
        voice.name.toLowerCase().includes('portuguese')
      );
      
      if (portugueseVoice) {
        return portugueseVoice.voice_id;
      }
      
      // Fallback to first available voice
      return voices[0]?.voice_id || '21m00Tcm4TlvDq8ikWAM'; // Default Rachel voice
      
    } catch (error) {
      console.error('Error getting Portuguese voice, using default:', error);
      return '21m00Tcm4TlvDq8ikWAM'; // Default Rachel voice
    }
  }

  private async getVoiceInfo(voiceId: string): Promise<ElevenLabsVoice | undefined> {
    try {
      const voices = await this.getAvailableVoices();
      return voices.find(voice => voice.voice_id === voiceId);
    } catch (error) {
      console.error('Failed to get voice info:', error);
      return undefined;
    }
  }

  async generateMultiLanguageAudio(texts: Array<{text: string, language: string}>): Promise<TTSResponse[]> {
    const results: TTSResponse[] = [];
    
    for (const item of texts) {
      try {
        const voices = await this.getAvailableVoices();
        const languageVoice = voices.find(voice => 
          voice.language?.toLowerCase().includes(item.language.toLowerCase())
        );
        
        const result = await this.synthesizeSpeech({
          text: item.text,
          voice_id: languageVoice?.voice_id
        });
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  async testConnection(): Promise<{ success: boolean; voice_count: number; error?: string }> {
    try {
      const testResponse = await this.synthesizeSpeech({
        text: 'Hello, this is a test of ElevenLabs text-to-speech service.'
      });
      
      const voices = await this.getAvailableVoices();
      
      return {
        success: testResponse.success,
        voice_count: voices.length
      };
    } catch (error) {
      return {
        success: false,
        voice_count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const elevenLabsService = new ElevenLabsService();