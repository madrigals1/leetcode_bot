import {
  isTrue, delay, log, error, isPromise,
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

  expect(timeMsAfter - timeMsBefore >= 500).toBe(true);
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
  const promise: Promise<boolean> = new Promise((resolve) => resolve(true));

  expect(isPromise(promise)).toBe(true);
});
