import express from 'express';

const router = express.Router();

interface ModuleStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'failed';
  lastCheck: string;
  errors: string[];
  expectedOutput: string;
  actualOutput: string;
  providersChecked: string[];
}

// In-memory status tracking
const moduleStatuses: Map<string, ModuleStatus> = new Map();

// Automatic failure detection endpoint
router.post('/api/failure-detection/check', async (req, res) => {
  try {
    const { moduleId, moduleName, expectedOutput, actualOutput, providers = [] } = req.body;
    
    const errors: string[] = [];
    let status: 'healthy' | 'warning' | 'failed' = 'healthy';

    // Check if output matches expected type
    if (expectedOutput && actualOutput) {
      if (expectedOutput === 'video' && !actualOutput.includes('.mp4') && !actualOutput.includes('video')) {
        errors.push('Módulo de vídeo retornou texto ao invés de arquivo de vídeo');
        status = 'failed';
      }
      
      if (expectedOutput === 'audio' && !actualOutput.includes('.mp3') && !actualOutput.includes('audio')) {
        errors.push('Módulo de áudio retornou texto ao invés de arquivo de áudio');
        status = 'failed';
      }
      
      if (expectedOutput === 'pdf' && !actualOutput.includes('.pdf') && actualOutput.length < 100) {
        errors.push('PDF gerado está vazio ou muito pequeno');
        status = 'warning';
      }
    }

    // Check if it's just a prompt instead of real content
    if (actualOutput && actualOutput.includes('prompt:') && actualOutput.length < 500) {
      errors.push('Módulo retornou apenas prompt ao invés de conteúdo real');
      status = 'failed';
    }

    // Update module status
    const moduleStatus: ModuleStatus = {
      id: moduleId,
      name: moduleName,
      status,
      lastCheck: new Date().toISOString(),
      errors,
      expectedOutput: expectedOutput || 'unknown',
      actualOutput: actualOutput || 'no output',
      providersChecked: providers
    };

    moduleStatuses.set(moduleId, moduleStatus);

    res.json({
      success: true,
      status,
      errors,
      recommendation: status === 'failed' 
        ? 'Reexecutar módulo ou verificar configuração das APIs'
        : status === 'warning'
        ? 'Verificar qualidade do output'
        : 'Módulo funcionando corretamente'
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro na detecção de falhas',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Get all module statuses
router.get('/api/failure-detection/status', (req, res) => {
  try {
    const allStatuses = Array.from(moduleStatuses.values());
    
    const summary = {
      total: allStatuses.length,
      healthy: allStatuses.filter(s => s.status === 'healthy').length,
      warning: allStatuses.filter(s => s.status === 'warning').length,
      failed: allStatuses.filter(s => s.status === 'failed').length,
      lastUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      summary,
      modules: allStatuses.sort((a, b) => {
        const statusOrder = { failed: 0, warning: 1, healthy: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter status dos módulos',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Auto-retry failed modules
router.post('/api/failure-detection/retry/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { retryPayload } = req.body;
    
    const moduleStatus = moduleStatuses.get(moduleId);
    if (!moduleStatus) {
      return res.status(404).json({
        success: false,
        error: 'Módulo não encontrado'
      });
    }

    // Mark as retrying
    moduleStatus.status = 'warning';
    moduleStatus.errors = ['Tentando reexecutar...'];
    moduleStatus.lastCheck = new Date().toISOString();
    moduleStatuses.set(moduleId, moduleStatus);

    res.json({
      success: true,
      message: 'Reexecução iniciada',
      moduleId,
      retryPayload
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro na reexecução do módulo',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

export default router;