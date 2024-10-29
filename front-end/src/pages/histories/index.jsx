import { useEffect, useState } from "react";
import axios from "axios";
import "./main.css";

const Histories = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      setLoading(false);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/rsa/all`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    })();
  }, []);

  if(loading) {
    return <p>Loading...</p>;
  };

  return (
    <div className="histories-container">
      <h2>Các khóa tự động đã tạo</h2>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div className="key-item" key={index}>
            <div className="key-details">
              <p>
                <strong>Khóa công khai:</strong> {item.publicKey}
              </p>
              <p>
                <strong>Khóa riêng tư:</strong> {item.privateKey}
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