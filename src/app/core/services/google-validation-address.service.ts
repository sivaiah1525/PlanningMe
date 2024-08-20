import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleValidationAddressService {

  constructor(
  ) { }

  getFullAddress(place: any) {
    console.log(place)
    const data = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      Address: this.getStreetNumber(place) + ' ' + this.getStreet(place),
      city: this.getCity(place),
      State:this.getState(place),
      country: this.getCountry(place),
      pincode: this.getPostCode(place),
    }
    return data

  }



  // ------------11111111111111 
  getAddrComponent(place:any, componentTemplate:any) {
    let result;
    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        if (result) {
          return result;
        } else {
          return '';
        }
      }
    }
    return;
  }
  // getStreetNumber 
  getStreetNumber(place:any) {
    const COMPONENT_TEMPLATE = { street_number: 'long_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    if (streetNumber) {
      return streetNumber;
    } else {
      return ' ';
    }
  }
  // getStreet 
  getStreet(place:any) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    if (street) {
      return street;
    } else {
      return '';
    }
  }
  // getCity 
  getCity(place:any) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    if (city) {
      return city;
    } else {
      return '';
    }
  }
  // getState 
  getState(place:any) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'long_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    if (state) {
      return state;
    } else {
      return '';
    }
  }
  // getCountry 
  getCountry(place:any) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    if (country) {
      return country;
    } else {
      return '';
    }
  }
  // getPostCode 
  getPostCode(place:any) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    if (postCode) {
      return postCode;
    } else {
      return '';
    }
  }
}
