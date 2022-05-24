import { Channel, ChannelKey, ChannelUser } from '../cache/models';

import {
  LBBChannel,
  LBBChannelKey,
  LBBChannelUser,
} from './models';

export function convertChannelToLBB(channel: Channel): LBBChannel {
  return {
    chat_id: channel.key.chatId,
    provider: channel.key.provider,
    user_limit: channel.userLimit,
  };
}

export function convertChannelUserToLBB(
  channelUser: ChannelUser,
): LBBChannelUser {
  return {
    channel_id: channelUser.channelId,
    user_id: channelUser.userId,
  };
}

export function convertChannelKeyToLBB(channelKey: ChannelKey): LBBChannelKey {
  return {
    id: channelKey.id,
    chat_id: channelKey.chatId,
    provider: channelKey.provider,
  };
}

export function convertLBBToChannel(lbbChannel: LBBChannel): Channel {
  return {
    id: lbbChannel.id,
    key: {
      chatId: lbbChannel.chat_id,
      provider: lbbChannel.provider,
    },
    userLimit: lbbChannel.user_limit,
  };
}

export function convertLBBToChannelUser(
  lbbChannelUser: LBBChannelUser,
): ChannelUser {
  return {
    id: lbbChannelUser.id,
    channelId: lbbChannelUser.channel_id,
    userId: lbbChannelUser.user_id,
  };
}

export function convertLBBToChannelKey(
  lbbChannelKey: LBBChannelKey,
): ChannelKey {
  return {
    id: lbbChannelKey.id,
    chatId: lbbChannelKey.chat_id,
    provider: lbbChannelKey.provider,
  };
}
