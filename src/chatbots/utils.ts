import { constants } from '../utils/constants';
import { User } from '../leetcode/models';

import {
  Button,
  ButtonOptions,
} from './models';
import { ButtonContainer, ButtonContainerType } from './models/buttons.model';

export function createButtonsFromUsers(
  options: ButtonOptions,
): Button[] {
  const { action, users, password } = options;

  // Create Button for each User
  const buttons = users.map((user: User) => ({
    text: user.username,
    action: `/${action} ${user.username} ${password || ''}`,
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
