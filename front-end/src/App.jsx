import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/index";
import Introduction from "./pages/introduction/index";
import RSAManual from "./pages/rsa/index";
import RSAAuto from "./pages/rsa-auto/index";
import Histories from "./pages/histories/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home><Introduction /></Home>} />
        <Route path="/manual" element={<Home><RSAManual /></Home>} />
        <Route path="/automatic" element={<Home><RSAAuto /></Home>} />
        <Route path="/history" element={<Home><Histories /></Home>} />
      </Routes>
    </Router>
  );
}

export default App;
