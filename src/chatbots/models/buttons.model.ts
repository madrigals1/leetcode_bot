export interface Button {
  text: string,
  action: string,
}

export interface ButtonOptions {
  action: string,
  password?: string,
}

export interface ButtonContainer {
  buttons: Button[],
  buttonPerRow: number,
}
