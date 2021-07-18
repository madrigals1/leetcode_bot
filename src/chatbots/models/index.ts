import {
  SlackMessage, SlackBlock, SlackAccessory, SlackAttachment, SlackField,
} from '../slack/slack.model';

import { Context, Options } from './context.model';
import { ReplyMarkupOptions, ReplyMarkupCommand } from './replyMarkup.model';
import { Table } from './table.model';
import { Compare, CompareUser } from './compare.model';
import { TableResponse } from './response.model';
import { TelegramTestCase, Args, DiscordTestCase } from './testCase.model';

export {
  Context,
  Options,
  ReplyMarkupOptions,
  ReplyMarkupCommand,
  Table,
  Compare,
  CompareUser,
  TableResponse,
  TelegramTestCase,
  Args,
  DiscordTestCase,
  SlackMessage,
  SlackBlock,
  SlackAccessory,
  SlackAttachment,
  SlackField,
};
