import { CanMatchFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const notAuthGuard: CanMatchFn = async () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const isAuth = await userService.getAuthUser();
  if (isAuth) {
    return router.createUrlTree(['/user/account']);
  }

  return true;
};
