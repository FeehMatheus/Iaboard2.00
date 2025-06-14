import fs from 'fs/promises';
import path from 'path';

interface ThumbnailRequest {
  prompt: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: string;
}

interface ThumbnailResponse {
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
}

export class CSSBasedThumbnailGenerator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'thumbnails');
    this.initializeOutputDirectory();
  }

  private async initializeOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create thumbnail directory:', error);
    }
  }

  async generateThumbnail(request: ThumbnailRequest): Promise<ThumbnailResponse> {
    try {
      const thumbnailId = `thumb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `${thumbnailId}.svg`;
      const filePath = path.join(this.outputDir, fileName);
      
      await this.createSVGThumbnail(request, filePath);
      
      const thumbnailUrl = `/thumbnails/${fileName}`;
      
      return {
        success: true,
        thumbnailUrl
      };
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Thumbnail generation failed'
      };
    }
  }

  private async createSVGThumbnail(request: ThumbnailRequest, outputPath: string): Promise<void> {
    const { aspectRatio = '16:9', prompt, style = 'default' } = request;
    
    const dimensions = this.getDimensions(aspectRatio);
    const colors = this.getStyleColors(style);
    const truncatedPrompt = prompt.substring(0, 50);
    
    const svgContent = `
      <svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#bg)" />
        
        <!-- Decorative elements -->
        <rect x="20" y="20" width="${dimensions.width - 40}" height="4" fill="${colors.accent}" opacity="0.7" />
        <rect x="20" y="${dimensions.height - 24}" width="${dimensions.width - 40}" height="4" fill="${colors.accent}" opacity="0.7" />
        
        <!-- Corner accents -->
        <rect x="20" y="20" width="30" height="30" fill="${colors.accent}" opacity="0.5" />
        <rect x="${dimensions.width - 50}" y="${dimensions.height - 50}" width="30" height="30" fill="${colors.accent}" opacity="0.5" />
        
        <!-- Preview label -->
        <rect x="20" y="30" width="80" height="25" fill="${colors.accent}" opacity="0.8" rx="4" />
        <text x="60" y="46" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
          PREVIEW
        </text>
        
        <!-- Style label -->
        <rect x="${dimensions.width - 100}" y="30" width="80" height="20" fill="black" opacity="0.7" rx="4" />
        <text x="${dimensions.width - 60}" y="43" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">
          ${style.toUpperCase()}
        </text>
        
        <!-- Main text -->
        <rect x="${dimensions.width * 0.1}" y="${dimensions.height * 0.4}" width="${dimensions.width * 0.8}" height="${dimensions.height * 0.2}" fill="black" opacity="0.8" rx="8" />
        <text x="${dimensions.width / 2}" y="${dimensions.height / 2}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.floor(dimensions.width / 25)}" font-weight="bold">
          ${this.wrapText(truncatedPrompt, 20)}
        </text>
      </svg>
    `;

    await fs.writeFile(outputPath, svgContent.trim());
  }

  private getDimensions(aspectRatio: string) {
    switch (aspectRatio) {
      case '16:9':
        return { width: 640, height: 360 };
      case '9:16':
        return { width: 360, height: 640 };
      case '1:1':
        return { width: 480, height: 480 };
      default:
        return { width: 640, height: 360 };
    }
  }

  private getStyleColors(style: string) {
    const styleMap: Record<string, { primary: string; secondary: string; accent: string }> = {
      'cinematic': { primary: '#1a1a2e', secondary: '#16213e', accent: '#ffd700' },
      'anime': { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#ff9ff3' },
      'realistic': { primary: '#2c3e50', secondary: '#34495e', accent: '#3498db' },
      'cartoon': { primary: '#f39c12', secondary: '#e74c3c', accent: '#2ecc71' },
      'abstract': { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
      'default': { primary: '#4a90e2', secondary: '#7b68ee', accent: '#50c878' }
    };
    
    return styleMap[style] || styleMap['default'];
  }

  private wrapText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}

export const cssBasedThumbnailGenerator = new CSSBasedThumbnailGenerator();