import { useState } from "react";
import "./main.css";

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

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

const encrypt = (m, e, n) => {
  return modExp(BigInt(m), BigInt(e), BigInt(n)).toString();
};

const decrypt = (c, d, n) => {
  return modExp(BigInt(c), BigInt(d), BigInt(n)).toString();
};

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
  const [useRandomE, setUseRandomE] = useState(true);
  const [modInverseSteps, setModInverseSteps] = useState([]);

  const calculateRSA = () => {
    const pNum = parseInt(p);
    const qNum = parseInt(q);

    if (!isPrime(pNum) || !isPrime(qNum)) {
      alert("Please enter valid values; they must be prime numbers!");
      return;
    }

    if (pNum === qNum) {
      alert("p and q must be different!");
      return;
    }

    const nVal = pNum * qNum;
    if (nVal < 128) {
      alert("n is too small to encrypt ASCII; please use larger numbers.");
      return;
    }

    const phiVal = (pNum - 1) * (qNum - 1);
    let eVal;

    if (useRandomE) {
      eVal = chooseRandomE(phiVal);
    } else {
      eVal = parseInt(e);
      if (isNaN(eVal) || gcd(eVal, phiVal) !== 1) {
        alert("The e value entered is not co-prime with φ(n).");
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

  const handleEncrypt = () => {
    if (message && e && n) {
      const messageNumbers = message.match(/\d+|\S|\s/g)?.map((part) => {
        if (part === " ") return " ";
        return isNaN(part) ? part.charCodeAt(0) : parseInt(part);
      });

      if (!messageNumbers) {
        alert("Message could not be parsed correctly. Please try again.");
        return;
      }

      const encryptedNumbers = [];
      const steps = [];

      messageNumbers.forEach((m) => {
        if (m === " ") {
          encryptedNumbers.push(" ");
          steps.push(<span className="step">Space remains unchanged</span>);
        } else {
          const encrypted = encrypt(m, e, n);
          encryptedNumbers.push(encrypted);
          steps.push(<span className="step">C = {m}<sup>{e}</sup> mod {n} = {encrypted}</span>);
        }
      });

      setCipherText(encryptedNumbers);
      setEncryptionSteps(steps);
    } else {
      alert("Error, please check again");
    }
  };

  const handleDecrypt = () => {
    if (decryptInput && d && n) {
      const encryptedValues = decryptInput.replace(/\[|\]/g, "").split(",").map((part) => (part.trim() === "" ? " " : part.trim()));
      const decryptedNumbers = [];
      const steps = [];

      encryptedValues.forEach((c) => {
        if (c === " ") {
          decryptedNumbers.push(" ");
          steps.push(<span className="step">Space remains unchanged</span>);
        } else {
          const decrypted = decrypt(c, d, n);
          decryptedNumbers.push(decrypted);
          steps.push(<span className="step">M = {c}<sup>{d}</sup> mod {n} = {decrypted}</span>);
        }
      });

      const decryptedChars = decryptedNumbers.map((m, index) => {
        if (m === " ") return " ";
        const originalPart = message.match(/\d+|\S|\s/g)[index]; // Get corresponding original part
        const num = parseInt(m);

        if (!isNaN(num) && num >= 32 && num <= 126 && isNaN(originalPart)) {
          return String.fromCharCode(num); // Convert valid ASCII codes to characters
        } else if (!isNaN(num) && !isNaN(originalPart)) {
          return originalPart; // Keep numeric parts as they are
        } else {
          return "?"; // Handle unexpected cases
        }
      });

      setDecryptedMessage(decryptedChars.join(""));
      setDecryptionSteps(steps);
    } else {
      alert("Error, please check again");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="mb-4">
        <label className="fs-5 fw-normal">
          Enter p:
          <input
            type="number"
            value={p}
            onChange={(e) => setP(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="fs-5 fw-normal">
          Enter q:
          <input
            type="number"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="d-flex align-items-center gap-3 fs-5 fw-normal">
          Choose e automatically
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
            placeholder="Enter e..."
            required
          />
        )}
      </div>
      <button className="bg-primary fs-5 mt-3" onClick={calculateRSA}>Calculate RSA</button>
      {n && (
        <div className="card pt-3 pb-4 mt-4" style={{ paddingLeft: "30px" }}>
          <p className="fs-5 mb-3">1. n = p * q = {n}</p>
          <p className="fs-5 mb-3">{`2. φ(${n}) = (p - 1) * (q - 1) = ${phi}`}</p>
          <p className="fs-5 mb-3">{`3. e = ${e}`}</p>
          <p className="fs-5 mb-3">{`4. d = e⁻¹ mod φ(${n}): d = ${d}`}</p>
          <strong className="fs-5 fw-medium">Steps to calculate d using the Euclidean algorithm</strong>
          <div className="mt-4">
            {modInverseSteps.map((step, index) => (
              <p className="fs-5 mb-3" key={index}>{step}</p>
            ))}
          </div>
          <p className="fs-5 mb-3 fw-medium">Public Key: (e, n) = ({publicKey.e}, {publicKey.n})</p>
          <p className="fs-5 mb-3 fw-medium">Private Key: (d, n) = ({privateKey.d}, {privateKey.n})</p>
        </div>
      )}
      <div>
        <h2 className="fs-3 fw-medium text-center mt-5 mb-3">Encrypt Message</h2>
        <label className="fs-5 fw-normal">
          Enter message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <button className="bg-primary mt-5" onClick={handleEncrypt}>Encrypt</button>
        {cipherText.length > 0 && (
          <div style={{ margin: "10px 0" }}>
            <p style={{ margin: "10px 0" }}><strong>Encrypted Result:</strong> [{cipherText.join(", ")}]</p>
            <strong style={{ margin: "10px 0" }}>Steps:</strong>
            <div>
              <p style={{ margin: "10px 0" }}><span>C = m<sup>e</sup> mod n</span></p>
              {encryptionSteps.map((step, index) => (
                <p key={index}>{step}</p>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className="fs-3 fw-medium text-center mt-5 mb-3">Decrypt Message</h2>
        <label className="fs-5 fw-normal">
          Enter values to decrypt (comma separated):
          <input
            type="text"
            value={decryptInput}
            onChange={(e) => setDecryptInput(e.target.value)}
          />
        </label>
        <button className="bg-primary mt-5" onClick={handleDecrypt}>Decrypt</button>
        {decryptedMessage && (
          <div style={{ margin: "10px 0" }}>
            <p style={{ margin: "10px 0" }}><strong>Decrypted Result:</strong> {decryptedMessage}</p>
            <strong>Steps:</strong>
            <div>
              <p style={{ margin: "10px 0" }}><span>M = C<sup>d</sup> mod n</span></p>
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
