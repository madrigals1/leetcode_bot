export interface ReplyMarkupCommand {
  text: string,
  action: string,
}

export interface ButtonOptions {
  action: string,
  password?: string,
}

export interface ReplyMarkupOptions {
  buttons: ReplyMarkupCommand[],
  isClosable?: boolean,
}
