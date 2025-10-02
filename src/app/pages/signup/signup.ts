import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/ui/button/button';
import { RouterLink } from '@angular/router';

@Component({
  templateUrl: './signup.html',
  imports: [ButtonComponent, RouterLink],
})
export class SignupPage {}
