import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const authGuard: CanMatchFn = (route: Route, _: UrlSegment[]) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.get();

  if (user().id) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
