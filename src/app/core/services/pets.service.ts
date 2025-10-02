import { Injectable, signal } from '@angular/core';
import { CreatePet, Pet, ResponseGetPetId, UpdatePet } from '../modules/pet.interface';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import baseUrl from '../../utils/baseUrl';

@Injectable({
  providedIn: 'root',
})
export class PetServices {
  constructor(private httpClient: HttpClient) {}
  pets = signal<Pet[]>([]);

  get() {
    return this.pets();
  }

  async getPetId(id: string) {
    const responseGetPet = await firstValueFrom(
      this.httpClient.get(`${baseUrl}/pet/${id}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
    );
    return responseGetPet as ResponseGetPetId;
  }

  async createPet(newPet: CreatePet) {
    const responseCreatePet = await firstValueFrom(
      this.httpClient.post(`${baseUrl}/pet`, newPet, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${newPet.token}`,
        },
      })
    );
    return responseCreatePet;
  }

  async deletePet(id: string, token: string) {
    const responseDeletePet: any = await firstValueFrom(
      this.httpClient.delete(`${baseUrl}/pet/${id}`, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    );
    console.log('Respuesta del back del delete: ', responseDeletePet);
    if (responseDeletePet.petRes) {
      this.pets.update((pets) => pets.filter((pet) => pet.id !== id));
    }

    return responseDeletePet;
  }

  async updatePet(id: string, updatePet: UpdatePet, token: string) {
    const responseDeletePet: any = await firstValueFrom(
      this.httpClient.put(`${baseUrl}/pet/${id}`, updatePet, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    );
    console.log(responseDeletePet);
    // if (responseDeletePet.petRes) {
    // this.pets.update((pets) => pets.filter((pet) => pet.id !== id));
    // }

    return responseDeletePet;
  }
}
