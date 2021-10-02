/* eslint-disable camelcase */
export interface TelegramEntity {
  lenght: number;
  offset: number;
  type: string;
}

export interface TelegramChat {
  id: number;
  first_name: string;
  last_name: string;
  type: string;
  username: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  is_bot: boolean;
  language_code: string;
  last_name: string;
  username: string;
}

export interface TelegramMessage {
  chat: TelegramChat;
  date: number;
  entities: TelegramEntity[];
  form: TelegramUser;
  message_id: number;
  text: string;
}
