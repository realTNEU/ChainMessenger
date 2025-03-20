import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LandingPage.css";

function LandingPage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAddress");
    const savedToken = localStorage.getItem("authToken");

    if (savedAccount) setAccount(savedAccount);
    if (savedToken) setToken(savedToken);
  }, []);

  const handleRedirect = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.href = "/Chatting";
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nodes = document.querySelectorAll(".blockchain-node");
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      if (randomNode) {
        randomNode.classList.add("pulse");
        setTimeout(() => {
          randomNode.classList.remove("pulse");
        }, 1000);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const checkIfMetaMaskIsInstalled = () => {
    return Boolean(window.ethereum && window.ethereum.isMetaMask);
  };

  const connectToMetaMask = async () => {
    setIsConnecting(true);
  
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      alert("MetaMask is not installed. Please install it to continue.");
      setIsConnecting(false);
      return;
    }
  
    try {
      // Request wallet connection
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  
      if (!accounts || accounts.length === 0) {
        alert("No accounts found. Please try again.");
        setIsConnecting(false);
        return;
      }
  
      const walletAddress = accounts[0];
  
      // Set wallet address in state and local storage
      setAccount(walletAddress);
      localStorage.setItem("walletAddress", walletAddress);
  
      // Fetch public key from MetaMask (EIP-4361 or similar method)
      let publicKey;
      try {
        publicKey = await window.ethereum.request({
          method: "eth_getEncryptionPublicKey",
          params: [walletAddress],
        });
      } catch (error) {
        console.error("Failed to get public key:", error);
        alert("Failed to retrieve public key from MetaMask.");
        setIsConnecting(false);
        return;
      }
  
      // Attempt login
      try {
        const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
          walletAddress,
        });
  
        if (loginResponse.data.token) {
          localStorage.setItem("authToken", loginResponse.data.token);
          setToken(loginResponse.data.token);
          console.log("Login successful:", walletAddress);
        }
      } catch (loginError) {
        // If login fails with 404, register the user
        if (loginError.response && loginError.response.status === 404) {
          console.log("User not found. Registering...");
  
          const registerResponse = await axios.post("http://localhost:5000/api/auth/register", {
            walletAddress,
            publicKey,
          });
  
          if (registerResponse.status === 201) {
            console.log("Registration successful. Logging in...");
  
            // After registration, attempt login again
            const newLoginResponse = await axios.post("http://localhost:5000/api/auth/login", {
              walletAddress,
            });
  
            if (newLoginResponse.data.token) {
              localStorage.setItem("authToken", newLoginResponse.data.token);
              setToken(newLoginResponse.data.token);
              console.log("Login successful after registration:", walletAddress);
            }
          }
        } else {
          console.error("Login failed:", loginError);
          alert("Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };
  
  

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleContinueToChat = () => {
    handleRedirect();
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        } else {
          setAccount(null);
          localStorage.removeItem("walletAddress");
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return (
    <div className={`landing-container ${isAnimating ? "fade-out" : ""}`}>
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
          <p className="subtitle-animate">
            Experience truly decentralized communication.
          </p>

          <div className="button-group">
            {account ? (
              <>
                <div className="wallet-display">
                  <span className="metamask-icon">🦊</span>
                  <span className="wallet-address">{formatAddress(account)}</span>
                </div>
                <button className="connect-button" onClick={handleContinueToChat}>
                  Enter App
                </button>
              </>
            ) : (
              <button
                className="metamask-button"
                onClick={connectToMetaMask}
                disabled={isConnecting}
              >
                <span className="metamask-icon">🦊</span>
                <span>{isConnecting ? "Connecting..." : "Connect with MetaMask"}</span>
              </button>
            )}
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
              <div className="feature-icon">👨🏻‍💻</div>
              <div className="feature-text">Anonymous</div>
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
