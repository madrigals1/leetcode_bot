import { LabelValues } from 'prom-client';

import { actionLogger } from '../../prometheus';
import { Context } from '../models';

/** Handles replies with logging */
export class ReplyHandler {
  private endLogging: (labels?: LabelValues<string>) => number;

  private actionName: string;

  context: Context;

  constructor(actionName: string, context: Context) {
    this.endLogging = actionLogger.startTimer();
    this.actionName = actionName;
    this.context = context;
  }

  async handleError(
    errorMessage: string,
    updatedContext: Context,
  ): Promise<string> {
    return this.context
      .reply(errorMessage, updatedContext)
      .then((res: string) => {
        this.endLogging({
          action: this.actionName,
          error: errorMessage,
          provider: this.context.provider,
        });
        return res;
      });
  }

  async reply(message: string, updatedContext: Context): Promise<string> {
    return this.context
      .reply(message, updatedContext)
      .then((res: string) => {
        this.endLogging({
          action: this.actionName,
          message,
          provider: this.context.provider,
        });
        return res;
      });
  }
}
