import { Component, OnInit, HostBinding } from '@angular/core';
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DelegationUsersComponent } from '../../../core/components/delegation-users/delegation-users.component';
import { DelegationService } from 'src/app/core/services/delegation.service';
import { MessageService } from 'src/app/core/services/message.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
})
export class DelegationComponent implements OnInit {
  listDetails: any;
  users: any[] = [];
  id: any;
  userid: any[] = [];
  reqdata: any = {};
  singleSearchValue = null;
  showicon!: boolean;
  discount: any;
  Discountshow!: boolean;
  dicountForm!: FormGroup;
  discountarr = [];
  discountdata = {};
  Height: Window['innerHeight'];
  AdminStatus: any;
  loginUserId;
  constructor(
    private dialog: MatDialog,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder,
    private delegationService: DelegationService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('lang')) {
      const lang: any = localStorage.getItem('lang');
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }
    this.Height = window.innerHeight - 150;
    this.loginUserId = localStorage.getItem('id');
  }

  ngOnInit(): void {
    console.log(this.loginUserId);
    this.getDelegation();
    this.Discountshow = false;
    this.getListDetails('8b5a25e3-2f3c-4e96-6cbc-08db41629571');
  }
  delegationUsersModal(): void {
    const createSiteDialog = this.dialog.open(DelegationUsersComponent, {
      width: '600px',
    });

    createSiteDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getDelegation() {
    this.delegationService.getDelegation().subscribe((res: any) => {
      const data: { id: any; rightsName: any }[] = [];
      res.forEach((element: any) => {
        data.push({
          id: element.id,
          rightsName: element.rightsName,
        });
      });
      this.listDetails = data;
    });
  }

  getListDetails(list: any) {
    this.users = [];
    if (list == '8b5a25e3-2f3c-4e96-6cbc-08db41629571') {
      this.Discountshow = true;
      this.id = list;
      this.delegationService
        .FindAppliedDiscountLimits()
        .subscribe((res: any) => {
          res.forEach((element: any) => {
            if (this.loginUserId != element.userId) {
              this.users.push(element);
            }
          });
        });
    } else {
      this.Discountshow = false;
      this.id = list;
      this.delegationService.getUsers(this.id).subscribe((res: any) => {
        res.forEach((element: any) => {
          if (this.loginUserId != element.userId) {
            this.users.push(element);
          }
        });
      });
    }
  }

  getuserid(event: any, data: any) {
    if (event.checked == true) {
      this.users.map((element: any) => {
        if (element.userId == data.userId) {
           element.isDelegated = true
        }
      });
    } else {
      this.users.map((element: any) => {
        if (element.userId == data.userId) {
           element.isDelegated = false
        }
      });
    }
  }

  applyDelegation() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add are Update in  user Delegation Rights',
        'Delegation Rights'
      );
    } else {
      if (this.Discountshow == false) {
        let tempUsers: any = [];
        if (this.users.length != 0) {
          this.users.forEach((element: any) => {
            if (element.isDelegated == true) {
              tempUsers.push(element.userId);
            }
          });
        }
        this.reqdata['delegationId'] = this.id;
        this.reqdata['usersId'] = tempUsers;
        this.delegationService
          .applyDelegation(this.reqdata)
          .subscribe((res: any) => {
            this.messageService.showMessage(res['response'][0].message);
          });
      } else if (this.Discountshow == true) {
        let discountIds: any = [];
        this.users.forEach((element: any) => {
          if (element.discount != 0) {
            discountIds.push({
              userId: element.userId,
              discount: element.discount,
            });
          }
        });
        this.delegationService
          .ApplyDiscountLimits(discountIds)
          .subscribe((res: any) => {
            this.messageService.showMessage(res['response'][0].message);
          });
      }
    }
  }

  applyFilter(filterValue: string) {
    if (filterValue.trim().toLowerCase().length > 0) {
      let arr = this.users;
      arr = this.users.filter((item: any) => {
        return (
          item.firstName.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
        );
      });
      this.users = arr;
    }
    this.showicon = true;
  }

  closesearch(value: any) {
    this.showicon = false;
    this.singleSearchValue = null;
    this.getListDetails(this.id);
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const value = event.target.value;
    if (('' + event.target.value).indexOf('.') !== -1) {
      if (('' + event.target.value).split('.')[1].length > 0) {
        return false;
      }
    }
    if (('' + event.target.value).length > 100) {
      return false;
    }

    if (charCode === 46) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  popupforerrormessage(message: any, header: any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }
}
