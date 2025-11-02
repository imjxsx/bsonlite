import { pbkdf2 } from "node:crypto";
import { promisify } from "node:util";

export async function pbkdf(password: string, salt: Buffer, iterations: number, keylen: number, digest: string): Promise<Buffer> {
  const fn = promisify(pbkdf2);
  return await fn(password, salt, iterations, keylen, digest);
}