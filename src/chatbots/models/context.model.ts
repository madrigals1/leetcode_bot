/* eslint-disable camelcase */
import {
  Client,
  TextChannel,
  NewsChannel,
  DMChannel,
  CommandInteractionOption,
  SelectMenuInteraction,
  ButtonInteraction,
  CommandInteraction,
} from 'discord.js';
import TelegramBot from 'node-telegram-bot-api';

import { ChannelCache } from '../../cache/channel';
import { ChannelKey } from '../../cache/models';
import ArgumentManager from '../argumentManager';
import { Argument } from '../decorators/models';
import MockBotTelegram from '../../__tests__/__mocks__/chatbots/telegram.mock';

import { ChatbotProvider } from './chatbot.model';
import { ButtonContainer } from './buttons.model';

export interface Options {
  polling?: boolean;
  buttons?: ButtonContainer[];
  files?: string[];
  baseApiUrl?: string;
  reply_markup?: TelegramBot.InlineKeyboardMarkup;
  parse_mode?: TelegramBot.ParseMode;
}

export interface Channel {
  send;
}

export type ComplexInteraction = ButtonInteraction
  | CommandInteraction
  | SelectMenuInteraction;

export interface Context {
  text: string;
  args?: ArgumentManager;
  reply: (message: string, context: Context) => Promise<string>;
  channel?: TextChannel | DMChannel | NewsChannel | Channel;
  argumentParser: (
    context: Context, requestedArgs: Argument[],
  ) => ArgumentManager;
  provider: ChatbotProvider;
  prefix: string;
  chatId?: number;
  options?: Options;
  bot?: Client | TelegramBot | MockBotTelegram;
  photoUrl?: string;
  channelKey?: ChannelKey;
  channelCache?: ChannelCache;
  isAdmin?: Promise<boolean>;
  // Discord
  discordProvidedArguments?: readonly CommandInteractionOption[];
  interaction?: ComplexInteraction;
}
