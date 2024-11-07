import { Link } from "react-router-dom";
import "./main.css"; 

const Header = () => {
  return (
    <header className="app-header bg-primary">
      <h1>RSA & Jamstack</h1>
      <nav>
        <ul>
          <li><Link to="/">Tạo khóa thủ công</Link></li>
          <li><Link to="/rsa-auto">Tạo khóa tự động</Link></li>
          <li><Link to="/histories">Lịch sử tạo khóa (Tự động)</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;