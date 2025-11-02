export function isRecord(arg: unknown): arg is Record<PropertyKey, unknown> {
  return Object.prototype.toString.call(arg) === "[object Object]";
}
export function isArray(arg: unknown): arg is unknown[] {
  return Object.prototype.toString.call(arg) === "[object Array]";
}
export function isBuffer(arg: unknown): arg is Buffer {
  return Buffer.isBuffer(arg);
}