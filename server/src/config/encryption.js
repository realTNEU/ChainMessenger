import crypto from "crypto";

const generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
        namedCurve: "secp256k1",
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });
    return { publicKey, privateKey };
};

const deriveSharedSecret = (privateKey, publicKey) => {
    const ecdh = crypto.createECDH("secp256k1");
    ecdh.setPrivateKey(Buffer.from(privateKey, "hex"));
    return ecdh.computeSecret(Buffer.from(publicKey, "hex")).toString("hex");
};

const encryptMessage = (message, secretKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(secretKey, "hex"), iv);
    let encrypted = cipher.update(message, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return { encrypted, iv: iv.toString("hex"), authTag };
};

const decryptMessage = (encrypted, secretKey, iv, authTag) => {
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(secretKey, "hex"), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

export { generateKeyPair, deriveSharedSecret, encryptMessage, decryptMessage };
