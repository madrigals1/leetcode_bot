/* eslint-disable camelcase */
/* eslint-disable no-console */
import { user1, user2 } from '../__mocks__/data.mock';
import { mockButtonOptions } from '../__mocks__/utils.mock';
import { createButtonsFromUsers } from '../../chatbots/utils';

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
  jest.setTimeout(5000);
});

describe('chatbots.utils.createButtonsFromUsers action', () => {
  test('Correct case - 2 users', () => {
    const action1 = 'action1';
    const mockOptions1 = mockButtonOptions(action1, [user1, user2]);
    const buttonsResponse1 = createButtonsFromUsers(mockOptions1);

    expect(buttonsResponse1.length).toBe(2);

    const user1response1 = buttonsResponse1[0];
    const user2response1 = buttonsResponse1[1];

    expect(user1response1.text).toBe(user1.username);
    expect(user2response1.text).toBe(user2.username);

    expect(user1response1.action).toBe(`/${action1} ${user1.username}`);
    expect(user2response1.action).toBe(`/${action1} ${user2.username}`);
  });

  test('Correct case - 3 users', () => {
    const action2 = 'action2';
    const otherUsername = 'other_username';
    const mockOptions2 = mockButtonOptions(
      action2,
      [user1, user2, { ...user1, username: otherUsername }],
    );
    const buttonsResponse2 = createButtonsFromUsers(mockOptions2);

    expect(buttonsResponse2.length).toBe(3);
  });

  test('Incorrect case - No users', () => {
    const mockOptions4 = mockButtonOptions('', []);
    const buttonsResponse4 = createButtonsFromUsers(mockOptions4);

    expect(buttonsResponse4.length).toBe(0);
  });
});
