import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { PDFDownloadLink } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import VoiceReader from '../components/VoiceReader';
import ReportPDF from '../components/ReportPDF';
import { Chart as ChartJS } from 'chart.js/auto';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

ChartJS.register();

export default function Results() {
  const [results, setResults] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('waiting');
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const url = location.state?.url;

  useEffect(() => {
    if (!url) return;

    setResults(null);
    setScreenshot(null);
    setAnalysisStatus('loading');
    setProgress(0);

    // Simular progreso de análisis (en una implementación real esto vendría del backend)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 800);

    // Simular obtención de resultados (reemplazar con tu implementación real)
    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisStatus('completed');
      
      // Datos de ejemplo - reemplazar con tus datos reales
      setResults({
        axe: {
          violations: [
            { 
              id: 'color-contrast', 
              description: 'Contraste insuficiente', 
              help: 'El contraste entre el texto y el fondo no cumple con los estándares WCAG',
              impact: 'serious',
              tags: ['wcag2aa', 'wcag143'],
              nodes: Array(5).fill({ html: '<span style="color: #777">Texto con bajo contraste</span>' })
            },
            { 
              id: 'image-alt', 
              description: 'Imágenes sin texto alternativo', 
              help: 'Las imágenes deben tener atributos alt descriptivos',
              impact: 'critical',
              tags: ['wcag2aa', 'wcag111'],
              nodes: Array(3).fill({ html: '<img src="banner.jpg">' })
            }
          ],
          passes: [
            { id: 'keyboard', description: 'Navegación por teclado funcional' },
            { id: 'aria-roles', description: 'Roles ARIA correctamente implementados' }
          ],
          incomplete: [
            { id: 'aria-hidden-focus', description: 'Elementos ocultos accesibles por teclado', nodes: Array(2) }
          ]
        },
        lighthouse: {
          categories: {
            accessibility: {
              score: 0.82,
              title: 'Accessibility'
            }
          },
          audits: {
            'color-contrast': { score: 0.8, title: 'Color Contrast' },
            'image-alt': { score: 0.9, title: 'Image Alt Text' },
            'keyboard-accessibility': { score: 1, title: 'Keyboard Accessibility' }
          }
        },
        wave: {
          status: {
            error: 5,
            alert: 3,
            feature: 2,
            structure: 1
          },
          categories: {
            error: {
              items: [
                { id: 'contrast', description: 'Contraste insuficiente', selector: 'span.low-contrast' }
              ]
            }
          }
        }
      });
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [url]);

  const handleCaptureScreenshot = async () => {
  const element = document.getElementById('results-container');
  if (!element) return null;
  
  try {
    setIsGeneratingReport(true);
    
    const canvas = await html2canvas(element, {
      scale: 2, // Mejor calidad
      useCORS: true, // Para permitir recursos externos
      logging: false, // Desactivar logs
      allowTaint: true, // Permitir imágenes externas
      scrollY: -window.scrollY, // Asegurar captura completa
    });

    // Convertir a blob y descargar
    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = `captura-${url.replace(/^https?:\/\//, "")}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      
      // También guardar para el PDF
      const imgData = canvas.toDataURL('image/png');
      setScreenshot(imgData);
    }, 'image/png');
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error("Error al capturar pantalla:", error);
    return null;
  } finally {
    setIsGeneratingReport(false);
  }
};

  const generateReportData = () => {
    if (!results) return null;

    // Procesar resultados de todas las herramientas
    const axeViolations = results.axe?.violations || [];
    const lighthouseAudits = results.lighthouse?.audits || {};
    const waveErrors = results.wave?.categories?.error?.items || [];

    const summaryData = {
      contrast: { 
        status: axeViolations.some(v => v.id === 'color-contrast') || 
                lighthouseAudits['color-contrast']?.score < 0.9 ? 'Falla' : 'Aprobado',
        count: (axeViolations.find(v => v.id === 'color-contrast')?.nodes.length || 0) +
               (waveErrors.filter(e => e.id === 'contrast').length),
        description: 'La relación de contraste entre el texto y el fondo no cumple con los estándares WCAG AA'
      },
      altText: { 
        status: axeViolations.some(v => v.id === 'image-alt') || 
                lighthouseAudits['image-alt']?.score < 0.9 ? 'Falla' : 'Aprobado',
        count: (axeViolations.find(v => v.id === 'image-alt')?.nodes.length || 0) +
               (waveErrors.filter(e => e.id === 'alt-missing').length),
        description: 'Las imágenes deben tener atributos alt descriptivos para usuarios con discapacidad visual'
      },
      keyboard: { 
        status: results.axe?.passes?.some(p => p.id === 'keyboard') && 
                lighthouseAudits['keyboard-accessibility']?.score === 1 ? 'Aprobado' : 'Falla',
        description: 'El sitio debe ser completamente navegable utilizando solo el teclado'
      },
      aria: { 
        status: axeViolations.some(v => v.tags.includes('aria')) ? 'Advertencia' : 'Aprobado',
        count: axeViolations.filter(v => v.tags.includes('aria')).reduce((acc, curr) => acc + curr.nodes.length, 0),
        description: 'Los atributos ARIA deben usarse correctamente para mejorar la accesibilidad'
      }
    };

    const recommendations = [
      ...axeViolations.map(v => v.help || `Corregir: ${v.description}`),
      ...waveErrors.map(e => `Problema detectado por WAVE: ${e.description}`),
      'Implementar pruebas periódicas de accesibilidad',
      'Realizar auditorías con usuarios reales con discapacidades'
    ];

    const futureWork = [
      'Implementar soporte para WCAG 2.2',
      'Añadir análisis de movilidad reducida',
      'Incluir pruebas con lectores de pantalla',
      'Desarrollar guías específicas para cada problema',
      'Crear sistema de monitoreo continuo'
    ];

    return { summaryData, recommendations, futureWork };
  };

  const getChartData = () => {
    if (!results) {
      return {
        labels: ['Contraste', 'Texto Alt', 'Navegación', 'ARIA', 'Semántica'],
        datasets: [{
          label: 'Problemas',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        }]
      };
    }

    const axeData = results.axe?.violations || [];
    const lighthouseData = results.lighthouse?.audits || {};
    const waveData = results.wave?.categories || {};

    return {
      labels: ['Contraste', 'Texto Alt', 'Navegación', 'ARIA', 'Semántica'],
      datasets: [
        {
          label: 'Axe Core',
          data: [
            axeData.find(v => v.id === 'color-contrast')?.nodes.length || 0,
            axeData.find(v => v.id === 'image-alt')?.nodes.length || 0,
            axeData.find(v => v.id === 'keyboard')?.nodes.length || 0,
            axeData.filter(v => v.tags?.includes('aria')).reduce((acc, curr) => acc + curr.nodes.length, 0),
            axeData.filter(v => v.tags?.includes('semantics')).reduce((acc, curr) => acc + curr.nodes.length, 0)
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
        {
          label: 'Lighthouse',
          data: [
            lighthouseData['color-contrast']?.score < 0.9 ? 1 : 0,
            lighthouseData['image-alt']?.score < 0.9 ? 1 : 0,
            lighthouseData['keyboard-accessibility']?.score < 1 ? 1 : 0,
            lighthouseData['aria-valid-attr-value']?.score < 1 ? 1 : 0,
            lighthouseData['heading-order']?.score < 1 ? 1 : 0
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'WAVE',
          data: [
            waveData.error?.items?.filter(i => i.id === 'contrast').length || 0,
            waveData.error?.items?.filter(i => i.id === 'alt-missing').length || 0,
            0, // Navegación no medida directamente por WAVE
            waveData.error?.items?.filter(i => i.id.includes('aria')).length || 0,
            0 // Semántica no medida directamente por WAVE
          ],
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
        }
      ]
    };
  };

  const getReportText = () => {
    if (!results) return `Analizando accesibilidad de ${url}...`;

    const axeViolations = results.axe?.violations || [];
    const lighthouseScore = results.lighthouse?.categories?.accessibility?.score * 100 || 0;
    const waveErrors = results.wave?.status?.error || 0;

    const criticalIssues = axeViolations.reduce((acc, curr) => acc + curr.nodes.length, 0) + waveErrors;
    const passedChecks = results.axe?.passes?.length || 0;
    
    return `Resultados de accesibilidad para ${url}. 
      Puntuación Lighthouse: ${Math.round(lighthouseScore)}/100.
      Se encontraron ${criticalIssues} problemas críticos. 
      ${passedChecks} verificaciones pasaron correctamente. 
      Problemas principales: ${axeViolations.slice(0, 3).map(v => `${v.nodes.length} ${v.description}`).join(', ')}.`;
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const screenshotData = await handleCaptureScreenshot();
    setIsGeneratingReport(false);
    return screenshotData;
  };

  const chartData = getChartData();
  const reportText = getReportText();
  const reportData = generateReportData();

  // Calcular métricas combinadas
  const criticalIssues = (results?.axe?.violations?.reduce((acc, curr) => acc + curr.nodes.length, 0) || 0) + 
                        (results?.wave?.status?.error || 0);
  const warnings = (results?.axe?.incomplete?.reduce((acc, curr) => acc + curr.nodes.length, 0) || 0) + 
                   (results?.wave?.status?.alert || 0);
  const passedChecks = results?.axe?.passes?.length || 0;
  const lighthouseScore = results?.lighthouse?.categories?.accessibility?.score * 100 || 0;

  return (
    <div id="results-container" className="p-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resultados de Accesibilidad</h1>
        <p className="text-gray-600">
          URL analizada: <span className="text-blue-600 break-all">{url}</span>
        </p>
        <p className="text-sm text-gray-500">
          Estándar evaluado: WCAG 2.1 Nivel AA | {new Date().toLocaleDateString()}
        </p>
      </header>

      {/* Estado del análisis */}
      {analysisStatus !== 'completed' && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-center">
            <ArrowPathIcon className={`h-5 w-5 mr-2 text-blue-500 ${analysisStatus === 'loading' ? 'animate-spin' : ''}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                {analysisStatus === 'loading' ? 'Analizando accesibilidad...' : 'Preparando análisis...'}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen principal */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de puntuación */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Puntuación General</h2>
          <div className="flex items-center justify-center">
            <div className={`radial-progress ${lighthouseScore >= 90 ? 'text-green-500' : 
                           lighthouseScore >= 70 ? 'text-yellow-500' : 'text-red-500'}`} 
                 style={{ '--value': lighthouseScore, '--size': '8rem' }}>
              <span className="text-2xl font-bold">{Math.round(lighthouseScore)}</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {lighthouseScore >= 90 ? 'Excelente accesibilidad' : 
               lighthouseScore >= 70 ? 'Accesibilidad moderada' : 'Accesibilidad deficiente'}
            </p>
          </div>
        </div>

        {/* Resumen de problemas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen de Problemas</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Problemas críticos</span>
                <span className="text-sm font-bold text-red-600">{criticalIssues}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(criticalIssues * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Advertencias</span>
                <span className="text-sm font-bold text-yellow-600">{warnings}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${Math.min(warnings * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Verificaciones aprobadas</span>
                <span className="text-sm font-bold text-green-600">{passedChecks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(passedChecks * 5, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Distribución de Problemas</h2>
          <div className="h-64">
            <Bar 
              data={chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      boxWidth: 12,
                      padding: 20
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </section>

      {/* Herramientas utilizadas */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Herramientas Utilizadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-blue-800">Google Lighthouse</h3>
            </div>
            <p className="text-sm text-blue-600">
              Puntuación: <span className="font-bold">{Math.round(lighthouseScore)}/100</span>
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center mb-2">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-medium text-green-800">WAVE</h3>
            </div>
            <p className="text-sm text-green-600">
              Errores: <span className="font-bold">{results?.wave?.status?.error || 0}</span>, 
              Alertas: <span className="font-bold">{results?.wave?.status?.alert || 0}</span>
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center mb-2">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="font-medium text-purple-800">Axe Core</h3>
            </div>
            <p className="text-sm text-purple-600">
              Violaciones: <span className="font-bold">{results?.axe?.violations?.length || 0}</span>, 
              Aprobados: <span className="font-bold">{results?.axe?.passes?.length || 0}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Acciones */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Exportar Resultados</h2>
        <div className="flex flex-wrap gap-3">
          <PDFDownloadLink 
  document={
    <ReportPDF 
      results={results} 
      url={url} 
      screenshot={screenshot}
      summaryData={reportData?.summaryData}
      recommendations={reportData?.recommendations}
      futureWork={reportData?.futureWork}
    />
  } 
  fileName={`reporte-accesibilidad-${url.replace(/^https?:\/\//, '').replace(/\//g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`}
  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
  onClick={async () => {
    // Capturar pantalla si no existe
    if (!screenshot) {
      await handleCaptureScreenshot();
    }
  }}
>
  {({ loading }) => (
    loading ? 'Generando PDF...' : 'Descargar Informe Completo'
  )}
</PDFDownloadLink>

          <button 
            onClick={handleCaptureScreenshot}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={isGeneratingReport}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Capturar Pantalla
          </button>

          <VoiceReader text={reportText} />
        </div>
      </section>

      {/* Detalles del análisis */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Detalles del Análisis</h2>
          <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {results?.axe?.violations?.length || 0} problemas encontrados
          </span>
        </div>

        {results?.axe?.violations?.length > 0 ? (
          <div className="space-y-6">
            {results.axe.violations.map((violation, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-red-600 mb-2 capitalize">
                    {violation.id.replace(/-/g, ' ')}: {violation.nodes.length} problema(s)
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    violation.impact === 'critical' ? 'bg-red-100 text-red-800' :
                    violation.impact === 'serious' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {violation.impact === 'critical' ? 'Crítico' : 
                     violation.impact === 'serious' ? 'Grave' : 'Moderado'}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{violation.help}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {violation.tags
                    .filter(tag => !tag.includes('wcag'))
                    .map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Elementos afectados ({violation.nodes.length} total):
                  </p>
                  <div className="space-y-2">
                    {violation.nodes.slice(0, 3).map((node, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto">
                        {node.html.substring(0, 100)}{node.html.length > 100 ? '...' : ''}
                      </div>
                    ))}
                    {violation.nodes.length > 3 && (
                      <p className="text-xs text-gray-500">
                        + {violation.nodes.length - 3} elementos más con este problema
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-4 rounded-lg ${
            results ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center">
              {results ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-800">
                    ¡No se encontraron problemas críticos de accesibilidad!
                  </p>
                </>
              ) : (
                <>
                  <InformationCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-gray-600">
                    {analysisStatus === 'loading' ? 'Analizando la página...' : 'Esperando URL para analizar...'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}