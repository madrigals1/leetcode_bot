import { ArgumentManager, RequestedArgument } from '../argument';

import { ChatbotProvider } from './provider.model';

export interface Context {
  text: string;
  args?: ArgumentManager;
  reply: (message: string, context: Context) => Promise<string>;
  argumentParser: (
    context: Context, requestedArgs: RequestedArgument[],
  ) => ArgumentManager;
  provider: ChatbotProvider;
  prefix: string;
  chatId?: number;
}
