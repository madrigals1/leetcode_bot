/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import _ from 'lodash';

import { User } from '../../leetcode/models';
import DatabaseProvider from '../../database/database.proto';
import { ChannelData, ChannelKey } from '../../cache/models/channel.model';

import { mockDatabaseData } from './data.mock';

class MockDatabaseProvider extends DatabaseProvider {
  // Connect to Database
  async connect(): Promise<boolean> {
    return new Promise((resolve) => resolve(mockDatabaseData.fakeResult));
  }

  createTables(): boolean {
    return mockDatabaseData.fakeResult;
  }

  // Find all Users
  async findAllUsers(): Promise<User[]> {
    return mockDatabaseData.users.map((username) => (
      { ...mockDatabaseData.mockUser1(), username }
    ));
  }

  // Load User by `username`
  async loadUser(username: string): Promise<boolean> {
    return mockDatabaseData.fakeResult;
  }

  // Add User to Database
  async addUser(username: string): Promise<boolean> {
    if (mockDatabaseData.users.includes(username)) {
      return false;
    }
    mockDatabaseData.users.push(username);
    return true;
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
    return mockDatabaseData.fakeResult;
  }

  async addChannel(channelData: ChannelData): Promise<ChannelData> {
    mockDatabaseData.channels.push(channelData);
    return channelData;
  }

  async getAllChannels(): Promise<ChannelData[]> {
    return mockDatabaseData.channels;
  }

  async getChannel(channelKey: ChannelKey): Promise<ChannelData> {
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
    return mockDatabaseData.fakeResult;
  }

  async addUserToChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const channel = await this.getChannel(channelKey);
    mockDatabaseData.channelUsers.push({ channelId: channel.id, username });
    return mockDatabaseData.fakeResult;
  }

  async removeUserFromChannel(
    channelKey: ChannelKey, username: string,
  ): Promise<boolean> {
    const channel = await this.getChannel(channelKey);
    _.remove(
      mockDatabaseData.channelUsers,
      { channelId: channel.id, username },
    );
    return mockDatabaseData.fakeResult;
  }

  async clearChannel(channelKey: ChannelKey): Promise<boolean> {
    const channel = await this.getChannel(channelKey);
    _.remove(
      mockDatabaseData.channelUsers,
      { channelId: channel.id },
    );
    return mockDatabaseData.fakeResult;
  }
}

export default MockDatabaseProvider;
