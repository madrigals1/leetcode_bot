import { Channel, ChannelUser } from '../../../cache/models';
import { Argument, IParsedArgument } from '../../../chatbots/decorators/models';
import { User } from '../../../leetcode/models';

export interface MockDatabaseInterface {
  users: string[];
  channels: Channel[];
  channelUsers: ChannelUser[];
  mockUser1: () => User;
  savedUsers: () => User[];
}

export interface OtherModel {
  field: string;
}

export interface ArgumentTestCaseParsedArgument extends IParsedArgument {
  index: number;
  key: string;
  name: string;
  _value: string | string[];
}

export interface ArgumentTestCase {
  name: string;
  input: {
    providedArgs: string[];
    requestedArgs: Argument[];
  };
  output: {
    byKey: Record<string, ArgumentTestCaseParsedArgument>;
    byIndex: Record<number, ArgumentTestCaseParsedArgument>;
  };
  error?: Error;
}
