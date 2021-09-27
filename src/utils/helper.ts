export function log(...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.log(...args);
}

export function error(...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.error(...args);
}

export function delay(msTime: number): Promise<void> {
  return new Promise((res) => setTimeout(res, msTime));
}

export function isTrue(value: string | number | boolean): boolean {
  return ['true', 'True', '1', 't', 'T', 1, true].includes(value);
}

export function isPromise(obj: unknown): boolean {
  return !!(obj instanceof Promise && Promise.resolve(obj));
}

export function isValidHttpUrl(urlString: string): boolean {
  let url: URL;

  try {
    url = new URL(urlString);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function generateString(
  length: number, chars: string = null,
): string {
  let usableChars: string;

  if (chars) {
    usableChars = chars;
  } else {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    const extra = '';
    usableChars = alpha + num + extra;
  }

  let result = '';
  const charactersLength = usableChars.length;

  for (let i = 0; i < length; i++) {
    result += usableChars.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
