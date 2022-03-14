import { User } from '../../leetcode/models';

export enum ButtonContainerType {
  SingleButton = 0,
  MultipleButtons,
  CloseButton,
}

export interface Button {
  text: string;
  action: string;
}

export interface ButtonOptions {
  action: string;
  users: User[];
}

export interface ButtonContainer {
  buttons: Button[];
  buttonPerRow: number;
  placeholder: string;
  type: ButtonContainerType;
}
