import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdvancefilterTargetService {
  constructor() {}

  createtargetfilterparams(data:any,EntityType:any,pagenumber:any,NumberOfRecord:any ) {
    console.log(data);
    console.log(EntityType);
    const params = new HttpParams()
    .set('NumberOfRecord', NumberOfRecord)
    .set('PageNumber', pagenumber)
    data.forEach((element:any) => {
      params.set(element.name, element.value)
    });
    console.log(params.toString())
    return params;

    
  }
}
