import type { Express } from "express";
import { createServer, type Server } from "http";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { storage } from "./storage";
import OpenAI from "openai";
import { realAIAPIs } from "./real-ai-apis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // FREE AI Video Generation
  app.post('/api/pika/generate', async (req, res) => {
    try {
      const { prompt, aspectRatio = '16:9', style = 'cinematic', duration = 5 } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
      }

      console.log('🎬 Starting REAL AI video generation with public APIs:', { prompt, aspectRatio, style });

      const result = await realAIAPIs.generateVideo({
        prompt,
        aspectRatio,
        style,
        duration
      });

      if (result.success) {
        res.json({
          success: true,
          videoUrl: result.videoUrl,
          downloadUrl: result.videoUrl,
          provider: 'Free AI Generation System',
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

  // AI Module Execution
  app.post('/api/ai/execute', async (req, res) => {
    try {
      const { prompt, module = 'ia-total', parameters = {} } = req.body;

      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt é obrigatório' });
      }

      console.log('🤖 Executing AI module:', { module, prompt });

      // Use OpenAI for AI execution
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "Você é um assistente de IA especializado em marketing digital e criação de conteúdo. Forneça respostas práticas e acionáveis."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const result = response.choices[0].message.content;

      res.json({
        success: true,
        result,
        metadata: {
          module,
          prompt,
          tokensUsed: response.usage?.total_tokens || 0,
          model: "gpt-4o"
        }
      });

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