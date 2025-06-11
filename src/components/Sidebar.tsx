import { Link } from 'react-router-dom';
import './styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Link to="/games">Games</Link>
      <Link to="/downloads">Downloads</Link>
      <Link to="/csharp">C#</Link>
      <Link to="/cplusplus">C++</Link>
      <Link to="/python">Python</Link>
      <Link to="/java">Java</Link>
    </aside>
  );
};

export default Sidebar;
