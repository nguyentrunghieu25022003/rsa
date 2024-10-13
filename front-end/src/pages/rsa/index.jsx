import { useState } from "react";
import "./main.css";

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Hàm tìm ước chung lớn nhất (gcd)
const gcd = (a, b) => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

// Hàm tính nghịch đảo modulo
const modInverse = (e, phi) => {
  let m0 = phi, t, q;
  let x0 = 0,
    x1 = 1;

  if (phi === 1) {
    return 0;
  }

  while (e > 1) {
    q = Math.floor(e / phi);
    t = phi;

    phi = e % phi;
    e = t;
    t = x0;

    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) {
    x1 += m0;
  }

  return x1;
};

// Hàm chuyển đổi ký tự thành số
const charToNumber = (char) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.indexOf(char) + 1;
};

// Hàm chuyển đổi số thành ký tự
const numberToChar = (num) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[num - 1];
};

// Hàm mã hóa
const encrypt = (m, e, n) => {
  const encrypted = BigInt(m) ** BigInt(e) % BigInt(n);
  return encrypted.toString();
};

// Hàm giải mã
const decrypt = (c, d, n) => {
  const decrypted = BigInt(c) ** BigInt(d) % BigInt(n);
  return decrypted.toString();
};

// Hàm chọn ngẫu nhiên e sao cho gcd(e, φ(n)) = 1
const chooseRandomE = (phi) => {
  let e = 2 + Math.floor(Math.random() * (phi - 2)); // Chọn ngẫu nhiên e từ (2, phi-1)
  while (gcd(e, phi) !== 1) {
    e = 2 + Math.floor(Math.random() * (phi - 2)); // Chọn lại nếu e không nguyên tố cùng nhau với phi
  }
  return e;
};

const RsaComponent = () => {
  const [p, setP] = useState("");
  const [q, setQ] = useState("");
  const [e, setE] = useState(null);
  const [n, setN] = useState(null);
  const [phi, setPhi] = useState(null);
  const [d, setD] = useState(null);
  const [publicKey, setPublicKey] = useState({});
  const [privateKey, setPrivateKey] = useState({});
  const [message, setMessage] = useState("");
  const [cipherText, setCipherText] = useState([]);
  const [decryptedMessage, setDecryptedMessage] = useState("");

  // Hàm tính toán RSA dựa trên p và q do người dùng nhập
  const calculateRSA = () => {
    const pNum = parseInt(p); // Chuyển đổi p sang số nguyên
    const qNum = parseInt(q); // Chuyển đổi q sang số nguyên

    if (!isPrime(pNum) || !isPrime(qNum)) {
      alert("Vui lòng nhập các số nguyên tố hợp lệ cho p và q!");
      return;
    }

    // Ràng buộc 2: Đảm bảo p và q khác nhau
    if (pNum === qNum) {
      alert("p và q phải là hai số nguyên tố khác nhau!");
      return;
    }

    if (!Number.isInteger(pNum) || !Number.isInteger(qNum) || pNum <= 1 || qNum <= 1) {
      alert("Vui lòng nhập số nguyên tố hợp lệ cho p và q!");
      return;
    }

    const nVal = pNum * qNum;
    const phiVal = (pNum - 1) * (qNum - 1);

    // Chọn giá trị e ngẫu nhiên sao cho gcd(e, φ(n)) = 1
    const eVal = chooseRandomE(phiVal);

    // Tính d bằng thuật toán Euclid mở rộng
    const dVal = modInverse(eVal, phiVal);

    setN(nVal);
    setPhi(phiVal);
    setE(eVal);
    setD(dVal);
    setPublicKey({ e: eVal, n: nVal });
    setPrivateKey({ d: dVal, n: nVal });
  };

  // Hàm xử lý mã hóa thông điệp
  const handleEncrypt = () => {
    if (message && e && n) {
      const messageNumbers = message.toUpperCase().split("").map(charToNumber);

      const encryptedNumbers = messageNumbers.map((m) => encrypt(m, e, n));
      setCipherText(encryptedNumbers);
    } else {
      alert("Vui lòng nhập thông điệp và tính toán RSA trước khi mã hóa.");
    }
  };

  // Hàm xử lý giải mã thông điệp
  const handleDecrypt = () => {
    if (cipherText.length > 0 && d && n) {
      const decryptedNumbers = cipherText.map((c) => decrypt(c, d, n));
      
      const decryptedChars = decryptedNumbers.map((m) => {
          const decryptedInt = parseInt(m);

          if (decryptedInt >= 1 && decryptedInt <= 26) {
              return numberToChar(decryptedInt);
          } else {
              console.error(`Invalid decryption value: ${decryptedInt}`);
              return "?";
          }
      });
      setDecryptedMessage(decryptedChars.join(""));
    } else {
      alert("Vui lòng mã hóa thông điệp trước khi giải mã.");
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <div>
        <label>
          Nhập số nguyên tố p:
          <input
            type="number"
            value={p}
            onChange={(e) => setP(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Nhập số nguyên tố q:
          <input
            type="number"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      
      <button onClick={calculateRSA}>Tính toán RSA</button>
      {n && (
        <div>
          <h2>Kết quả</h2>
          <p>n = p * q = {n}</p>
          <p>{`φ(${n}) = (p - 1) * (q - 1) = ${phi}`}</p>
          <p>{`Giá trị e được chọn ngẫu nhiên: e = ${e}`}</p>
          <p>{`Tính d = e⁻¹ mod φ(${n}): d = ${d}`}</p>
          <p>
            Khóa công khai: {"(e, n)"} = {`(${publicKey.e}, ${publicKey.n})`}
          </p>
          <p>
            Khóa bí mật: {"(d, n)"} = {`(${privateKey.d}, ${privateKey.n})`}
          </p>
        </div>
      )}
      <div>
        <h2>Mã hóa thông điệp</h2>
        <label>
          Nhập thông điệp:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button onClick={handleEncrypt}>Mã hóa</button>
        {cipherText.length > 0 && (
          <p>
            <strong>Kết quả mã hóa:</strong> [{cipherText.join(", ")}]
          </p>
        )}
      </div>
      <div>
        <h2>Giải mã thông điệp</h2>
        <button onClick={handleDecrypt}>Giải mã</button>
        {decryptedMessage && (
          <p>
            <strong>Kết quả giải mã:</strong> {decryptedMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default RsaComponent;