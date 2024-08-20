import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { MessageService } from 'src/app/core/services/message.service';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { CreateDiscountComponent } from '../create-discount/create-discount.component';
import { SelectDiscountComponent } from '../select-discount/select-discount.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-discount-details',
  templateUrl: './view-discount-details.component.html',
  styleUrls: ['./view-discount-details.component.scss']
})
export class ViewDiscountDetailsComponent implements OnInit {
  Details: any;
  getKeyword:any= [];
  screenType: any;
  discountEntity: any;
  listOftableDiscount :any= [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private manageContactsService: ManageContactsService,
    private messageService: MessageService,
    private matDialogRef: MatDialogRef<ViewDiscountDetailsComponent>,
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
    if (this.data?.type == 'viewdiscountdetails') {
      this.screenType = this.data?.type
      this.Details = this.data.data
      this.getKeyword = this.data.data.getKeyword.split(",")
    } else if (this.data?.type == 'viewdiscountTable') {
      this.screenType = this.data?.type
      this.Details = this.data.data
      this.discountEntity = this.data?.entity
      this.getdiscountForEntity(this.Details.hasPrivateDiscount, this.Details.hasPublicDiscount);

    }
  }

  closedialogbox() {
    this.dialog.closeAll();
  }

  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type, entitydata: { name: this.discountEntity, id: this.Details.id } } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.matDialogRef.close(true)
      }
      console.log(result)
    })
  }



  // UpdateDiscount 
  UpdateDiscountForEntity(x:any) {
    const AddDiscount = this.dialog.open(SelectDiscountComponent, {
      disableClose: true,
      data: { ManagenemtEntity: this.discountEntity, row: this.Details, EditDiscount: true, discoundata: x },
      width: '500px',
    });
    AddDiscount.afterClosed().subscribe(result => {
      if (result) {
        this.matDialogRef.close(true)
      }
    });
  }



  // AddDiscountForEntity 
  AddDiscountForEntity() {
    const AddDiscount = this.dialog.open(SelectDiscountComponent, {
      disableClose: true,
      data: { ManagenemtEntity: this.discountEntity, row: this.Details, AddDiscount: true },
      width: '500px',
    });
    AddDiscount.afterClosed().subscribe(result => {
      if (result) {
        this.getdiscountForEntity(true, true)
      }
    });
  }







  // UpdateDiscount 
  UpdateDiscount(data:any) {
    const updateDiscount = this.dialog.open(CreateDiscountComponent, {
      width: '500px',
      data: { data: data, Edit: true },
      autoFocus: false,
      disableClose: true,
    });
    updateDiscount.afterClosed().subscribe(result => {
      if (result) {
        this.matDialogRef.close(true)
      }
    });
  }




  getdiscountForEntity(hasPrivateDiscount:any, hasPublicDiscount:any) {
    this.listOftableDiscount.length = 0;
    if (hasPrivateDiscount == true) {
      const data = { IsPublic: false, IsPrivate: true, EntityId: this.Details.id, Entity: this.discountEntity }
      this.manageContactsService.getDiscountByEntity(data).subscribe((result: any) => {
        if (result) {
          result.forEach((event:any) => {
            this.listOftableDiscount.push(event)
          })
        }
        console.log(result)
      })
    }
    if (hasPublicDiscount == true) {
      const data = { IsPublic: true, IsPrivate: false, EntityId: this.Details.id, Entity: this.discountEntity }
      this.manageContactsService.getDiscountByEntity(data).subscribe((result: any) => {
        console.log(result)
        if (result) {
          result.forEach((event:any) => {
            this.listOftableDiscount.push(event)
          })
        }
      })
    }

  }

}
