import { Button } from '../models';

class ButtonIndexer {
  id = 0;

  buttons = new Map<string, Button>();

  select = new Map<string, string[]>();

  addButton(button: Button): string {
    const sid = `button_${this.id}`;
    this.buttons.set(sid, button);
    this.id += 1;
    return sid;
  }

  addSelect(buttons: Button[]): string {
    const indexes = buttons.map((button) => this.addButton(button));
    const sid = `select_${this.id}`;
    this.select.set(sid, indexes);
    this.id += 1;
    return sid;
  }

  getButton(sid: string): Button {
    return this.buttons.get(sid);
  }

  getSelect(sid: string): string[] {
    return this.select.get(sid);
  }
}

export default new ButtonIndexer();
