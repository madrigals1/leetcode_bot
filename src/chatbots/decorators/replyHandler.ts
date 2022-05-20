import { LabelValues } from 'prom-client';

import { actionLogger } from '../../prometheus';
import { Context } from '../models';

export class ReplyHandler {
  endLogging: (labels?: LabelValues<string>) => number;

  actionName: string;

  context: Context;

  constructor(actionName: string, context: Context) {
    this.endLogging = actionLogger.startTimer();
    this.actionName = actionName;
    this.context = context;
  }

  async handleError(errorMessage: string): Promise<string> {
    return this.context
      .reply(errorMessage, this.context)
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
          provider: this.context.provider,
        });
        return res;
      });
  }
}
