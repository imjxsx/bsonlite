import fs from "node:fs";
import path from "node:path";
import { AES256GCM } from "./utils/aes-256-gcm.js";
import { isBuffer } from "./utils/helpers.js";
import bson from "./utils/bson.js";
import lodash from "lodash";
import Logger from "@imjxsx/logger";

class BSONLite<T extends object> {
  private filepath: string;
  private aes: Nullable<AES256GCM>;
  public data: T;
  public size: number;
  public logger: Logger;
  constructor(filepath: string, logger?: Optional<Logger>, encrypt?: Optional<boolean>, password?: Optional<string>) {
    this.filepath = path.isAbsolute(filepath) ? filepath : path.resolve(filepath);
    this.logger = logger ?? new Logger({
      name: "BSONLite",
      colorize: process.env["NODE_ENV"] !== "production",
      level: process.env["NODE_ENV"] !== "production" ? "DEBUG" : "INFO",
    });
    if (encrypt === true) {
      if (!/\.enc$/.test(filepath)) {
        this.filepath = `${this.filepath.replace(/\.[^/.]+$/, "")}.enc`;
      }
      this.aes = new AES256GCM(password ?? "");
    }
    else {
      if (!/\.bson$/.test(filepath)) {
        this.filepath = `${this.filepath.replace(/\.[^/.]+$/, "")}.bson`;
      }
      this.aes = null;
    }
    this.size = 0;
    this.data = <T>{};
  }
  public async load(): Promise<void> {
    try {
      const before = Date.now();
      if (!Object.keys(this.data).length) {
        try {
          await fs.promises.access(this.filepath);
        } catch {
          await this.save();
          this.logger.info(`Database file initialized to '${this.filepath}'`);
          return;
        }
      }
      this.logger.info(`Loading database from '${this.filepath}'`);
      let blob: Buffer = await fs.promises.readFile(this.filepath);
      if (!isBuffer(blob) || !blob.length) {
        this.logger.warn(`Could not load database from '${this.filepath}'`);
        return;
      }
      if (this.aes) {
        this.logger.trace("Decrypting database.");
        blob = await this.aes.decrypt(blob);
      }
      this.logger.debug("Deserializing database.");
      const deserialized = bson.deserialize<T>(blob);
      if (!deserialized) {
        this.logger.warn("The database could not be deserialized.");
        return;
      }
      this.data = deserialized;
      this.size = blob.length;
      const after = Date.now();
      this.logger.info(`Database loaded successfully in ${after - before} ms.`);
    } catch (e) {
      this.logger.error(e);
    }
  }
  public async save(): Promise<void> {
    try {
      const before = Date.now();
      this.logger.debug("Serializing database.");
      const serialized = bson.serialize(this.data);
      if (!serialized) {
        this.logger.warn("It could not be serialized to a database.");
        return;
      }
      let blob = serialized;
      if (this.aes) {
        this.logger.trace("Encrypting database.");
        blob = await this.aes.encrypt(serialized);
      }
      this.logger.info(`Saving database in '${this.filepath}'`);
      await fs.promises.writeFile(this.filepath, blob);
      const after = Date.now();
      this.logger.info(`Database saved successfully in ${after - before} ms.`);
    } catch (e) {
      this.logger.error(e);
    }
  }
  public set(path: string, value: unknown): BSONLite<T> {
    lodash.set(this.data, path, value);
    return this;
  }
  public get<T>(path: string): T {
    return lodash.get(this.data, path) as T;
  }
  public has(path: string): boolean {
    return lodash.has(this.data, path);
  }
}
export default BSONLite;
export { BSONLite };