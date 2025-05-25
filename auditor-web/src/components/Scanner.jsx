import { useEffect } from 'react';
import axe from 'axe-core';

export default function Scanner({ url, onResults, onStatusChange }) {
  useEffect(() => {
    if (!url) return;

    const TIMEOUT = 30000; // 30 segundos de timeout

    const analyzeAccessibility = async () => {
      onStatusChange('Preparando análisis...');
      
      try {
        const startTime = Date.now();
        
        // Verificar si es una URL compleja (como YouTube)
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          onStatusChange('Análisis rápido (modo simplificado para plataformas de video)...');
          return onResults({
            warnings: [{
              id: 'complex-platform',
              description: 'Análisis simplificado para plataformas de video',
              help: 'Para plataformas como YouTube, recomendamos usar extensiones de navegador para análisis de accesibilidad'
            }],
            timestamp: new Date().toISOString()
          });
        }

        onStatusChange('Ejecutando análisis de accesibilidad...');
        
        // Usar Promise.race para implementar timeout
        const results = await Promise.race([
          runAxeAnalysis(url),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Tiempo de análisis excedido')), TIMEOUT)
          )
        ]);

        onStatusChange(`Análisis completado en ${((Date.now() - startTime)/1000).toFixed(1)} segundos`);
        onResults(results);
      } catch (error) {
        console.error('Error en el análisis:', error);
        onStatusChange('Error en el análisis');
        onResults({ 
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    };

    analyzeAccessibility();
  }, [url]);

  return null;
}

async function runAxeAnalysis(url) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const timeout = setTimeout(() => {
      document.body.removeChild(iframe);
      resolve({ 
        error: 'El análisis tomó demasiado tiempo',
        violations: [],
        timestamp: new Date().toISOString()
      });
    }, 20000);

    iframe.onload = () => {
      try {
        axe.run(iframe.contentDocument, {}, (err, results) => {
          clearTimeout(timeout);
          document.body.removeChild(iframe);
          
          if (err) {
            resolve({ error: err.message, violations: [] });
          } else {
            resolve({
              violations: results.violations,
              passes: results.passes,
              incomplete: results.incomplete,
              timestamp: new Date().toISOString()
            });
          }
        });
      } catch (e) {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        resolve({ error: e.message, violations: [] });
      }
    };

    iframe.onerror = () => {
      clearTimeout(timeout);
      document.body.removeChild(iframe);
      resolve({ 
        error: 'Error al cargar la URL para análisis',
        violations: []
      });
    };

    iframe.src = url;
  });
}