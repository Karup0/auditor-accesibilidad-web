// components/ToolSelector.jsx
import { useState } from 'react';

const tools = [
  { id: 'axe', name: 'Axe Core', description: 'Análisis básico de accesibilidad' },
  { id: 'lighthouse', name: 'Google Lighthouse', description: 'Auditoría completa incluyendo performance' },
  { id: 'wave', name: 'WAVE', description: 'Evaluación visual de problemas' }
];

export default function ToolSelector({ selectedTools, onChange }) {
  const toggleTool = (toolId) => {
    const newSelection = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId];
    onChange(newSelection);
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Herramientas de análisis</h3>
      <p className="text-sm text-gray-500">
        Selecciona las herramientas que deseas utilizar para el análisis
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => toggleTool(tool.id)}
            className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
              selectedTools.includes(tool.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            aria-labelledby={`${tool.id}-label`}
            aria-describedby={`${tool.id}-desc`}
          >
            <div className="flex items-center">
              <input
                id={`tool-${tool.id}`}
                name="tools"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={selectedTools.includes(tool.id)}
                onChange={() => {}}
              />
              <label
                id={`${tool.id}-label`}
                htmlFor={`tool-${tool.id}`}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {tool.name}
              </label>
            </div>
            <p
              id={`${tool.id}-desc`}
              className="mt-1 ml-7 text-xs text-gray-500"
            >
              {tool.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}