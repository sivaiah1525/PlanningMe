import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/core/services/message.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PermissionApplyEditComponent } from '../permission-apply-edit/permission-apply-edit.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})


export class PermissionComponent implements OnInit {
  contactForm!: FormGroup;
  type: any;
  getparams: [] = [];
  listdata: any;
  index: any;
  permission = {};
  userid: any[] = [];
  linkeduserid: any[] = [];
  tagparameters: any[] = [];
  UserDetails: any;
  singleSearchValue = null;
  SearchValue = null;
  showicon!: boolean;
  isChecked!: boolean;
  UserPermission: any = {};
  create: any;
  tempdata: any;
  permisiondata: any[] = [];
  opendialog = false;
  permssionarray!: any[];
  id: any;
  params: any[] = [];
  selected = [];
  coldata: any;
  tagdata: any;
  permissionId: any;
  result: any;
  resultsplit: any;
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  Height: Window["innerHeight"];
  AllLinks: any[] | undefined;
  getAllUsers!: any[];
  defaultParameters: any[] = [];
  tagParameters: any[] = [];
  createButton = false
  AdminUserId: any;
  constructor(
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }        this.Height = window.innerHeight - 150
    this.AdminUserId = localStorage.getItem("id")

  }

  ngOnInit(): void {
    this.getalluserdata();
  }

  onPageChange($event:any) {
    const pg = $event.pageIndex * $event.pageSize;
    const mx = $event.pageIndex * $event.pageSize + $event.pageSize;
    this.getAllUsers = this.resultsplit.slice(pg, mx);
  }

  applyFilter(filterValue: string) {
    if (filterValue.trim().toLowerCase().length > 0) {
      let arr = this.getAllUsers;
      arr = this.getAllUsers.filter((item) => {
        return (item.firstname.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
        );
      });
      this.getAllUsers = arr;
    }
    this.showicon = true;
  }

  closesearch(value:any) {
    this.showicon = false;
    this.singleSearchValue = null;
    this.getalluserdata();
    this.AllLinks = this.tempdata;
  }
  getalluserdata() {
    this.permissionService.findAllUsers().subscribe((res) => {
      console.log(res)
      this.getAllUsers = [];
      res.forEach((element:any) => {
        // if (this.AdminUserId != element.id) {
        this.getAllUsers.push({
          id: element.id,
          firstname: element.firstName,
          lastName: element.lastName,
          profilePicture: element.profilePicture,
          isChecked: true
        });
        // }
      });
      this.resultsplit = this.getAllUsers;
      this.length = this.resultsplit.length;
    });
  }




  createpermision(data:any, type:any) {
    this.dialog.open(PermissionApplyEditComponent, {
      width: '700px',
      autoFocus: false,
      disableClose: true,
      data: { data: data, type: type, screenType: 'UpdatePermission' }
    });
  }
  updatepermision(data:any, type:any) {
    this.dialog.open(PermissionApplyEditComponent, {
      width: '700px',
      autoFocus: false,
      disableClose: true,
      data: { data: data, type: type, screenType: 'CreatePermission' }
    });
  }

  givepermission(data:any, type:any) {
    this.permissionService.getUserPermission(data.id).subscribe((result: any) => {
      if (result) {
        let list:any= []
        result.forEach((value:any) => {
          list.push(value.tableName)
        })
        setTimeout(() => {
          const value = list.filter((e:any) => {
            return e == type
          })
          if (value == type) {
            this.createpermision(data, type)
          } else {
            this.updatepermision(data, type)
          }
        }, 100);
      } else {
        this.updatepermision(data, type)
      }
    });
  }

}


