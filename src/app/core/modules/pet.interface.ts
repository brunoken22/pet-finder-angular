export interface Pet {
  id: string;
  name: string;
  img: string;
  lugar: string;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
  email: string;
  objectID: string;
}

export interface CreatePet {
  email: string;
  img: string;
  lat: number;
  lng: number;
  lugar: string;
  name: string;
  token: string;
}

export type UpdatePet = Omit<CreatePet, 'email' | 'token'>;

export interface ResponseGetPetId {
  message?: string;
  success: boolean;
  pet: Pet;
}

export interface ReportForm {
  email: string;
  info: string;
  namePet: string;
  nombre: string;
  nombreRecib: string;
  tel: string;
  id: string;
}
