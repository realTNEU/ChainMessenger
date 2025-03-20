import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatting.css";

// Load environment variables
const API_URL = import.meta.env.VITE_API_URL;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

function ChattingContent() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const messagesEndRef = useRef(null);

  // Fetch user address from MetaMask
  useEffect(() => {
    const getUserAddress = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
          }
        }
      } catch (error) {
        console.error("Error accessing MetaMask account:", error);
      }
    };

    getUserAddress();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setUserAddress(accounts.length > 0 ? accounts[0] : "");
      });
    }
  }, []);

  // Auto-fetch messages when recipient address changes
  useEffect(() => {
    if (recipientAddress.trim()) {
      fetchMessages();
    }
  }, [recipientAddress]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat messages
  const fetchMessages = async () => {
    if (!recipientAddress.trim()) return;
    try {
      const response = await axios.post(
        `${API_URL}/messages`,
        { receiverAddress: recipientAddress },
        { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (message.trim() === "" || recipientAddress.trim() === "") return;

    try {
      await axios.post(
        `${API_URL}/send`,
        { receiverAddress: recipientAddress, message },
        { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
      );

      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-section">
        {/* Address Selection */}
        <div className="address-bar">
          <div className="address-select-container">
            <input
              type="text"
              className="address-select"
              value={userAddress || "Sender address..."}
              disabled
              readOnly
            />
          </div>

          <div className="arrow-icon">→</div>

          <div className="address-select-container">
            <input
              type="text"
              className="address-select"
              placeholder="Recipient address..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "user" ? "sender-message" : "recipient-message"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="message-input">
          <input
            type="text"
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChattingContent;
