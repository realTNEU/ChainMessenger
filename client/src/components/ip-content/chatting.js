import React, { useState, useRef, useEffect } from 'react';
import './chatting.css';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'I love this blockchain app!', sender: 'user' },
    { text: 'hi, how are you doing?', sender: 'recipient' },
    { text: 'yes, but each message costs you gas, be careful 💰', sender: 'user' },
    { text: "yes, we'll monitor the gas later right?", sender: 'recipient' }
  ]);
  
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      
      const newMessages = [...messages, { text: message, sender: 'user' }];
      setMessages(newMessages);
      
      
      setMessage('');
      

    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    
    localStorage.setItem('blockchainChatMessages', JSON.stringify(messages));
  }, [messages]);


  useEffect(() => {
    const savedMessages = localStorage.getItem('blockchainChatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  return (
    <div className="app-container">
      <div className="chat-section">
        <div className="address-bar">
          <select className="address-select">
            <option value="">Select sender address...</option>
          </select>
          <div className="arrow-icon">→</div>
          <select className="address-select">
            <option value="">Select recipient address...</option>
          </select>
        </div>
        
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.sender === 'user' ? 'sender-message' : 'recipient-message'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="message-input">
          <input 
            type="text" 
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
      
      <div className="info-panel">
        <div className="info-section">
          <div className="info-title">Blockchain state</div>
          <div className="info-item">Number of blocks: 466</div>
          <div className="info-item">Last transaction gas: 1500000</div>
        </div>
        
        <div className="address-info">
          <div className="address-title">Sender address:</div>
          <div className="address-value"></div>
          <div className="info-item">Number of transactions: 3</div>
          <div className="info-item">Wallet balance: 99.9923538 ETH</div>
        </div>
        
        <div className="address-info recipient">
          <div className="address-title">Recipient address:</div>
          <div className="address-value"></div>
          <div className="info-item">Number of transactions: 416</div>
          <div className="info-item">Wallet balance: 77.49212746 ETH</div>
        </div>
      </div>
    </div>
  );
}

export default App;