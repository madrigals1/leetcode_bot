import { dictionary } from '../../utils/dictionary';

const { SERVER_MESSAGES: SM } = dictionary;

test('utils.dictionary file', () => {
  const errorMessage = 'placeholder_error_message';

  expect(SM.CONNECTION_STATUS.ERROR(errorMessage))
    .toBe(`Database connection error: ${errorMessage}`);
});
