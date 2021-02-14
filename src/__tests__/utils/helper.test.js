import {
  isTrue, delay, log, error,
} from '../../utils/helper';

test('isTrue function', () => {
  const trueValues = ['true', 'True', '1', 't', 'T', 1, true];

  // Check true valuess
  trueValues.forEach((value) => expect(isTrue(value)).toBe(true));

  const falseValues = [
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
  falseValues.forEach((value) => expect(isTrue(value)).toBe(false));
});

test('delay function', async () => {
  expect(delay(1).then).not.toBe(undefined);

  const timeMsBefore = new Date().getTime();
  await delay(500);
  const timeMsAfter = new Date().getTime();

  expect(timeMsAfter - timeMsBefore >= 500).toBe(true);
});

test('log function', () => {
  log('test logging');

  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith('test logging');
});

test('error function', () => {
  error('test errors');

  // eslint-disable-next-line no-console
  expect(console.error).toHaveBeenCalledWith('test errors');
});
