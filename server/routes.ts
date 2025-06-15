import express from "express";
import { storage } from "./storage";
import { realYouTubeAnalyzer } from "./real-youtube-analyzer";

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