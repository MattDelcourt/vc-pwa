import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Games from '../pages/Games';
import Downloads from '../pages/Downloads';
import CSharp from '../pages/CSharp';
import CPlusPlus from '../pages/CPlusPlus';
import Python from '../pages/Python';
import Java from '../pages/Java';
import Contact from '../pages/Contact';
import About from '../pages/About';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/games" element={<Games />} />
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/csharp" element={<CSharp />} />
      <Route path="/cplusplus" element={<CPlusPlus />} />
      <Route path="/python" element={<Python />} />
      <Route path="/java" element={<Java />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
