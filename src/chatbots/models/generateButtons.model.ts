export interface Button {
  text: string,
  action: string,
}

export interface ButtonOptions {
  action: string,
  password?: string,
}

export interface GenerateButtonsOptions {
  buttons: Button[],
  isClosable?: boolean,
}
