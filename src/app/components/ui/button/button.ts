import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroInformationCircle, heroTrash } from '@ng-icons/heroicons/outline';

type ButtonType = 'default' | 'green' | 'red' | 'purple' | '';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  imports: [NgClass, NgIcon],
  viewProviders: [provideIcons({ heroTrash, heroInformationCircle })],
})
export class ButtonComponent {
  @Input() title = '';
  @Input() type = 'button';
  @Input() form = '';
  @Input() color?: ButtonType = 'default';
  @Input() routerLink = '';
  @Input() disable = '';
  @Input() handleClick: any = async () => {};
  @Input() id = '';
  @Input() loading: boolean = false;

  async onClick() {
    await this.handleClick();
  }
}
