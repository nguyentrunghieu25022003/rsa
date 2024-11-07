import { useState } from "react";
import "./main.css";

// Check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;  
  }
  return true;
};

// Calculate GCD
const gcd = (a, b) => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

// Calculate Modular Inverse using Extended Euclidean Algorithm
const modInverse = (e, phi) => {
  let m0 = phi, t, q;
  let x0 = 0, x1 = 1;
  const steps = [];

  if (phi === 1) return { inverse: 0, steps };

  while (e > 1) {
    q = Math.floor(e / phi);
    t = phi;

    phi = e % phi;
    e = t;
    t = x0;

    x0 = x1 - q * x0;
    x1 = t;

    steps.push(`q = ${q}, φ = ${phi}, e = ${e}, x0 = ${x0}, x1 = ${x1}`);
  }

  if (x1 < 0) x1 += m0;

  return { inverse: x1, steps };
};

// Modular exponentiation for accurate large number handling
const modExp = (base, exp, mod) => {
  base = BigInt(base);
  exp = BigInt(exp);
  mod = BigInt(mod);
  let result = BigInt(1);

  while (exp > 0) {
    if (exp % BigInt(2) === BigInt(1)) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp = exp / BigInt(2);
  }

  return result;
};

// Encryption
const encrypt = (m, e, n) => {
  return modExp(BigInt(m), BigInt(e), BigInt(n)).toString();
};

// Decryption
const decrypt = (c, d, n) => {
  return modExp(BigInt(c), BigInt(d), BigInt(n)).toString();
};

