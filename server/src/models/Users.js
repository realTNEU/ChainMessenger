import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    publicKey: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
