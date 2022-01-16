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
import { LabelValues } from 'prom-client';

import ArgumentManager from '../argumentManager';
import { Argument } from '../decorators/models';

import { ButtonContainer } from './buttons.model';

export interface Options {
  polling?: boolean;
  parseMode?: string;
  buttons?: ButtonContainer[];
  files?: string[];
  baseApiUrl?: string;
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
  provider: string;
  prefix: string;
  chatId?: number;
  options?: Options;
  bot?: Client | TelegramBot;
  photoUrl?: string;
  password?: string;
  // Discord
  discordProvidedArguments?: readonly CommandInteractionOption[];
  interaction?: ComplexInteraction;
}
