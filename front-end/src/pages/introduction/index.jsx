import { Link } from "react-router-dom";

const Introduction = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center fs-1 fw-medium">Welcome to RSA & Jamstack</h1>
      <p className="lead text-center mt-4 mb-2">
        This application demonstrates the RSA encryption algorithm and how it
        can be integrated with modern Jamstack architecture for secure data
        transmission.
      </p>
      <div className="d-flex justify-content-center mt-4 mb-4">
        <img
          src="/Block-diagram-of-RSA-algorithm.png"
          alt="RSA Algorithm Block Diagram"
          className="img-fluid"
          style={{ maxWidth: "80%", height: "auto" }}
        />
      </div>
      <p className="text-center fst-italic">RSA Algorithm Block Diagram</p>
      <section className="mt-3 mb-3">
        <h2 className="display-4 text-primary fs-5">What is RSA?</h2>
        <p className="lead mt-2 mb-2">
          RSA is a public-key encryption algorithm that uses two keys: a public
          key for encryption and a private key for decryption. It is widely used
          in secure communications, including HTTPS connections and digital
          signatures.
        </p>
        <p className="lead mt-2 mb-2">
          The security of RSA comes from the difficulty of factoring large
          composite numbers. The algorithm is based on the mathematical
          properties of prime numbers and their relationship to modular
          arithmetic.
        </p>
      </section>
      <section className="mt-3 mb-3">
        <h2 className="display-4 text-primary fs-5">What is Jamstack?</h2>
        <p className="lead mt-2 mb-2">
          Jamstack is a modern web development architecture that focuses on
          delivering fast and secure websites using pre-built static assets
          (HTML, CSS, JS) served from a CDN. Jamstack is built on the principles
          of decoupling the front-end and back-end, which can provide better
          performance, security, and scalability.
        </p>
      </section>
      <section className="mt-3 mb-3">
        <h2 className="display-4 text-primary fs-5">How This App Works</h2>
        <p className="lead mt-2 mb-2">
          This app allows you to generate RSA keys (public and private), encrypt
          messages using RSA, and decrypt them securely. You can generate keys
          manually or automatically, and you can also view the history of key
          generation.
        </p>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Manual Key Generation:</strong> You can enter your own prime
            numbers to create a pair of keys for encryption and decryption.
          </li>
          <li className="list-group-item">
            <strong>Automatic Key Generation:</strong> You can let the app
            generate keys automatically for you with a selected key size.
          </li>
          <li className="list-group-item">
            <strong>Key Generation History:</strong> View the history of
            automatically generated keys.
          </li>
        </ul>
      </section>
      <section className="mt-3 mb-3">
        <h2 className="display-4 text-primary fs-5">Start Exploring</h2>
        <p className="lead mt-2 mb-2">
          Ready to get started? You can generate your own RSA keys and start
          encrypting and decrypting messages right away. Choose an option below:
        </p>
        <div className="text-center mt-4 mb-2">
          <Link to="/" class="btn btn-primary mx-2">
            Manual Key Generation
          </Link>
          <Link to="/automatic" class="btn btn-primary mx-2">
            Automatic Key Generation
          </Link>
          <Link to="/history" class="btn btn-primary mx-2">
            Key Generation History
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Introduction;