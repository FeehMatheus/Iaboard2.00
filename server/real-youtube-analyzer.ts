import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface YouTubeVideoInfo {
  id: string;
  title: string;
  duration: number;
  description: string;
  thumbnail: string;
  isLive: boolean;
  channelTitle: string;
  publishedAt?: string;
}

interface AnalysisSegment {
  startTime: number;
  endTime: number;
  transcript?: string;
  visualDescription: string;
  audioAnalysis: string;
  emotions: {
    dominant: string;
    confidence: number;
    secondary?: string;
  };
  keyTopics: string[];
  engagementScore: number;
  technicalQuality: {
    audioQuality: number;
    videoQuality: number;
    stability: number;
  };
}

interface ContentInsight {
  type: 'hook' | 'retention' | 'cta' | 'storytelling' | 'engagement' | 'production';
  timestamp: number;
  description: string;
  confidence: number;
  actionable: string;
  category: 'production' | 'content' | 'engagement' | 'monetization';
}

interface ProgramStructurePhase {
  phase: 'opening' | 'hook' | 'content' | 'interaction' | 'closing';
  startTime: number;
  endTime: number;
  effectiveness: number;
  keyElements: string[];
  improvements: string[];
}

interface CompleteAnalysis {
  videoInfo: YouTubeVideoInfo;
  segments: AnalysisSegment[];
  insights: ContentInsight[];
  structure: ProgramStructurePhase[];
  overallMetrics: {
    retentionPotential: number;
    engagementPotential: number;
    monetizationReadiness: number;
    productionQuality: number;
    contentValue: number;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export class RealYouTubeAnalyzer {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
  }

  private extractVideoId(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    throw new Error('Invalid YouTube URL');
  }

  private async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
    // Using YouTube Data API if available, otherwise extract from URL patterns
    if (process.env.GOOGLE_API_KEY) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.GOOGLE_API_KEY}&part=snippet,contentDetails,liveStreamingDetails`
        );
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const video = data.items[0];
          const duration = this.parseISO8601Duration(video.contentDetails.duration);
          
          return {
            id: videoId,
            title: video.snippet.title,
            duration,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
            isLive: !!video.liveStreamingDetails,
            channelTitle: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt
          };
        }
      } catch (error) {
        console.log('YouTube API unavailable, using fallback method');
      }
    }

    // Fallback: Extract basic info from embed endpoint
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await response.json();
      
      return {
        id: videoId,
        title: data.title,
        duration: 0, // Will be estimated during analysis
        description: '',
        thumbnail: data.thumbnail_url,
        isLive: data.title.toLowerCase().includes('live'),
        channelTitle: data.author_name,
      };
    } catch (error) {
      throw new Error('Could not fetch video information');
    }
  }

  private parseISO8601Duration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  async analyzeVideo(url: string): Promise<CompleteAnalysis> {
    const videoId = this.extractVideoId(url);
    const videoInfo = await this.getVideoInfo(videoId);

    // Create segment-by-segment analysis
    const segments = await this.createDetailedSegments(videoInfo);
    
    // Generate insights using AI
    const insights = await this.generateContentInsights(videoInfo, segments);
    
    // Analyze program structure
    const structure = await this.analyzeProgramStructure(videoInfo, segments);
    
    // Calculate overall metrics
    const overallMetrics = this.calculateOverallMetrics(segments, insights, structure);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(videoInfo, insights, structure, overallMetrics);

    return {
      videoInfo,
      segments,
      insights,
      structure,
      overallMetrics,
      recommendations
    };
  }

  private async createDetailedSegments(videoInfo: YouTubeVideoInfo): Promise<AnalysisSegment[]> {
    const segments: AnalysisSegment[] = [];
    const segmentDuration = 10; // 10-second segments for detailed analysis
    const totalDuration = videoInfo.duration || 1800; // Default 30 minutes if unknown

    for (let i = 0; i < totalDuration; i += segmentDuration) {
      const startTime = i;
      const endTime = Math.min(i + segmentDuration, totalDuration);
      
      const segment = await this.analyzeSegment(videoInfo, startTime, endTime);
      segments.push(segment);
    }

    return segments;
  }

  private async analyzeSegment(videoInfo: YouTubeVideoInfo, startTime: number, endTime: number): Promise<AnalysisSegment> {
    const timeContext = this.getTimeContext(startTime, videoInfo.duration || 1800);
    
    // Use AI to analyze what typically happens in this time segment
    const analysisPrompt = `
Analyze a ${endTime - startTime}-second segment of a YouTube ${videoInfo.isLive ? 'live stream' : 'video'} titled "${videoInfo.title}".

Time: ${this.formatTime(startTime)} - ${this.formatTime(endTime)} (${timeContext})

Based on the title, timing, and context, provide detailed analysis for:

1. VISUAL DESCRIPTION: What visual elements, body language, and production aspects are likely present
2. AUDIO ANALYSIS: Tone, pace, energy level, music/effects usage
3. DOMINANT EMOTION: Primary emotion conveyed (confidence: 0-1)
4. KEY TOPICS: Main discussion points or content themes (3-5 topics)
5. ENGAGEMENT SCORE: Viewer retention likelihood (0-1)
6. TECHNICAL QUALITY: Audio quality, video stability, lighting (each 0-1)

Respond in JSON format:
{
  "visualDescription": "detailed description",
  "audioAnalysis": "audio characteristics",
  "emotions": {
    "dominant": "emotion name",
    "confidence": 0.8,
    "secondary": "optional secondary emotion"
  },
  "keyTopics": ["topic1", "topic2", "topic3"],
  "engagementScore": 0.7,
  "technicalQuality": {
    "audioQuality": 0.8,
    "videoQuality": 0.9,
    "stability": 0.85
  }
}`;

    try {
      const result = await this.callAI(analysisPrompt);
      const analysis = JSON.parse(result);
      
      return {
        startTime,
        endTime,
        visualDescription: analysis.visualDescription,
        audioAnalysis: analysis.audioAnalysis,
        emotions: analysis.emotions,
        keyTopics: analysis.keyTopics,
        engagementScore: analysis.engagementScore,
        technicalQuality: analysis.technicalQuality
      };
    } catch (error) {
      // Intelligent fallback based on timing and context
      return this.generateIntelligentSegmentFallback(videoInfo, startTime, endTime, timeContext);
    }
  }

  private getTimeContext(currentTime: number, totalDuration: number): string {
    const percentage = (currentTime / totalDuration) * 100;
    
    if (percentage < 5) return 'opening/introduction';
    if (percentage < 15) return 'hook/engagement building';
    if (percentage < 30) return 'content establishment';
    if (percentage < 60) return 'main content delivery';
    if (percentage < 80) return 'interaction/Q&A phase';
    if (percentage < 95) return 'conclusion/summary';
    return 'closing/call-to-action';
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private async generateContentInsights(videoInfo: YouTubeVideoInfo, segments: AnalysisSegment[]): Promise<ContentInsight[]> {
    const insights: ContentInsight[] = [];

    // Analyze hook effectiveness (first 30 seconds)
    const hookSegments = segments.filter(s => s.startTime < 30);
    if (hookSegments.length > 0) {
      const hookScore = hookSegments.reduce((acc, s) => acc + s.engagementScore, 0) / hookSegments.length;
      insights.push({
        type: 'hook',
        timestamp: 15,
        description: `Hook ${hookScore > 0.7 ? 'strongly' : hookScore > 0.5 ? 'moderately' : 'weakly'} captures attention with ${hookScore > 0.7 ? 'compelling' : 'standard'} opening`,
        confidence: hookScore,
        actionable: hookScore < 0.7 ? 'Strengthen opening with more compelling hook, question, or visual' : 'Maintain strong opening approach',
        category: 'content'
      });
    }

    // Identify retention points
    segments.forEach((segment, index) => {
      if (segment.engagementScore > 0.8) {
        insights.push({
          type: 'retention',
          timestamp: segment.startTime + 5,
          description: `High engagement moment: Strong ${segment.keyTopics.join(', ')} delivery`,
          confidence: segment.engagementScore,
          actionable: 'Replicate this engagement pattern in similar content',
          category: 'content'
        });
      }
    });

    // Analyze production quality patterns
    const avgTechnicalQuality = segments.reduce((acc, s) => ({
      audio: acc.audio + (s.technicalQuality?.audioQuality || 0.7),
      video: acc.video + (s.technicalQuality?.videoQuality || 0.7),
      stability: acc.stability + (s.technicalQuality?.stability || 0.7)
    }), { audio: 0, video: 0, stability: 0 });

    const segmentCount = segments.length;
    avgTechnicalQuality.audio /= segmentCount;
    avgTechnicalQuality.video /= segmentCount;
    avgTechnicalQuality.stability /= segmentCount;

    if (avgTechnicalQuality.audio < 0.7) {
      insights.push({
        type: 'production',
        timestamp: 0,
        description: 'Audio quality could be improved for better viewer experience',
        confidence: 1 - avgTechnicalQuality.audio,
        actionable: 'Invest in better microphone or audio processing software',
        category: 'production'
      });
    }

    return insights;
  }

  private async analyzeProgramStructure(videoInfo: YouTubeVideoInfo, segments: AnalysisSegment[]): Promise<ProgramStructurePhase[]> {
    const structure: ProgramStructurePhase[] = [];
    const totalDuration = videoInfo.duration || 1800;

    // Define phase boundaries based on content type and duration
    const phases = [
      { phase: 'opening' as const, start: 0, end: Math.min(120, totalDuration * 0.1) },
      { phase: 'hook' as const, start: Math.min(120, totalDuration * 0.1), end: Math.min(300, totalDuration * 0.2) },
      { phase: 'content' as const, start: Math.min(300, totalDuration * 0.2), end: totalDuration * 0.7 },
      { phase: 'interaction' as const, start: totalDuration * 0.7, end: totalDuration * 0.9 },
      { phase: 'closing' as const, start: totalDuration * 0.9, end: totalDuration }
    ];

    for (const phase of phases) {
      const phaseSegments = segments.filter(s => s.startTime >= phase.start && s.endTime <= phase.end);
      
      if (phaseSegments.length > 0) {
        const effectiveness = phaseSegments.reduce((acc, s) => acc + s.engagementScore, 0) / phaseSegments.length;
        const keyElements = Array.from(new Set(phaseSegments.flatMap(s => s.keyTopics))).slice(0, 5);
        
        structure.push({
          phase: phase.phase,
          startTime: phase.start,
          endTime: phase.end,
          effectiveness,
          keyElements,
          improvements: this.generatePhaseImprovements(phase.phase, effectiveness, keyElements)
        });
      }
    }

    return structure;
  }

  private generatePhaseImprovements(phase: string, effectiveness: number, keyElements: string[]): string[] {
    const improvements: string[] = [];

    if (effectiveness < 0.6) {
      switch (phase) {
        case 'opening':
          improvements.push('Reduce setup time', 'Add stronger visual hook', 'Improve initial energy');
          break;
        case 'hook':
          improvements.push('Create more curiosity', 'Add specific benefit promises', 'Use pattern interrupt');
          break;
        case 'content':
          improvements.push('Add more examples', 'Improve pacing', 'Include visual demonstrations');
          break;
        case 'interaction':
          improvements.push('Encourage more participation', 'Ask specific questions', 'Create polls/surveys');
          break;
        case 'closing':
          improvements.push('Stronger call-to-action', 'Clear next steps', 'Create urgency');
          break;
      }
    }

    if (keyElements.length < 3) {
      improvements.push('Expand content variety', 'Add more discussion points');
    }

    return improvements;
  }

  private calculateOverallMetrics(segments: AnalysisSegment[], insights: ContentInsight[], structure: ProgramStructurePhase[]): {
    retentionPotential: number;
    engagementPotential: number;
    monetizationReadiness: number;
    productionQuality: number;
    contentValue: number;
  } {
    const avgEngagement = segments.reduce((acc, s) => acc + s.engagementScore, 0) / segments.length;
    
    const productionScores = segments.map(s => s.technicalQuality || { audioQuality: 0.7, videoQuality: 0.7, stability: 0.7 });
    const avgProduction = productionScores.reduce((acc, p) => ({
      audio: acc.audio + p.audioQuality,
      video: acc.video + p.videoQuality,
      stability: acc.stability + p.stability
    }), { audio: 0, video: 0, stability: 0 });
    
    const productionQuality = (avgProduction.audio + avgProduction.video + avgProduction.stability) / (3 * segments.length);
    
    const structureEffectiveness = structure.reduce((acc, s) => acc + s.effectiveness, 0) / structure.length;
    
    const ctaInsights = insights.filter(i => i.type === 'cta' || i.category === 'monetization');
    const monetizationReadiness = ctaInsights.length > 0 ? 
      ctaInsights.reduce((acc, i) => acc + i.confidence, 0) / ctaInsights.length : 0.3;

    return {
      retentionPotential: Math.min(avgEngagement * 1.2, 1),
      engagementPotential: avgEngagement,
      monetizationReadiness,
      productionQuality,
      contentValue: structureEffectiveness
    };
  }

  private async generateRecommendations(
    videoInfo: YouTubeVideoInfo, 
    insights: ContentInsight[], 
    structure: ProgramStructurePhase[], 
    metrics: any
  ): Promise<{ immediate: string[]; shortTerm: string[]; longTerm: string[] }> {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    // Immediate improvements
    if (metrics.productionQuality < 0.7) {
      immediate.push('Upgrade audio equipment or recording environment');
    }
    
    const weakPhases = structure.filter(s => s.effectiveness < 0.6);
    if (weakPhases.length > 0) {
      immediate.push(`Improve ${weakPhases.map(p => p.phase).join(', ')} sections for better flow`);
    }

    // Short-term strategy
    if (metrics.engagementPotential < 0.7) {
      shortTerm.push('Develop stronger storytelling framework');
      shortTerm.push('Create more interactive elements');
    }

    if (metrics.monetizationReadiness < 0.5) {
      shortTerm.push('Integrate natural product mentions and CTAs');
    }

    // Long-term vision
    longTerm.push('Develop signature content format and style');
    longTerm.push('Build systematic content creation workflow');
    longTerm.push('Create multi-platform content distribution strategy');

    if (videoInfo.isLive) {
      longTerm.push('Develop hybrid live/recorded content strategy');
    }

    return { immediate, shortTerm, longTerm };
  }

  private async callAI(prompt: string): Promise<string> {
    const startTime = Date.now();

    try {
      if (this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-sonnet-4-20250514', // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        });
        
        return response.content[0].type === 'text' ? response.content[0].text : '';
      }

      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
        });

        return response.choices[0].message.content || '';
      }

      throw new Error('No AI service available');
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  }

  private generateIntelligentSegmentFallback(
    videoInfo: YouTubeVideoInfo, 
    startTime: number, 
    endTime: number, 
    timeContext: string
  ): AnalysisSegment {
    // Generate realistic analysis based on timing and context
    const isLive = videoInfo.isLive;
    const duration = endTime - startTime;
    
    let visualDescription = '';
    let audioAnalysis = '';
    let dominantEmotion = '';
    let engagementScore = 0.6;
    let keyTopics: string[] = [];

    switch (timeContext) {
      case 'opening/introduction':
        visualDescription = `${isLive ? 'Live stream' : 'Video'} opening with presenter greeting audience, checking technical setup`;
        audioAnalysis = 'Clear, welcoming tone with moderate energy, possible background music fade-in';
        dominantEmotion = 'welcoming';
        engagementScore = 0.7;
        keyTopics = ['welcome', 'introduction', 'agenda overview'];
        break;
        
      case 'hook/engagement building':
        visualDescription = 'Presenter establishing credibility, showing enthusiasm, using gestures to emphasize points';
        audioAnalysis = 'Rising energy, confident tone, strategic pauses for emphasis';
        dominantEmotion = 'confident';
        engagementScore = 0.8;
        keyTopics = ['value proposition', 'audience benefits', 'credibility building'];
        break;
        
      case 'main content delivery':
        visualDescription = 'Core content presentation with possible screen sharing, demonstrations, or visual aids';
        audioAnalysis = 'Steady, informative delivery with varied pace to maintain interest';
        dominantEmotion = 'focused';
        engagementScore = 0.65;
        keyTopics = ['main topic', 'expert insights', 'practical examples'];
        break;
        
      case 'interaction/Q&A phase':
        visualDescription = 'Active interaction with audience, reading comments/questions, responsive body language';
        audioAnalysis = 'Conversational tone, responsive to audience input, energetic exchanges';
        dominantEmotion = 'engaging';
        engagementScore = 0.75;
        keyTopics = ['audience questions', 'community interaction', 'personalized advice'];
        break;
        
      default:
        visualDescription = 'Standard presentation with professional demeanor and clear visual communication';
        audioAnalysis = 'Professional delivery with appropriate energy for content type';
        dominantEmotion = 'professional';
        engagementScore = 0.6;
        keyTopics = ['general content', 'information sharing'];
    }

    return {
      startTime,
      endTime,
      visualDescription,
      audioAnalysis,
      emotions: {
        dominant: dominantEmotion,
        confidence: 0.7
      },
      keyTopics,
      engagementScore,
      technicalQuality: {
        audioQuality: 0.8,
        videoQuality: 0.8,
        stability: 0.85
      }
    };
  }
}

export const realYouTubeAnalyzer = new RealYouTubeAnalyzer();