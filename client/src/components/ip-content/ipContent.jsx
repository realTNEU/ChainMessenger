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
  const [userAddress, setUserAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    const getUserAddress = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
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
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        } else {
          setUserAddress('');
        }
      });
    }
  }, []);

  
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
          {/* Display sender's MetaMask address as disabled input that looks like a dropdown */}
          <div className="address-select-container">
            <input 
              type="text" 
              className="address-select" 
              value={userAddress || "Sender address..."}
              disabled
              readOnly
            />
            <div className="select-arrow"></div>
          </div>
          
          <div className="arrow-icon">→</div>
          
          {/* Input field that looks like a dropdown for recipient address */}
          <div className="address-select-container">
            <input 
              type="text" 
              className="address-select" 
              placeholder="Recipient address..." 
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            <div className="select-arrow"></div>
          </div>
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
      
     
    </div>
  );
}
// She told me put my heart in the bag
// And nobody gets hurt
// Now I'm running from her love, I'm not fast
// So I'm making it worse
// Now I'm digging up a grave for my past
// I'm a whole different person
// It's a gift and a curse
export default App;