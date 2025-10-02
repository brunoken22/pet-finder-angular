import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type ButtonType = 'default' | 'green' | 'red' | 'purple' | '';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  imports: [NgClass],
})
export class ButtonComponent {
  @Input() title = '';
  @Input() type = 'button';
  @Input() form = '';
  @Input() color?: ButtonType = 'default';
  @Input() routerLink = '';
  @Input() disable = '';
  @Input() handleClick: any = () => {};
  @Input() id = '';

  onClick() {
    this.handleClick();
  }
}
