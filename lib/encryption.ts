import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  console.error("ENCRYPTION_KEY must be 64 characters (32 bytes)");
}

function getKey() {
  return Buffer.from(ENCRYPTION_KEY, 'hex');
}

// Encrypt function
export function encrypt(text) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', getKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

// Decrypt function
export function decrypt(encryptedText) {
  try {
    const [ivHex, encryptedData] = encryptedText.split(':');
    if (!ivHex || !encryptedData) {
      throw new Error("Invalid encrypted data format");
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', getKey(), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

// Generate encrypted token
export function generateEncryptedToken(email, otp) {
  const data = {
    email: email,
    otp: otp,
    expires: Date.now() + 10 * 60 * 1000
  };
  return encrypt(JSON.stringify(data));
}

// Decrypt token
export function decryptToken(encryptedToken) {
  try {
    const decrypted = decrypt(encryptedToken);
    const data = JSON.parse(decrypted);
    
    if (data.expires && Date.now() > data.expires) {
      throw new Error("Verification link has expired");
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || "Invalid verification token");
  }
}