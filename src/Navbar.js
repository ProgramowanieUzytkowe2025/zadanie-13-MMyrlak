import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink to="/tabela-kursowa" className="nav-link">Kursy Walut</NavLink>
        </li>
        <li>
          <NavLink to="/cena-zlota" className="nav-link">Cena Złota</NavLink>
        </li>
        <li>
          <NavLink to="/autor" className="nav-link">Autor</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;