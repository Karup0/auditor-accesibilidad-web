// pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolSelector from '../components/ToolSelector';

export default function Home() {
  const [url, setUrl] = useState('');
  const [tools, setTools] = useState(['axe', 'lighthouse']);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (url) {
      localStorage.removeItem('lastAudit');
      navigate('/results', { state: { url, tools } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Auditor de Accesibilidad</h1>
          <p className="text-gray-600">Analiza cualquier sitio web según WCAG 2.1</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="mb-6">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
              URL del sitio a analizar
            </label>
            <input
              id="url-input"
              type="url"
              placeholder="https://ejemplo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-required="true"
            />
          </div>

          <ToolSelector selectedTools={tools} onChange={setTools} />

          <button
            onClick={handleAnalyze}
            disabled={!url}
            className={`w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              !url ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Analizar accesibilidad del sitio web"
          >
            Analizar Accesibilidad
          </button>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Este auditor verifica los criterios WCAG 2.1 AA</p>
        </div>
      </div>
    </div>
  );
}