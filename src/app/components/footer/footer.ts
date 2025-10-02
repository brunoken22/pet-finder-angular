import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  imports: [RouterLink],
})
export class FooterComponent {
  get user() {
    return this.userService.get();
  }
  constructor(private userService: UserService) {}
}
