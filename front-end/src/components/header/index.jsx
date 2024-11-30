import { Link } from "react-router-dom";
import "./main.css"; 

const Header = () => {
  return (
    <header className="app-header bg-primary">
      <Link to="/">
        <h1>RSA & Jamstack</h1>
      </Link>
      <nav>
        <ul>
          <li><Link to="/manual">Manual Key Generation</Link></li>
          <li><Link to="/automatic">Automatic Key Generation</Link></li>
          <li><Link to="/history">Key Generation History (Automatic)</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;