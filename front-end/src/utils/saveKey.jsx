import axios from "axios";

export const handleSaveKey = async (publicKey, privateKey) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/rsa/create`,
      {
        publicKey: publicKey,
        privateKey: privateKey,
      }
    );

    if (response.status === 200) {
      console.log("Success !");
    }
  } catch (err) {
    console.error(err);
  }
};