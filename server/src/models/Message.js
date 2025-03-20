import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    encrypted: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);
