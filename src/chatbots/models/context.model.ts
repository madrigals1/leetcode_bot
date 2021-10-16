import * as DiscordBot from 'discord.js';
import { TextChannel, NewsChannel, DMChannel } from 'discord.js';
import TelegramBot from 'node-telegram-bot-api';

import ArgumentManager from '../argumentManager';

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

export interface Context {
  text: string;
  args?: ArgumentManager;
  reply: (message: string, context: Context) => Promise<string>;
  channel?: TextChannel | DMChannel | NewsChannel | Channel;
  ireply?: (message: string) => Promise<void>,
  provider: string;
  prefix: string;
  chatId?: number;
  options?: Options;
  bot?: DiscordBot.Client | TelegramBot;
  photoUrl?: string;
  password?: string;
}
