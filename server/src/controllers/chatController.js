import User from "../models/Users.js";
import Message from "../models/Message.js";
import { deriveSharedSecret, encryptMessage, decryptMessage } from "../config/encryption.js";

const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;
        if (!sender || !receiver || !message) return res.status(400).json({ error: "Missing fields" });

        const senderUser = await User.findOne({ walletAddress: sender });
        const receiverUser = await User.findOne({ walletAddress: receiver });
        if (!senderUser || !receiverUser) return res.status(404).json({ error: "User not found" });

        const sharedSecret = deriveSharedSecret(senderUser.privateKey, receiverUser.publicKey);
        const { encrypted, iv, authTag } = encryptMessage(message, sharedSecret);

        const newMessage = new Message({ sender, receiver, encrypted, iv, authTag });
        await newMessage.save();

        res.json({ success: true, message: "Message sent" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const getMessages = async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { privateKey } = req.body;
        if (!walletAddress || !privateKey) return res.status(400).json({ error: "Missing fields" });

        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(404).json({ error: "User not found" });

        const messages = await Message.find({ receiver: walletAddress });

        const decryptedMessages = await Promise.all(
            messages.map(async (msg) => {
                const senderUser = await User.findOne({ walletAddress: msg.sender });
                const sharedSecret = deriveSharedSecret(privateKey, senderUser.publicKey);
                return { 
                    sender: msg.sender, 
                    message: decryptMessage(msg.encrypted, sharedSecret, msg.iv, msg.authTag),
                    timestamp: msg.timestamp
                };
            })
        );

        res.json({ messages: decryptedMessages });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { sendMessage, getMessages };
