import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface TTSRequest {
  text: string;
  languageCode?: string;
  voiceName?: string;
  ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
}

interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  audioContent?: string;
  error?: string;
  metadata?: any;
}

export class GoogleTTSService {
  private outputDir: string;
  private logPath: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'ai-content');
    this.logPath = path.join(process.cwd(), 'logs', 'tts.log');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    if (!fs.existsSync(path.dirname(this.logPath))) {
      fs.mkdirSync(path.dirname(this.logPath), { recursive: true });
    }
  }

  async synthesizeSpeech(request: TTSRequest): Promise<TTSResponse> {
    const startTime = Date.now();

    try {
      console.log('🔊 Starting Google TTS synthesis:', request.text.substring(0, 50) + '...');

      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            text: request.text
          },
          voice: {
            languageCode: request.languageCode || 'pt-BR',
            name: request.voiceName || 'pt-BR-Wavenet-A',
            ssmlGender: request.ssmlGender || 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google TTS API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;
      
      if (data.audioContent) {
        // Save audio file
        const filename = `tts_${Date.now()}.mp3`;
        const filepath = path.join(this.outputDir, filename);
        
        // Convert base64 to buffer and save
        const audioBuffer = Buffer.from(data.audioContent, 'base64');
        fs.writeFileSync(filepath, audioBuffer);
        
        console.log(`✅ Audio saved: ${filepath} (${audioBuffer.length} bytes)`);
        
        const finalResponse: TTSResponse = {
          success: true,
          audioUrl: `/ai-content/${filename}`,
          audioContent: data.audioContent,
          metadata: {
            text: request.text,
            languageCode: request.languageCode || 'pt-BR',
            voiceName: request.voiceName || 'pt-BR-Wavenet-A',
            ssmlGender: request.ssmlGender || 'FEMALE',
            provider: 'Google Cloud TTS',
            generatedAt: new Date().toISOString(),
            processingTime: Date.now() - startTime,
            audioFormat: 'MP3',
            fileSize: audioBuffer.length
          }
        };

        this.logTTSGeneration(request, finalResponse, Date.now() - startTime);
        return finalResponse;
      }

      throw new Error('No audio content in response');

    } catch (error) {
      console.error('❌ Google TTS synthesis failed:', error);
      
      const errorResponse: TTSResponse = {
        success: false,
        error: (error as Error).message
      };

      this.logTTSGeneration(request, errorResponse, Date.now() - startTime);
      return errorResponse;
    }
  }

  private logTTSGeneration(request: TTSRequest, response: TTSResponse, duration: number) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      service: 'google-tts',
      textLength: request.text.length,
      languageCode: request.languageCode || 'pt-BR',
      voiceName: request.voiceName || 'pt-BR-Wavenet-A',
      success: response.success,
      duration: duration,
      error: response.error,
      audioUrl: response.audioUrl,
      fileSize: response.metadata?.fileSize
    };

    fs.appendFileSync(this.logPath, JSON.stringify(logEntry) + '\n');
  }

  async healthCheck(): Promise<{ success: boolean; message: string; audioUrl?: string }> {
    try {
      const result = await this.synthesizeSpeech({
        text: 'Olá! Este áudio foi gerado pela IA Board.',
        languageCode: 'pt-BR',
        voiceName: 'pt-BR-Wavenet-A',
        ssmlGender: 'FEMALE'
      });

      if (result.success && result.audioUrl && result.audioContent) {
        // Verify the file exists and has content
        const fullPath = path.join(process.cwd(), 'public', result.audioUrl.replace('/', ''));
        const exists = fs.existsSync(fullPath);
        const hasContent = exists && fs.statSync(fullPath).size > 0;
        
        return {
          success: exists && hasContent && result.audioContent.length > 0,
          message: exists && hasContent ? 'Google TTS working correctly' : 'Audio file not accessible or empty',
          audioUrl: result.audioUrl
        };
      }

      return {
        success: false,
        message: result.error || 'TTS synthesis failed'
      };
    } catch (error) {
      return {
        success: false,
        message: `Health check failed: ${(error as Error).message}`
      };
    }
  }
}

export const googleTTSService = new GoogleTTSService();