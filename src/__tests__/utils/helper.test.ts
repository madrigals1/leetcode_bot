import {
  isTrue,
  delay,
  log,
  error,
  isPromise,
  isValidHttpUrl,
  generateString,
} from '../../utils/helper';

test('utils.helper.isTrue function', () => {
  const trueValues: Array<string | number | boolean> = [
    'true', 'True', '1', 't', 'T', 1, true,
  ];

  // Check true valuess
  trueValues.forEach((value: string | number | boolean) => {
    expect(isTrue(value)).toBe(true);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const falseValues: Array<any> = [
    'false',
    'False',
    '0',
    'f',
    'F',
    0,
    'any string',
    false,
    123,
    {},
    [],
    '',
    null,
    undefined,
  ];

  // Check false valuess
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  falseValues.forEach((value: any) => expect(isTrue(value)).toBe(false));
});

test('utils.helper.delay function', async () => {
  expect(delay(1).then).not.toBe(undefined);

  const timeMsBefore: number = new Date().getTime();
  await delay(500);
  const timeMsAfter: number = new Date().getTime();

  expect(timeMsAfter - timeMsBefore).toBeCloseTo(500, -2);
});

test('utils.helper.log function', () => {
  log('test logging');

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith('test logging');
});

test('utils.helper.error function', () => {
  error('test errors');

  // eslint-disable-next-line no-console
  expect(console.error).toHaveBeenCalledWith('test errors');
});

test('utils.helper.isPromise function', () => {
  const promise = Promise.resolve(true);

  expect(isPromise(promise)).toBe(true);
});

test('utils.helper.isValidHttpUrl function', () => {
  const testCases = [
    {
      input: 'http://example.com',
      output: true,
    },
    {
      input: 'https://example.com',
      output: true,
    },
    {
      input: 'https://some.other.website',
      output: true,
    },
    {
      input: 'ftp://example.com',
      output: false,
    },
    {
      input: 'random_string',
      output: false,
    },
    {
      input: '',
      output: false,
    },
  ];

  testCases.forEach(({ input, output }) => {
    expect(isValidHttpUrl(input)).toBe(output);
  });
});

test('utils.helper.generateString function', () => {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const num = '0123456789';
  const extra = '';
  const usableCharsDefault = alpha + num + extra;

  // Default charset
  const genString1 = generateString(10);
  expect(genString1.length).toBe(10);
  Array.from(genString1).forEach((char) => {
    expect(usableCharsDefault).toContain(char);
  });

  // Different charset
  const usableCharsLimited = 'ABCD';
  const genString2 = generateString(15, usableCharsLimited);
  expect(genString2.length).toBe(15);
  Array.from(genString2).forEach((char) => {
    expect(usableCharsLimited).toContain(char);
  });
});
