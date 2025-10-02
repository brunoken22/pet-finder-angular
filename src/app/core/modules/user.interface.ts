import { Pet } from './pet.interface';

export interface User {
  id: number;
  fullName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  Pets?: Pet[];
}

export interface UpdateUser extends Partial<Pick<User, 'fullName' | 'email'>> {
  password?: string;
}
