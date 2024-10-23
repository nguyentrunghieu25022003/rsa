import { useState } from "react";
import "./main.css";

// Kiểm tra số nguyên tố
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Tìm ước chung lớn nhất (gcd)
const gcd = (a, b) => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

// Tính nghịch đảo modulo
const modInverse = (e, phi) => {
  let m0 = phi, t, q;
  let x0 = 0, x1 = 1;

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

// Chuyển đổi ký tự thành số
const charToNumber = (char) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.indexOf(char) + 1;
};

// Chuyển đổi số thành ký tự
const numberToChar = (num) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[num - 1];
};

// Mã hóa
const encrypt = (m, e, n) => {
  const encrypted = BigInt(m) ** BigInt(e) % BigInt(n);
  return encrypted.toString();
};

// Giải mã
const decrypt = (c, d, n) => {
  const decrypted = BigInt(c) ** BigInt(d) % BigInt(n);
  return decrypted.toString();
};

// Chọn ngẫu nhiên e sao cho gcd(e, φ(n)) = 1
const chooseRandomE = (phi) => {
  let e = 2 + Math.floor(Math.random() * (phi - 2));
  while (gcd(e, phi) !== 1) {
    e = 2 + Math.floor(Math.random() * (phi - 2));
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

  // Tính toán RSA
  const calculateRSA = () => {
    const pNum = parseInt(p);
    const qNum = parseInt(q);

    if (!isPrime(pNum) || !isPrime(qNum)) {
      alert("Vui lòng nhập các số nguyên tố hợp lệ cho p và q!");
      return;
    }

    if (pNum === qNum) {
      alert("p và q phải là hai số nguyên tố khác nhau!");
      return;
    }

    const nVal = pNum * qNum;
    const phiVal = (pNum - 1) * (qNum - 1);

    const eVal = chooseRandomE(phiVal);

    const dVal = modInverse(eVal, phiVal);

    setN(nVal);
    setPhi(phiVal);
    setE(eVal);
    setD(dVal);
    setPublicKey({ e: eVal, n: nVal });
    setPrivateKey({ d: dVal, n: nVal });
  };

  // Mã hóa thông điệp
  const handleEncrypt = () => {
    if (message && e && n) {
      const messageNumbers = message.toUpperCase().split("").map((char) => {
          const number = charToNumber(char);
          return number !== 0 ? number : 27;
        });

      const encryptedNumbers = messageNumbers.map((m) => encrypt(m, e, n));
      setCipherText(encryptedNumbers);
    } else {
      alert("Vui lòng nhập thông điệp và tính toán RSA trước khi mã hóa.");
    }
  };

  // Giải mã thông điệp
  const handleDecrypt = () => {
    if (cipherText.length > 0 && d && n) {
      const decryptedNumbers = cipherText.map((c) => decrypt(c, d, n));

      const decryptedChars = decryptedNumbers.map((m) => {
        const decryptedInt = parseInt(m);
        return decryptedInt >= 1 && decryptedInt <= 26
          ? numberToChar(decryptedInt)
          : " ";
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