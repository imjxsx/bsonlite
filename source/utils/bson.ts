import { BSON } from "bson";
import { isArray, isRecord } from "./helpers.js";

export default {
  serialize: (object: unknown): Nullable<Buffer> => {
    try {
      if (!isRecord(object) && !isArray(object)) {
        return null;
      }
      return Buffer.from(BSON.serialize(object));
    } catch {
      return null;
    }
  },
  deserialize: <T>(blob: Buffer): Nullable<T> => {
    try {
      return BSON.deserialize(blob) as T;
    } catch {
      return null;
    }
  },
};