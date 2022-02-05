import { SERVER_MESSAGES as SM } from '../../utils/dictionary';

test('utils.dictionary file', () => {
  const errorMessage = 'placeholder_error_message';

  expect(SM.CONNECTION_STATUS.ERROR(errorMessage))
    .toBe(`Database connection error: ${errorMessage}`);
});
