import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  templateUrl: './account.html',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class AccountPage {
  handleSignup() {
    this.userService.update(false);
  }

  constructor(private userService: UserService) {}
}
