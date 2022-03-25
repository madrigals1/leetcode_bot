/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import * as _ from 'lodash';

import {
  User, Channel, ChannelUser, ChannelKey,
} from '../../cache/models';
import DatabaseProvider from '../../database/database.proto';

import { mockDatabaseData, users as leetcodeUsers } from './data.mock';

class MockDatabaseProvider extends DatabaseProvider {
  channelId = 1;

  channelUserIds: Map<number, number> = new Map<number, number>();

  userIndexer = 1;

  userIds: Map<string, number> = new Map<string, number>();

  // Connect to Database
  async connect(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  }

  private getIdForChannel(): number {
    const currentChannelId = this.channelId;
    this.channelId += 1;
    return currentChannelId;
  }

  private getIdForChannelUser(channelId: number) {
    const existingChannelUserId = this.channelUserIds.get(channelId);

    if (!existingChannelUserId) {
      this.channelUserIds.set(channelId, 1);
    } else {
      this.channelUserIds.set(channelId, existingChannelUserId + 1);
    }

    return this.channelUserIds.get(channelId);
  }

  private getIdForUser(username: string) {
    if (!this.userIds.get(username)) {
      this.userIds.set(username, this.userIndexer);
      this.userIndexer += 1;
    }

    return this.userIds.get(username);
  }

  createTables(): boolean {
    return true;
  }

  // Find all Users
  async findAllUsers(): Promise<User[]> {
    return mockDatabaseData.users
      .map((username) => {
        const foundUser = leetcodeUsers
          .find((user) => user.username === username);

        if (foundUser) {
          return {
            id: this.getIdForUser(username),
            username: foundUser.username,
            data: JSON.stringify(foundUser),
          };
        }

        return null;
      });
  }

  // Load User by `username`
  async userExists(username: string): Promise<boolean> {
    return mockDatabaseData.users.includes(username);
  }

  // Add User to Database
  async addUser(username: string): Promise<User> {
    const foundUserInCache = leetcodeUsers
      .map((user, index) => ({
        id: index,
        username: user.username,
        data: JSON.stringify(user),
      }))
      .find((user) => user.username === username);

    if (mockDatabaseData.users.includes(username)) {
      return foundUserInCache;
    }
    mockDatabaseData.users.push(username);
    return foundUserInCache;
  }

  // Remove User from Database
  async removeUser(username: string): Promise<boolean> {
    if (!mockDatabaseData.users.includes(username)) {
      return false;
    }
    mockDatabaseData.users = (
      mockDatabaseData.users.filter((uname) => uname !== username)
    );
    return true;
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<boolean> {
    mockDatabaseData.users = [];
    return true;
  }

  async addChannel(channel: Channel): Promise<Channel> {
    const newChannel = {
      id: this.getIdForChannel(),
      key: channel.key,
      userLimit: 1000,
    };
    mockDatabaseData.channels.push(newChannel);
    return newChannel;
  }

  async getAllChannels(): Promise<Channel[]> {
    return mockDatabaseData.channels;
  }

  async getChannel(channelKey: ChannelKey): Promise<Channel> {
    return mockDatabaseData.channels
      .find((channel) => channel.key === channelKey);
  }

  async getUsersForChannel(channelKey: ChannelKey): Promise<string[]> {
    const channel = await this.getChannel(channelKey);

    return mockDatabaseData.channelUsers
      .filter((channelUser) => channelUser.channelId === channel.id)
      .map((channelUser) => channelUser.username);
  }

  async deleteChannel(channelKey: ChannelKey): Promise<boolean> {
    _.remove(mockDatabaseData.channels, { key: channelKey });
    return true;
  }

  async deleteAllChannels(): Promise<boolean> {
    mockDatabaseData.channels.length = 0;
    return true;
  }

  private existsChannelUser(channelUser: ChannelUser): boolean {
    return !!mockDatabaseData.channelUsers
      // eslint-disable-next-line arrow-body-style
      .find((existingChannelUser) => {
        return existingChannelUser.channelId === channelUser.channelId
          && existingChannelUser.username === channelUser.username;
      });
  }

  async addUserToChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<ChannelUser> {
    // Add User
    await this.addUser(username);

    const channel = await this.getChannel(channelKey);
    const channelUser = {
      id: this.getIdForChannelUser(channel.id),
      channelId: channel.id,
      username,
    };

    // If User already exists, return false
    if (this.existsChannelUser(channelUser)) {
      return null;
    }

    mockDatabaseData.channelUsers.push(channelUser);
    return channelUser;
  }

  async removeUserFromChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const channel = await this.getChannel(channelKey);
    const existsChannelUser = mockDatabaseData.channelUsers
      .find((cu) => cu.username === username && cu.channelId === channel.id);

    // If not found User, return false
    if (!existsChannelUser) {
      return false;
    }

    _.remove(
      mockDatabaseData.channelUsers,
      { channelId: channel.id, username },
    );
    return true;
  }

  async clearChannel(channelKey: ChannelKey): Promise<boolean> {
    const channel = await this.getChannel(channelKey);
    _.remove(
      mockDatabaseData.channelUsers,
      { channelId: channel.id },
    );
    return true;
  }
}

export default MockDatabaseProvider;
