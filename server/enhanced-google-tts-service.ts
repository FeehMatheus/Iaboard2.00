import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

interface TTSRequest {
  text: string;
  voice?: {
    languageCode?: string;
    name?: string;
    ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  };
  audioConfig?: {
    audioEncoding?: 'LINEAR16' | 'MP3' | 'OGG_OPUS';
    speakingRate?: number;
    pitch?: number;
    volumeGainDb?: number;
    effectsProfileId?: string[];
  };
}

interface TTSResponse {
  success: boolean;
  audioContent?: string;
  error?: string;
  audioUrl?: string;
  duration?: number;
  voiceInfo?: {
    language: string;
    gender: string;
    name: string;
  };
  metadata?: {
    wordsCount: number;
    charactersCount: number;
    estimatedDuration: number;
  };
}

export class EnhancedGoogleTTSService {
  private apiKey: string;
  private projectId: string;
  
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.projectId = process.env.GOOGLE_TTS_PROJECT_ID || 'ia-board-tts';
  }

  async synthesizeText(request: TTSRequest): Promise<TTSResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Google API key not configured');
      }

      const payload = {
        input: {
          text: request.text
        },
        voice: {
          languageCode: request.voice?.languageCode || 'pt-BR',
          name: request.voice?.name || 'pt-BR-Standard-A',
          ssmlGender: request.voice?.ssmlGender || 'FEMALE'
        },
        audioConfig: {
          audioEncoding: request.audioConfig?.audioEncoding || 'MP3',
          speakingRate: request.audioConfig?.speakingRate || 1.0,
          pitch: request.audioConfig?.pitch || 0.0,
          volumeGainDb: request.audioConfig?.volumeGainDb || 0.0,
          effectsProfileId: request.audioConfig?.effectsProfileId || []
        }
      };

      console.log('🎵 Google TTS: Synthesizing audio for text:', request.text.substring(0, 100));

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google TTS API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json() as any;
      
      if (data.audioContent) {
        // Ensure directory exists
        const audioDir = path.join(process.cwd(), 'public', 'ai-content');
        try {
          await fs.access(audioDir);
        } catch {
          await fs.mkdir(audioDir, { recursive: true });
        }
        
        // Save audio to public directory
        const audioBuffer = Buffer.from(data.audioContent, 'base64');
        const filename = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`;
        const filepath = path.join(audioDir, filename);
        
        await fs.writeFile(filepath, audioBuffer);
        
        console.log('✅ Google TTS: Audio generated successfully:', filename);
        
        const wordsCount = request.text.split(/\s+/).length;
        const charactersCount = request.text.length;
        const estimatedDuration = this.estimateAudioDuration(request.text);
        
        return {
          success: true,
          audioContent: data.audioContent,
          audioUrl: `/ai-content/${filename}`,
          duration: estimatedDuration,
          voiceInfo: {
            language: payload.voice.languageCode,
            gender: payload.voice.ssmlGender,
            name: payload.voice.name
          },
          metadata: {
            wordsCount,
            charactersCount,
            estimatedDuration
          }
        };
      }

      throw new Error('No audio content received from Google TTS');
      
    } catch (error) {
      console.error('❌ Google TTS synthesis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'TTS synthesis failed'
      };
    }
  }

  async generateProfessionalVoiceover(text: string, options: {
    style?: 'professional' | 'conversational' | 'dramatic' | 'calm' | 'energetic';
    speed?: 'slow' | 'normal' | 'fast';
    language?: 'pt-BR' | 'en-US' | 'es-ES' | 'en-GB' | 'fr-FR';
    gender?: 'male' | 'female' | 'neutral';
    effects?: 'telephony' | 'studio' | 'outdoor' | 'none';
  } = {}): Promise<TTSResponse> {
    const {
      style = 'professional',
      speed = 'normal',
      language = 'pt-BR',
      gender = 'female',
      effects = 'studio'
    } = options;

    const speedConfigs = {
      slow: 0.75,
      normal: 1.0,
      fast: 1.25
    };

    const pitchConfigs = {
      professional: 0.0,
      conversational: 1.5,
      dramatic: -2.0,
      calm: -1.5,
      energetic: 3.0
    };

    const effectsProfiles = {
      telephony: ['telephony-class-application'],
      studio: ['headphone-class-device'],
      outdoor: ['large-home-entertainment-class-device'],
      none: []
    };

    const voiceConfigs = {
      'pt-BR': {
        male: { name: 'pt-BR-Standard-B' },
        female: { name: 'pt-BR-Standard-A' },
        neutral: { name: 'pt-BR-Standard-C' }
      },
      'en-US': {
        male: { name: 'en-US-Standard-B' },
        female: { name: 'en-US-Standard-C' },
        neutral: { name: 'en-US-Standard-D' }
      },
      'en-GB': {
        male: { name: 'en-GB-Standard-B' },
        female: { name: 'en-GB-Standard-A' },
        neutral: { name: 'en-GB-Standard-C' }
      },
      'es-ES': {
        male: { name: 'es-ES-Standard-B' },
        female: { name: 'es-ES-Standard-A' },
        neutral: { name: 'es-ES-Standard-C' }
      },
      'fr-FR': {
        male: { name: 'fr-FR-Standard-B' },
        female: { name: 'fr-FR-Standard-A' },
        neutral: { name: 'fr-FR-Standard-C' }
      }
    };

    return this.synthesizeText({
      text,
      voice: {
        languageCode: language,
        name: voiceConfigs[language][gender].name,
        ssmlGender: gender.toUpperCase() as 'MALE' | 'FEMALE' | 'NEUTRAL'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: speedConfigs[speed],
        pitch: pitchConfigs[style],
        volumeGainDb: 0.0,
        effectsProfileId: effectsProfiles[effects]
      }
    });
  }

  async generateMultiLanguageVoiceover(texts: { text: string; language: string }[]): Promise<TTSResponse[]> {
    const results: TTSResponse[] = [];
    
    for (const item of texts) {
      const result = await this.generateProfessionalVoiceover(item.text, {
        language: item.language as any,
        style: 'professional'
      });
      results.push(result);
    }
    
    return results;
  }

  async generateSSMLVoiceover(ssmlText: string, voiceConfig: {
    languageCode: string;
    name: string;
    gender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  }): Promise<TTSResponse> {
    try {
      const payload = {
        input: {
          ssml: ssmlText
        },
        voice: voiceConfig,
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0
        }
      };

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google TTS SSML API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json() as any;
      
      if (data.audioContent) {
        const audioDir = path.join(process.cwd(), 'public', 'ai-content');
        try {
          await fs.access(audioDir);
        } catch {
          await fs.mkdir(audioDir, { recursive: true });
        }
        
        const audioBuffer = Buffer.from(data.audioContent, 'base64');
        const filename = `ssml_tts_${Date.now()}.mp3`;
        const filepath = path.join(audioDir, filename);
        
        await fs.writeFile(filepath, audioBuffer);
        
        return {
          success: true,
          audioContent: data.audioContent,
          audioUrl: `/ai-content/${filename}`,
          voiceInfo: {
            language: voiceConfig.languageCode,
            gender: voiceConfig.gender,
            name: voiceConfig.name
          }
        };
      }

      throw new Error('No audio content received from SSML synthesis');
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SSML TTS synthesis failed'
      };
    }
  }

  async listAvailableVoices(languageCode = 'pt-BR'): Promise<any[]> {
    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/voices?languageCode=${languageCode}&key=${this.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching available voices:', error);
      return [];
    }
  }

  private estimateAudioDuration(text: string): number {
    const words = text.split(/\s+/).length;
    const minutes = words / 150; // 150 words per minute average
    return Math.round(minutes * 60); // Return seconds
  }

  async generateVoiceoverWithTimestamps(text: string, options: any = {}): Promise<TTSResponse & { timestamps?: any[] }> {
    // For basic implementation, we'll generate the audio and estimate timestamps
    const result = await this.generateProfessionalVoiceover(text, options);
    
    if (result.success) {
      const words = text.split(/\s+/);
      const totalDuration = result.duration || this.estimateAudioDuration(text);
      const timePerWord = totalDuration / words.length;
      
      const timestamps = words.map((word, index) => ({
        word,
        startTime: Math.round(index * timePerWord * 1000), // milliseconds
        endTime: Math.round((index + 1) * timePerWord * 1000)
      }));
      
      return {
        ...result,
        timestamps
      };
    }
    
    return result;
  }
}

export const enhancedGoogleTTSService = new EnhancedGoogleTTSService();