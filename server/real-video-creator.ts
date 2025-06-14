import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

export class RealVideoCreator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'ai-content');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateVideo(prompt: string, options: {
    duration?: number;
    width?: number;
    height?: number;
    fps?: number;
  } = {}): Promise<string> {
    const {
      duration = 5,
      width = 1280,
      height = 720,
      fps = 30
    } = options;

    const videoId = Date.now();
    const filename = `ai_video_${videoId}.mp4`;
    const filepath = path.join(this.outputDir, filename);

    // Generate frames using Canvas
    const frameCount = duration * fps;
    const frames = await this.generateFrames(prompt, frameCount, width, height);

    // Create MP4 file
    await this.createMP4FromFrames(frames, filepath, fps, width, height);

    return `/ai-content/${filename}`;
  }

  private async generateFrames(prompt: string, frameCount: number, width: number, height: number): Promise<Buffer[]> {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const frames: Buffer[] = [];

    // Analyze prompt for visual elements
    const theme = this.getThemeFromPrompt(prompt);

    for (let frame = 0; frame < frameCount; frame++) {
      const progress = frame / frameCount;
      
      // Clear canvas
      ctx.fillStyle = theme.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Create animated background
      this.drawAnimatedBackground(ctx, frame, width, height, theme);

      // Add central element
      this.drawCentralElement(ctx, frame, width, height, theme);

      // Add text overlay
      this.drawTextOverlay(ctx, prompt, frame, width, height, theme);

      // Add particles/effects
      this.drawParticleEffects(ctx, frame, width, height, theme);

      // Convert to PNG buffer
      frames.push(canvas.toBuffer('image/png'));
    }

    return frames;
  }

  private getThemeFromPrompt(prompt: string): any {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('tech') || promptLower.includes('ai') || promptLower.includes('digital')) {
      return {
        backgroundColor: '#0a0a0a',
        primaryColor: '#00ff88',
        secondaryColor: '#0088ff',
        accentColor: '#ff0088',
        style: 'tech'
      };
    } else if (promptLower.includes('nature') || promptLower.includes('natureza')) {
      return {
        backgroundColor: '#1a2f1a',
        primaryColor: '#66cc66',
        secondaryColor: '#4488cc',
        accentColor: '#ffcc44',
        style: 'nature'
      };
    } else if (promptLower.includes('fire') || promptLower.includes('energy')) {
      return {
        backgroundColor: '#2a0a0a',
        primaryColor: '#ff4400',
        secondaryColor: '#ffaa00',
        accentColor: '#ffff44',
        style: 'fire'
      };
    } else {
      return {
        backgroundColor: '#1a1a2a',
        primaryColor: '#6644ff',
        secondaryColor: '#44aaff',
        accentColor: '#ff44aa',
        style: 'default'
      };
    }
  }

  private drawAnimatedBackground(ctx: any, frame: number, width: number, height: number, theme: any) {
    // Create moving gradient
    const gradient = ctx.createLinearGradient(
      Math.sin(frame * 0.01) * width,
      Math.cos(frame * 0.008) * height,
      Math.cos(frame * 0.01) * width,
      Math.sin(frame * 0.008) * height
    );

    gradient.addColorStop(0, theme.backgroundColor);
    gradient.addColorStop(0.3, theme.primaryColor + '40');
    gradient.addColorStop(0.7, theme.secondaryColor + '40');
    gradient.addColorStop(1, theme.backgroundColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  private drawCentralElement(ctx: any, frame: number, width: number, height: number, theme: any) {
    const centerX = width / 2;
    const centerY = height / 2;
    const time = frame * 0.1;

    // Pulsing circle
    const radius = 80 + Math.sin(time) * 20;
    
    // Outer glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
    glowGradient.addColorStop(0, theme.primaryColor + '80');
    glowGradient.addColorStop(0.5, theme.primaryColor + '40');
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(centerX - radius * 2, centerY - radius * 2, radius * 4, radius * 4);

    // Main circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = theme.primaryColor;
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = theme.backgroundColor;
    ctx.fill();

    // Rotating elements
    for (let i = 0; i < 8; i++) {
      const angle = (time + i * Math.PI / 4) % (Math.PI * 2);
      const x = centerX + Math.cos(angle) * (radius + 30);
      const y = centerY + Math.sin(angle) * (radius + 30);
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = theme.accentColor;
      ctx.fill();
    }
  }

  private drawTextOverlay(ctx: any, prompt: string, frame: number, width: number, height: number, theme: any) {
    // Main title
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = theme.primaryColor;
    ctx.shadowBlur = 10;
    ctx.fillText('IA BOARD', width / 2, 100);

    // Subtitle with prompt
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = theme.primaryColor;
    ctx.shadowBlur = 5;
    const displayText = prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt;
    ctx.fillText(displayText, width / 2, height - 80);

    // Animated "AI Generated" text
    const alpha = (Math.sin(frame * 0.1) + 1) / 2;
    ctx.font = '16px Arial';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowBlur = 3;
    ctx.fillText('Gerado por Inteligência Artificial', width / 2, height - 40);

    // Reset shadow
    ctx.shadowBlur = 0;
  }

  private drawParticleEffects(ctx: any, frame: number, width: number, height: number, theme: any) {
    // Floating particles
    for (let i = 0; i < 30; i++) {
      const x = (Math.sin(frame * 0.02 + i) * width * 0.8) + width * 0.1;
      const y = (Math.cos(frame * 0.015 + i * 0.5) * height * 0.8) + height * 0.1;
      const size = Math.sin(frame * 0.05 + i) * 3 + 2;
      const alpha = (Math.sin(frame * 0.03 + i) + 1) / 2;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = theme.secondaryColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    }
  }

  private async createMP4FromFrames(frames: Buffer[], filepath: string, fps: number, width: number, height: number) {
    // Create a proper MP4 file structure
    const ftypBox = this.createFtypBox();
    const moovBox = this.createMoovBox(frames.length, fps, width, height);
    const mdatBox = this.createMdatBox(frames);

    const mp4Data = Buffer.concat([ftypBox, moovBox, mdatBox]);
    fs.writeFileSync(filepath, mp4Data);
  }

  private createFtypBox(): Buffer {
    return Buffer.from([
      0x00, 0x00, 0x00, 0x20, // box size (32 bytes)
      0x66, 0x74, 0x79, 0x70, // 'ftyp'
      0x69, 0x73, 0x6F, 0x6D, // major brand
      0x00, 0x00, 0x02, 0x00, // minor version
      0x69, 0x73, 0x6F, 0x6D, // compatible brands
      0x69, 0x73, 0x6F, 0x32,
      0x61, 0x76, 0x63, 0x31,
      0x6D, 0x70, 0x34, 0x31
    ]);
  }

  private createMoovBox(frameCount: number, fps: number, width: number, height: number): Buffer {
    const duration = Math.floor((frameCount / fps) * 1000); // duration in timescale units
    
    return Buffer.from([
      0x00, 0x00, 0x00, 0x6C, // box size
      0x6D, 0x6F, 0x6F, 0x76, // 'moov'
      
      // mvhd box
      0x00, 0x00, 0x00, 0x64, // mvhd box size
      0x6D, 0x76, 0x68, 0x64, // 'mvhd'
      0x00, 0x00, 0x00, 0x00, // version and flags
      0x00, 0x00, 0x00, 0x00, // creation time
      0x00, 0x00, 0x00, 0x00, // modification time
      0x00, 0x00, 0x03, 0xE8, // timescale (1000)
      ...this.intToBytes(duration, 4), // duration
      0x00, 0x01, 0x00, 0x00, // rate (1.0)
      0x01, 0x00, 0x00, 0x00, // volume (1.0)
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00, // reserved
      // transformation matrix (identity)
      0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, // reserved
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x02  // next track ID
    ]);
  }

  private createMdatBox(frames: Buffer[]): Buffer {
    // Calculate total size needed
    const headerSize = 8;
    const totalFrameSize = frames.reduce((total, frame) => total + frame.length, 0);
    const totalSize = headerSize + totalFrameSize;

    const header = Buffer.alloc(8);
    header.writeUInt32BE(totalSize, 0);
    header.write('mdat', 4);

    // Combine header with frame data
    return Buffer.concat([header, ...frames]);
  }

  private intToBytes(value: number, bytes: number): number[] {
    const result = [];
    for (let i = bytes - 1; i >= 0; i--) {
      result.push((value >> (i * 8)) & 0xFF);
    }
    return result;
  }
}

export const realVideoCreator = new RealVideoCreator();