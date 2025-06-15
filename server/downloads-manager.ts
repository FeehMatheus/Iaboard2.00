import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

interface DownloadFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
  module: string;
}

// Get all downloads
router.get('/api/downloads', async (req, res) => {
  try {
    const files: DownloadFile[] = [];
    
    if (fs.existsSync(downloadsDir)) {
      const fileNames = fs.readdirSync(downloadsDir);
      
      for (const fileName of fileNames) {
        const filePath = path.join(downloadsDir, fileName);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
          const fileExt = path.extname(fileName).toLowerCase().substring(1);
          const moduleType = fileName.includes('copy') ? 'IA Copy' :
                           fileName.includes('produto') ? 'IA Produto' :
                           fileName.includes('video') ? 'IA Vídeo' :
                           fileName.includes('audio') ? 'IA Voz' :
                           fileName.includes('documento') ? 'IA Documento' :
                           'IA Board';
          
          files.push({
            id: fileName,
            name: fileName,
            type: fileExt,
            size: stats.size,
            url: `/downloads/${fileName}`,
            createdAt: stats.birthtime.toISOString(),
            module: moduleType
          });
        }
      }
    }
    
    // Sort by creation date (newest first)
    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json({
      success: true,
      files,
      count: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    });
    
  } catch (error) {
    console.error('Erro ao listar downloads:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar lista de downloads'
    });
  }
});

// Delete specific file
router.delete('/api/downloads/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(downloadsDir, fileId);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Arquivo deletado com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }
    
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar arquivo'
    });
  }
});

// Clear all downloads
router.delete('/api/downloads/clear', async (req, res) => {
  try {
    if (fs.existsSync(downloadsDir)) {
      const files = fs.readdirSync(downloadsDir);
      
      for (const file of files) {
        const filePath = path.join(downloadsDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Todos os arquivos foram removidos'
    });
    
  } catch (error) {
    console.error('Erro ao limpar downloads:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao limpar downloads'
    });
  }
});

// Download file endpoint
router.get('/downloads/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(downloadsDir, fileName);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      
      // Set appropriate headers
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      // Stream the file
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }
    
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao baixar arquivo'
    });
  }
});

export default router;