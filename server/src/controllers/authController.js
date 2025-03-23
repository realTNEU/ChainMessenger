import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const registerUser = async (req, res) => {
    try {
        const { walletAddress, publicKey } = req.body;
        if (!walletAddress || !publicKey) return res.status(400).json({ error: "Missing fields" });

        let user = await User.findOne({ walletAddress });
        if (user) return res.status(400).json({ error: "User already exists" });

        user = new User({ walletAddress, publicKey });
        await user.save();

        const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { walletAddress } = req.body;
        if (!walletAddress) return res.status(400).json({ error: "Wallet address is required" });

        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(404).json({ error: "User not found" });

        const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
