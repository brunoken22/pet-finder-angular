import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../components/ui/button/button';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  templateUrl: './signup.html',
  imports: [ButtonComponent, RouterLink, ReactiveFormsModule],
})
export class SignupPage {
  private userService = inject(UserService);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);

  newFormUser = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  messageReponse = signal('');

  async handleCreateUser(event: Event) {
    event.preventDefault();
    const { email, password, repeatPassword, firstName, lastName } = this.newFormUser.value;
    if (!email || !password || !repeatPassword || !firstName || !lastName) {
      this.messageReponse.set('Por favor complete todos los campos');
      return;
    }

    if (password.trim() !== repeatPassword.trim()) {
      this.messageReponse.set('Las contraseñas no coinciden');
      return;
    }
    this.messageReponse.set('');

    const data = {
      email: email,
      fullName: `${firstName} ${lastName}`,
      password: password,
    };
    const responseCreateUser: any = await this.userService.createUser(data);
    if (responseCreateUser?.token) {
      this.localStorageService.setItem('LOGIN_PET_FINDER', responseCreateUser.token);
      await this.userService.update(true);
      this.messageReponse.set('Usuario creado con éxito');
      this.newFormUser.reset();
      this.router.navigate(['/']);
      return;
    }
    this.messageReponse.set('Error al crear el usuario');
  }
}
