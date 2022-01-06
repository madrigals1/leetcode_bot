import { Argument, IParsedArgument } from '../../../chatbots/decorators/models';
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

export interface ArgumentTestCaseParsedArgument extends IParsedArgument {
  index: number;
  key: string;
  name: string;
  _value: string | string[];
}

export interface ArgumentTestCase {
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
