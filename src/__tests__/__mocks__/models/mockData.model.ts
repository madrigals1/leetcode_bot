import { Argument, ParsedArgument } from '../../../chatbots/decorators/models';
import { User } from '../../../leetcode/models';

export interface MockDatabaseInterface {
  users: string[];
  mockUser1: () => User;
  savedUsers: () => User[];
  fakeResult: boolean;
}

export interface OtherModel {
  field: string;
}

export interface ArgumentTestCase {
  input: {
    providedArgs: string[],
    requestedArgs: Argument[],
  }
  output: {
    byKey: Record<string, ParsedArgument>,
    byIndex: Record<number, ParsedArgument>,
  }
  error?: Error,
}
