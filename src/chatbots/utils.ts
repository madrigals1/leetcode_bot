import constants from '../utils/constants';
import { User } from '../leetcode/models';
import Cache from '../cache';

import {
  Button,
  ButtonOptions,
} from './models';
import { ButtonContainer, ButtonContainerType } from './models/buttons.model';

export function createButtonsFromUsers(
  options: ButtonOptions,
): Button[] {
  const { action, password } = options;

  // Get all user from Cache and create Button for each
  const buttons = Cache.allUsers().map((user: User) => ({
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
