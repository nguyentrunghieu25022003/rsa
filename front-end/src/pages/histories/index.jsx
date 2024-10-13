import { useEffect, useState } from "react";
import axios from "axios";
import "./main.css";

const Histories = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/rsa/all`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    })();
  }, []);

  return (
    <div className="histories-container">
      <h2>RSA Key Pairs</h2>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div className="key-item" key={index}>
            <div className="key-details">
              <p>
                <strong>Public Key:</strong> {item.publicKey}
              </p>
              <p>
                <strong>Private Key:</strong> {item.privateKey}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No key pairs found.</p>
      )}
    </div>
  );
};

export default Histories;