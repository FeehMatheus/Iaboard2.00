import express from "express";
import { storage } from "./storage";
import { realYouTubeAnalyzer } from "./real-youtube-analyzer";
import { furionSuperiorSystem } from "./furion-superior-system";

const router = express.Router();

// YouTube Analysis Routes
router.post("/api/youtube/analyze", async (req, res) => {
  try {
    const { url, userId = 'demo-user' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "YouTube URL is required" });
    }

    // Create analysis record
    const analysis = await storage.createYouTubeAnalysis({
      videoId: extractVideoId(url),
      url,
      title: "Processing...",
      analysisType: url.includes('live') ? 'live' : 'video',
      status: 'processing',
      userId,
      metadata: {}
    });

    // Start analysis in background
    processAnalysis(analysis.id, url).catch(console.error);

    res.json({ 
      success: true, 
      analysisId: analysis.id,
      status: 'processing',
      message: 'Analysis started successfully'
    });

  } catch (error) {
    console.error('Analysis creation error:', error);
    res.status(500).json({ 
      error: "Failed to start analysis",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get("/api/youtube/analysis/:id", async (req, res) => {
  try {
    const analysisId = parseInt(req.params.id);
    const analysis = await storage.getAnalysisWithDetails(analysisId);
    
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ 
      error: "Failed to fetch analysis",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get("/api/youtube/analyses", async (req, res) => {
  try {
    // For demo purposes, return all analyses
    const analyses = Array.from((storage as any).memoryAnalyses.values());
    res.json(analyses);
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ 
      error: "Failed to fetch analyses",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Superior Furion Analysis Route
router.post("/api/furion/superior-analyze", async (req, res) => {
  try {
    const { url, userId = 'demo-user' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "YouTube URL is required" });
    }

    console.log(`🚀 Iniciando análise superior ao Furion: ${url}`);

    // Create analysis record
    const analysis = await storage.createYouTubeAnalysis({
      videoId: extractVideoId(url),
      url,
      title: "Análise Superior Furion - Processando...",
      analysisType: url.includes('live') ? 'live' : 'video',
      status: 'processing',
      userId,
      metadata: { analysisType: 'furion-superior' }
    });

    // Start superior analysis in background
    processFurionSuperiorAnalysis(analysis.id, url).catch(console.error);

    res.json({ 
      success: true, 
      analysisId: analysis.id,
      status: 'processing',
      message: 'Análise superior ao Furion iniciada com sucesso',
      technologies: furionSuperiorSystem.getFurionTechnologies()
    });

  } catch (error) {
    console.error('Superior analysis creation error:', error);
    res.status(500).json({ 
      error: "Falha ao iniciar análise superior",
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Get Furion Technologies
router.get("/api/furion/technologies", async (req, res) => {
  try {
    const technologies = furionSuperiorSystem.getFurionTechnologies();
    res.json({ 
      success: true, 
      technologies,
      count: technologies.length 
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Falha ao obter tecnologias",
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Background analysis processing
async function processAnalysis(analysisId: number, url: string) {
  try {
    console.log(`Starting analysis for ID: ${analysisId}, URL: ${url}`);
    
    // Run the actual analysis
    const result = await realYouTubeAnalyzer.analyzeVideo(url);
    
    // Update analysis with results
    await storage.updateYouTubeAnalysis(analysisId, {
      title: result.videoInfo.title,
      duration: result.videoInfo.duration,
      status: 'completed',
      completedAt: new Date(),
      metadata: {
        thumbnail: result.videoInfo.thumbnail,
        channelTitle: result.videoInfo.channelTitle,
        isLive: result.videoInfo.isLive,
        overallMetrics: result.overallMetrics
      }
    });

    // Store segments
    for (const segment of result.segments) {
      await storage.createTimeSegment({
        analysisId,
        ...segment
      });
    }

    // Store insights
    for (const insight of result.insights) {
      await storage.createContentInsight({
        analysisId,
        ...insight
      });
    }

    // Store structure
    for (const structure of result.structure) {
      await storage.createProgramStructure({
        analysisId,
        ...structure
      });
    }

    console.log(`Analysis completed for ID: ${analysisId}`);

  } catch (error) {
    console.error(`Analysis failed for ID: ${analysisId}:`, error);
    
    // Update status to failed
    await storage.updateYouTubeAnalysis(analysisId, {
      status: 'failed',
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}

// Background Furion Superior analysis processing
async function processFurionSuperiorAnalysis(analysisId: number, url: string) {
  try {
    console.log(`🚀 Iniciando análise superior Furion para ID: ${analysisId}, URL: ${url}`);
    
    // Run the superior Furion analysis
    const result = await furionSuperiorSystem.analyzeVideoComprehensively(url);
    
    // Update analysis with results
    await storage.updateYouTubeAnalysis(analysisId, {
      title: `Análise Superior Furion - ${url.includes('live') ? 'Live' : 'Vídeo'}`,
      status: 'completed',
      completedAt: new Date(),
      metadata: {
        analysisType: 'furion-superior',
        performanceMetrics: result.performanceMetrics,
        competitorAnalysis: result.competitorAnalysis,
        audienceProfile: result.audienceProfile,
        technologiesUsed: furionSuperiorSystem.getFurionTechnologies().length
      }
    });

    // Store enhanced segments with transcript
    for (const segment of result.transcriptSegments) {
      await storage.createTimeSegment({
        analysisId,
        startTime: segment.timestamp,
        endTime: segment.timestamp + 10,
        transcript: segment.text,
        visualDescription: `Transcrição: ${segment.text}`,
        audioAnalysis: `Emoção: ${segment.emotion}, Persuasão: ${Math.round(segment.persuasionLevel * 100)}%`,
        emotions: { dominant: segment.emotion, confidence: segment.confidence },
        keyTopics: Object.keys(segment.keywordDensity),
        engagementScore: segment.persuasionLevel,
        technicalQuality: {
          audioQuality: segment.confidence,
          videoQuality: segment.confidence,
          stability: segment.confidence
        }
      });
    }

    // Store marketing insights
    for (const insight of result.marketingInsights) {
      await storage.createContentInsight({
        analysisId,
        insightType: insight.type,
        timestamp: insight.timestamp,
        description: insight.description,
        confidence: insight.effectiveness,
        actionable: insight.improvement,
        category: 'marketing'
      });
    }

    // Store copywriting elements as insights
    for (const element of result.copywritingElements) {
      await storage.createContentInsight({
        analysisId,
        insightType: 'copywriting',
        timestamp: element.timestamp,
        description: `${element.element}: ${element.content}`,
        confidence: element.persuasionScore,
        actionable: element.optimization,
        category: 'content'
      });
    }

    // Store psychological triggers
    for (const trigger of result.psychologicalTriggers) {
      await storage.createContentInsight({
        analysisId,
        insightType: 'psychological',
        timestamp: trigger.timestamp,
        description: `Gatilho ${trigger.trigger}: ${trigger.implementation}`,
        confidence: trigger.strength,
        actionable: trigger.enhancement,
        category: 'psychology'
      });
    }

    // Store monetization opportunities
    for (const opportunity of result.monetizationOpportunities) {
      await storage.createContentInsight({
        analysisId,
        insightType: 'monetization',
        timestamp: opportunity.timestamp,
        description: opportunity.opportunity,
        confidence: opportunity.conversion_probability,
        actionable: opportunity.implementation_strategy,
        category: 'monetization'
      });
    }

    console.log(`✅ Análise superior Furion concluída para ID: ${analysisId}`);

  } catch (error) {
    console.error(`❌ Análise superior Furion falhou para ID: ${analysisId}:`, error);
    
    // Update status to failed
    await storage.updateYouTubeAnalysis(analysisId, {
      status: 'failed',
      metadata: {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        analysisType: 'furion-superior'
      }
    });
  }
}

function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url; // fallback
}

export default router;