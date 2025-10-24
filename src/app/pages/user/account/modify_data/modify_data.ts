import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { UserService } from '../../../../core/services/user.service';
import { AlertComponent } from '../../../../components/ui/alert/alert';

@Component({
  templateUrl: './modify_data.html',
  imports: [ButtonComponent, AlertComponent],
})
export class ModifyDataPage {
  constructor(private userService: UserService) {}

  message = '';
  loading = signal<boolean>(false);

  get user() {
    return this.userService.get();
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.loading.update(() => true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const fullName = formData.get('fullName') as string;

    if (!fullName || !fullName.trim()) {
      this.loading.update(() => false);

      this.message = 'El nombre no puede estar vacío';
      return;
    }
    if (fullName === this.user().fullName) {
      this.loading.update(() => false);

      this.message = 'El nombre no puede ser el mismo';
      return;
    }
    this.message = '';
    this.userService.updateUser({ fullName, email: this.user().email, password: '' }).subscribe(
      () => {
        this.loading.update(() => false);
      },
      (error) => {
        this.loading.update(() => false);
        this.message = error.message || 'Error al actualizar los datos';
      }
    );
  }
}
