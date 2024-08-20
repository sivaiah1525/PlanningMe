

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SocialUser } from 'angularx-social-login';
import { F } from '@angular/cdk/keycodes';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';

@Component({
  selector: 'app-microsoft-auth-redirect',
  templateUrl: './microsoft-auth-redirect.component.html',
  styleUrls: ['./microsoft-auth-redirect.component.scss']
})
export class MicrosoftAuthRedirectComponent implements OnInit {
  user: SocialUser | null = null; // Initialize with null
  accessToken: any
  microsoftaccessToken: any
  resposncesstatus: any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private google: GoogleApiService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      const scopes: string = params['scope'];
      console.log(scopes)
      // window.alert(params?.['code'])
      if (params?.['code']) {
        this.google.GetMicrosoftAccessToken(params?.['code']).subscribe((result) => {
          if (result) {
            this.resposncesstatus = true
            console.log(result)
            this.router.navigate(['/app/home/files'])
          }
        }, error => {
          this.resposncesstatus = false
        })
      }
    });
  }

}

