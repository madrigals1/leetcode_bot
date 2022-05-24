import { Channel, ChannelKey } from '../../cache/models';

export class LBBChannel {
  id?: number;

  url: string;

  chat_id: string;

  provider: number;

  user_limit: number;

  created_at?: string;

  updated_at?: string;

  toChannel(): Channel {
    return {
      id: this.id,
      key: {
        chatId: this.chat_id,
        provider: this.provider,
      },
      userLimit: this.user_limit,
    };
  }
}

export class LBBChannelUser {
  id?: number;

  url: string;

  channel_id: number;

  user_id: number;

  created_at?: string;

  updated_at?: string;
}

export class LBBChannelKey {
  id?: number;

  chat_id: string;

  provider: number;

  toChannelKey(): ChannelKey {
    return {
      id: this.id,
      chatId: this.chat_id,
      provider: this.provider,
    };
  }
}
