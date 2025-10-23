import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import baseUrl from '../../utils/baseUrl';
import { UpdateUser, User } from '../modules/user.interface';
import { firstValueFrom } from 'rxjs';
import { PetServices } from './pets.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private petService: PetServices,
    private localStorageService: LocalStorageService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  private user = signal<User>({
    fullName: '',
    email: '',
    id: 0,
  });

  get() {
    return this.user;
  }

  async createUser(userCreate: UpdateUser) {
    const response = await firstValueFrom(
      this.httpClient.post(`${baseUrl}/auth`, userCreate, {
        headers: {
          'content-type': 'application/json',
        },
      })
    );
    return response;
  }

  async update(loggedIn: boolean) {
    try {
      // this.user.update((user) => user);
      if (!loggedIn) {
        this.user.set({ fullName: '', email: '', id: 0 });
        this.localStorageService.removeItem('LOGIN_PET_FINDER');
        this.router.navigate(['/login']);
        return;
      }
      const token = this.localStorageService.getItem('LOGIN_PET_FINDER');

      await this.getUser(token);
    } catch (e) {
      console.error('Este es el error: ', e);
    }
  }

  async getUser(token: string | null): Promise<User | null> {
    if (token) {
      const response: any = await firstValueFrom(
        this.httpClient.get(`${baseUrl}/init/token`, {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      );
      const { Pets, ...userData } = response;
      this.user.set(userData);
      this.petService.pets.set(Pets);
      return response as User;
    }
    return null;
  }

  updateUser(newDataUser: UpdateUser) {
    return this.httpClient.put(`${baseUrl}/datos/${this.user().id}`, newDataUser, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getItem('LOGIN_PET_FINDER')}`,
      },
    });
  }
}
