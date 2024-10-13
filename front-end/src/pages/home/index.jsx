import Header from "../../components/header/index";

// eslint-disable-next-line react/prop-types
const Home = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Home;