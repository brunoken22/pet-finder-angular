import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMapPin, heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.html',
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroMapPin, heroQuestionMarkCircle })],
})
export class HomePage {
  router = inject(Router);

  handleGiveUbication() {
    navigator.geolocation.getCurrentPosition(
      (ubication) => {
        const { latitude, longitude } = ubication.coords;
        if (latitude && longitude) {
          this.router.navigate(['report']);
        }
      },
      (error) => {
        console.log('Esto es el error: ', error);
      }
    );
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      if (latitude && longitude) {
        this.router.navigate(['report']);
      }
    });
  }
}
