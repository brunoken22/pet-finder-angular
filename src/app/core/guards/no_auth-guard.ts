import { CanMatchFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

export const notAuthGuard: CanMatchFn = async () => {
  const userService = inject(UserService);
  const localStorageService = inject(LocalStorageService);

  const router = inject(Router);
  const token = localStorageService.getItem('LOGIN_PET_FINDER');
  await userService.getUser(token);
  const user = userService.get();

  // Si el usuario YA está autenticado, redirigir a account
  if (token) {
    return router.createUrlTree(['/account']);
  }

  // Si NO está autenticado, permitir acceso a login/signup
  return true;
};
