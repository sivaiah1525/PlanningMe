import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SocialUser } from 'angularx-social-login';
import { F } from '@angular/cdk/keycodes';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';

@Component({
  selector: 'app-google-auth-redirect',
  templateUrl: './google-auth-redirect.component.html',
  styleUrls: ['./google-auth-redirect.component.scss']
})
export class GoogleAuthRedirectComponent implements OnInit {
  user: SocialUser | null = null; // Initialize with null
  accessToken:any
  microsoftaccessToken:any
  resposncesstatus:any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private google: GoogleApiService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      // window.alert(params?.['code'])
      if(params?.['code']) {
       this.google.GetGoogleAccessToken(params?.['code']).subscribe((result)=>{
        if(result){
          this.resposncesstatus=true
          const scopes: string = params['scope'];
          if (scopes) {
            const scopesArray: string[] = scopes.split(' ');
              if(scopesArray.includes('https://www.googleapis.com/auth/gmail.readonly')){
                this.router.navigate(['/app/home/files'])
              }else if(scopesArray.includes('https://www.googleapis.com/auth/drive.file')){
                this.router.navigate(['/app/home/files'])
              }else if(scopesArray.includes('https://www.googleapis.com/auth/calendar.events')){
                this.router.navigate(['/app/home/calendar'])
              }
          }
        }
       },error=>{
        this.resposncesstatus=false
       })

      } 
    });
  }



}
