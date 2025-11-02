import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { pbkdf } from "./pbkdf.js";

export class AES256GCM {
  private readonly version: number;
  private readonly password: string;
  constructor(password: string) {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{12,}$/.test(password)) {
      throw new Error("The password you entered isn’t secure. It must include letters, numbers, special characters, and be at least 12 characters long.");
    }
    this.version = 1;
    this.password = password;
  }
  public async encrypt(plain: Buffer): Promise<Buffer> {
    const version = Buffer.from([this.version]);
    const salt = randomBytes(16);
    const key = await pbkdf(this.password, salt, 100_000, 32, "sha256");
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ct = Buffer.concat([
      cipher.update(plain),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([
      version,
      salt,
      iv,
      tag,
      ct,
    ]);
  }
  public async decrypt(blob: Buffer): Promise<Buffer> {
    const version = blob.readInt8(0);
    if (version !== this.version) {
      throw new Error("Unsupported version.");
    }
    const salt = blob.subarray(1, 17);
    const key = await pbkdf(this.password, salt, 100_000, 32, "sha256");
    const iv = blob.subarray(17, 29);
    const tag = blob.subarray(29, 45);
    const ct = blob.subarray(45);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(ct),
      decipher.final(),
    ]);
  }
}