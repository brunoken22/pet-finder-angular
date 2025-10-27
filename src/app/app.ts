import { Component, OnInit } from '@angular/core';
import { NavComponent } from './components/nav/nav';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer';
import { FlowbiteService } from './core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { UserService } from './core/services/user.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(
    private flowbiteService: FlowbiteService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.meta.addTag({
      name: 'description',
      content: 'Encontra mascotas perdidas o publica mascotas.',
    });
    this.meta.addTag({ name: 'keywords', content: 'Mascotas, Angular, Perdidas' });
    this.meta.addTag({ name: 'author', content: 'Bruno Ken', url: 'https://brunoken.vercel.app/' });

    this.flowbiteService.loadFlowbite(() => {
      initFlowbite();
    });

    const LOGIN_PET_FINDER = this.localStorageService.getItem('LOGIN_PET_FINDER');

    if (LOGIN_PET_FINDER) {
      this.userService.update(true);
    }
  }
}
