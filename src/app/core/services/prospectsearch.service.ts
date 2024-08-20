import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = environment.onSeenUrl
@Injectable({
  providedIn: 'root'
})
export class ProspectsearchService {

  constructor(private http: HttpClient) { }

  findAllSearchPropect() {
    return this.http.get(baseUrl + '/api/Target/SearchFieldDropDownsList')
  }

  getSearchConfiguraion(data:any) {
    console.log(data);
    const httpOptions = {
      headers: new HttpHeaders({
        // 'X-Api-Key': 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl'
 })
    };

    return this.http.get(baseUrl + '/api/Target/SearchTarget?Siret=' + data.Siret + '&RaisonSociale=' + data.RaisonSociale + '&CodePostal=' + data.CodePostal
      + '&Region=' + data.region + '&Department=' + data.department + '&EffectifTranche=' + data.effectif_Tranche + '&CodeNaf=' + data.codeNaf + '&Statut=' + data.status + '&From_DateCreation=' + data.StartDate
      + '&To_DateCreation=' + data.EndDate
      + '&Fonction1=' + data.funtion + '&Service=' + "" + '&Distance=' + "" + '&Address=' + "" + '&FileName=' + data.FileName
      + '&Format=' + data.Format + '&GetResultForSufficientCredits=' + true + '&excludeFile=' + "" + '&includeFile=' + "", httpOptions)
  }
  checklimit(data:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Api-Key': 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl'
      })
    }
    return this.http.get(baseUrl + '/api/Target/ConnectedUserCreditPotential?Siret=' + data.Siret + '&RaisonSociale=' + data.RaisonSociale + '&CodePostal=' + data.CodePostal
      + '&Region=' + data.region + '&Department=' + data.department + '&EffectifTranche=' + data.effectif_Tranche + '&CodeNaf=' + data.codeNaf + '&Statut=' + data.status + '&From_DateCreation=' + data.StartDate
      + '&To_DateCreation=' + data.EndDate
      + '&Fonction1=' + data.funtion + '&Service=' + "" + '&Distance=' + "" + '&Address=' + "" + '&FileName=' + data.FileName
      + '&Format=' + data.Format + '&GetResultForSufficientCredits=' + true + '&excludeFile=' + "" + '&includeFile=' + "", httpOptions)
  }






  getorginalDtataWithApiKey(data:any) {
    const httpOptions = {
      headers: new HttpHeaders({'X-Api-Key': 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl'})
    };

    return this.http.get(baseUrl + '/api/Target/SearchTarget?Siret=' + data.Siret + '&RaisonSociale=' + data.RaisonSociale + '&CodePostal=' + data.CodePostal
      + '&Region=' + data.region + '&Department=' + data.department + '&EffectifTranche=' + data.effectif_Tranche + '&CodeNaf=' + data.codeNaf + '&Statut=' + data.status + '&From_DateCreation=' + data.StartDate
      + '&To_DateCreation=' + data.EndDate
      + '&Fonction1=' + data.funtion + '&Service=' + "" + '&Distance=' + "" + '&Address=' + "" + '&FileName=' + data.FileName
      + '&Format=' + data.Format + '&GetResultForSufficientCredits=' + true + '&excludeFile=' + "" + '&includeFile=' + "", httpOptions)
  }

  getonssendatabyId(id:number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'X-Api-Key': 'ZEp4NTg5NjljNmNmNGU4NGE0Y2EwYTM1ZDVhZGViODkwZTlPTnBl'})
    };
    return this.http.get(baseUrl + '/api/Target/SearchTargetDetailById?id='  + id,httpOptions);
  }


}
