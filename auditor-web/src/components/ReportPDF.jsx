import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    borderColor: '#2c5282',
    paddingBottom: 15
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2c5282'
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4a5568',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#2c5282',
    borderBottom: 1,
    borderColor: '#e2e8f0',
    paddingBottom: 5
  },
  section: {
    marginBottom: 25
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
    color: '#4a5568'
  },
  resultItem: {
    marginBottom: 15
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4a5568'
  },
  passed: {
    color: '#38a169'
  },
  failed: {
    color: '#e53e3e'
  },
  warning: {
    color: '#dd6b20'
  },
  recommendation: {
    backgroundColor: '#ebf8ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderLeft: 3,
    borderColor: '#3182ce'
  },
  screenshot: {
    width: '100%',
    marginBottom: 15,
    border: 1,
    borderColor: '#e2e8f0',
    borderRadius: 5
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: 1,
    borderColor: '#e2e8f0',
    fontSize: 10,
    color: '#718096',
    textAlign: 'center'
  }
});

const ReportPDF = ({ results, url, screenshot }) => {
  // Datos de ejemplo - reemplazar con tus datos reales
  const summaryData = {
    contrast: { status: 'Falla', count: 5, description: 'La relación de contraste entre el texto y el fondo es insuficiente en algunas secciones.' },
    altText: { status: 'Falla', count: 3, description: 'Se encontraron imágenes sin descripciones alternativas.' },
    keyboard: { status: 'Aprobado', description: 'El sitio es completamente navegable utilizando solo el teclado.' },
    aria: { status: 'Advertencia', count: 2, description: 'Algunos elementos ARIA podrían mejorarse.' }
  };

  const recommendations = [
    'Mejorar el contraste de los textos utilizando herramientas como Color Contrast Checker.',
    'Agregar texto alternativo a todas las imágenes que no lo tienen.',
    'Verificar que todos los elementos interactivos sean accesibles por teclado.',
    'Implementar landmarks ARIA para mejorar la navegación para usuarios de lectores de pantalla.',
    'Asegurar que todos los formularios tengan etiquetas asociadas correctamente.'
  ];

  const futureWork = [
    'Implementar soporte para WCAG 2.2 (nuevos criterios)',
    'Añadir evaluación de movilidad reducida (operabilidad con dispositivos adaptativos)',
    'Incluir pruebas con usuarios reales con diversas discapacidades',
    'Desarrollar guías específicas para cada tipo de problema detectado',
    'Crear un sistema de monitoreo continuo de accesibilidad'
  ];

  return (
    <Document>
      <Page style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Evaluación de Accesibilidad Web</Text>
          <Text style={styles.subtitle}>Análisis según pautas WCAG 2.1 AA</Text>
          <Text style={styles.text}>URL analizada: {url}</Text>
          <Text style={styles.text}>Fecha del análisis: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* 1. Descripción general */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Descripción General</Text>
          {screenshot && (
            <Image src={screenshot} style={styles.screenshot} />
          )}
          <Text style={styles.text}>
            Este informe presenta los resultados de la evaluación de accesibilidad realizada al sitio web 
            indicado, utilizando las pautas WCAG 2.1 nivel AA como referencia. La evaluación identifica 
            barreras potenciales para personas con discapacidades y proporciona recomendaciones para mejorar 
            la accesibilidad del sitio.
          </Text>
        </View>

        {/* 2. Resultados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Resultados Detallados</Text>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultTitle}>Contraste de colores: 
              <Text style={summaryData.contrast.status === 'Aprobado' ? styles.passed : styles.failed}>
                {` ${summaryData.contrast.status}`}
              </Text>
            </Text>
            <Text style={styles.text}>{summaryData.contrast.description}</Text>
            <Text style={styles.text}>Elementos con problemas: {summaryData.contrast.count}</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultTitle}>Imágenes sin texto alternativo: 
              <Text style={summaryData.altText.status === 'Aprobado' ? styles.passed : styles.failed}>
                {` ${summaryData.altText.status}`}
              </Text>
            </Text>
            <Text style={styles.text}>{summaryData.altText.description}</Text>
            <Text style={styles.text}>Imágenes afectadas: {summaryData.altText.count}</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultTitle}>Navegación con teclado: 
              <Text style={summaryData.keyboard.status === 'Aprobado' ? styles.passed : styles.failed}>
                {` ${summaryData.keyboard.status}`}
              </Text>
            </Text>
            <Text style={styles.text}>{summaryData.keyboard.description}</Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultTitle}>Atributos ARIA: 
              <Text style={summaryData.aria.status === 'Aprobado' ? styles.passed : 
                           summaryData.aria.status === 'Advertencia' ? styles.warning : styles.failed}>
                {` ${summaryData.aria.status}`}
              </Text>
            </Text>
            <Text style={styles.text}>{summaryData.aria.description}</Text>
            {summaryData.aria.count && <Text style={styles.text}>Elementos a revisar: {summaryData.aria.count}</Text>}
          </View>
        </View>

        {/* 3. Recomendaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Recomendaciones</Text>
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendation}>
              <Text style={styles.text}>• {rec}</Text>
            </View>
          ))}
        </View>

        {/* 4. Conclusiones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Conclusiones</Text>
          <Text style={styles.text}>
            El análisis de accesibilidad ha identificado áreas de mejora significativas en el sitio web evaluado. 
            Si bien algunos aspectos como la navegación por teclado cumplen con los estándares, existen 
            oportunidades importantes para mejorar en áreas como el contraste de color y los textos alternativos 
            en imágenes, lo que beneficiaría a usuarios con discapacidades visuales.
          </Text>
          <Text style={styles.text}>
            La implementación de las recomendaciones propuestas no solo mejoraría la accesibilidad del sitio, 
            sino que también podría tener un impacto positivo en la experiencia de usuario general y en el 
            posicionamiento en motores de búsqueda.
          </Text>
        </View>

        {/* 5. Trabajo futuro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Trabajo Futuro</Text>
          {futureWork.map((item, index) => (
            <View key={index} style={{marginBottom: 5}}>
              <Text style={styles.text}>{index + 1}. {item}</Text>
            </View>
          ))}
        </View>

        
<View style={styles.section}>
  <Text style={styles.sectionTitle}>1.1 Herramientas Utilizadas</Text>
  <Text style={styles.text}>
    Este informe fue generado utilizando las siguientes herramientas de evaluación:
  </Text>
  
  <View style={{marginTop: 10}}>
    <Text style={{...styles.text, fontWeight: 'bold'}}>• Google Lighthouse</Text>
    <Text style={styles.text}>Herramienta automatizada de Google para evaluar calidad web, incluyendo accesibilidad, performance y más.</Text>
    
    <Text style={{...styles.text, fontWeight: 'bold', marginTop: 5}}>• WAVE (Web Accessibility Evaluation Tool)</Text>
    <Text style={styles.text}>Herramienta de evaluación visual de accesibilidad desarrollada por WebAIM.</Text>
    
    <Text style={{...styles.text, fontWeight: 'bold', marginTop: 5}}>• Axe Core</Text>
    <Text style={styles.text}>Motor de accesibilidad de código abierto para pruebas automatizadas y desarrollo.</Text>
  </View>
</View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Reporte generado automáticamente por Auditor Web Personal</Text>
          <Text>WCAG 2.1 AA - {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportPDF;