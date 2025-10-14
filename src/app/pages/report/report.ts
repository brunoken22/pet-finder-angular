import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PetServices } from '../../core/services/pets.service';
import { PetCardComponent } from '../../components/petCard/petCard';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Pet } from '../../core/modules/pet.interface';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { SkeletonCardPet } from '../../components/skeletonCardPet/skeletonCardPet';

@Component({
  templateUrl: './report.html',
  imports: [PetCardComponent, SkeletonCardPet],
})
export class ReportPage {
  private localStorageService = inject(LocalStorageService);
  private petServices = inject(PetServices);
  private userService = inject(UserService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  pets: Pet[] | [] = [];
  loading = true;

  async handleDeletePet(id: string) {
    const token = this.localStorageService.getItem('LOGIN_PET_FINDER');
    if (!token) return;
    const responseDeletePet = await this.petServices.deletePet(id, token);
    if (responseDeletePet.petRes) {
      this.petServices.pets.update((pets) => pets.filter((pet) => pet.id != id));
    }
  }

  async ngAfterViewInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // console.log('Este es la posicion de navigator: ', latitude, longitude);
          if (
            !latitude ||
            !longitude ||
            typeof latitude !== 'number' ||
            typeof longitude !== 'number'
          ) {
            this.router.navigate(['home']);
            return;
          }

          // Esperar a que el usuario esté cargado
          let retries = 0;
          const maxRetries = 10;
          while (!this.userService.get()().email && retries < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Esperar 100ms
            retries++;
          }

          const emailUser = this.userService.get()().email;

          if (!emailUser) {
            console.error('No se pudo obtener el email del usuario');
            return;
          }

          // console.log('Este es el mail:', emailUser);
          const dataPets = (await this.petServices.getPetsUbication(
            latitude,
            longitude,
            emailUser
          )) as any;
          // console.log(dataPets);
          if (!dataPets[0]?.hits?.length) {
            return;
          }

          this.pets = dataPets[0].hits;
          this.loading = false;
          this.cd.detectChanges();
        },
        (error) => {
          console.error(error);
          this.router.navigate(['home']);
        }
      );
    }
  }
}
