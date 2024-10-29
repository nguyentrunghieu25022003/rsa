import { Link } from "react-router-dom";
import "./main.css"; 

const Header = () => {
  return (
    <header className="app-header">
      <h1>RSA & Jamstack</h1>
      <nav>
        <ul>
          <li><Link to="/">Thủ công</Link></li>
          <li><Link to="/rsa-auto">Tự động</Link></li>
          <li><Link to="/histories">Lịch sử tạo khóa</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;