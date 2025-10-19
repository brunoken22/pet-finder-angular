import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMapPin, heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';
import { Router, RouterLink } from '@angular/router';

@Component({
  templateUrl: './home.html',
  imports: [NgIcon, RouterLink],
  viewProviders: [provideIcons({ heroMapPin, heroQuestionMarkCircle })],
})
export class HomePage implements OnInit {
  router = inject(Router);
  message = signal('');
  viewReport = signal(false);

  handleGiveUbication() {
    navigator.geolocation.getCurrentPosition(
      () => {
        this.router.navigate(['report']);
      },
      () => {
        this.message.set('Tenes que dar permiso para ver mascotas cerca tuyo');
      }
    );
  }

  async ngOnInit() {
    if (navigator.geolocation) {
      const geolocationPermission = await navigator.permissions.query({ name: 'geolocation' });
      if (geolocationPermission.state === 'granted') {
        this.viewReport.update(() => true);
      }
    }
  }
}
