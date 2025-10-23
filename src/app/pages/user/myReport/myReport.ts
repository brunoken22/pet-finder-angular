import { Component } from '@angular/core';
import { PetServices } from '../../../core/services/pets.service';
import { PetCardComponent } from '../../../components/petCard/petCard';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SkeletonCardPet } from '../../../components/skeletonCardPet/skeletonCardPet';

@Component({
  templateUrl: './myReport.html',
  imports: [PetCardComponent, SkeletonCardPet],
})
export class MyReportPage {
  loading = true;
  get pets() {
    const pets = this.petServices.get();
    this.loading = false;
    return pets;
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
