import { Button } from '../models';

class ButtonIndexer {
  id = 0;

  buttons = new Map<string, Button>();

  addButton(button: Button): string {
    const sid = `button_${this.id}`;
    this.buttons.set(sid, button);
    this.id += 1;
    return sid;
  }

  addSelect(): string {
    const sid = `select_${this.id}`;
    this.id += 1;
    return sid;
  }

  getButton(sid: string): Button {
    return this.buttons.get(sid);
  }
}

export default new ButtonIndexer();
