import { useState } from "react";
import forge from "node-forge";
import { handleSaveKey } from "../../utils/saveKey";
import "./main.css";

const AutoRSAComponent = () => {
  const [keySize, setKeySize] = useState(1024);
  const [autoPublicKey, setAutoPublicKey] = useState(null);
  const [autoPrivateKey, setAutoPrivateKey] = useState(null);
  const [message, setMessage] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");

  // Hàm sinh cặp khóa RSA dựa trên kích thước khóa
  const generateKeys = () => {
    const rsa = forge.pki.rsa;
    rsa.generateKeyPair({ bits: keySize, workers: -1 }, async (err, keypair) => {
      if (err) {
        alert("Có lỗi khi tạo khóa!");
        return;
      }
      setAutoPublicKey(keypair.publicKey);
      setAutoPrivateKey(keypair.privateKey);
      const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey); // Chuyển khóa công khai thành chuỗi PEM
      const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
      await handleSaveKey(publicKeyPem, privateKeyPem);
      setCipherText(""); // Reset kết quả mã hóa
      setDecryptedMessage(""); // Reset kết quả giải mã
    });
  };

  // Hàm mã hóa với khóa tự động
  const handleAutoEncrypt = () => {
    if (message && autoPublicKey) {
      const encrypted = autoPublicKey.encrypt(message, "RSA-OAEP");
      setCipherText(forge.util.encode64(encrypted));
    } else {
      alert("Vui lòng nhập thông điệp và tạo khóa tự động trước khi mã hóa.");
    }
  };

  // Hàm giải mã với khóa tự động
  const handleAutoDecrypt = () => {
    if (cipherText && autoPrivateKey) {
      const decodedCipher = forge.util.decode64(cipherText);
      const decrypted = autoPrivateKey.decrypt(decodedCipher, "RSA-OAEP");
      setDecryptedMessage(decrypted);
    } else {
      alert("Vui lòng mã hóa thông điệp trước khi giải mã.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="select-container">
        <label>Chọn kích thước khóa (bit):</label>
        <select
            value={keySize}
            onChange={(e) => setKeySize(parseInt(e.target.value))}
        >
            <option value={1024}>1024</option>
            <option value={2048}>2048</option>
            <option value={3072}>3072</option>
            <option value={4096}>4096</option>
        </select>
      </div>
      <button onClick={generateKeys}>Tạo khóa tự động</button>

      {autoPublicKey && autoPrivateKey && (
        <div>
          <h3>Khóa công khai (tự động):</h3>
          <textarea
            value={forge.pki.publicKeyToPem(autoPublicKey)}
            readOnly
            rows={6}
            cols={50}
          />
          <h3>Khóa bí mật (tự động):</h3>
          <textarea
            value={forge.pki.privateKeyToPem(autoPrivateKey)}
            readOnly
            rows={6}
            cols={50}
          />
        </div>
      )}

      <div>
        <h2>Mã hóa với khóa tự động</h2>
        <label>
          Nhập thông điệp:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button onClick={handleAutoEncrypt}>Mã hóa</button>
        {cipherText && (
          <p>
            <strong>Kết quả mã hóa:</strong> {cipherText}
          </p>
        )}
      </div>

      <div>
        <h2>Giải mã với khóa tự động</h2>
        <button onClick={handleAutoDecrypt}>Giải mã</button>
        {decryptedMessage && (
          <p>
            <strong>Kết quả giải mã:</strong> {decryptedMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AutoRSAComponent;