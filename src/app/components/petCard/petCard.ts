import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ButtonComponent } from '../ui/button/button';
import { RouterLink } from '@angular/router';
import { PetServices } from '../../core/services/pets.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-petCard',
  templateUrl: './petCard.html',
  imports: [ButtonComponent, RouterLink],
})
export class PetCardComponent {
  private petServices = inject(PetServices);
  private localStorageService = inject(LocalStorageService);

  @Input() img = '';
  @Input() title = '';
  @Input() location = '';
  @Input() id = '';
  @Input() owner = true;
  loading = signal(false);
  @Input() onClickDelete = () => {};
  // @Output() deletePet = new EventEmitter<string>();
  @Output() reportPet = new EventEmitter<string>();

  // async handleDeletePet() {
  //   this.deletePet.emit(this.id);
  // }

  handleReportPet() {
    this.reportPet.emit(this.id);
  }

  async handleDeletePet(): Promise<any> {
    this.loading.update(() => true);
    const id = this.id;

    const token = this.localStorageService.getItem('LOGIN_PET_FINDER');
    if (!token) return;

    const responseDeletePet = await this.petServices.deletePet(id, token);
    this.loading.update(() => false);

    if (responseDeletePet.petRes) {
      this.petServices.pets.update((pets) => pets.filter((pet) => pet.id != id));
    }
  }
}
