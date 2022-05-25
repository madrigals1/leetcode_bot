import { constants } from '../globals/constants';
import { User } from '../leetcode/models';

import {
  Button,
  ButtonOptions,
  ButtonContainer,
  ButtonContainerType,
} from './models';

export function createButtonsFromUsers(options: ButtonOptions): Button[] {
  const { action, users } = options;

  // Create Button for each User
  const buttons = users.map((user: User) => ({
    text: user.username,
    action: `/${action} ${user.username}`,
  }));

  return buttons;
}

export function getCloseButton(): ButtonContainer {
  return {
    buttons: [{
      text: `${constants.EMOJI.CROSS_MARK} Close`,
      action: 'placeholder',
    }],
    buttonPerRow: 1,
    placeholder: '',
    type: ButtonContainerType.CloseButton,
  };
}
