import { Component, Input, signal } from '@angular/core';
import { ButtonComponent } from '../../components/ui/button/button';
import { GoogleMapsComponent } from '../../components/googleMaps/googleMaps';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { PetServices } from '../../core/services/pets.service';
import { CreatePet } from '../../core/modules/pet.interface';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-report',
  templateUrl: './newReport.html',
  imports: [GoogleMapsComponent, ButtonComponent, ReactiveFormsModule, CommonModule],
})
export class NewReportPage {
  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private petService: PetServices,
    private router: Router
  ) {}

  newReport = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    photo: new FormControl<File | null>(null, [Validators.required]),
    googleMaps: new FormControl('', [Validators.required]),
  });

  @Input() center: google.maps.LatLngLiteral = { lat: 10.96854, lng: -74.78132 };

  validation = '';
  isSubmitting = false;

  // Método para obtener controles fácilmente
  get f() {
    return this.newReport.controls;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    // Validar formulario
    const validate = this.validationForm();
    if (validate) {
      this.validation = validate;
      return;
    } else {
      this.validation = '';
    }

    // Validar token
    const token = this.localStorageService.getItem('LOGIN_PET_FINDER');
    if (!token) {
      this.validation = 'Debe iniciar sesión nuevamente';
      return;
    }

    const user = this.userService.get()();
    if (!user) {
      this.validation = 'Usuario no encontrado';
      return;
    }

    this.isSubmitting = true;

    try {
      // Convertir imagen a base64
      const photoFile = this.newReport.value.photo as File;
      const base64Image = await this.convertImageToBase64(photoFile);

      const newPet: CreatePet = {
        ...this.center,
        email: user.email,
        img: base64Image,
        lugar: this.newReport.value.googleMaps!,
        name: this.newReport.value.fullName!,
        token,
      };

      const response: any = await this.petService.createPet(newPet);
      if (response.pet) {
        this.petService.pets.update((pets) => [...pets, response.pet]);
        this.router.navigate(['/myReport']);
      }
    } catch (error) {
      console.error('Error al reportar mascota:', error);
      this.validation = 'Error al procesar la imagen. Intente nuevamente.';
    } finally {
      this.isSubmitting = false;
    }
  }

  onCenterChange(event: google.maps.LatLngLiteral) {
    this.center = event;
  }

  validationForm(): string {
    if (this.newReport.invalid) {
      return 'Por favor, complete todos los campos requeridos correctamente.';
    }
    return '';
  }

  // Manejar cambio de archivo
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.validation = 'El archivo debe ser una imagen';
        this.newReport.patchValue({ photo: null });
        return;
      }

      // Validar tamaño (ejemplo: máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.validation = 'La imagen no debe superar los 5MB';
        this.newReport.patchValue({ photo: null });
        return;
      }

      this.newReport.patchValue({ photo: file });
      this.validation = '';
    }
  }

  async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }
}
