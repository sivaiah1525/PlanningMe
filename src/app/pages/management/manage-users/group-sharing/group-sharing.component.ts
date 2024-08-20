import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-group-sharing',
  templateUrl: './group-sharing.component.html',
  styleUrls: ['./group-sharing.component.scss']
})
export class GroupSharingComponent implements OnInit {
  EntityName: any;
  EntityDetails: any;
  AllEntityList :any= []
  showicon = false;
  selactedId:any;
  singleSearchValue = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private manageProductsService: ManageProductsService,
    private matDialogRef: MatDialogRef<GroupSharingComponent>,
    private messageService: MessageService,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  }

  ngOnInit(): void {
    this.EntityName = this.data.Name;
    this.EntityDetails = this.data.data
    console.log(this.data)
    this.getallusers()
  }


  SelactGroupShareId(value:any) {
    this.selactedId = value.id
  }

  applyFilter(filterValue: string) {
    if (filterValue.trim().toLowerCase().length > 0) {
      let arr = this.AllEntityList;
      arr = this.AllEntityList.filter((item:any) => {
        return (item.firstName.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
        );
      });
      this.AllEntityList = arr;
    }
    this.showicon = true;
  }

  closesearch(value:any) {
    this.showicon = false;
    this.singleSearchValue = null;
    this.getallusers()

  }

  ApplygroupShare() {
    this.manageSitesService.GroupShare(this.EntityDetails.id, this.selactedId, this.EntityName).subscribe((result:any) => {
      if (result) {
        this.matDialogRef.close();
        this.messageService.showMessage(result['response'][0].message);
      }
    })
  }




  getallusers() {
    this.AllEntityList = []
    this.manageUsersService.findAllUsersDropdown().subscribe((res: any) => {
      console.log(res)
      res.forEach((element:any) => {
        this.AllEntityList.push(
          {
            firstName: element.firstName,
            lastName: element.lastName,
            profilePicture: element.profilePicture,
            id: element.id
          }
        )
      })
    })
  }


}
