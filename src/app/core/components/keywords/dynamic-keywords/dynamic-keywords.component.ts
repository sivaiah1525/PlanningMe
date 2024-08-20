import { Component, Inject, OnInit } from '@angular/core';
import { CreateDynamicKeywordsComponent } from '../create-dynamic-keywords/create-dynamic-keywords.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';


@Component({
  selector: 'app-dynamic-keywords',
  templateUrl: './dynamic-keywords.component.html',
  styleUrls: ['./dynamic-keywords.component.scss']
})
export class DynamicKeywordsComponent implements OnInit {
  // spinner loadder 
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loadder = false;
  Alldynamickeywords:any=[];

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<DynamicKeywordsComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserService: ManageUsersService,
  ) {

  }

  ngOnInit(): void {
this.getAlldynamickeywords()
  }


  getAlldynamickeywords(){
    this.loadder=true
    this.manageUserService.getAlldynamickeywords().subscribe((result)=>{
      if(result){
        this.loadder=false
        this.Alldynamickeywords=result
      }
    },error=>{
      this.loadder=false
    })

  }


  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.ngOnInit()
      }
    })
  }

  editdynamickeywords(value:any){
    this.addkeyword('update',value)
  }



  addkeyword(screenType:any,data?:any){
    const Createdynamickeywords=this.dialog.open(CreateDynamicKeywordsComponent, {
      width: '550px',
      data: { screenType:screenType,data:data },
      autoFocus: false,
      disableClose: true,
    });

    Createdynamickeywords.afterClosed().subscribe(result => {
      if (result) {
        this.getAlldynamickeywords()
        console.log(result)
      }
    });
  }

}
