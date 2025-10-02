import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMapPin, heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';

@Component({
  templateUrl: './home.html',
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroMapPin, heroQuestionMarkCircle })],
})
export class HomePage {}
