// server.js
const express = require('express');
const cors = require('cors');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de APIs
const WAVE_API_URL = 'https://wave.webaim.org/api/request';
const WAVE_API_KEY = process.env.WAVE_API_KEY;

// Escaneo con Lighthouse
async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {output: 'json', port: chrome.port, onlyCategories: ['accessibility']};
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  return runnerResult.lhr;
}

// Escaneo con WAVE
async function runWAVE(url) {
  const response = await axios.get(WAVE_API_URL, {
    params: {
      key: WAVE_API_KEY,
      url: url,
      format: 'json'
    }
  });
  return response.data;
}

app.post('/scan', async (req, res) => {
  const { url, tools = ['lighthouse', 'wave', 'axe'] } = req.body;
  
  try {
    const results = {};
    
    if (tools.includes('lighthouse')) {
      results.lighthouse = await runLighthouse(url);
    }
    
    if (tools.includes('wave')) {
      results.wave = await runWAVE(url);
    }
    
    // Siempre incluimos axe-core como base
    const mockAxeResults = {
      violations: [
        { id: 'color-contrast', description: 'Contraste insuficiente', nodes: Array(5) },
        { id: 'image-alt', description: 'Imágenes sin texto alternativo', nodes: Array(3) },
      ],
      url,
      timestamp: new Date().toISOString(),
    };
    
    results.axe = mockAxeResults;
    
    res.json({ status: 'success', data: results });
  } catch (error) {
    console.error('Error scanning:', error);
    res.status(500).json({ status: 'error', message: 'Error during scanning' });
  }
});

app.listen(3001, () => console.log('Backend running on port 3001'));