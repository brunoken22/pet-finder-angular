import { Component, Input, Output, signal, EventEmitter, effect } from '@angular/core';
import { ɵInternalFormsSharedModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-google-maps',
  templateUrl: './googleMaps.html',
  imports: [GoogleMap, GoogleMapsModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
})
export class GoogleMapsComponent {
  @Input() newReportForm: FormGroup | null = null;
  @Input() center = signal<google.maps.LatLngLiteral>({ lat: -34.61315, lng: -58.37723 });
  @Output() centerChange = new EventEmitter<google.maps.LatLngLiteral>();

  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  private geocoder = new google.maps.Geocoder();

  constructor() {
    effect(() => {
      console.log(`Este es el efecto secundario de CENTER: `, this.newReportForm?.value);
    });
  }
  moveMap(event: google.maps.MapMouseEvent) {
    const center = event?.latLng?.toJSON() || this.center();
    this.centerChange.emit(center);
    this.center.set(center);
  }

  addMarker(event: google.maps.MapMouseEvent) {
    const position = event.latLng?.toJSON() || this.center();
    this.getLocationName(position);
    this.centerChange.emit(position);
    this.center.set(position);
  }

  getLocationName(position: google.maps.LatLngLiteral) {
    this.geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const responseUbication = this.extractAddressComponents(results[0]);
        this.newReportForm?.get('googleMaps')?.setValue(responseUbication);
        return responseUbication;
      }
      return;
    });
  }

  extractAddressComponents(result: google.maps.GeocoderResult) {
    // Extraer componentes específicos de la dirección
    const addressComponents = result.address_components;

    let country = '';
    let province = '';
    let city = '';
    let street = '';
    let number = '';

    addressComponents.forEach((component) => {
      const types = component.types;

      if (types.includes('country')) {
        country = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        province = component.long_name;
      }
      if (types.includes('locality')) {
        city = component.long_name;
      }
      if (types.includes('route')) {
        street = component.long_name;
      }
      if (types.includes('street_number')) {
        number = component.long_name;
      }
    });

    return `${street} ${number}, ${city}, ${province}, ${country}`;
  }

  autoComplete(event: Event) {
    const autocomplete = event.currentTarget as HTMLInputElement;
    if (autocomplete) {
      const data = new google.maps.places.Autocomplete(autocomplete);
      data.addListener('place_changed', () => {
        const place = data.getPlace();
        const location = place.geometry?.location?.toJSON() || this.center();
        this.newReportForm?.get('googleMaps')?.setValue(place.formatted_address);
        this.center.set(location);
        this.centerChange.emit(location);
      });
    }
  }
}
