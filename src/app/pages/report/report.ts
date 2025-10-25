import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { PetServices } from '../../core/services/pets.service';
import { PetCardComponent } from '../../components/petCard/petCard';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Pet, ReportForm } from '../../core/modules/pet.interface';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { SkeletonCardPet } from '../../components/skeletonCardPet/skeletonCardPet';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonComponent } from '../../components/ui/button/button';
import { delay } from 'rxjs';

@Component({
  templateUrl: './report.html',
  imports: [
    PetCardComponent,
    SkeletonCardPet,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
})
export class ReportPage implements OnInit {
  private localStorageService = inject(LocalStorageService);
  private petServices = inject(PetServices);
  private userService = inject(UserService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  get user() {
    return this.userService.get()();
  }

  reportPetForId = new FormGroup({
    id: new FormControl('', [Validators.required]),
    fullNamePet: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    fullName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  });

  messageReport = signal('');
  pets: Pet[] | [] = [];
  loading = true;
  loadingCreateReport = signal(false);

  async handleReportPetModal(id: any) {
    const pet = this.pets.find((pet) => pet.objectID == id);
    const user = this.userService.get()();
    this.reportPetForId.patchValue({ id, fullNamePet: pet?.name, fullName: user.fullName });
    this.reportPetForId.get('fullName')?.disable();
  }

  handleCloseModal() {
    this.reportPetForId.reset();
  }

  async createReportPetid(event: Event) {
    event.preventDefault();
    this.loadingCreateReport.update(() => true);
    const token = this.localStorageService.getItem('LOGIN_PET_FINDER');
    const fullName = this.reportPetForId.get('fullName')?.value;
    const { message, fullNamePet, id, phone } = this.reportPetForId.value;
    if (!message || !fullName || !fullNamePet || !id || !phone) {
      this.messageReport.set('Todos los campos son obligatorios');
      this.loadingCreateReport.update(() => false);
      return;
    }
    const userPet = this.userService.get()();
    const reportData: ReportForm = {
      email: userPet.email,
      info: message,
      namePet: fullNamePet,
      nombre: fullName,
      nombreRecib: fullName,
      tel: phone.toString(),
    };
    const responseDeletePet = await this.petServices.reportPetId(reportData, token);
    this.loadingCreateReport.update(() => false);

    if (responseDeletePet?.send?.code) {
      this.messageReport.set('Error al enviar el reporte, intente nuevamente o contáctenos');
      return;
    }
    this.reportPetForId.reset();
    return responseDeletePet;
  }

  async ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
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

          const dataPets = (await this.petServices.getPetsUbication(
            latitude,
            longitude,
            emailUser
          )) as any;
          if (!dataPets[0]?.hits?.length) {
            return;
          }

          this.pets = dataPets[0].hits;
          this.loading = false;
          this.cd.detectChanges();
        },
        (error) => {
          this.router.navigate(['/']);
        }
      );
    }
  }
}
