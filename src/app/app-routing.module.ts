import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignOneComponent } from './campaigns/campaign-one/campaign-one.component';
import { TokenExpiryPageComponent } from './pages/auth/mail-redirect/token-expiry-page/token-expiry-page.component';
import { SuccessPageForOtherUserComponent } from './pages/auth/mail-redirect/success-page-for-other-user/success-page-for-other-user.component';
import { SuccessPageForForgotPasswordComponent } from './pages/auth/mail-redirect/success-page-for-forgot-password/success-page-for-forgot-password.component';
import { SuccessPageForFirstUserComponent } from './pages/auth/mail-redirect/success-page-for-first-user/success-page-for-first-user.component';
import { MailConformationFailedComponent } from './pages/auth/mail-Redirect/mail-conformation-failed/mail-conformation-failed.component';
import { OtherUserPasswordSetComponent } from './pages/auth/other-user-password-set/other-user-password-set.component';
import { VerificationEmailSentComponent } from './pages/auth/mail-redirect/verification-email-sent/verification-email-sent.component';
import { InvoiceDownloadComponent } from './core/components/invoice-download/invoice-download.component';
import { GoogleAuthRedirectComponent } from './pages/auth/mail-redirect/google-auth-redirect/google-auth-redirect.component';
import { MicrosoftAuthRedirectComponent } from './pages/auth/mail-redirect/microsoft-auth-redirect/microsoft-auth-redirect.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/auth/signup/singup.module').then(m => m.SingupModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'campaign/promo', component: CampaignOneComponent},
  { path: 'mail/MailConformationFailed', component: MailConformationFailedComponent},
  { path: 'mail/SuccessPageForFirstUser', component: SuccessPageForFirstUserComponent},
  { path: 'mail/SuccessPageForForgotPassword', component: SuccessPageForForgotPasswordComponent},
  { path: 'mail/SuccessPageForOtherUser', component: SuccessPageForOtherUserComponent},
  { path: 'mail/TokenExpiryPage', component: TokenExpiryPageComponent},
  { path: 'mail/SetPassword', component: OtherUserPasswordSetComponent},
  { path: 'mail/ResetPassword', component: OtherUserPasswordSetComponent},
  { path: 'mail/VerificationEmailSent', component: VerificationEmailSentComponent},
  { path: 'invoice', component: InvoiceDownloadComponent},
  { path: 'GoogleAuth', component: GoogleAuthRedirectComponent},
  { path: 'MicrosoftAuth', component: MicrosoftAuthRedirectComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      scrollOffset: [0, 0],
    }),  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
