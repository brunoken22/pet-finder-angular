import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import {
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-google-maps',
  templateUrl: './googleMaps.html',
  imports: [
    GoogleMapsModule,
    GoogleMap,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    MapMarker,
  ],
})
export class GoogleMapsComponent implements OnInit {
  @Input() newReportForm: FormGroup | null = null;
  @Output() centerChange = new EventEmitter<google.maps.LatLngLiteral>();

  zoom = 12;

  private geocoder = new google.maps.Geocoder();
  private formGroupDirective = inject(FormGroupDirective);

  ngOnInit() {
    console.log('PRIMERO PASANDO POR EL AFTER 2 ');

    this.newReportForm = this.formGroupDirective.form;
  }

  moveMap(event: google.maps.MapMouseEvent) {
    const center = event?.latLng?.toJSON() || this.newReportForm?.value.center;
    this.centerChange.emit(center);
    // this.center.set(center);
  }

  addMarker(event: google.maps.MapMouseEvent) {
    const position = event.latLng?.toJSON() || this.newReportForm?.value.center;
    this.getLocationName(position);
    this.centerChange.emit(position);
    // this.center.set(position);
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
        const location = place.geometry?.location?.toJSON() || this.newReportForm?.value.center;
        this.newReportForm?.get('googleMaps')?.setValue(place.formatted_address);
        // this.center.set(location);
        this.newReportForm?.get('center')?.setValue(location);
        this.centerChange.emit(location);
      });
    }
  }
}
