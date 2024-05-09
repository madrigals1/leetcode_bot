/* eslint-disable camelcase */
export interface SlackField {
  title: string;
  value: string;
  short: boolean;
}

export interface SlackAttachment {
  fallback: string;
  color?: string;
  pretext?: string;
  author_name?: string;
  author_icon?: string;
  title?: string;
  title_link?: string;
  text?: string;
  fields?: SlackField[];
  image_url?: string;
  thumb_url?: string;
  footer?: string;
  footer_icon?: string;
  ts?: number;
}

export interface SlackAccessory {
  type: string;
  // eslint-disable-next-line no-use-before-define
  text: SlackBlock;
  image_url: string;
  alt_text: string;
  value: string;
}

export interface SlackBlock {
  type: string;
  block_id?: string;
  text?: SlackBlock | string;
  accessory: SlackAccessory;
  fields?: SlackBlock[];
  emoji?: boolean;
}

export interface SlackMessage {
  channel?: string;
  text?: SlackBlock | string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[] | SlackBlock[];
}
