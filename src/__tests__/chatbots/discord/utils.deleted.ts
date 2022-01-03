/*
import { Message, MessageOptions } from 'discord.js';
import { APIMessage } from 'discord-api-types';

import { formatMessage, reply } from '../../../chatbots/discord/utils';
import MockFuncDiscord from '../../__mocks__/chatbots/discord.mock';
import { DiscordTestCase, Options } from '../../../chatbots/models';

test('chatbots.discord.utils.formatMessage function', async () => {
  const testCases: string[][] = [
    ['<b>Bold Text</b>', '**Bold Text**'],
    ['<i>Italic Text</i>', '*Italic Text*'],
    ['<code>Code Text</code>', '`Code Text`'],
    [
      'Hello <b><i><code>Human</code></i></b>, how <code>was <b>your <i>day</'
      + 'i></b></code>',
      'Hello ***`Human`***, how `was **your *day***`',
    ],
  ];

  testCases.forEach(([input, output]) => {
    expect(formatMessage(input)).toBe(output);
  });
});

test('chatbots.discord.utils.reply function', async () => {
  const mockDiscordInstances: MockFuncDiscord[] = [
    new MockFuncDiscord(),
    new MockFuncDiscord(),
    new MockFuncDiscord(),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testCases: DiscordTestCase[] = [
    {
      message: '<b>Message 1</b>',
      context: {
        text: 'asd asd asd',
        argumentParser: () => undefined,
        photoUrl: 'random_url',
        reply: () => new Promise(() => 'asd'),
        provider: 'Random',
        interaction: {
          replied: false,
          reply(message: MessageOptions): Promise<void> {
            mockDiscordInstances[0].formattedMessage = message.content;
            return new Promise(() => message);
          },
          editReply(message: MessageOptions): Promise<void> {
            mockDiscordInstances[0].formattedMessage = message.content;
            return new Promise(() => message);
          },
        },
        prefix: '!',
      },
      expected: 'Success',
      expectedMessage: '**Message 1**',
      expectedOptions: { files: ['random_url'] },
    },
    {
      message: '<i>Message 2</i>',
      context: {
        text: 'asd asd asd',
        reply: () => new Promise(() => 'asd'),
        argumentParser: () => undefined,
        provider: 'Random',
        interaction: {
          replied: false,
          reply(message: MessageOptions): Promise<void> {
            mockDiscordInstances[0].formattedMessage = message.content;
            return new Promise(() => message);
          },
          editReply(message: MessageOptions): Promise<void> {
            mockDiscordInstances[0].formattedMessage = message.content;
            return new Promise(() => message);
          },
        },
        prefix: '!',
      },
      expected: 'Success',
      expectedMessage: '*Message 2*',
      expectedOptions: {},
    },
    {
      message: '<i>Message 3</i>',
      context: {
        text: 'asd asd asd',
        photoUrl: 'random_url_3',
        reply: () => new Promise(() => 'asd'),
        argumentParser: () => undefined,
        provider: 'Random',
        interaction: {
          replied: false,
          reply(message: MessageOptions): Promise<void> {
            mockDiscordInstances[0].formattedMessage = message.content;
            return new Promise(() => message);
          },
          editReply(message: MessageOptions): Promise<void> {
            mockDiscordInstances[0].formattedMessage = message.content;
            return new Promise(() => message);
          },
        },
        prefix: '!',
      },
      expected: Error('Channel is not provided in context'),
      expectedMessage: null,
      expectedOptions: {},
    },
  ];

  testCases.forEach(({
    message, context, expected, expectedMessage, expectedOptions,
  }, i) => {
    reply(message, context)
      .then((result) => {
        expect(result).toBe(expected);
        expect(expectedMessage).toBe(mockDiscordInstances[i].formattedMessage);
        // expect(expectedOptions).toEqual(mockDiscordInstances[i].options);
      })
      .catch((err: Error) => {
        expect(err).toEqual(expected);
        expect(expectedMessage).toBe(mockDiscordInstances[i].formattedMessage);
        // expect(expectedOptions).toEqual(mockDiscordInstances[i].options);
      });
  });
});
*/
