import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../ui/button/button';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  imports: [RouterLink, ButtonComponent, RouterLinkActive],
})
export class NavComponent {
  get user() {
    return this.userService.get();
  }

  handleSignup() {
    this.userService.update(false);
  }

  constructor(private userService: UserService) {}
}
