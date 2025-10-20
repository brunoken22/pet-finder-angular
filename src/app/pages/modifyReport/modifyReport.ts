import {
  Component,
  ElementRef,
  Inject,
  inject,
  Input,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapsComponent } from '../../components/googleMaps/googleMaps';
import { ButtonComponent } from '../../components/ui/button/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetServices } from '../../core/services/pets.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { UpdatePet } from '../../core/modules/pet.interface';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  templateUrl: './modifyReport.html',
  imports: [GoogleMapsComponent, ButtonComponent, ReactiveFormsModule],
})
export class ModifyReportPage {
  private route = inject(ActivatedRoute);
  private localStorageService = inject(LocalStorageService);
  private petService = inject(PetServices);
  private router = inject(Router);

  id = signal('');
  newReport = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    photo: new FormControl<File | string | null>(null, [Validators.required]),
    googleMaps: new FormControl('', [Validators.required]),
    photoLink: new FormControl(''),
    center: new FormControl<google.maps.LatLngLiteral | null>({ lat: -34.61315, lng: -58.37723 }),
  });

  validation = '';
  isSubmitting = false;
  isPet = '';

  @ViewChild('photoRef') photoRef!: ElementRef<HTMLInputElement | null>;

  async handleSubmit(event: Event) {
    event.preventDefault();
    const token = this.localStorageService.getItem('LOGIN_PET_FINDER');
    if (!token) {
      this.validation = 'Faltan datos para actualizar';
      return;
    }
    // const form = event.target as HTMLFormElement;
    // const formData = new FormData(form);
    // const photo = formData.get('photo');
    // const base64Image = await this.convertImageToBase64(photo as File);
    const updatePet: UpdatePet = {
      ...this.newReport.value.center!,
      img: this.newReport.value.photoLink!,
      lugar: this.newReport.value.googleMaps!,
      name: this.newReport.value.fullName!,
    };

    const responseUpdatePet = await this.petService.updatePet(this.id(), updatePet, token);
    if (responseUpdatePet?.message && responseUpdatePet?.message !== 'Todo Ok') {
      this.validation = responseUpdatePet.message;
      return;
    }
    this.router.navigate(['myReport']);
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

  onCenterChange(event: google.maps.LatLngLiteral) {
    this.newReport.value.center = event;
  }

  async onFileChange(event: any) {
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
    const base64URL = await this.convertImageToBase64(file);
    this.newReport.patchValue({ photoLink: base64URL });
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      console.log('✅ Ejecutándose en SERVER (SSR)');
    } else if (isPlatformBrowser(this.platformId)) {
      console.log('✅ Ejecutándose en BROWSER (CSR)');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['myReport']);
      return;
    }
    this.id.set(id);
    const responseGetPet = await this.petService.getPetId(id);
    const { message, success, pet } = responseGetPet;
    if (!success && message) {
      this.isPet = message;
      return;
    }
    const fileImg = await this.urlToFile(pet.img, 'mascosta-petFinder.webp');
    const newReportResponse = {
      fullName: pet.name,
      photo: fileImg,
      googleMaps: pet.lugar,
      center: { lng: pet.lng, lat: pet.lat },
      photoLink: pet.img,
    };

    this.newReport.patchValue(newReportResponse);
  }

  async urlToFile(url: string, fileName: string, mimeType?: string): Promise<File> {
    try {
      // 1. Hacer fetch a la URL
      const response = await fetch(url);

      // 2. Verificar que la respuesta sea exitosa
      if (!response.ok) {
        throw new Error(`Error al descargar la imagen: ${response.status}`);
      }

      // 3. Obtener los datos como blob
      const blob = await response.blob();

      // 4. Determinar el tipo MIME
      const actualMimeType = mimeType || blob.type || 'image/jpeg';

      // 5. Crear el objeto File
      const file = new File([blob], fileName, { type: actualMimeType });

      return file;
    } catch (error) {
      console.error('Error al convertir URL a File:', error);
      throw error;
    }
  }
}
