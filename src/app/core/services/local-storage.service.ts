// services/local-storage.service.ts
import { inject, Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const LOCAL_STORAGE_TOKEN = new InjectionToken<Storage>('LOCAL_STORAGE_TOKEN', {
  providedIn: 'root',
  factory: () => {
    // Verifica si está en el navegador
    if (typeof window !== 'undefined' && isPlatformBrowser(inject(PLATFORM_ID))) {
      return window.localStorage;
    } else {
      // Mock para el servidor
      return {
        length: 0,
        clear: () => {},
        getItem: (key: string) => null,
        setItem: (key: string, value: string) => {},
        removeItem: (key: string) => {},
        key: (index: number) => null,
      } as Storage;
    }
  },
});

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(
    @Inject(LOCAL_STORAGE_TOKEN) private storage: Storage,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.storage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storage.removeItem(key);
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storage.clear();
    }
  }
}
