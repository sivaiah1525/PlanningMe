// matomo.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var _paq: any;

@Injectable({
  providedIn: 'root',
})
export class MatomoService {
  setUserId = '0';
  constructor(private route: ActivatedRoute) {}
  trackPageView(pageTitle: string): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params)
      if ( params.UId) {
        this.setUserId = params.UId.split('_')[1];
      }
      if (localStorage.getItem('Cookies') === 'true') {
        _paq.push(['setUserId', this.setUserId]);
        _paq.push(['setDocumentTitle', pageTitle]);
        _paq.push(['trackPageView']);
        _paq.push(['setCustomVariable', 1, 'Consent', 'Accepted','visit'])
      } else if(localStorage.getItem('Cookies') === 'false') {
        _paq.push(['disableCookies']);
        _paq.push(['requireCookieConsent']);
        _paq.push(['setUserId', this.setUserId]);
        _paq.push(['setDocumentTitle', pageTitle]);
        _paq.push(['trackPageView']);
        _paq.push(['setCustomVariable', 1, 'Consent', 'Rejected', 'visit']); 
      } else if(this.setUserId!='0'){
        _paq.push(['disableCookies']);
        _paq.push(['requireCookieConsent']);
        _paq.push(['setUserId', this.setUserId]);
        _paq.push(['setDocumentTitle', pageTitle]);
        _paq.push(['trackPageView']);
      }
    });
  }
}



