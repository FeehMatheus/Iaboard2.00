import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { storage } from "./storage";
import OpenAI from "openai";
import { freeRealVideoAPIs } from "./free-real-video-apis";
import { tokenManager } from "./token-manager";
import { realAIServices } from "./real-ai-services";
import { freePublicAPIs } from "./free-public-apis";
import { ultimateAISystem } from "./ultimate-ai-system";
import { aiMultiProvider } from './ai-multi-provider';
import { stabilityVideoService } from './stability-video-service';
import { heyGenAvatarService } from './heygen-avatar-service';
import { googleTTSService } from './google-tts-service';
import { typeformService } from './typeform-service';
import { aiHealthCheck } from './ai-health-check';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Thumbnail generation endpoint - MOVED TO TOP FOR PRIORITY
  app.post('/api/pika/thumbnail', async (req, res) => {
    try {
      const { prompt, aspectRatio = '16:9', style = 'cinematic' } = req.body;

      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: 'Prompt é obrigatório para gerar thumbnail'
        });
      }

      console.log('🖼️ Generating thumbnail for:', prompt);

      // Generate thumbnail using the Ultimate AI System
      const result = await ultimateAISystem.generate({
        type: 'image',
        prompt: `Create a video thumbnail preview for: ${prompt}. Style: ${style}, Aspect ratio: ${aspectRatio}`,
        parameters: {
          width: aspectRatio === '16:9' ? 1280 : aspectRatio === '9:16' ? 720 : 1024,
          height: aspectRatio === '16:9' ? 720 : aspectRatio === '9:16' ? 1280 : 1024,
          style
        }
      });

      if (result.success && result.url) {
        res.json({
          success: true,
          thumbnailUrl: result.url,
          provider: result.provider || 'Ultimate AI Thumbnail Generator',
          metadata: result.metadata
        });
      } else {
        throw new Error(result.error || 'Falha na geração do thumbnail');
      }
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na geração do thumbnail'
      });
    }
  });

  // Serve AI-generated content with proper MIME types
  app.use('/ai-content', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'public', 'ai-content', req.path);
    
    if (req.path.endsWith('.mp4')) {
      res.set('Content-Type', 'video/mp4');
    } else if (req.path.endsWith('.svg')) {
      res.set('Content-Type', 'image/svg+xml');
    } else if (req.path.endsWith('.mp3')) {
      res.set('Content-Type', 'audio/mpeg');
    }
    
    next();
  });
  
  app.use('/ai-content', express.static(path.join(process.cwd(), 'public', 'ai-content')));

  // AI Module Execution
  app.post('/api/ai/module/execute', async (req, res) => {
    try {
      const { module, prompt } = req.body;
      
      if (!module || !prompt) {
        return res.status(400).json({ success: false, error: 'Module and prompt are required' });
      }

      console.log('🤖 Executing AI module:', { module, prompt });

      // Use ultimate AI system for execution
      const result = await ultimateAISystem.generate({
        type: 'text',
        prompt: `Como assistente de IA especializado em marketing digital: ${prompt}`,
        parameters: {
          maxTokens: 2000,
          temperature: 0.7
        }
      });

      if (result.success) {
        res.json({
          success: true,
          content: result.content,
          metadata: result.metadata
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Execution failed'
        });
      }
    } catch (error) {
      console.error('AI module execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Module execution failed'
      });
    }
  });

  // FREE AI Video Generation
  app.post('/api/pika/generate', async (req, res) => {
    try {
      const { prompt, aspectRatio = '16:9', style = 'cinematic', duration = 5 } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
      }

      console.log('🎬 Starting REAL AI video generation with public APIs:', { prompt, aspectRatio, style });

      const result = await ultimateAISystem.generate({
        type: 'video',
        prompt,
        parameters: {
          aspectRatio,
          style,
          duration
        }
      });

      if (result.success) {
        res.json({
          success: true,
          videoUrl: result.url,
          downloadUrl: result.url,
          provider: result.provider || 'Advanced AI Video Generator',
          metadata: result.metadata
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Falha na geração do vídeo AI'
        });
      }
    } catch (error) {
      console.error('AI video generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno na geração de vídeo AI'
      });
    }
  });



  // Video generation status check
  app.get('/api/pika/status/:taskId', async (req, res) => {
    res.json({
      success: true,
      status: 'completed',
      message: 'Free AI video generation uses direct processing'
    });
  });

  // Multi-Provider LLM API
  app.post('/api/llm/generate', async (req, res) => {
    try {
      const { prompt, model = 'gpt-4o', maxTokens = 500, temperature = 0.7 } = req.body;

      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
      }

      const result = await aiMultiProvider.generateLLM({
        prompt,
        model,
        maxTokens,
        temperature
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `LLM generation failed: ${error.message}`
      });
    }
  });

  // Stability AI Video Generation
  app.post('/api/stability/video', async (req, res) => {
    try {
      const { prompt, seed, aspectRatio = '16:9' } = req.body;

      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
      }

      const result = await stabilityVideoService.generateVideo({
        prompt,
        seed,
        aspectRatio
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Stability video generation failed: ${error.message}`
      });
    }
  });

  // HeyGen Avatar Generation
  app.post('/api/heygen/avatar', async (req, res) => {
    try {
      const { text, voice = 'pt-BR-FranciscaNeural', avatar = 'default' } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, error: 'Texto é obrigatório' });
      }

      const result = await heyGenAvatarService.generateAvatar({
        text,
        voice,
        avatar
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `HeyGen avatar generation failed: ${error.message}`
      });
    }
  });

  // Google Text-to-Speech
  app.post('/api/tts/synthesize', async (req, res) => {
    try {
      const { text, languageCode = 'pt-BR', voiceName = 'pt-BR-Wavenet-A', ssmlGender = 'FEMALE' } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, error: 'Texto é obrigatório' });
      }

      const result = await googleTTSService.synthesizeSpeech({
        text,
        languageCode,
        voiceName,
        ssmlGender
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `TTS synthesis failed: ${error.message}`
      });
    }
  });

  // Typeform Creation
  app.post('/api/typeform/create', async (req, res) => {
    try {
      const { title, fields } = req.body;

      if (!title || !fields || !Array.isArray(fields)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Título e campos são obrigatórios' 
        });
      }

      const result = await typeformService.createForm({
        title,
        fields
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Typeform creation failed: ${error.message}`
      });
    }
  });

  // Comprehensive Health Check
  app.get('/api/health', async (req, res) => {
    try {
      const result = await aiHealthCheck.runFullHealthCheck();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Health check failed: ${error.message}`
      });
    }
  });

  // Quick Health Check
  app.get('/api/health/quick', async (req, res) => {
    try {
      const result = await aiHealthCheck.quickCheck();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Quick health check failed: ${error.message}`
      });
    }
  });

  // AI Module Execution
  app.post('/api/ai/execute', async (req, res) => {
    try {
      const { prompt, module = 'ia-total', parameters = {} } = req.body;

      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
      }

      console.log('🤖 Executing AI module:', { module, prompt });

      // Use ultimate AI system for execution
      const result = await ultimateAISystem.generate({
        type: 'text',
        prompt: `Como assistente de IA especializado em marketing digital: ${prompt}`,
        parameters: {
          maxTokens: 2000,
          temperature: 0.7
        }
      });

      if (result.success) {
        res.json({
          success: true,
          result: result.content,
          metadata: {
            module,
            prompt,
            provider: result.provider || 'Advanced AI System',
            generated: true
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'AI execution failed'
        });
      }

    } catch (error) {
      console.error('AI execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na execução do módulo AI'
      });
    }
  });

  // Canvas data endpoints
  app.get('/api/canvas/nodes', async (req, res) => {
    res.json({ success: true, nodes: [] });
  });

  app.post('/api/canvas/nodes', async (req, res) => {
    const nodeData = req.body;
    res.json({ success: true, node: { id: Date.now(), ...nodeData } });
  });

  app.put('/api/canvas/nodes/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    res.json({ success: true, node: { id: parseInt(id), ...updates } });
  });

  app.delete('/api/canvas/nodes/:id', async (req, res) => {
    res.json({ success: true });
  });

  // Token status endpoint
  app.get('/api/tokens/status', (req, res) => {
    try {
      const status = tokenManager.getAllServiceStatus();
      res.json({
        success: true,
        services: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Token status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get token status'
      });
    }
  });

  // Universal AI generation endpoint for all modules
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { type, prompt, parameters } = req.body;

      if (!type || !prompt) {
        return res.status(400).json({
          success: false,
          error: 'Type and prompt are required'
        });
      }

      console.log(`🤖 Generating ${type} content with real AI services:`, prompt);

      const result = await ultimateAISystem.generate({
        type,
        prompt,
        parameters
      });

      if (result.success) {
        res.json({
          success: true,
          content: result.content,
          url: result.url,
          provider: result.provider,
          metadata: result.metadata
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'AI generation failed'
        });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI content'
      });
    }
  });

  // Enhanced IA Copy module with real AI
  app.post('/api/ia-copy/generate', async (req, res) => {
    try {
      const { prompt, copyType, parameters } = req.body;

      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: 'Prompt is required'
        });
      }

      console.log('✍️ Generating copy with real AI services:', prompt);

      const copyPrompt = `Create ${copyType || 'professional'} copy for: ${prompt}. Make it compelling, persuasive, and action-oriented.`;

      const result = await ultimateAISystem.generate({
        type: 'text',
        prompt: copyPrompt,
        parameters: {
          ...parameters,
          temperature: 0.8,
          maxTokens: 1500
        }
      });

      if (result.success) {
        res.json({
          success: true,
          copy: result.content,
          provider: result.provider,
          metadata: {
            ...result.metadata,
            copyType: copyType || 'professional',
            module: 'IA Copy'
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Copy generation failed'
        });
      }
    } catch (error) {
      console.error('IA Copy generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate copy'
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      success: true, 
      message: 'IA Board API is running',
      timestamp: new Date().toISOString()
    });
  });

  return httpServer;
}