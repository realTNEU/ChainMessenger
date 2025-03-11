import React, { useState, useEffect } from "react";
import "./LandingPage.css";

function LandingPage() {
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to handle redirection to the chat page
  const handleRedirect = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.href = "/IpTracker"; // Use window.location instead of Router navigation
    }, 800); // Delay navigation to allow animation to complete
  };

  // Animation for blockchain nodes
  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = document.querySelectorAll('.blockchain-node');
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      if (randomNode) {
        randomNode.classList.add('pulse');
        setTimeout(() => {
          randomNode.classList.remove('pulse');
        }, 1000);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`landing-container ${isAnimating ? 'fade-out' : ''}`}>
      <div className="blockchain-background">
        <div className="blockchain-grid">
          {Array(30)
            .fill()
            .map((_, i) => (
              <div key={i} className="blockchain-node">
                <div className="node-inner"></div>
              </div>
            ))}
        </div>
      </div>

      <div className="content-container">
        <div className="connect-container">
          <h1 className="title-animate">Secure Messaging on the Blockchain</h1>
          <p className="subtitle-animate">Experience truly decentralized communication.</p>

          <div className="button-group">
            <button className="connect-button" onClick={handleRedirect}>
              Sign Up
            </button>
            <button className="metamask-button" onClick={handleRedirect}>
              <span className="metamask-icon">🦊</span>
              <span>Connect with MetaMask</span>
              <span className="coming-soon">Soon</span>
            </button>
          </div>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">End-to-End Encryption</div>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">Fast & Reliable</div>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <div className="feature-text">Gas-Optimized</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔗</div>
              <div className="feature-text">Fully Decentralized</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;