import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { AlertComponent } from '../../../../components/ui/alert/alert';
import { UserService } from '../../../../core/services/user.service';
import { AlertType } from '../../../../core/modules/alert.interface';

@Component({
  templateUrl: './modify_password.html',
  imports: [ButtonComponent, AlertComponent],
})
export class ModifyPasswordPage {
  alertData = signal<{ type: AlertType; message: string }>({ type: 'success', message: '' });

  constructor(private userService: UserService) {}

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const formData = new FormData(form);
    const newPassword = formData.get('newPassword') as string;
    const repeatPassword = formData.get('repeatPassword') as string;
    if (!newPassword || !newPassword.trim() || !repeatPassword || !repeatPassword.trim()) {
      this.alertData.update((_) => ({
        type: 'danger',
        message: 'Las contraseñas no pueden estar vacías',
      }));
      return;
    }
    if (newPassword !== repeatPassword) {
      this.alertData.update((data) => ({
        type: 'danger',
        message: 'Las contraseñas no coinciden',
      }));
      return;
    }

    // this.alertData.message = '';

    this.userService
      .updateUser({
        fullName: this.userService.get()().fullName,
        email: this.userService.get()().email,
        password: newPassword,
      })
      .subscribe({
        next: (response: any) => {
          if (response?.user) {
            this.alertData.update((_) => ({
              type: 'success',
              message: 'Se actualizo la contraseña correctamente',
            }));
          }
        },
      });
  }
}
