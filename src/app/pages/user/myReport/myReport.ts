import { Component, inject } from '@angular/core';
import { PetServices } from '../../../core/services/pets.service';
import { PetCardComponent } from '../../../components/petCard/petCard';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { SkeletonCardPet } from '../../../components/skeletonCardPet/skeletonCardPet';

@Component({
  templateUrl: './myReport.html',
  imports: [PetCardComponent, SkeletonCardPet],
})
export class MyReportPage {
  private petServices = inject(PetServices);
  private localStorageService = inject(LocalStorageService);

  loading = true;
  get pets() {
    const pets = this.petServices.get();
    this.loading = false;
    return pets;
  }

  async handleDeletePet(id: string): Promise<any> {
    console.log('Eliminando mascota con ID 2 :', id);

    const token = this.localStorageService.getItem('LOGIN_PET_FINDER');
    if (!token) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Eliminando mascota con ID:', id);

        // Aquí tu lógica real comentada:
        // const responseDeletePet = await this.petServices.deletePet(id, token);
        // if (responseDeletePet.petRes) {
        //   this.petServices.pets.update((pets) => pets.filter((pet) => pet.id != id));
        // }
        console.log('dasda');
        resolve({ success: true, message: 'Mascota eliminada', id });
      }, 5000);
    });
  }
}
