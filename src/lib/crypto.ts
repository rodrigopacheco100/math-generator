import { env } from "./env";

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);
  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(data: string): Promise<string> {
  const secret = env.NEXT_PUBLIC_CACHE_SECRET;
  const key = await getCryptoKey(secret);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    dataBuffer,
  );

  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const encryptedHex = Array.from(new Uint8Array(encryptedBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return ivHex + encryptedHex;
}

export async function decrypt(ciphertext: string): Promise<string | null> {
  try {
    const secret = env.NEXT_PUBLIC_CACHE_SECRET;
    const key = await getCryptoKey(secret);

    const ivHex = ciphertext.slice(0, IV_LENGTH * 2);
    const encryptedHex = ciphertext.slice(IV_LENGTH * 2);

    const iv = new Uint8Array(
      ivHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [],
    );
    const encryptedBuffer = new Uint8Array(
      encryptedHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [],
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encryptedBuffer,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
}
