import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';

export const locationReportGuard: CanMatchFn = async (route: Route, _: UrlSegment[]) => {
  const router = inject(Router);
  if (!navigator.geolocation) {
    return router.createUrlTree(['/']);
  }

  const geolocation = await navigator.permissions.query({ name: 'geolocation' });

  if (geolocation.state === 'granted') {
    return true;
  }

  return router.createUrlTree(['/']);
};
