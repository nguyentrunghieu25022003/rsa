import { useEffect, useState } from "react";
import axios from "axios";
import "./main.css";

const Histories = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/rsa/all`
        );
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <p className="fs-4">Loading...</p>
      </div>
    );
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
        <p>Lịch sử trống</p>
      )}
    </div>
  );
};

export default Histories;