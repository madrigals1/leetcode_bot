export function log(...args: any[]): void {
  // eslint-disable-next-line no-console
  console.log(...args);
}

export function error(...args: any[]): void {
  // eslint-disable-next-line no-console
  console.error(...args);
}

export function delay(msTime: number): Promise<void> {
  return new Promise((res) => setTimeout(res, msTime));
}
export function isTrue(value: string | number | boolean): boolean {
  return ['true', 'True', '1', 't', 'T', 1, true].includes(value);
}

export function isPromise(obj): boolean {
  return !!(obj instanceof Promise && Promise.resolve(obj));
}
