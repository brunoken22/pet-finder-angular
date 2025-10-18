import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard: CanMatchFn = async (route: Route, _: UrlSegment[]) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem('LOGIN_PET_FINDER');
  await userService.getUser(token);
  const user = userService.get();

  if (user().id) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
