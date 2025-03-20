import crypto from "crypto";

export const deriveSharedSecret = (privateKey, publicKey) => {
    const ecdh = crypto.createECDH("secp256k1");
    ecdh.setPrivateKey(Buffer.from(privateKey, "hex"));
    return ecdh.computeSecret(Buffer.from(publicKey, "hex")).toString("hex");
};

export const encryptMessage = (message, sharedSecret) => {
    const key = crypto.createHash("sha256").update(sharedSecret).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encrypted = cipher.update(message, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return { encrypted, iv: iv.toString("hex"), authTag };
};

export const decryptMessage = (encrypted, iv, authTag, sharedSecret) => {
    const key = crypto.createHash("sha256").update(sharedSecret).digest();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};
