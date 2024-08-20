import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-single-to-group-convert',
  templateUrl: './single-to-group-convert.component.html',
  styleUrls: ['./single-to-group-convert.component.scss']
})
export class SingleToGroupConvertComponent implements OnInit {

  Allgroupdata :any= [];
  entity:any;
  entityDetails:any;
  singletoGroupForm!: FormGroup
  selactesIds :any= []
  showicon = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserService: ManageUsersService,
    private manageproductsService: ManageProductsService,
    private managesitesService: ManageSitesService,
    private manageContactsService: ManageContactsService,
    private formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<SingleToGroupConvertComponent>,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }

  ngOnInit(): void {
    console.log(this.data)
    this.entityDetails = this.data.data
    this.entity = this.data.Entity
    if (this.entity == 'Users') {
      this.loadUserGroups()

    } else if (this.entity == 'Products') {
      this.loadProductGroups()

    } else if (this.entity == 'Sites') {
      this.loadSiteGroups()

    } else if (this.entity == 'Contacts') {
      this.loadContactGroups()

    }
  }


  selactGroupId(event:any, group:any) {
    let value:any
    if (event.checked == true) {
      this.Allgroupdata.map((e:any) => {
        if (e.id == group.id) {
          value= e.Checked = true
        }
      })
    } else {
      this.Allgroupdata.map((e:any) => {
        if (e.id == group.id) {
          value= e.Checked = false
        }
      })
    }
    return value
  }



  //fetch  user group data
  loadUserGroups() {
    this.manageUserService.findAllUsersGroupDropdown().subscribe((result: any) => {
      result.forEach((element:any) => {
        if (element?.dynamicGroupId == null) {
          this.Allgroupdata.push(
            {
              id: element.id,
              name: element.groupName,
              Checked: false
            }
          )
        }
      });
    });
  }
  loadProductGroups() {
    this.manageproductsService.findAllProductsGroupDropdown().subscribe((result: any) => {
      result.forEach((element:any) => {
        if (element?.dynamicGroupId == null) {
          this.Allgroupdata.push(
            {
              id: element.id,
              name: element.groupName,
              Checked: false
            }
          )
        }
      });
    });
  }

  loadSiteGroups() {
    this.managesitesService.findAllSitesGroupDropdown().subscribe(
      (result: any) => {
        result.forEach((element:any) => {
          if (element?.dynamicGroupId == null) {
            this.Allgroupdata.push(
              {
                id: element.id,
                name: element.groupName,
                Checked: false
              }
            )
          }
        });
      });
  }
  loadContactGroups() {
    this.manageContactsService.findAllContactsGroupDropdown().subscribe((result: any) => {
      result.forEach((element:any) => {
        if (element?.dynamicGroupId == null) {
          this.Allgroupdata.push(
            {
              id: element.id,
              name: element.groupName,
              Checked: false
            }
          )
        }
      });
    });
  }
  RemovePlanningFilter() {
    this.matDialogRef.close(true)
  }
  onSubmit() {
    this.selactesIds = []
    this.Allgroupdata.forEach((element:any) => {
      if (element.Checked == true) {
        this.selactesIds.push(element.id)
      }
    })

    if (this.entity == 'Users') {
      this.manageUserService.singleToAddGroup(this.data.data.id, this.selactesIds).subscribe((result: any) => {
        if (result) {
          this.matDialogRef.close(true)
        }
      })

    } else if (this.entity == 'Products') {
      this.manageproductsService.singleToAddGroup(this.data.data.id, this.selactesIds).subscribe((result: any) => {
        if (result) {
          this.matDialogRef.close(true)
        }
      })
    } else if (this.entity == 'Sites') {
      this.managesitesService.singleToAddGroup(this.data.data.id, this.selactesIds).subscribe((result: any) => {
        if (result) {
          this.matDialogRef.close(true)
        }
      })
    } else if (this.entity == 'Contacts') {
      this.manageContactsService.singleToAddGroup(this.data.data.id, this.selactesIds).subscribe((result: any) => {
        if (result) {
          this.matDialogRef.close(true)
        }
      })
    }
  }



}
