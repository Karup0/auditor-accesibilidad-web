export default function VoiceReader({ text }) {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tu navegador no soporta síntesis de voz");
    }
  };

  return (
    <button 
      onClick={handleSpeak}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Leer Informe
    </button>
  );
}