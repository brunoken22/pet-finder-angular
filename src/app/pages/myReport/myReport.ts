import { Component } from '@angular/core';
import { PetServices } from '../../core/services/pets.service';
import { PetCardComponent } from '../../components/petCard/petCard';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  templateUrl: './myReport.html',
  imports: [PetCardComponent],
})
export class MyReportPage {
  get pets() {
    return this.petServices.get();
  }

  constructor(private petServices: PetServices, private localStorageService: LocalStorageService) {}

  async handleDeletePet(id: string) {
    const token = this.localStorageService.getItem('LOGIN_PET_FINDER');
    if (!token) return;
    const responseDeletePet = await this.petServices.deletePet(id, token);
    if (responseDeletePet.petRes) {
      this.petServices.pets.update((pets) => pets.filter((pet) => pet.id != id));
    }
  }
}
