import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './styles/App.css';
import './styles/colors.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <AppRoutes />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
