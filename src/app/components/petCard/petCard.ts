import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
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
  @Input() owner = true;
  loading = signal(false);
  @Input() onClickDelete = () => {};
  @Output() deletePet = new EventEmitter<string>();
  @Output() reportPet = new EventEmitter<string>();

  handleDeletePet() {
    this.deletePet.emit(this.id);
  }

  handleReportPet() {
    this.reportPet.emit(this.id);
  }
}
