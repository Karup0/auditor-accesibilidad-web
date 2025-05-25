import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';

export default function App() {
  return (
    <Router>
      <div className="app-container"> {/* Contenedor añadido */}
       <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/results" element={<Results />} />
  <Route path="*" element={<h1>Ruta no encontrada</h1>} />
</Routes>
      </div>
    </Router>
  );
}