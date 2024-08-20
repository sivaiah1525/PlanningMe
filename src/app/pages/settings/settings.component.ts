import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { DelegationService } from 'src/app/core/services/delegation.service';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsNav :any= []
  tabnumber!: number;
  AdminStatus: any;
  invoicesataus: any
  isManagersataus: any;
  DemoOrganationstatus:boolean=false

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private delegationService: DelegationService,
    public OrgSrvice:CheckOrganationTypeService,
    private matoService: MatomoService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      } 
      this.matoService.trackPageView('Setting-page');
      if (this.OrgSrvice.checkOrganationType().DemoOrganation == 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('Setting')
      this.popupforerrormessage(data.message, data.header);
    } 
    
    this.AdminStatus = localStorage.getItem("isAdmin");
    this.invoicesataus = localStorage.getItem("Invoice");
    this.isManagersataus = localStorage.getItem("isManager");
  }
  ngOnInit(): void {
    if (this.AdminStatus == 'true') {
      this.settingsNav = [ 
        { title: 'Profile', url: 'general', icon: 'folder_shared', tabnumber: 0, },
        { title: 'Invoice', url: 'invoice', icon: 'monetization_on', tabnumber: 1 },
        { title: 'Delegation', url: 'delegation', icon: 'device_hub', tabnumber: 2 },
        { title: 'Alerts', url: 'strategy', icon: 'wb_incandescent', tabnumber: 3 },
        { title: 'Permissions', url: 'permission', icon: ' vpn_key', tabnumber: 4 },
        { title: 'Credit Card', url: 'card', icon: 'credit_card', tabnumber: 5 },
      ]
    } else if (this.AdminStatus == 'true' && this.invoicesataus == 'true') {
      this.settingsNav = [
        { title: 'Profile', url: 'general', icon: 'folder_shared', tabnumber: 0, },
        { title: 'Invoice', url: 'invoice', icon: 'monetization_on', tabnumber: 1 },
        { title: 'Delegation', url: 'delegation', icon: 'device_hub', tabnumber: 2 },
        { title: 'Alerts', url: 'strategy', icon: 'wb_incandescent', tabnumber: 3 },
        { title: 'Permissions', url: 'permission', icon: ' vpn_key', tabnumber: 4 },
        { title: 'Credit Card', url: 'card', icon: 'credit_card', tabnumber: 5 }
      ]
    } else if (this.AdminStatus == 'false' && this.invoicesataus == 'true' && this.isManagersataus == 'false') {
      this.settingsNav = [
        { title: 'Profile', url: 'general', icon: 'folder_shared', tabnumber: 0, },
        { title: 'Invoice', url: 'invoice', icon: 'monetization_on', tabnumber: 1 },
        { title: 'Alerts', url: 'strategy', icon: 'wb_incandescent', tabnumber: 2 },
        { title: 'Credit Card', url: 'card', icon: 'credit_card', tabnumber: 3 }
      ]
    }
    else if (this.AdminStatus == 'false' && this.invoicesataus == 'false' && this.isManagersataus == 'true') {
      this.settingsNav = [
        { title: 'Profile', url: 'general', icon: 'folder_shared', tabnumber: 0, },
        { title: 'Delegation', url: 'delegation', icon: 'device_hub', tabnumber: 1 },
        { title: 'Alerts', url: 'strategy', icon: 'wb_incandescent', tabnumber: 2 },
      ]
    } else if (this.AdminStatus == 'false' && this.invoicesataus == 'true' && this.isManagersataus == 'true') {
      this.settingsNav = [
        { title: 'Profile', url: 'general', icon: 'folder_shared', tabnumber: 0, },
        { title: 'Invoice', url: 'invoice', icon: 'monetization_on', tabnumber: 1 },
        { title: 'Delegation', url: 'delegation', icon: 'device_hub', tabnumber: 2 },
        { title: 'Alerts', url: 'strategy', icon: 'wb_incandescent', tabnumber: 3 },
        { title: 'Credit Card', url: 'card', icon: 'credit_card', tabnumber: 4 }
      ]
    } else if (this.AdminStatus == 'false' && this.invoicesataus == 'false' && this.isManagersataus == 'false') {
      this.settingsNav = [
        { title: 'Profile', url: 'general', icon: 'folder_shared', tabnumber: 0, },
        { title: 'Alerts', url: 'strategy', icon: 'wb_incandescent', tabnumber: 1 },
      ]
    }
    this.tabnumber = 0;
  }



  tabChange(tabIndex: number): void {
    console.log(tabIndex)
    this.tabnumber = tabIndex
  }



  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

}
