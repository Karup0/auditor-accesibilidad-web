# 🚀 Auditor de Accesibilidad Web WCAG 2.1

Herramienta para evaluar la accesibilidad de sitios web según estándares WCAG 2.1, desarrollada para el curso de Temas Avanzados de Desarrollo de Software.

## 🌟 Características Principales

- ✅ Escaneo automático de páginas web
- 📊 Dashboard interactivo con resultados visuales
- 📄 Generación de informes en PDF detallados
- 🎧 Soporte para lectura en voz alta
- 🔍 Detección de problemas de accesibilidad:
  - Contraste de color (WCAG 1.4.3)
  - Texto alternativo en imágenes (WCAG 1.1.1)
  - Navegación por teclado (WCAG 2.1.1)
  - Estructura semántica (WCAG 1.3.1)
  - Atributos ARIA (WCAG 4.1.2)

## 🛠 Tecnologías Utilizadas

| Área         | Tecnologías                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **Frontend** | React.js, Axe-core, Chart.js, Tailwind CSS, React-PDF, html2canvas          |
| **Backend**  | Node.js, Express, Lighthouse API, WAVE API                                  |
| **Testing**  | Jest, React Testing Library                                                 |

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js v16+
- npm v8+
- Git

### Pasos para Instalar

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Karup0/auditor-accesibilidad-web.git
   cd auditor-accesibilidad-web
2. **Instalar dependencias**
   ```bash
   # Frontend
   cd client
   npm install

   # Backend
   cd ../server
   npm install

3. **Configurar variables de entorno**
   
   Crear archivo .env en /server con:
   ```bash
   WAVE_API_KEY=tu_api_key_aquí
   PORT=3001
   
4. **Ejecutar la aplicación**
    ```bash
    # En terminal 1 (backend)
    cd server
    npm start

    # En terminal 2 (frontend)
    cd client
    npm run dev

5. **Abrir en navegador**
   ```bash
   http://localhost:5173

## 🎯 Marco Teórico
Este proyecto implementa los 4 principios fundamentales de WCAG 2.1:

  Perceptible:
  - Texto alternativo para contenido no textual
  - Contraste mínimo 4.5:1 para texto normal
  - Adaptabilidad a diferentes tamaños de pantalla

  Operable:
  - Navegación completa mediante teclado
  - Tiempo suficiente para interactuar con contenido
  - Prevención de contenido que pueda causar convulsiones

  Comprensible:
  - Lenguaje claro y simple
  - Comportamiento predecible en navegación
  - Asistencia para prevenir y corregir errores

  Robusto:
  - Compatibilidad con tecnologías asistivas
  - Validación de código HTML/CSS

# Funcionamiento en navegadores modernos

## 📝 Manual de Usuario Completo

  1. Cómo Realizar un Análisis
  - Ingresa la URL completa (ej: https://ejemplo.com)
  - Haz clic en "Analizar Accesibilidad"
  - Espera 30-60 segundos mientras se realiza el escaneo
  - Revisa los resultados en el dashboard

  2. Interpretación de Resultados
     - Puntuación General: Porcentaje de cumplimiento WCAG
     - Gráfico de Problemas: Distribución por categorías
     - Listado Detallado: Errores específicos con:
     - Descripción del problema
     - Nivel de impacto (Crítico, Grave, Moderado)
     - Elementos HTML afectados
     - Recomendaciones específicas

3. Exportación de Resultados
    - Generar PDF: Crea un informe profesional con:
    - Captura de pantalla del sitio analizado
    - Resumen ejecutivo
    - Recomendaciones priorizadas
    - Plan de mejora continua
    - Capturar Pantalla: Guarda una imagen del análisis actual
    - Leer en Voz Alta: Activa la síntesis de voz para el informe

4. Solución de Problemas Comunes
  - Problema	Solución
  - Análisis no inicia	Verificar conexión a internet y URL
  - Informe no se genera	Asegurar permisos para guardar archivos
  - Error en backend	Revisar consola del servidor
  - Falta de datos en gráficos	Verificar conexión con APIs externas

## 📊 Ejemplo de Reporte Generado
1. Resumen Ejecutivo
  - ![Captura de análisis] - Puntuación: 82/100

2. Problemas Detectados:

  - Contraste de color: 5 elementos no cumplen (WCAG 1.4.3)
  - Imágenes sin alt text: 3 elementos (WCAG 1.1.1)

Navegación por teclado: Cumple totalmente (WCAG 2.1.1)

3. Recomendaciones Prioritarias:

  - Mejorar contraste en textos principales
  - Agregar texto alternativo a imágenes

Verificar estructura de encabezados

4. Trabajo Futuro:
  - Implementar análisis WCAG 2.2
  - Añadir pruebas con lectores de pantalla
    -Soporte para análisis multi-página

## 📚 Referencias (APA 7ª Edición)

- World Wide Web Consortium. (2018). Web Content Accessibility Guidelines (WCAG) 2.1. https://www.w3.org/TR/WCAG21/
- Cooper, M. et al. (2021). Understanding WCAG 2.1. W3C Press.
- Deque Systems. (2022). axe-core Documentation. https://github.com/dequelabs/axe-core
= Google LLC. (2022). Lighthouse Developer Guide. https://developers.google.com/web/tools/lighthouse

# 🤝 Cómo Contribuir

- Crea una rama (git checkout -b feature/mejora)
- Haz commit de tus cambios (git commit -m 'Añade nueva funcionalidad')
- Haz push a la rama (git push origin feature/mejora)
- Abre un Pull Request
