import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from "@auth0/angular-jwt";
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ColorPickerModule } from 'ngx-color-picker';
import { ProspectsearchComponent } from './core/components/prospectsearch/prospectsearch.component';
import { AddNotesComponent } from './pages/files/components/add-notes/add-notes.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MatChipsModule } from '@angular/material/chips';
import { DeleteCommomComponent } from './pages/commonForAll/delete-commom/delete-commom.component';
import { OtherPepoleComponent } from './core/components/other-pepole/other-pepole.component';
import { MatCheckboxDefaultOptions, MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SharedModule } from './shared/shared.module';
import { CalendarHeaderModule } from "./core/components/calendar-header/calendar-header.module";
import { EventListsModule } from "./core/components/event-lists/event-lists.module";
import { MatBadgeModule } from '@angular/material/badge';
import { AddtagCommonComponent } from './pages/commonForAll/addtag-common/addtag-common.component';
import { SingleAndGroupForDropdownSelactionComponent } from './pages/graph/components/single-and-group-for-dropdown-selaction/single-and-group-for-dropdown-selaction.component';
import { MessagePopupComponent } from './pages/commonForAll/message-popup/message-popup.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CKEditorModule } from 'ckeditor4-angular';
import { FileandnotesformanagementComponent } from './pages/commonForAll/fileandnotesformanagement/fileandnotesformanagement.component';
import { FilterCommonComponent } from './pages/commonForAll/filter-common/filter-common.component';
import { ImportedDataResultComponent } from './core/components/imported-data-result/imported-data-result.component';
import { AuthService } from './core/services/auth.service';
import { TimeZoneComponent } from './pages/auth/time-zone/time-zone.component';
import { PopupErrorMessageComponent } from './popup-error-message/popup-error-message.component';
import {TranslateModule, TranslateLoader, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { CookiesComponent } from './core/components/cookies/cookies.component';
import { CookiesPolicyComponent } from './pages/PnmDashboard/components/cookies-policy/cookies-policy.component';
import { ContactFormComponent } from './pages/PnmDashboard/components/contact-form/contact-form.component';
import { ServiceUsageComponent } from './pages/PnmDashboard/components/service-usage/service-usage.component';
import { PolicyComponent } from './pages/PnmDashboard/components/policy/policy.component';
import { VideoComponent } from './core/components/video/video.component';
import { NavbarFooterModule } from './pages/navbar-footer/navbar-footer.module';
import { TopNavbarModule } from './pages/top-navbar/top-navbar.module';
import { CampaignOneComponent } from './campaigns/campaign-one/campaign-one.component';
import { Scroll } from '@angular/router';
import { ShowBannerLimitComponent } from './core/components/show-banner-limit/show-banner-limit.component';
import { ApiErrorMessagesComponent } from './api-error-messages/api-error-messages.component';
import { PasswordChangeComponent } from './pages/auth/password-change/password-change.component';
import { MailConformationFailedComponent } from './pages/auth/mail-Redirect/mail-conformation-failed/mail-conformation-failed.component';
import { SuccessPageForFirstUserComponent } from './pages/auth/mail-redirect/success-page-for-first-user/success-page-for-first-user.component';
import { SuccessPageForOtherUserComponent } from './pages/auth/mail-redirect/success-page-for-other-user/success-page-for-other-user.component';
import { SuccessPageForForgotPasswordComponent } from './pages/auth/mail-redirect/success-page-for-forgot-password/success-page-for-forgot-password.component';
import { TokenExpiryPageComponent } from './pages/auth/mail-redirect/token-expiry-page/token-expiry-page.component';
import { OtherUserPasswordSetComponent } from './pages/auth/other-user-password-set/other-user-password-set.component';
import { ApiSuccessMessagesComponent } from './api-success-messages/api-success-messages.component';
import { VerificationEmailSentComponent } from './pages/auth/mail-redirect/verification-email-sent/verification-email-sent.component';
import { PaymentCardDetailsComponent } from './core/components/payment-card-details/payment-card-details.component';
import { PopupForAllComponent } from './pages/commonForAll/popup-for-all/popup-for-all.component';
import { InvoiceDownloadComponent } from './core/components/invoice-download/invoice-download.component';
import { DynamicKeywordsComponent } from './core/components/keywords/dynamic-keywords/dynamic-keywords.component';
import { CreateDynamicKeywordsComponent } from './core/components/keywords/create-dynamic-keywords/create-dynamic-keywords.component';
import { GoogleAuthRedirectComponent } from './pages/auth/mail-redirect/google-auth-redirect/google-auth-redirect.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SyncOptionsListComponent } from './core/components/sync-options-list/sync-options-list.component';
import { UserAgentApplication, Configuration } from 'msal';
import { environment } from 'src/environments/environment';
import { SynchronizationDataComponent } from './core/components/synchronization-data/synchronization-data.component';
import { ShowListOfGmailsComponent } from './core/components/show-list-of-gmails/show-list-of-gmails.component';
import { MicrosoftAuthRedirectComponent } from './pages/auth/mail-redirect/microsoft-auth-redirect/microsoft-auth-redirect.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectPipelineComponent } from './core/components/select-pipeline/select-pipeline.component';
import { ApiErrorResponseComponent } from './api-error-response/api-error-response.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
export function tokenGetter() {
  return localStorage.getItem("access_token");
}


@NgModule({
  declarations: [
    AppComponent,
    DeleteCommomComponent,
    AddtagCommonComponent,
    SingleAndGroupForDropdownSelactionComponent,
    MessagePopupComponent,
    FileandnotesformanagementComponent,
    FilterCommonComponent,
    ImportedDataResultComponent,
    TimeZoneComponent,
    PopupErrorMessageComponent,
    CookiesComponent,
    CookiesPolicyComponent,
    ContactFormComponent,
    ServiceUsageComponent,
    PolicyComponent,
    VideoComponent,
    CampaignOneComponent,
    ShowBannerLimitComponent,
    ApiErrorMessagesComponent,
    PasswordChangeComponent,
    MailConformationFailedComponent,
    SuccessPageForFirstUserComponent,
    SuccessPageForOtherUserComponent,
    SuccessPageForForgotPasswordComponent,
    TokenExpiryPageComponent,
    OtherUserPasswordSetComponent,
    ApiSuccessMessagesComponent,
    VerificationEmailSentComponent,
    PaymentCardDetailsComponent,
    PopupForAllComponent,
    InvoiceDownloadComponent,
    DynamicKeywordsComponent,
    CreateDynamicKeywordsComponent,
    GoogleAuthRedirectComponent,
    SyncOptionsListComponent,
    SynchronizationDataComponent,
    ShowListOfGmailsComponent,
    MicrosoftAuthRedirectComponent,
    SelectPipelineComponent,
    ApiErrorResponseComponent,
   ],
  providers: [
    DatePipe,
    MatSnackBar,
    TranslatePipe,
    TranslateService,
  ],
  exports: [
    GooglePlaceModule,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    GooglePlaceModule,
    BrowserModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatSelectFilterModule,
    CKEditorModule,
    SharedModule,
    TopNavbarModule,
    NavbarFooterModule,
    ReactiveFormsModule,
    SocialLoginModule,
    DragDropModule,
    NgxChartsModule,
    OAuthModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), 
    
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200', 'planning.eu-west-3.elasticbeanstalk.com'],
      },
    }),
    MatGoogleMapsAutocompleteModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    MatDialogModule,
    AgmJsMarkerClustererModule,
    MatChipsModule,
    SharedModule,
    ReactiveFormsModule,
    CalendarHeaderModule,
    EventListsModule,
    
  ]
})
export class AppModule { }


// information 
// invioce details component 
