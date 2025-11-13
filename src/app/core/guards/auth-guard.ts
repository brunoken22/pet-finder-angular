import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard: CanActivateChildFn = async (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getItem('LOGIN_PET_FINDER');
  if (token) {
    return true;
  }
  // await userService.getUser(token);
  // const user = userService.get();

  // if (user().id) {
  //   return true;
  // }

  return router.createUrlTree(['/login']);
};
