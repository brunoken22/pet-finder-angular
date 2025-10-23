import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../ui/button/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  imports: [RouterLink, ButtonComponent, RouterLinkActive, NgClass],
})
export class NavComponent implements OnInit {
  constructor() {
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  private userService = inject(UserService);
  activeReport = signal(false);
  get user() {
    return this.userService.get();
  }

  async handleLogOut() {
    await this.userService.update(false);
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        this.activeReport.update(() => true);
      });
    }
  }
}
