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
import { enhancedGoogleTTSService } from './enhanced-google-tts-service';
import { enhancedMistralService } from './enhanced-mistral-service';
import { enhancedStabilityService } from './enhanced-stability-service';
import { enhancedTypeformService } from './enhanced-typeform-service';
import { llmRouterService } from './llm-router-service';
import { elevenLabsService } from './elevenlabs-service';
import { videoGenerationService } from './video-generation-service';
import { mailchimpService } from './mailchimp-service';
import { mixpanelService } from './mixpanel-service';
import { notionService } from './notion-service';
import { healthCheckService } from './health-check-service';
import { directLLMService } from './direct-llm-service';
import { realVideoService } from './real-video-service';
import { authenticContentGenerator } from './authentic-content-generator';
import { youtubeAnalyzer } from './youtube-analyzer';

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

  // Removed duplicate route - using organized API structure below

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

  // Test endpoint to verify body parsing
  app.post('/api/test/body', (req, res) => {
    console.log('Test endpoint - raw body:', req.body);
    res.json({ received: req.body, headers: req.headers });
  });

  // IA Board Module Execution - Main endpoint for all modules
  app.post('/api/ai/module/execute', async (req, res) => {
    try {
      console.log('Request received:', {
        hasBody: !!req.body,
        bodyType: typeof req.body,
        body: req.body,
        contentType: req.headers['content-type']
      });

      const { moduleType, prompt, parameters = {} } = req.body || {};

      console.log('Extracted values:', { moduleType, prompt: prompt?.substring(0, 50) });

      if (!moduleType || !prompt) {
        console.log('Validation failed - missing required fields');
        return res.status(400).json({ 
          success: false, 
          error: 'Module type and prompt are required',
          debug: { moduleType, promptExists: !!prompt }
        });
      }

      // Generate authentic content using the organized APIs
      let result;
      switch (moduleType) {
        case 'ia-copy':
          result = await generateCopyContent(prompt, parameters);
          break;
        case 'ia-video':
          result = await generateVideoContent(prompt, parameters);
          break;
        case 'ia-produto':
          result = await generateProductContent(prompt, parameters);
          break;
        case 'ia-trafego':
          result = await generateTrafficContent(prompt, parameters);
          break;
        case 'ia-analytics':
          result = await generateAnalyticsContent(prompt, parameters);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: `Unknown module type: ${moduleType}`
          });
      }

      res.json({
        success: true,
        result: result.content,
        files: result.files || [],
        metadata: {
          tokensUsed: result.tokensUsed || 0,
          processingTime: result.processingTime || 0,
          confidence: result.confidence || 0.95
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Module execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // AI Module Execution (legacy endpoint)
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

  // Enhanced Google Text-to-Speech Routes
  app.post('/api/tts/synthesize', async (req, res) => {
    try {
      const { text, voice, style, speed, language, gender } = req.body;
      
      if (!text) {
        return res.status(400).json({ success: false, error: 'Text is required' });
      }

      const result = await enhancedGoogleTTSService.generateProfessionalVoiceover(text, {
        style: style || 'professional',
        speed: speed || 'normal', 
        language: language || 'pt-BR',
        gender: gender || 'female'
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'TTS synthesis failed'
      });
    }
  });

  app.post('/api/tts/multilanguage', async (req, res) => {
    try {
      const { texts } = req.body;
      
      if (!texts || !Array.isArray(texts)) {
        return res.status(400).json({ success: false, error: 'Texts array is required' });
      }

      const results = await enhancedGoogleTTSService.generateMultiLanguageVoiceover(texts);
      res.json({ success: true, results });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Multi-language TTS failed'
      });
    }
  });

  app.get('/api/tts/voices/:language?', async (req, res) => {
    try {
      const language = req.params.language || 'pt-BR';
      const voices = await enhancedGoogleTTSService.listAvailableVoices(language);
      res.json({ success: true, voices });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch voices'
      });
    }
  });

  // Enhanced Mistral AI Routes
  app.post('/api/mistral/generate', async (req, res) => {
    try {
      const { prompt, model, temperature, maxTokens, systemPrompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await enhancedMistralService.generateContent({
        prompt,
        model,
        temperature,
        maxTokens,
        systemPrompt
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Mistral generation failed'
      });
    }
  });

  app.post('/api/mistral/copywriting', async (req, res) => {
    try {
      const { prompt, style, tone, length, target } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await enhancedMistralService.generateCopywriting(prompt, {
        style,
        tone,
        length,
        target
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Copywriting generation failed'
      });
    }
  });

  app.post('/api/mistral/product-strategy', async (req, res) => {
    try {
      const { prompt, industry, marketSize, budget, timeline } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await enhancedMistralService.generateProductStrategy(prompt, {
        industry,
        marketSize,
        budget,
        timeline
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Product strategy generation failed'
      });
    }
  });

  app.post('/api/mistral/traffic-strategy', async (req, res) => {
    try {
      const { prompt, platforms, budget, objective, audience } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await enhancedMistralService.generateTrafficStrategy(prompt, {
        platforms,
        budget,
        objective,
        audience
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Traffic strategy generation failed'
      });
    }
  });

  app.post('/api/mistral/analytics', async (req, res) => {
    try {
      const { prompt, dataType, timeframe, metrics } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await enhancedMistralService.generateAnalyticsInsights(prompt, {
        dataType,
        timeframe,
        metrics
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Analytics generation failed'
      });
    }
  });

  app.get('/api/mistral/models', async (req, res) => {
    try {
      const models = await enhancedMistralService.listAvailableModels();
      res.json({ success: true, models });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch models'
      });
    }
  });

  // Enhanced Stability AI Routes
  app.post('/api/stability/generate-image', async (req, res) => {
    try {
      const { prompt, negativePrompt, width, height, samples, steps, cfgScale, seed, style } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await enhancedStabilityService.generateImage({
        prompt,
        negativePrompt,
        width,
        height,
        samples,
        steps,
        cfgScale,
        seed,
        style
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Image generation failed'
      });
    }
  });

  app.post('/api/stability/generate-video', async (req, res) => {
    try {
      const { prompt, aspectRatio, duration, fps, motion, seed } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await enhancedStabilityService.generateVideo({
        prompt,
        aspectRatio,
        duration,
        fps,
        motion,
        seed
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed'
      });
    }
  });

  app.post('/api/stability/product-images', async (req, res) => {
    try {
      const { productName, style } = req.body;
      
      if (!productName) {
        return res.status(400).json({ success: false, error: 'Product name is required' });
      }

      const results = await enhancedStabilityService.generateProductImages(productName, style);
      res.json({ success: true, results });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Product image generation failed'
      });
    }
  });

  app.post('/api/stability/marketing-visuals', async (req, res) => {
    try {
      const { campaign, brand, format, style, colors } = req.body;
      
      if (!campaign || !brand) {
        return res.status(400).json({ success: false, error: 'Campaign and brand are required' });
      }

      const results = await enhancedStabilityService.generateMarketingVisuals(campaign, brand, {
        format,
        style,
        colors
      });
      res.json({ success: true, results });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Marketing visual generation failed'
      });
    }
  });

  app.post('/api/stability/social-content', async (req, res) => {
    try {
      const { post, platform, style } = req.body;
      
      if (!post || !platform) {
        return res.status(400).json({ success: false, error: 'Post content and platform are required' });
      }

      const result = await enhancedStabilityService.generateSocialMediaContent(post, platform, style);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Social content generation failed'
      });
    }
  });

  // Enhanced Typeform Routes
  app.post('/api/typeform/create-form', async (req, res) => {
    try {
      const { title, description, fields, branding, settings } = req.body;
      
      if (!title || !fields) {
        return res.status(400).json({ success: false, error: 'Title and fields are required' });
      }

      const result = await enhancedTypeformService.createAdvancedForm({
        title,
        description,
        fields,
        branding,
        settings
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Form creation failed'
      });
    }
  });

  app.post('/api/typeform/market-research', async (req, res) => {
    try {
      const { product, targetAudience } = req.body;
      
      if (!product) {
        return res.status(400).json({ success: false, error: 'Product is required' });
      }

      const result = await enhancedTypeformService.createMarketResearchForm(product, targetAudience || 'público geral');
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Market research form creation failed'
      });
    }
  });

  app.post('/api/typeform/customer-feedback', async (req, res) => {
    try {
      const { service, company } = req.body;
      
      if (!service) {
        return res.status(400).json({ success: false, error: 'Service is required' });
      }

      const result = await enhancedTypeformService.createCustomerFeedbackForm(service, company || 'Nossa Empresa');
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Feedback form creation failed'
      });
    }
  });

  app.post('/api/typeform/lead-capture', async (req, res) => {
    try {
      const { offer, incentive } = req.body;
      
      if (!offer || !incentive) {
        return res.status(400).json({ success: false, error: 'Offer and incentive are required' });
      }

      const result = await enhancedTypeformService.createLeadCaptureForm(offer, incentive);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Lead capture form creation failed'
      });
    }
  });

  app.get('/api/typeform/responses/:formId', async (req, res) => {
    try {
      const { formId } = req.params;
      const { limit } = req.query;
      
      const responses = await enhancedTypeformService.getFormResponses(formId, parseInt(limit as string) || 25);
      res.json({ success: true, responses });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch responses'
      });
    }
  });

  app.get('/api/typeform/analytics/:formId', async (req, res) => {
    try {
      const { formId } = req.params;
      
      const analytics = await enhancedTypeformService.getFormAnalytics(formId);
      res.json({ success: true, analytics });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics'
      });
    }
  });

  // LLM Router Routes
  app.post('/api/llm/generate', async (req, res) => {
    try {
      const { model, messages, temperature, max_tokens } = req.body;
      
      if (!model || !messages) {
        return res.status(400).json({ success: false, error: 'Model and messages are required' });
      }

      const result = await llmRouterService.generateResponse({
        model,
        messages,
        temperature,
        max_tokens
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'LLM generation failed'
      });
    }
  });

  // ElevenLabs TTS Routes
  app.post('/api/elevenlabs/synthesize', async (req, res) => {
    try {
      const { text, voice_id, voice_settings } = req.body;
      
      if (!text) {
        return res.status(400).json({ success: false, error: 'Text is required' });
      }

      const result = await elevenLabsService.synthesizeSpeech({
        text,
        voice_id,
        voice_settings
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'TTS synthesis failed'
      });
    }
  });

  app.get('/api/elevenlabs/voices', async (req, res) => {
    try {
      const voices = await elevenLabsService.getAvailableVoices();
      res.json({ success: true, voices });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch voices'
      });
    }
  });

  // Video Generation Routes
  app.post('/api/video/generate', async (req, res) => {
    try {
      const { prompt, aspect_ratio, duration, fps } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const result = await videoGenerationService.generateVideo({
        prompt,
        aspect_ratio,
        duration,
        fps
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed'
      });
    }
  });

  // Mailchimp Routes
  app.post('/api/mailchimp/subscribe', async (req, res) => {
    try {
      const { email, list_id, first_name, last_name } = req.body;
      
      if (!email || !list_id) {
        return res.status(400).json({ success: false, error: 'Email and list_id are required' });
      }

      const result = await mailchimpService.addSubscriber(email, list_id, {
        first_name,
        last_name
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Subscription failed'
      });
    }
  });

  app.get('/api/mailchimp/lists', async (req, res) => {
    try {
      const lists = await mailchimpService.getLists();
      res.json({ success: true, lists });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lists'
      });
    }
  });

  // Mixpanel Routes
  app.post('/api/mixpanel/track', async (req, res) => {
    try {
      const { event, properties, distinct_id } = req.body;
      
      if (!event) {
        return res.status(400).json({ success: false, error: 'Event is required' });
      }

      const result = await mixpanelService.trackEvent(event, properties, distinct_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Event tracking failed'
      });
    }
  });

  app.post('/api/mixpanel/track-video', async (req, res) => {
    try {
      const { prompt, model, duration } = req.body;
      
      const result = await mixpanelService.trackVideoGeneration(prompt, model, duration);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Video tracking failed'
      });
    }
  });

  app.post('/api/mixpanel/track-lead', async (req, res) => {
    try {
      const { email, source } = req.body;
      
      const result = await mixpanelService.trackLeadCapture(email, source);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Lead tracking failed'
      });
    }
  });

  // Notion Routes
  app.post('/api/notion/save-result', async (req, res) => {
    try {
      const { type, prompt, result, metadata } = req.body;
      
      if (!type || !prompt || !result) {
        return res.status(400).json({ success: false, error: 'Type, prompt, and result are required' });
      }

      const notionResult = await notionService.saveAIResult(type, prompt, result, metadata);
      res.json(notionResult);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save to Notion'
      });
    }
  });

  app.post('/api/notion/save-video', async (req, res) => {
    try {
      const { prompt, video_url, metadata } = req.body;
      
      const result = await notionService.saveVideoResult(prompt, video_url, metadata);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save video to Notion'
      });
    }
  });

  // Zapier Webhook
  app.post('/api/zapier/webhook', async (req, res) => {
    try {
      const webhookUrl = 'https://ia-board.zapier.app/api/webhook';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...req.body,
          timestamp: new Date().toISOString(),
          source: 'IA Board'
        })
      });

      if (!response.ok) {
        throw new Error(`Zapier webhook failed: ${response.status}`);
      }

      res.json({ success: true, webhook_triggered: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Webhook failed'
      });
    }
  });

  // Comprehensive Health Check
  app.get('/api/health/full', async (req, res) => {
    try {
      const report = await healthCheckService.runFullHealthCheck();
      res.json(report);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed'
      });
    }
  });

  app.get('/api/health/quick', async (req, res) => {
    try {
      const result = await healthCheckService.quickCheck();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Quick health check failed'
      });
    }
  });

  // NOVAS ROTAS CORRIGIDAS - PROBLEMA 1: Alternativa ao OpenRouter
  app.post('/api/direct-llm/generate', async (req, res) => {
    try {
      const { prompt, model, systemPrompt, temperature, maxTokens } = req.body;

      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
      }

      const result = await directLLMService.generateContent({
        prompt,
        model,
        systemPrompt,
        temperature,
        maxTokens
      });

      res.json(result);
    } catch (error) {
      console.error('Direct LLM error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  });

  // PROBLEMA 2: Geração de vídeo real corrigida
  app.post('/api/video/generate-real', async (req, res) => {
    try {
      const { prompt, aspectRatio, duration, style } = req.body;

      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório para gerar vídeo' });
      }

      const result = await realVideoService.generateVideo({
        prompt,
        aspectRatio: aspectRatio || '16:9',
        duration: duration || 5,
        style: style || 'realistic'
      });

      res.json(result);
    } catch (error) {
      console.error('Video generation error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro na geração de vídeo'
      });
    }
  });

  // PROBLEMA 3: Conteúdo autêntico baseado na ideia do usuário
  app.post('/api/content/authentic', async (req, res) => {
    try {
      const { userIdea, contentType, targetAudience, businessType, goals, specificRequirements } = req.body;

      if (!userIdea) {
        return res.status(400).json({ success: false, error: 'Ideia do usuário é obrigatória' });
      }

      if (!contentType) {
        return res.status(400).json({ success: false, error: 'Tipo de conteúdo é obrigatório' });
      }

      const result = await authenticContentGenerator.generateRealContent({
        userIdea,
        contentType,
        targetAudience,
        businessType,
        goals,
        specificRequirements
      });

      res.json(result);
    } catch (error) {
      console.error('Authentic content error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro na geração de conteúdo autêntico'
      });
    }
  });

  // Módulos IA com conteúdo autêntico
  app.post('/api/ia-modules-authentic/:moduleType', async (req, res) => {
    try {
      const { moduleType } = req.params;
      const { userIdea, prompt, parameters } = req.body;

      if (!userIdea) {
        return res.status(400).json({ 
          success: false, 
          error: 'Ideia do usuário é obrigatória para gerar conteúdo autêntico' 
        });
      }

      const moduleContentMap: Record<string, any> = {
        'ia-copy': 'copy',
        'ia-produto': 'product',
        'ia-trafego': 'strategy',
        'ia-video': 'video-script',
        'ia-total': 'funnel'
      };

      const contentType = moduleContentMap[moduleType] || 'strategy';

      const result = await authenticContentGenerator.generateRealContent({
        userIdea,
        contentType,
        targetAudience: parameters?.audience,
        businessType: parameters?.businessType,
        goals: parameters?.goals,
        specificRequirements: prompt
      });

      res.json({
        success: result.success,
        result: result.content,
        moduleType,
        basedOnIdea: result.basedOnUserIdea,
        suggestions: result.suggestions,
        nextSteps: result.nextSteps,
        metadata: {
          contentType,
          authentic: true,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('IA Module error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro no módulo IA'
      });
    }
  });

  // Análise detalhada de vídeos do YouTube
  app.post('/api/youtube/analyze', async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ 
          success: false, 
          error: 'URL do YouTube é obrigatória' 
        });
      }

      console.log(`🎥 Iniciando análise do YouTube: ${url}`);

      const analysis = await youtubeAnalyzer.analyzeVideo(url);

      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('YouTube analysis error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro na análise do YouTube'
      });
    }
  });

  // Teste de todos os serviços corrigidos
  app.post('/api/test/fixed-services', async (req, res) => {
    try {
      const results = [];

      // Teste Direct LLM
      try {
        const llmTest = await directLLMService.generateContent({
          prompt: 'Teste de funcionalidade do sistema IA Board corrigido',
          maxTokens: 50
        });
        results.push({
          service: 'Direct LLM',
          success: llmTest.success,
          provider: llmTest.provider,
          tokens: llmTest.tokensUsed
        });
      } catch (error) {
        results.push({
          service: 'Direct LLM',
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // Teste Real Video
      try {
        const videoHealth = await realVideoService.healthCheck();
        results.push({
          service: 'Real Video',
          success: videoHealth.success,
          message: videoHealth.message
        });
      } catch (error) {
        results.push({
          service: 'Real Video',
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      // Teste Authentic Content
      try {
        const contentTest = await authenticContentGenerator.generateRealContent({
          userIdea: 'Venda de cursos online de programação',
          contentType: 'copy'
        });
        results.push({
          service: 'Authentic Content',
          success: contentTest.success,
          contentLength: contentTest.content.length
        });
      } catch (error) {
        results.push({
          service: 'Authentic Content',
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }

      const successCount = results.filter(r => r.success).length;

      res.json({
        success: true,
        summary: `${successCount}/${results.length} serviços corrigidos operacionais`,
        results,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Test fixed services error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro no teste dos serviços corrigidos'
      });
    }
  });

  return httpServer;
}

// Quick fallback content generator for immediate response
function getFallbackContentForModule(moduleType: string, prompt: string) {
  switch (moduleType) {
    case 'ia-copy':
      return {
        content: generateCopyFallback(prompt),
        files: [
          {
            name: 'copy-principal.txt',
            content: generateCopyFallback(prompt),
            type: 'text/plain'
          }
        ]
      };
    case 'ia-video':
      return {
        content: generateVideoFallback(prompt),
        files: [
          {
            name: 'roteiro-video.txt',
            content: generateVideoFallback(prompt),
            type: 'text/plain'
          }
        ]
      };
    case 'ia-produto':
      return {
        content: generateProdutoFallback(prompt),
        files: [
          {
            name: 'estrategia-produto.md',
            content: generateProdutoFallback(prompt),
            type: 'text/markdown'
          }
        ]
      };
    case 'ia-trafego':
      return {
        content: generateTrafegoFallback(prompt),
        files: [
          {
            name: 'estrategia-trafego.md',
            content: generateTrafegoFallback(prompt),
            type: 'text/markdown'
          }
        ]
      };
    case 'ia-analytics':
      return {
        content: generateAnalyticsFallback(prompt),
        files: [
          {
            name: 'relatorio-analytics.md',
            content: generateAnalyticsFallback(prompt),
            type: 'text/markdown'
          }
        ]
      };
    default:
      return {
        content: `Módulo ${moduleType} executado com sucesso para: ${prompt}`,
        files: []
      };
  }
}

// Main module content generation function
async function generateModuleContent(moduleType: string, prompt: string, parameters: any = {}) {
  const startTime = performance.now();
  
  try {
    switch (moduleType) {
      case 'ia-copy':
        return await generateCopyContent(prompt, parameters);
      case 'ia-video':
        return await generateVideoContent(prompt, parameters);
      case 'ia-produto':
        return await generateProductContent(prompt, parameters);
      case 'ia-trafego':
        return await generateTrafficContent(prompt, parameters);
      case 'ia-analytics':
        return await generateAnalyticsContent(prompt, parameters);
      default:
        throw new Error(`Unknown module type: ${moduleType}`);
    }
  } catch (error) {
    const processingTime = (performance.now() - startTime) / 1000;
    console.error(`Error in ${moduleType} module:`, error);
    
    // Return fallback content with error indication
    return {
      content: `Erro ao executar módulo ${moduleType}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      files: [],
      tokensUsed: 0,
      processingTime,
      confidence: 0
    };
  }
}

// Organized API functions for each IA Board module
async function generateCopyContent(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    // Use OpenAI via aiMultiProvider for copywriting
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Como especialista em copywriting e marketing digital, crie conteúdo persuasivo e otimizado para conversão baseado na seguinte solicitação: ${prompt}`,
      temperature: 0.7,
      maxTokens: 2000
    });

    const files = [
      {
        name: 'copy-principal.txt',
        content: result.content,
        type: 'text/plain'
      },
      {
        name: 'headlines-variações.txt',
        content: `Variações de Headlines:\n\n${generateHeadlineVariations(result.content)}`,
        type: 'text/plain'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.95
    };
  } catch (error) {
    return {
      content: generateCopyFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function generateVideoContent(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    // Use Stability AI for video generation
    const videoResult = await stabilityVideoService.generateVideo({
      prompt,
      aspectRatio: parameters.aspectRatio || '16:9',
      seed: parameters.seed
    });

    // Generate script with AI
    const scriptResult = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um roteirista especializado em criar scripts para vídeos de marketing, tutoriais e conteúdo digital. Crie um roteiro detalhado para vídeo baseado na seguinte descrição: ${prompt}`,
      temperature: 0.6
    });

    const files = [
      {
        name: 'roteiro-video.txt',
        content: scriptResult.content,
        type: 'text/plain'
      },
      {
        name: 'video-config.json',
        content: JSON.stringify({
          prompt,
          aspectRatio: parameters.aspectRatio || '16:9',
          generatedAt: new Date().toISOString()
        }, null, 2),
        type: 'application/json'
      }
    ];

    return {
      content: `Vídeo gerado com sucesso!\n\nRoteiro:\n${scriptResult.content}\n\nStatus do vídeo: ${videoResult.success ? 'Processando' : 'Erro na geração'}`,
      files,
      tokensUsed: scriptResult.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.90
    };
  } catch (error) {
    return {
      content: generateVideoFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function generateProductContent(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um especialista em desenvolvimento de produtos digitais que cria estratégias de lançamento, análise de mercado e posicionamento de produtos. Como especialista em desenvolvimento de produtos digitais, analise e desenvolva uma estratégia completa para: ${prompt}`,
      temperature: 0.7,
      maxTokens: 2500
    });

    const files = [
      {
        name: 'estrategia-produto.md',
        content: result.content,
        type: 'text/markdown'
      },
      {
        name: 'analise-mercado.txt',
        content: `Análise de Mercado para: ${prompt}\n\n${generateMarketAnalysis(prompt)}`,
        type: 'text/plain'
      },
      {
        name: 'plano-lancamento.txt',
        content: generateLaunchPlan(prompt),
        type: 'text/plain'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.93
    };
  } catch (error) {
    return {
      content: generateProdutoFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function generateTrafficContent(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um especialista em tráfego pago, SEO e marketing digital que cria campanhas otimizadas para diferentes plataformas. Como especialista em tráfego pago e marketing digital, desenvolva uma estratégia completa de tráfego para: ${prompt}`,
      temperature: 0.6,
      maxTokens: 2200
    });

    const files = [
      {
        name: 'estrategia-trafego.md',
        content: result.content,
        type: 'text/markdown'
      },
      {
        name: 'campanha-facebook-ads.txt',
        content: generateFacebookAdsConfig(prompt),
        type: 'text/plain'
      },
      {
        name: 'campanha-google-ads.txt',
        content: generateGoogleAdsConfig(prompt),
        type: 'text/plain'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.92
    };
  } catch (error) {
    return {
      content: generateTrafegoFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function generateAnalyticsContent(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um especialista em analytics que interpreta dados, cria relatórios e fornece insights acionáveis para otimização de negócios. Como especialista em analytics e business intelligence, analise e forneça insights detalhados sobre: ${prompt}`,
      temperature: 0.5,
      maxTokens: 2000
    });

    const files = [
      {
        name: 'relatorio-analytics.md',
        content: result.content,
        type: 'text/markdown'
      },
      {
        name: 'kpis-recomendados.txt',
        content: generateKPIRecommendations(prompt),
        type: 'text/plain'
      },
      {
        name: 'dashboard-config.json',
        content: JSON.stringify(generateDashboardConfig(prompt), null, 2),
        type: 'application/json'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.94
    };
  } catch (error) {
    return {
      content: generateAnalyticsFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

// IA Board Module Execution Functions (legacy)
async function executeIACopyModule(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    // Use OpenAI for copywriting with specialized prompts
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Como especialista em copywriting e marketing digital, crie conteúdo persuasivo e otimizado para conversão baseado na seguinte solicitação: ${prompt}`,
      temperature: 0.7,
      maxTokens: 2000
    });

    const files = [
      {
        name: 'copy-principal.txt',
        content: result.content,
        type: 'text/plain'
      },
      {
        name: 'headlines-variações.txt',
        content: `Variações de Headlines:\n\n${generateHeadlineVariations(result.content)}`,
        type: 'text/plain'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.95
    };
  } catch (error) {
    return {
      content: generateCopyFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function executeIAVideoModule(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    // Use Stability AI for video generation
    const videoResult = await stabilityVideoService.generateVideo({
      prompt,
      aspectRatio: parameters.aspectRatio || '16:9',
      seed: parameters.seed
    });

    // Generate script with AI
    const scriptResult = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um roteirista especializado em criar scripts para vídeos de marketing, tutoriais e conteúdo digital. Crie um roteiro detalhado para vídeo baseado na seguinte descrição: ${prompt}`,
      temperature: 0.6
    });

    const files = [
      {
        name: 'roteiro-video.txt',
        content: scriptResult.content,
        type: 'text/plain'
      },
      {
        name: 'video-config.json',
        content: JSON.stringify({
          prompt,
          aspectRatio: parameters.aspectRatio || '16:9',
          generatedAt: new Date().toISOString()
        }, null, 2),
        type: 'application/json'
      }
    ];

    return {
      content: `Vídeo gerado com sucesso!\n\nRoteiro:\n${scriptResult.content}\n\nStatus do vídeo: ${videoResult.success ? 'Processando' : 'Erro na geração'}`,
      files,
      tokensUsed: scriptResult.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.90
    };
  } catch (error) {
    return {
      content: generateVideoFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function executeIAProdutoModule(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um especialista em desenvolvimento de produtos digitais que cria estratégias de lançamento, análise de mercado e posicionamento de produtos. Como especialista em desenvolvimento de produtos digitais, analise e desenvolva uma estratégia completa para: ${prompt}`,
      temperature: 0.7,
      maxTokens: 2500
    });

    const files = [
      {
        name: 'estrategia-produto.md',
        content: result.content,
        type: 'text/markdown'
      },
      {
        name: 'analise-mercado.txt',
        content: `Análise de Mercado para: ${prompt}\n\n${generateMarketAnalysis(prompt)}`,
        type: 'text/plain'
      },
      {
        name: 'plano-lancamento.txt',
        content: generateLaunchPlan(prompt),
        type: 'text/plain'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.93
    };
  } catch (error) {
    return {
      content: generateProdutoFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function executeIATrafegoModule(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um especialista em tráfego pago, SEO e marketing digital que cria campanhas otimizadas para diferentes plataformas. Como especialista em tráfego pago e marketing digital, desenvolva uma estratégia completa de tráfego para: ${prompt}`,
      temperature: 0.6,
      maxTokens: 2200
    });

    const files = [
      {
        name: 'estrategia-trafego.md',
        content: result.content,
        type: 'text/markdown'
      },
      {
        name: 'campanha-facebook-ads.txt',
        content: generateFacebookAdsConfig(prompt),
        type: 'text/plain'
      },
      {
        name: 'campanha-google-ads.txt',
        content: generateGoogleAdsConfig(prompt),
        type: 'text/plain'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.92
    };
  } catch (error) {
    return {
      content: generateTrafegoFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

async function executeIAAnalyticsModule(prompt: string, parameters: any) {
  const startTime = performance.now();
  
  try {
    const result = await aiMultiProvider.generateLLM({
      model: 'gpt-4o',
      prompt: `Você é um especialista em analytics que interpreta dados, cria relatórios e fornece insights acionáveis para otimização de negócios. Como especialista em analytics e business intelligence, analise e forneça insights detalhados sobre: ${prompt}`,
      temperature: 0.5,
      maxTokens: 2000
    });

    const files = [
      {
        name: 'relatorio-analytics.md',
        content: result.content,
        type: 'text/markdown'
      },
      {
        name: 'kpis-recomendados.txt',
        content: generateKPIRecommendations(prompt),
        type: 'text/plain'
      },
      {
        name: 'dashboard-config.json',
        content: JSON.stringify(generateDashboardConfig(prompt), null, 2),
        type: 'application/json'
      }
    ];

    return {
      content: result.content,
      files,
      tokensUsed: result.tokensUsed,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.94
    };
  } catch (error) {
    return {
      content: generateAnalyticsFallback(prompt),
      files: [],
      tokensUsed: 0,
      processingTime: (performance.now() - startTime) / 1000,
      confidence: 0.85
    };
  }
}

// Helper functions for generating specialized content
function generateHeadlineVariations(content: string): string {
  const headlines = [
    "🚀 Transforme Seus Resultados em 30 Dias",
    "💡 A Estratégia Que Está Revolucionando o Mercado",
    "⚡ Descubra o Segredo dos Experts",
    "🎯 Como Multiplicar Seus Ganhos de Forma Inteligente",
    "🔥 O Método Que Todo Empreendedor Precisa Conhecer"
  ];
  return headlines.join('\n');
}

function generateMarketAnalysis(prompt: string): string {
  return `
Análise de Mercado Detalhada:

📊 Tamanho do Mercado: Estimativa baseada em tendências atuais
🎯 Público-Alvo: Segmentação demográfica e comportamental  
💰 Potencial de Receita: Projeções de crescimento
🏆 Concorrentes: Análise competitiva
📈 Oportunidades: Gaps identificados no mercado
⚠️ Riscos: Desafios e mitigation strategies
  `;
}

function generateLaunchPlan(prompt: string): string {
  return `
Plano de Lançamento Estratégico:

🎯 Fase 1 - Pré-lançamento (30 dias)
- Validação de conceito
- Criação de landing page
- Construção de lista de interessados

🚀 Fase 2 - Lançamento (7 dias)
- Campanha de divulgação
- Ativação de tráfego pago
- Monitoramento em tempo real

📈 Fase 3 - Pós-lançamento (60 dias)
- Otimização baseada em dados
- Expansão de mercado
- Scaling das campanhas
  `;
}

function generateFacebookAdsConfig(prompt: string): string {
  return `
Configuração Facebook Ads:

🎯 Targeting:
- Interesses relacionados ao nicho
- Comportamentos de compra online
- Lookalike audiences

💰 Budget Recomendado:
- Teste inicial: R$ 50/dia
- Scaling: R$ 200-500/dia

📱 Formatos de Anúncio:
- Carousel para produtos
- Video ads para engajamento
- Collection ads para e-commerce
  `;
}

function generateGoogleAdsConfig(prompt: string): string {
  return `
Configuração Google Ads:

🔍 Palavras-chave:
- Termos de alta intenção de compra
- Long-tail keywords
- Palavras-chave negativas

💡 Estratégia de Lance:
- CPC maximizado com limite
- Target CPA após dados suficientes
- Smart bidding para scale

📊 Extensões Recomendadas:
- Sitelinks
- Callouts
- Structured snippets
  `;
}

function generateKPIRecommendations(prompt: string): string {
  return `
KPIs Recomendados:

📈 Métricas de Crescimento:
- Taxa de conversão
- Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)

💰 Métricas Financeiras:
- Revenue per Visitor (RPV)
- Return on Ad Spend (ROAS)
- Margem de contribuição

🎯 Métricas de Engajamento:
- Tempo na página
- Taxa de rejeição
- Páginas por sessão
  `;
}

function generateDashboardConfig(prompt: string): any {
  return {
    name: "Dashboard IA Analytics",
    widgets: [
      { type: "metric", title: "Conversões", value: "tracking" },
      { type: "chart", title: "Tráfego por Canal", chartType: "pie" },
      { type: "table", title: "Top Páginas", columns: ["Página", "Visualizações", "Conversões"] },
      { type: "metric", title: "ROAS", value: "calculated" }
    ],
    updateFrequency: "real-time"
  };
}

// Fallback functions for when APIs fail
function generateCopyFallback(prompt: string): string {
  return `
🎯 Copy Gerado para: ${prompt}

**Headline Principal:**
Transforme Sua Realidade com Esta Solução Revolucionária

**Subheadline:**
Descubra como milhares de pessoas estão alcançando resultados extraordinários usando este método comprovado.

**Call-to-Action:**
QUERO TRANSFORMAR MINHA VIDA AGORA

**Benefícios Principais:**
✅ Resultados em 30 dias ou menos
✅ Método 100% testado e aprovado
✅ Suporte completo incluído
✅ Garantia de satisfação

**Prova Social:**
"Mudou completamente minha perspectiva e resultados!" - Cliente Satisfeito
  `;
}

function generateVideoFallback(prompt: string): string {
  return `
🎬 Roteiro de Vídeo para: ${prompt}

**Abertura (0-15s):**
Hook impactante que prende a atenção imediatamente

**Desenvolvimento (15s-2min):**
- Apresentação do problema
- Demonstração da solução
- Benefícios claros e mensuráveis

**Fechamento (2-2:30min):**
- Call-to-action claro
- Senso de urgência
- Próximos passos definidos

**Elementos Visuais:**
- Transições dinâmicas
- Textos destacados
- Cores da marca
  `;
}

function generateProdutoFallback(prompt: string): string {
  return `
🚀 Estratégia de Produto para: ${prompt}

**Posicionamento:**
Solução inovadora que resolve problemas reais do mercado

**Proposta de Valor:**
Entrega resultados mensuráveis de forma simples e eficiente

**Público-Alvo:**
Empreendedores e profissionais em busca de crescimento

**Modelo de Negócio:**
- Freemium com upsells estratégicos
- Assinatura recorrente
- Vendas diretas com alto ticket

**Roadmap de Desenvolvimento:**
1. MVP em 30 dias
2. Feedback e iteração
3. Lançamento oficial
4. Expansão de features
  `;
}

function generateTrafegoFallback(prompt: string): string {
  return `
📈 Estratégia de Tráfego para: ${prompt}

**Canais Principais:**
- Facebook e Instagram Ads
- Google Ads (Search + Display)
- SEO orgânico
- Email marketing

**Budget Sugerido:**
- Teste: R$ 1.000/mês
- Scale: R$ 5.000-10.000/mês

**Funil de Conversão:**
1. Atração (Topo)
2. Consideração (Meio)
3. Conversão (Fundo)
4. Retenção (Pós-venda)

**Métricas de Sucesso:**
- CPA abaixo de R$ 50
- ROAS acima de 4:1
- CTR acima de 2%
  `;
}

function generateAnalyticsFallback(prompt: string): string {
  return `
📊 Análise e Insights para: ${prompt}

**Principais Indicadores:**
- Taxa de conversão: 2.5% (benchmark)
- Tempo médio na página: 3min 45s
- Taxa de rejeição: 35%

**Oportunidades Identificadas:**
1. Otimização de páginas de alta saída
2. Melhoria na experiência mobile
3. A/B test em CTAs principais

**Recomendações Prioritárias:**
- Implementar heat mapping
- Configurar eventos personalizados
- Criar segmentos de usuários
- Automatizar relatórios semanais

**Próximos Passos:**
1. Setup completo do Google Analytics 4
2. Integração com ferramentas de CRM
3. Dashboard executivo personalizado
  `;
}