import { isRecord } from "./helpers.js"

export default {
  size: (object: Record<PropertyKey, unknown>): number => {
    if (!isRecord(object)) {
      return 0;
    }
    return Object.keys(object).length;
  },
};