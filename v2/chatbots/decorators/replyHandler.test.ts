import { Histogram } from 'prom-client';

import { ChatbotProvider, Context } from '../models';

import { ReplyHandler } from './replyHandler';

jest.mock('prom-client');

describe('ReplyHandler', () => {
  function init() {
    const replyMock = jest.fn();
    const endLoggingMock = jest.fn();

    const mockContext: Context = {
      reply: replyMock,
      provider: ChatbotProvider.Mockbot,
      text: 'placeholder',
    };
    jest
      .spyOn(Histogram.prototype, 'startTimer')
      .mockReturnValue(endLoggingMock);

    const replyHandler = new ReplyHandler(
      'mockAction',
      mockContext,
    );

    return {
      mockContext,
      replyHandler,
      replyMock,
      endLoggingMock,
    };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    it('should handle error and log it', async () => {
      const {
        replyHandler,
        mockContext,
        replyMock,
        endLoggingMock,
      } = init();
      const replyMessage = 'Reply message';
      const errorMessage = 'Error occurred';
      const updatedContext: Context = {
        ...mockContext,
        text: 'placeholder 2',
      };
      replyMock.mockResolvedValue(replyMessage);

      const result = await replyHandler
        .handleError(errorMessage, updatedContext);

      expect(replyMock)
        .toHaveBeenCalledWith(errorMessage, updatedContext);
      expect(endLoggingMock)
        .toHaveBeenCalledWith({
          action: 'mockAction',
          error: errorMessage,
          provider: ChatbotProvider.Mockbot,
        });
      expect(result).toEqual(replyMessage);
    });
  });

  describe('reply', () => {
    it('should reply with message and log it', async () => {
      const {
        replyHandler,
        mockContext,
        replyMock,
        endLoggingMock,
      } = init();
      const replyMessage = 'Reply message';
      const message = 'Response message';
      const updatedContext: Context = {
        ...mockContext,
        text: 'some other text',
      };
      replyMock.mockResolvedValue(replyMessage);

      const result = await replyHandler.reply(message, updatedContext);

      expect(replyMock).toHaveBeenCalledWith(message, updatedContext);
      expect(endLoggingMock)
        .toHaveBeenCalledWith({
          action: 'mockAction',
          message,
          provider: ChatbotProvider.Mockbot,
        });
      expect(result).toEqual(replyMessage);
    });
  });
});
