import { Component, signal } from '@angular/core';
import { NavComponent } from './components/nav/nav';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer';
import { FlowbiteService } from './core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { UserService } from './core/services/user.service';
import { LocalStorageService } from './core/services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
// export class App implements OnInit{
export class App {
  constructor(
    private flowbiteService: FlowbiteService,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    const LOGIN_PET_FINDER = this.localStorageService.getItem('LOGIN_PET_FINDER');
    if (LOGIN_PET_FINDER) {
      this.userService.update(true);
    }
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
