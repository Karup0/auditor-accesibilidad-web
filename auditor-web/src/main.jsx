import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/accessibility.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);