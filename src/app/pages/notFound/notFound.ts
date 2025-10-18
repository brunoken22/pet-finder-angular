import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/ui/button/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  templateUrl: './notFound.html',
  imports: [ButtonComponent, RouterLink],
})
export default class NotFound {}