// Select a random e such that gcd(e, φ(n)) = 1
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
  const [e, setE] = useState("");
  const [n, setN] = useState(null);
  const [phi, setPhi] = useState(null);
  const [d, setD] = useState(null);
  const [publicKey, setPublicKey] = useState({});
  const [privateKey, setPrivateKey] = useState({});
  const [message, setMessage] = useState("");
  const [cipherText, setCipherText] = useState([]);
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [encryptionSteps, setEncryptionSteps] = useState([]);
  const [decryptionSteps, setDecryptionSteps] = useState([]);
  const [decryptInput, setDecryptInput] = useState("");
  const [useRandomE, setUseRandomE] = useState(true); // New state for choosing e
  const [modInverseSteps, setModInverseSteps] = useState([]);

  // Calculate RSA keys
  const calculateRSA = () => {
    const pNum = parseInt(p);
    const qNum = parseInt(q);

    if (!isPrime(pNum) || !isPrime(qNum)) {
      alert("Vui lòng nhập giá trị hợp lệ, giá trị đó phải là số nguyên tố!");
      return;
    }

    if (pNum === qNum) {
      alert("p và q phải khác nhau !");
      return;
    }

    const nVal = pNum * qNum;
    if (nVal < 128) {
      alert("Giá trị n quá nhỏ để mã hóa ASCII; vui lòng sử dụng số lớn hơn.");
      return;
    }

    const phiVal = (pNum - 1) * (qNum - 1);
    let eVal;

    // Decide if e should be randomly chosen or user-provided
    if (useRandomE) {
      eVal = chooseRandomE(phiVal);
    } else {
      eVal = parseInt(e);
      if (isNaN(eVal) || gcd(eVal, phiVal) !== 1) {
        alert("Giá trị e vừa nhập không phải là số nguyên tố cùng nhau với φ(n).");
        return;
      }
    }

    const { inverse: dVal, steps } = modInverse(eVal, phiVal);

    setN(nVal);
    setPhi(phiVal);
    setE(eVal);
    setD(dVal);
    setPublicKey({ e: eVal, n: nVal });
    setPrivateKey({ d: dVal, n: nVal });
    setModInverseSteps(steps);
  };

  // Encrypt the message
  const handleEncrypt = () => {
    if (message && e && n) {
      const messageNumbers = message.split("").map((char) => char.charCodeAt(0));

      const encryptedNumbers = [];
      const steps = [];
      messageNumbers.forEach((m) => {
        const encrypted = encrypt(m, e, n);
        encryptedNumbers.push(encrypted);
        steps.push(<span>C = {m}<sup>{e}</sup> mod {n} = {encrypted}</span>);
      });

      setCipherText(encryptedNumbers);
      setEncryptionSteps(steps);
    } else {
      alert("Lỗi, vui lòng kiểm tra lại");
    }
  };

  // Decrypt the message based on input
  const handleDecrypt = () => {
    if (decryptInput && d && n) {
      const encryptedValues = decryptInput.replace(/\[|\]/g, "").split(",").map(Number);
      const decryptedNumbers = [];
      const steps = [];

      encryptedValues.forEach((c) => {
        const decrypted = decrypt(c, d, n);
        decryptedNumbers.push(decrypted);
        steps.push(<span>M = {c}<sup>{d}</sup> mod {n} = {decrypted}</span>);
      });

      const decryptedChars = decryptedNumbers.map((m) => {
        const num = parseInt(m);
        return num >= 32 && num <= 126 ? String.fromCharCode(num) : '?';
      });

      setDecryptedMessage(decryptedChars.join(""));
      setDecryptionSteps(steps);
    } else {
      alert("Vui lòng nhập giá trị hợp lệ");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <label>
          Nhập p:
          <input
            type="number"
            value={p}
            onChange={(e) => setP(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Nhập q:
          <input
            type="number"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            required
          />
        </label>
      </div>

      <div>
        <label className="d-flex align-items-center gap-3">
          Chọn e tự động
          <input
            type="checkbox"
            checked={useRandomE}
            onChange={() => setUseRandomE(!useRandomE)}
          />
        </label>
        {!useRandomE && (
          <input
            type="number"
            value={e}
            onChange={(e) => setE(e.target.value)}
            placeholder="Nhập vào giá trị e..."
            required
          />
        )}
      </div>

      <button className="bg-primary" onClick={calculateRSA}>Tính toán RSA</button>
      {n && (
        <div className="card pt-3 pb-4 mt-4" style={{ paddingLeft: "30px" }}>
          <strong>Kết quả</strong>
          <p>n = p * q = {n}</p>
          <p>{`φ(${n}) = (p - 1) * (q - 1) = ${phi}`}</p>
          <p>{`e = ${e}`}</p>
          <p>{`d = e⁻¹ mod φ(${n}): d = ${d}`}</p>
          <strong>Các bước tính toán d theo thuật toán Euclid</strong>
          <div>
            {modInverseSteps.map((step, index) => (
              <p key={index}>{step}</p>
            ))}
          </div>
          <p>Khóa công khai: (e, n) = ({publicKey.e}, {publicKey.n})</p>
          <p>Khóa riêng tư: (d, n) = ({privateKey.d}, {privateKey.n})</p>
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
            required
          />
        </label>
        <button className="bg-primary" onClick={handleEncrypt}>Mã hóa</button>
        {cipherText.length > 0 && (
          <div>
            <p><strong>Kết quả mã hóa:</strong> [{cipherText.join(", ")}]</p>
            <strong>Các bước thực hiện:</strong>
            <div>
              <p><span>C = m<sup>e</sup> mod n</span></p>
              {encryptionSteps.map((step, index) => (
                <p key={index}>{step}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2>Giải mã thông điệp</h2>
        <label>
          Nhập giá trị cần giải mã (Ngăn cách bởi dấu phẩy):
          <input
            type="text"
            value={decryptInput}
            onChange={(e) => setDecryptInput(e.target.value)}
          />
        </label>
        <button className="bg-primary" onClick={handleDecrypt}>Giải mã</button>
        {decryptedMessage && (
          <div>
            <p><strong>Kết quả giải mã:</strong> {decryptedMessage}</p>
            <strong>Các bước thực hiện:</strong>
            <div>
              <p><span>M = C<sup>d</sup> mod n</span></p>
              {decryptionSteps.map((step, index) => (
                <p key={index}>{step}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RsaComponent;
