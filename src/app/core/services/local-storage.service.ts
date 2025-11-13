import { CookieService } from 'ngx-cookie-service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  cookie = inject(CookieService);

  getItem(key: string): string | null {
    const token = this.cookie.get(key);
    return token;
  }

  setItem(key: string, value: string): void {
    this.cookie.set(key, value);
  }

  removeItem(key: string): void {
    console.log('INTENTO DE CIERRE y esta es la key', key);
    if (this.cookie.check(key)) {
      console.log('entrando para el cierre');
      this.cookie.delete(key);
      console.log('estos cookies quedaron solos: ', this.cookie.getAll());
      return;
    }
    console.log('NO SE ENCONTRO ESTA KEY: ', key);
  }
}
