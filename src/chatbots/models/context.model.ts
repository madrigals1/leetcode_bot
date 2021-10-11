/* eslint-disable camelcase */
import * as DiscordBot from 'discord.js';
import TelegramBot from 'node-telegram-bot-api';

export interface Options {
  polling?: boolean;
  parseMode?: string;
  buttons?: string;
  files?: string[];
  baseApiUrl?: string;
}

export interface Channel {
  send;
}

export interface Context {
  text: string;
  args?: string[];
  reply: (message: string, context: Context) => Promise<string>;
  channel?: DiscordBot.TextChannel
  | DiscordBot.DMChannel
  | DiscordBot.NewsChannel
  | Channel;
  provider: string;
  prefix: string;
  chatId?: number;
  options?: Options;
  bot?: DiscordBot.Client | TelegramBot;
  photoUrl?: string;
  password?: string;
}
