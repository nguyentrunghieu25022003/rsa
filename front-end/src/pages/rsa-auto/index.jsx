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
  const [decryptInput, setDecryptInput] = useState("");

  const generateKeys = () => {
    const rsa = forge.pki.rsa;
    rsa.generateKeyPair({ bits: keySize, workers: -1 }, async (err, keypair) => {
      if (err) {
        alert("There was an error generating the keys!");
        return;
      }
      setAutoPublicKey(keypair.publicKey);
      setAutoPrivateKey(keypair.privateKey);
      const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
      const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
      await handleSaveKey(publicKeyPem, privateKeyPem);
      setCipherText("");
      setDecryptedMessage("");
    });
  };

  const handleAutoEncrypt = () => {
    if (message && autoPublicKey) {
      try {
        const encrypted = autoPublicKey.encrypt(message, "RSA-OAEP");
        setCipherText(forge.util.encode64(encrypted));
      } catch (error) {
        alert("Error during encryption: " + error.message);
      }
    } else {
      alert("Please enter a message and generate the keys before encrypting.");
    }
  };

  const handleAutoDecrypt = () => {
    if (decryptInput && autoPrivateKey) {
      try {
        const isBase64 = /^[A-Za-z0-9+/=]+$/.test(decryptInput);
        if (!isBase64) {
          alert("Please enter a valid base64 encoded ciphertext.");
          return;
        }
        const decodedCipher = forge.util.decode64(decryptInput);
        const decrypted = autoPrivateKey.decrypt(decodedCipher, "RSA-OAEP");
        setDecryptedMessage(decrypted); 
      } catch (error) {
        alert("Error during decryption: " + error.message);
      }
    } else {
      alert("Please enter an encrypted message to decrypt.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="select-container d-flex align-items-center">
        <label className="fs-5 fw-normal">Select Key Size (bits):</label>
        <select
          className="mb-2"
          value={keySize}
          onChange={(e) => setKeySize(parseInt(e.target.value))}
        >
          <option value={1024}>1024</option>
          <option value={2048}>2048</option>
          <option value={3072}>3072</option>
          <option value={4096}>4096</option>
        </select>
      </div>
      <button className="bg-primary mt-5 mb-3" onClick={generateKeys}>Generate Keys Automatically</button>
      {autoPublicKey && autoPrivateKey && (
        <div>
          <h3 className="mt-3">Public Key (Automatically Generated):</h3>
          <textarea
            value={forge.pki.publicKeyToPem(autoPublicKey)}
            readOnly
            rows={6}
            cols={50}
          />
          <h3 className="mt-3">Private Key (Automatically Generated):</h3>
          <textarea
            value={forge.pki.privateKeyToPem(autoPrivateKey)}
            readOnly
            rows={6}
            cols={50}
          />
        </div>
      )}
      <div>
        <h2 className="fs-3 fw-medium text-center mt-5 mb-3">Encrypt with Automatically Generated Keys</h2>
        <label className="fs-5 fw-normal">
          Enter Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button className="bg-primary mt-5" onClick={handleAutoEncrypt}>Encrypt</button>
        {cipherText && (
          <div className="card mt-3" style={{ padding: "0 20px" }}>
            <p className="pt-5 pb-5">{cipherText}</p>
          </div>
        )}
      </div>
      <div>
        <h2 className="fs-3 fw-medium text-center mt-5 mb-3">Decrypt with Automatically Generated Keys</h2>
        <label className="fs-5 fw-normal">
          Enter Ciphertext (Base64):
          <input
            type="text"
            value={decryptInput}
            onChange={(e) => setDecryptInput(e.target.value)}
          />
        </label>
        <button className="bg-primary mt-5" onClick={handleAutoDecrypt}>Decrypt</button>
        {decryptedMessage && (
          <div className="card mt-3" style={{ padding: "0 20px" }}>
            <p className="pt-5 pb-5">{decryptedMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoRSAComponent;