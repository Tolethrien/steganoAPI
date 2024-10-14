"use server";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
export interface Cipher {
  password: string;
  msg: string;
}
/**
 * @description encrypt text with aes-256-cbc algorithm
 * @returns encrypted text and password to decipher
 */
export async function cipher(text: string) {
  if (text.length === 0) showError("trying to encrypt empty text");
  const { iv, key } = generateKeyAndIV();
  const cipher = createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  return {
    password: key + iv,
    msg: cipher.update(text, "utf-8", "hex") + cipher.final("hex"),
  };
}
/**
 * @description  decrypt text with aes-256-cbc algorithm
 * @returns decrypted text
 */
export async function decipher(password: string, text: string) {
  if (password.length !== 96)
    showError(
      "Decipher Error: Password needs to be 96 chars long - 64 key, 32 iv, combined"
    );

  const key = password.slice(0, 64);
  const iv = password.slice(64);
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  try {
    return decipher.update(text, "hex", "utf-8") + decipher.final("utf-8");
  } catch {
    return null;
  }
}
function generateKeyAndIV() {
  const key = randomBytes(32).toString("hex");
  const iv = randomBytes(16).toString("hex");
  return { key, iv };
}
const showError = (text: string) => console.error(`\x1b[31m${text}\x1b[0m`);
