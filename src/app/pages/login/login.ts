import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../components/ui/button/button';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  templateUrl: './login.html',
  imports: [ButtonComponent, RouterLink],
})
export class LoginPage {
  private router = inject(Router);
  message = signal('');
  loading = signal(false);
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  handleLogin(event: Event) {
    event.preventDefault();
    this.loading.set(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    if (!email && !password) {
      this.message.set('Por favor ingrese un email y una contraseña');
      return;
    }

    this.authService.signin(email as string, password as string).subscribe({
      next: (respuesta: any) => {
        console.log('ESTA ES LA RESPUESTA ', respuesta);
        if (respuesta?.token) {
          this.userService.get().set({ ...respuesta?.auth });
          this.localStorageService.setItem('LOGIN_PET_FINDER', respuesta.token);
          this.userService.update(true);
          this.router.navigate(['/user/account']);
        }
        this.loading.set(false);
        this.message.set(respuesta.message);
      },
      error: (error) => {
        this.loading.set(false);
        this.message.set(error.message);
        return error;
      },
    });
  }

  get user() {
    return this.userService.get();
  }
}
