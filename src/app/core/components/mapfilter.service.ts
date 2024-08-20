import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapfilterService {

  filterOtherPepole$ = new Subject<any>();
  filterOtherPepole = this.filterOtherPepole$.asObservable();

  mapfilterDetails$ = new Subject<any>();
  mapfilterDetailsob = this.mapfilterDetails$.asObservable();

  mapconfigureDetails$ = new Subject<any>();
  mapconfiguredetails = this.mapconfigureDetails$.asObservable();

  configvalue = this.mapconfigureDetails$.asObservable();


  prospectsearch$ = new Subject<any>();
  prospectConfigurtion = this.prospectsearch$.asObservable();

  checklimit$ = new Subject<any>();
  checklimitdata = this.checklimit$.asObservable();

  getProspectConfiguration$ = new Subject<any>();
  getProspectConfigurationData = this.getProspectConfiguration$.asObservable();


  getActivity$ = new Subject<any>();
  getActivityDetails = this.getActivity$.asObservable();

  constructor() { }
}
