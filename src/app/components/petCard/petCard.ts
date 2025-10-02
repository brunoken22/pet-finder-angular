import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../ui/button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-petCard',
  templateUrl: './petCard.html',
  imports: [ButtonComponent, RouterLink],
})
export class PetCardComponent {
  @Input() img = '';
  @Input() title = '';
  @Input() location = '';
  @Input() id = '';
  @Input() onClickDelete = () => {};
  @Output() deletePet = new EventEmitter<string>(); // Cambio importante

  handleDeletePet() {
    this.deletePet.emit(this.id);
  }
}
