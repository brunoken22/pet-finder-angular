import { Component, inject } from '@angular/core';
import { PetServices } from '../../../core/services/pets.service';
import { PetCardComponent } from '../../../components/petCard/petCard';
import { SkeletonCardPet } from '../../../components/skeletonCardPet/skeletonCardPet';

@Component({
  templateUrl: './myReport.html',
  imports: [PetCardComponent, SkeletonCardPet],
})
export class MyReportPage {
  private petServices = inject(PetServices);
  loading = true;

  get pets() {
    const pets = this.petServices.get();
    this.loading = false;
    return pets;
  }
}
