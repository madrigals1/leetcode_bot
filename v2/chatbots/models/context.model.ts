import { ChatbotProvider } from './provider.model';

export interface Context {
  text: string;
  provider: ChatbotProvider;
  reply: (message: string, context: Context) => Promise<string>;
}
