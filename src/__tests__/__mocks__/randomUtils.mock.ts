const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  + '0123456789';

export function randomString(length = 8, characters = CHARACTERS): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random()
      * characters.length));
  }
  return result;
}

export function randomNumber(limit = 1000000): number {
  return Math.floor(Math.random() * limit);
}
